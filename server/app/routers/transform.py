import logging
import json
import os
import uuid
from typing import Annotated, Optional
from werkzeug.utils import secure_filename
from app.utils.file_handling import wait_for_file

from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from fastapi.responses import JSONResponse
from pydantic import ValidationError

from app.config import config as app_config
from app.models.transform import TransformIn

from app.celery_worker import celery_app
from app.operations.transform import transform_operation

router = APIRouter()
logger = logging.getLogger("api")

string_input_types = ["geojson"]
binary_input_types = ["shp"]


@router.post("/transform", status_code=200)
async def create_transformation(
    config: Annotated[str, Form(...)],
    input_file: Optional[UploadFile] = File(None),
):
    # Step 1: Parse and validate config
    try:
        transform = TransformIn.model_validate(json.loads(config))
    except ValidationError as e:
        logger.warning(f"Validation failed for config: {e}")
        raise HTTPException(status_code=400, detail=e.errors())

    input_type:str = transform.input.type
    job_id:str = str(uuid.uuid4())
    filePath:str = None
    data:dict = None

    if input_type not in string_input_types + binary_input_types:
        raise HTTPException(status_code=400, detail=f"Unsupported input type: {input_type}")

    # if input_type is a string input type then data is required
    if input_type in string_input_types:
        data = getattr(transform.input, "data", None)
        if data is None:
            raise HTTPException(status_code=400, detail=f"data is required for {"/".join(string_input_types)} input type")

    # Step 4: Save input_file if present
    if input_type in binary_input_types:
        if input_file:
            upload_dir = os.path.join(app_config.UPLOADS_PATH, job_id)
            os.makedirs(upload_dir, exist_ok=True)

            filename = secure_filename(input_file.filename)
            filePath = os.path.join(upload_dir, filename)
            with open(filePath, "wb") as f:
                f.write(await input_file.read())

            # Check if the file is accessible
            try:
                wait_for_file(filePath)
            except FileNotFoundError as e:
                logger.error(f"File save failed or file not accessible: {e}")
                HTTPException(status_code=400, description="File save failed or not accessible.")
        else:
            raise HTTPException(status_code=400, detail="input_file is required for binary input type")
        
    # Step 6: Que the celery task
    logger.info(f"job_id: {job_id} - Queuing transformation task for input type: {input_type}")
    result = transform_operation.apply_async(
        args=[input_type, filePath, data],
        expires=3600,  # 1 hour
        task_id=job_id
    )
    logger.info(f"Dispatched celery transform task: {result.id} for job_id: {job_id}")

    # TODO: Step 7: schedule a cleanup task to remove the old files after expiry
    # Also schedule a cleanup task 1 hour later example:
    # cleanup_task.apply_async(
    #     args=["/uploads/input.gpkg"],
    #     countdown=3600
    # )

    logger.info(f"Queued transformation job: {job_id}")

    return JSONResponse({
        "job_id": job_id,
        "task_id": result.id,
        "status": "queued",
        "message": "Transformation job has been accepted"
    })