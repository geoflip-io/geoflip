import logging
import os
from fastapi.responses import FileResponse
from fastapi import HTTPException
from fastapi import APIRouter
from celery.result import AsyncResult

from app.core.celery_worker import celery_app
from app.core.config import config

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
async def get_output(job_id: str):
    result = AsyncResult(job_id, app=celery_app)

    if not result.successful():
        raise HTTPException(status_code=400, detail="Task not yet completed or failed.")
    
    output_type = result.result.get("output_type")

    match output_type:
        case "filepath":
            output_filepath = result.result.get("output_filepath")

            if not output_filepath or not os.path.exists(output_filepath):
                raise HTTPException(status_code=404, detail="Output file not found.")

            filename = os.path.basename(output_filepath)

            # Stream the file back to the user
            return FileResponse(
                path=output_filepath,
                filename=filename,
                media_type="application/octet-stream"  # Generic, you can be more specific if you know the format
            )
        case "data":
            return result.result["output_data"]
        case _:
            raise HTTPException(status_code=400, detail=f"Invalid output type: {output_type}")

    # get the output file that was produced via the output id
    return {
        "message": "Output file retrieval not implemented yet.",
    }