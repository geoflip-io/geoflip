import logging
from fastapi import APIRouter
from fastapi.responses import JSONResponse
from celery.result import AsyncResult
from app.operations.transform import fake_task

from app.celery_worker import celery_app

router = APIRouter()
logger = logging.getLogger("api")


@router.post("/test-celery/run", status_code=200)
async def run_test_task():
    result = fake_task.delay()
    logger.info(f"Dispatched test Celery task: {result.id}")
    return {"task_id": result.id, "status": "queued"}


@router.get("/test-celery/status/{task_id}")
async def get_task_status(task_id: str):
    result = AsyncResult(task_id, app=celery_app)
    return {
        "task_id": task_id,
        "status": result.status,
        "result": result.result,
        "info": result.info,
    }