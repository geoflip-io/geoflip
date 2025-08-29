import logging
import os
import json
import datetime
from enum import Enum
from pydantic import BaseModel, UUID4, HttpUrl, ConfigDict
from typing import Annotated, Optional
from fastapi.responses import FileResponse
from fastapi import APIRouter, Request, Depends, HTTPException
from celery.result import AsyncResult

from app.core.celery_worker import celery_app
from app.core.config import config
from app.core.usage_logger import log_usage
from app.core.security import get_current_user
from app.accounts.models.user import User



class TaskStatus(str, Enum):
    PENDING = "PENDING"
    STARTED = "STARTED"
    RETRY = "RETRY"
    FAILURE = "FAILURE"
    SUCCESS = "SUCCESS"

class TaskStatusOut(BaseModel):
    job_id: UUID4
    status: TaskStatus
    output_url: Optional[HttpUrl] = None

    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "job_id": "4fdf9052-261d-4ff0-9521-6de863e785c4",
                "status": "SUCCESS",
                "output_url": "https://api.geoflip.io/result/output/4fdf9052-261d-4ff0-9521-6de863e785c4"
            }
        }
    )

router = APIRouter()
logger = logging.getLogger("api")


@router.get("/result/status/{job_id}",
    response_model=TaskStatusOut,
    tags=["Results"],
    responses={
        404: {"description": "Job not found", "content": {"application/json": {
            "example": {"detail": "Job not found"}
        }}}
    }
)
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

@router.get(
    "/result/output/{job_id}",
    tags=["Results"],
    responses={
        200: {
            "description": "Output file (binary) or GeoJSON content",
            "content": {
                # Binary download (e.g., DXF, SHP.zip, GPKG, etc.)
                "application/octet-stream": {
                    "schema": {"type": "string", "format": "binary"}
                },
                # GeoJSON example
                "application/geo+json": {
                    "schema": {"type": "object"},
                    "examples": {
                        "geojson": {
                            "summary": "GeoJSON FeatureCollection",
                            "value": {
                                "type": "FeatureCollection",
                                "features": [
                                    {"type": "Feature",
                                     "geometry": {"type": "Point", "coordinates": [115.857, -31.953]},
                                     "properties": {"name": "Perth"}}
                                ]
                            }
                        }
                    }
                },
                # Fallback for JSON clients
                "application/json": {
                    "schema": {"type": "object"},
                    "examples": {
                        "geojson-string": {
                            "summary": "GeoJSON (stringified)",
                            "value": {"type": "FeatureCollection", "features": []}
                        }
                    }
                },
            },
        },
        400: {"description": "Task not yet completed or failed", "content": {
            "application/json": {"example": {"detail": "Task not yet completed or failed."}}
        }},
        401: {"description": "Unauthorized", "content": {
            "application/json": {"example": {"detail": "Not authenticated"}}
        }},
        404: {"description": "Output file not found", "content": {
            "application/json": {"example": {"detail": "Output file not found."}}
        }},
    },
)
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