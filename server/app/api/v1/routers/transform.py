import logging
import json
import uuid
from typing import Annotated, Optional
from app.api.v1.utils.file_handling import save_input
from app.core.security import get_current_user
from app.accounts.models.user import User

from fastapi import APIRouter, UploadFile, File, Form, HTTPException, Depends
from fastapi.responses import JSONResponse
from pydantic import ValidationError

from app.api.v1.models.transform import TransformIn

from app.api.v1.operations.transform import transform_operation
from app.api.v1.operations.cleanup import cleanup_operation

from app.core.config import config as app_config

router = APIRouter()
logger = logging.getLogger("api")

string_input_types = ["geojson"]
binary_input_types = ["shp"]


@router.post("/transform", status_code=200)
async def create_transformation(
    current_user: Annotated[User, Depends(get_current_user)],
    config: Annotated[str, Form(...)],
    input_file: Optional[UploadFile] = File(None)
):
    # Step 1: Parse and validate config
    try:
        transform = TransformIn.model_validate(json.loads(config))
    except ValidationError as e:
        logger.warning(f"Validation failed for config: {e}")
        raise HTTPException(status_code=400, detail=e.errors())

    input_type:str = transform.input.type
    job_id:str = str(uuid.uuid4())
    input_file_path:str = None
    data:dict = None
    output_format:str = transform.output.format
    output_epsg:int = transform.output.epsg
    # convert transformations to a list of dictionaries to pass to the celery task
    transformations: list = [t.model_dump(mode="json") for t in transform.transformations]

    if input_type not in string_input_types + binary_input_types:
        raise HTTPException(status_code=400, detail=f"Unsupported input type: {input_type}")

    # if input_type is a string input type then data is required
    if input_type in string_input_types:
        data = getattr(transform.input, "data", None)
        if data is None:
            raise HTTPException(status_code=400, detail=f"data is required for {'/'.join(string_input_types)} input type")

    # Step 4: Save input_file if present
    if input_type in binary_input_types:
        if input_file:
            input_file_path = await save_input(input_file, job_id)
        else:
            raise HTTPException(status_code=400, detail="input_file is required for binary input type")
        
    # Step 6: Que the celery task
    logger.info(f"job_id: ({current_user.email}){job_id} - Queuing transformation task for input type: {input_type}")
    transform_operation.apply_async(
        args=[
            job_id, 
            input_type,
            transformations,
            output_format,
            output_epsg,
            input_file_path, 
            data
        ],
        expires=app_config.JOB_EXPIRY_TIME,
        task_id=job_id
    )
    logger.info(f"Dispatched celery transform task with job_id: {job_id}")

    # Also schedule a cleanup task to clean up expired job data:
    cleanup_operation.apply_async(
        args=[job_id],
        countdown=app_config.JOB_EXPIRY_TIME,
        ignore_result=True
    )

    logger.info(f"Queued transformation job: {job_id}")

    return JSONResponse({
        "job_id": job_id,
        "status": "queued",
        "message": "Transformation job has been accepted"
    })