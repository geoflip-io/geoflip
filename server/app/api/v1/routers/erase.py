import logging
import datetime
import uuid
import json
import io

from app.api.v1.operations.cleanup import cleanup_operation
from fastapi.responses import JSONResponse
from app.api.v1.models.erase import EraseIn
from pydantic import UUID4, ConfigDict, BaseModel, ValidationError
from fastapi import APIRouter, Form, Request, Depends, UploadFile, HTTPException
from typing import Annotated, Literal
from app.accounts.models.user import User
from app.core.security import get_current_user
from app.api.v1.utils.file_handling import save_input

from app.core.config import config as app_config
from app.core.usage_logger import log_usage
from app.api.v1.models.input import SUPPORTED_INPUT_FORMATS
from app.api.v1.models.output import SUPPORTED_OUTPUT_FORMATS

router = APIRouter()
logger = logging.getLogger("api")


class EraseQuedOut(BaseModel):
    job_id: UUID4
    status: Literal["queued"]
    message: str

    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "job_id": "4fdf9052-261d-4ff0-9521-6de863e785c4",
                "status": "queued",
                "message": "Erase job has been accepted",
            }
        }
    )


@router.post(
    "/erase",
    status_code=200,
    response_model=EraseQuedOut,
    tags=["Erase"],
    responses={
        400: {
            "description": "Bad Request",
            "content": {
                "application/json": {"example": {"detail": "input is invalid"}}
            },
        }
    },
)
async def create_erase(
    request: Request,
    current_user: Annotated[User, Depends(get_current_user)],
    config: Annotated[str, Form(...)],
    target_file: UploadFile,
    erase_file: UploadFile,
):
    start_time = datetime.datetime.now()

    # Step 1: Parse and validate config
    try:
        erase_config = EraseIn.model_validate(json.loads(config))
    except ValidationError as e:
        logger.warning(f"Validation failed for config: {e}")
        raise HTTPException(status_code=400, detail="input is invalid")
    except Exception as e:
        logger.warning(f"Bad request: {e}")
        raise HTTPException(status_code=400, detail=f"Bad request {e}")

    target_format: str = erase_config.target.format
    target_epsg: int | None = erase_config.target.epsg
    erase_format: str = erase_config.erase.format
    erase_epsg: int | None = erase_config.erase.epsg
    job_id: str = str(uuid.uuid4())
    input_file_path: str | None = None
    output_format: str = erase_config.output.format
    output_epsg: int | None = erase_config.output.epsg
    output_to_file: bool = erase_config.output.to_file
    payload_size_bytes = 0

    # Valdiation
    if target_format not in SUPPORTED_INPUT_FORMATS:
        raise HTTPException(
            status_code=400, detail=f"Unsupported target input type: {target_format}"
        )
    if erase_format not in SUPPORTED_INPUT_FORMATS:
        raise HTTPException(
            status_code=400, detail=f"Unsupported erase input type: {erase_format}"
        )
    if output_format not in SUPPORTED_OUTPUT_FORMATS:
        raise HTTPException(
            status_code=400, detail=f"Unsupported output format type: {output_format}"
        )

    # Save files
    try:
        target_file_path = await save_input(target_file, job_id)
        target_file.file.seek(0, io.SEEK_END)
        target_file_size_bytes = target_file.file.tell()
        target_file.file.seek(0)
    except Exception:
        raise HTTPException(status_code=400, detail="target_file is required")

    try:
        erase_file_path = await save_input(erase_file, job_id)
        erase_file.file.seek(0, io.SEEK_END)
        erase_file_size_bytes = erase_file.file.tell()
        erase_file.file.seek(0)
    except Exception:
        raise HTTPException(status_code=400, detail="erase_file is required")

    # Step 6: Que the celery task
    logger.info(
        f"job_id: ({current_user.email}){job_id} - Queuing erase task for target format type: {target_format} with erase format type: {erase_format}"
    )

    # TODO: Handle the actual erase operation here (via celery)
    # erase_operation.apply_async()  # type: ignore[call-arg]
    # logger.info(f"Dispatched celery erase task with job_id: {job_id})
    # cleanup_operation.apply_async(  # type: ignore[call-arg]
    #     args=[job_id], countdown=app_config.JOB_EXPIRY_TIME, ignore_result=True
    # )
    #
    # logger.info(f"Queued transfomration job: {job_id}")

    # log the request into usage logs
    end_time = datetime.datetime.now()
    elapsed = (end_time - start_time).total_seconds()
    await log_usage(
        tenant_id=current_user.tenant_id,
        user_id=current_user.id,
        job_id=job_id,
        endpoint="/erase",
        success=True,
        client_ip=request.client.host if request.client else None,
        payload_size_bytes=target_file_size_bytes + erase_file_size_bytes,
        response_time_seconds=elapsed,  # Will log when output is requested
        processing_time_seconds=None,
    )

    return JSONResponse(
        {"job_id": job_id, "status": "queued", "message": "Erase job has been accepted"}
    )
