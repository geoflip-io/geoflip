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

router = APIRouter()
logger = logging.getLogger("api")


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

    input_type = transform.input.type

    # Step 2: File validation
    if input_type == "shp" and not input_file:
        raise HTTPException(status_code=400, detail="input_file is required for 'shp' input type")
    if input_type == "geojson" and input_file:
        raise HTTPException(status_code=400, detail="input_file should not be provided for 'geojson' input")
    
    # Step 3: Create job directory
    job_id = str(uuid.uuid4())

    #  make a folder to extract the zip file
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
    # celery_worker.process_transform.delay(job_id)

    logger.info(f"Queued transformation job: {job_id}")

    return JSONResponse({
        "job_id": job_id,
        "status": "queued",
        "message": "Transformation job has been accepted"
    })