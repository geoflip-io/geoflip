# celery_worker.py
from celery import Celery
from app.core.database import redis_url

# List all modules containing tasks here
TASK_MODULES = [
    "app.api.v1.operations.transform",
    "app.api.v1.operations.erase",
    "app.api.v1.operations.cleanup",
    # Add any other module containing task definitions
]

celery_app = Celery(
    "geoflip", broker=redis_url, backend=redis_url, include=TASK_MODULES
)

celery_app.conf.update(
    task_track_started=True,
    task_serializer="json",
    result_serializer="json",
    accept_content=["json"],
    result_expires=3600,  # expire task results after 1 hour
)

