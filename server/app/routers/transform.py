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
    filePath = None
    data = None
    
    # Step 1: Parse and validate config
    try:
        transform = TransformIn.model_validate(json.loads(config))
    except ValidationError as e:
        logger.warning(f"Validation failed for config: {e}")
        raise HTTPException(status_code=400, detail=e.errors())

    input_type = transform.input.type

    # Step 2: File/Data validation
    if input_type in binary_input_types and not input_file:
        raise HTTPException(status_code=400, detail=f"input_file is required for {binary_input_types.join("/")} input type")
    if input_type in string_input_types and input_file:
        raise HTTPException(status_code=400, detail=f"input_file should not be provided for {string_input_types.join("/")} input")
    if input_type in string_input_types:
        data = transform.input.data
        if not data:
            raise HTTPException(status_code=400, detail=f"data is required for {string_input_types.join("/")} input type")

    # Step 3: Create job directory
    job_id = str(uuid.uuid4())
    upload_dir = os.path.join(os.getenv("UPLOADS_PATH"), job_id)
    os.makedirs(upload_dir, exist_ok=True)

    # Step 4: Save input_file if present
    if input_file:
        filename = secure_filename(input_file.filename)
        input_path = os.path.join(upload_dir, filename)
        with open(input_path, "wb") as f:
            f.write(await input_file.read())

        filePath = os.path.join(upload_dir, filename)        
        logger.info(f"Saved input file to {input_path}")

        # Check if the file is accessible
        try:
            wait_for_file(filePath)
        except FileNotFoundError as e:
            logger.error(f"File save failed or file not accessible: {e}")
            HTTPException(status_code=400, description="File save failed or not accessible.")
        
    # Step 6: TODO - Queue Celery task here
    result = transform_operation.apply_async(
        args=[filePath, data],
        expires=3600,  # 1 hour
        task_id=job_id
    )
    logger.info(f"Dispatched celery transform task: {result.id} for job_id: {job_id}")

    # Step 7: schedule a cleanup task to remove the old files after expiry
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