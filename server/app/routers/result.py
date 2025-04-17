import logging
from fastapi import APIRouter
from celery.result import AsyncResult

from app.celery_worker import celery_app

router = APIRouter()
logger = logging.getLogger("api")


@router.get("/result/status/{task_id}")
async def get_task_status(task_id: str):
    result = AsyncResult(task_id, app=celery_app)
    return {
        "task_id": task_id,
        "status": result.status,
        "result": result.result,
    }

#TODO: implement this endpoint to get the output file from the task
@router.get("/result/output/{output_id}")
async def get_task_status(task_id: str):
    # get the output file that was produced via the output id
    return {
        "message": "Output file retrieval not implemented yet.",
    }