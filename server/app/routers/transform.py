import logging
import json
import os
import uuid
from typing import Annotated, Optional

from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from fastapi.responses import JSONResponse
from pydantic import ValidationError

from app.models.transform import TransformIn

router = APIRouter()
logger = logging.getLogger(__name__)


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
    job_dir = os.path.join("/data/jobs", job_id)
    os.makedirs(job_dir, exist_ok=True)

    # Step 4: Save input_file if present
    if input_file:
        input_path = os.path.join(job_dir, input_file.filename)
        with open(input_path, "wb") as f:
            f.write(await input_file.read())

    # Step 6: TODO - Queue Celery task here
    # celery_worker.process_transform.delay(job_id)

    logger.info(f"Queued transformation job: {job_id}")

    return JSONResponse({
        "job_id": job_id,
        "status": "queued",
        "message": "Transformation job has been accepted"
    })