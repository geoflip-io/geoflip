import logging
import json
import io
import uuid
import datetime
from typing import Annotated, Literal
from app.api.v1.utils.file_handling import save_input
from app.core.security import get_current_user
from app.accounts.models.user import User

from fastapi import APIRouter, UploadFile, Form, HTTPException, Depends, Request
from fastapi.responses import JSONResponse
from pydantic import ValidationError, BaseModel, UUID4, ConfigDict

from app.api.v1.models.transform import TransformIn

from app.api.v1.operations.transform import transform_operation
from app.api.v1.operations.cleanup import cleanup_operation

from app.core.config import config as app_config
from app.core.usage_logger import log_usage

from app.api.v1.models.input import SUPPORTED_INPUT_FORMATS


router = APIRouter()
logger = logging.getLogger("api")


class TransformQueuedOut(BaseModel):
    job_id: UUID4
    status: Literal["queued"]
    message: str

    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "job_id": "4fdf9052-261d-4ff0-9521-6de863e785c4",
                "status": "queued",
                "message": "Transformation job has been accepted",
            }
        }
    )


@router.post(
    "/transform",
    status_code=200,
    response_model=TransformQueuedOut,
    tags=["Transformation"],
    responses={
        400: {
            "description": "Bad Request",
            "content": {
                "application/json": {"example": {"detail": "input is invalid"}}
            },
        }
    },
)
async def create_transformation(
    request: Request,
    current_user: Annotated[User, Depends(get_current_user)],
    config: Annotated[str, Form(...)],
    input_file: UploadFile,
):
    start_time = datetime.datetime.now()

    # Step 1: Parse and validate config
    try:
        transform = TransformIn.model_validate(json.loads(config))
    except ValidationError as e:
        logger.warning(f"Validation failed for config: {e}")
        raise HTTPException(status_code=400, detail="input is invalid")
    except Exception as e:
        logger.warning(f"Bad request: {e}")
        raise HTTPException(status_code=400, detail=f"Bad request {e}")

    input_format: str = transform.input.format
    input_epsg: int | None = transform.input.epsg
    job_id: str = str(uuid.uuid4())
    input_file_path: str | None = None
    output_format: str = transform.output.format
    output_epsg: int | None = transform.output.epsg
    output_to_file: bool = transform.output.to_file
    payload_size_bytes = 0
    # convert transformations to a list of dictionaries to pass to the celery task
    transformations: list = [
        t.model_dump(mode="json") for t in transform.transformations
    ]

    if input_format not in SUPPORTED_INPUT_FORMATS:
        raise HTTPException(
            status_code=400, detail=f"Unsupported input type: {input_format}"
        )

    try:
        input_file_path = await save_input(input_file, job_id)
        input_file.file.seek(0, io.SEEK_END)
        payload_size_bytes = input_file.file.tell()
        input_file.file.seek(0)
    except Exception:
        raise HTTPException(status_code=400, detail="input_file is required")

    # Step 6: Que the celery task
    logger.info(
        f"job_id: ({current_user.email}){job_id} - Queuing transformation task for input type: {input_format}"
    )
    transform_operation.apply_async(  # type: ignore[call-arg]
        args=[
            job_id,
            input_format,
            transformations,
            output_format,
            output_epsg,
            input_epsg,
            input_file_path,
            output_to_file,
        ],
        expires=app_config.JOB_EXPIRY_TIME,
        task_id=job_id,
    )
    logger.info(f"Dispatched celery transform task with job_id: {job_id}")

    # Also schedule a cleanup task to clean up expired job data:
    cleanup_operation.apply_async(  # type: ignore[call-arg]
        args=[job_id], countdown=app_config.JOB_EXPIRY_TIME, ignore_result=True
    )

    logger.info(f"Queued transformation job: {job_id}")

    # log the request into usage logs
    end_time = datetime.datetime.now()
    elapsed = (end_time - start_time).total_seconds()
    await log_usage(
        tenant_id=current_user.tenant_id,
        user_id=current_user.id,
        job_id=job_id,
        endpoint="/transform",
        success=True,
        client_ip=request.client.host if request.client else None,
        payload_size_bytes=payload_size_bytes,
        response_time_seconds=elapsed,  # Will log when output is requested
        processing_time_seconds=None,
    )

    return JSONResponse(
        {
            "job_id": job_id,
            "status": "queued",
            "message": "Transformation job has been accepted",
        }
    )
