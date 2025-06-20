import logging
import os
import json
import datetime
from typing import Annotated
from fastapi.responses import FileResponse
from fastapi import APIRouter, Request, Depends, HTTPException
from celery.result import AsyncResult

from app.core.celery_worker import celery_app
from app.core.config import config
from app.core.usage_logger import log_usage
from app.core.security import get_current_user

from app.accounts.models.user import User

router = APIRouter()
logger = logging.getLogger("api")


@router.get("/result/status/{job_id}")
async def get_task_status(job_id: str):
    result = AsyncResult(job_id, app=celery_app)
    output_url = None

    if result.successful():
        output_url = f"{config.BACKEND_URL}/result/output/{job_id}"

    return {
        "job_id": job_id,
        "status": result.status,
        "output_url": output_url,
    }

@router.get("/result/output/{job_id}")
async def get_output(
    request: Request,
    current_user: Annotated[User, Depends(get_current_user)],
    job_id: str
):
    start_time = datetime.datetime.now()
    payload_size_bytes = 0
    result = AsyncResult(job_id, app=celery_app)

    if not result.successful():
        await log_usage(
            tenant_id=current_user.tenant_id,
            user_id=current_user.id,
            job_id=job_id,
            endpoint=f"/result/output/{job_id}",
            success=False,
            client_ip=request.client.host if request.client else None,
            payload_size_bytes=None,
            response_time_seconds=None, 
            processing_time_seconds=None
        )
        raise HTTPException(status_code=400, detail="Task not yet completed or failed.")
    
    output_type = result.result.get("output_type")
    processing_time_seconds = result.result.get("processing_time_seconds")
    end_time = datetime.datetime.now()
    elapsed = (end_time - start_time).total_seconds()

    match output_type:
        case "filepath":
            output_filepath = result.result.get("output_filepath")

            if not output_filepath or not os.path.exists(output_filepath):
                raise HTTPException(status_code=404, detail="Output file not found.")
            
            payload_size_bytes = os.path.getsize(output_filepath)

            filename = os.path.basename(output_filepath)

            await log_usage(
                tenant_id=current_user.tenant_id,
                user_id=current_user.id,
                job_id=job_id,
                endpoint=f"/result/output/{job_id}",
                success=True,
                client_ip=request.client.host if request.client else None,
                payload_size_bytes=payload_size_bytes,
                response_time_seconds=elapsed,  # Will log when output is requested
                processing_time_seconds=processing_time_seconds
            )

            # Stream the file back to the user
            return FileResponse(
                path=output_filepath,
                filename=filename,
                media_type="application/octet-stream"  # Generic, you can be more specific if you know the format
            )
        case "data":
            payload_size_bytes = len(json.dumps(result.result["output_data"]).encode("utf-8"))

            await log_usage(
                tenant_id=current_user.tenant_id,
                user_id=current_user.id,
                job_id=job_id,
                endpoint=f"/result/output/{job_id}",
                success=True,
                client_ip=request.client.host if request.client else None,
                payload_size_bytes=payload_size_bytes,
                response_time_seconds=elapsed,  # Will log when output is requested
                processing_time_seconds=processing_time_seconds
            )

            return result.result["output_data"]
        case _:
            raise HTTPException(status_code=400, detail=f"Invalid output type: {output_type}")

    # get the output file that was produced via the output id
    return {
        "message": "Output file retrieval not implemented yet.",
    }