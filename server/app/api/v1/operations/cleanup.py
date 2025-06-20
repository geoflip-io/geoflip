# app/routers/tasks.py
import logging
import os
import shutil
from celery import shared_task
from app.core.config import config as app_config

logger = logging.getLogger("api")  # Use a logger specific to tasks if desired

@shared_task(bind=True, name="app.routers.tasks.cleanup_task")
def cleanup_operation(self, job_id: str) -> None:
    """
    Cleanup task to remove the job directory and its contents.

    Args:
        job_id (str): The unique job identifier.
    """
    job_dir = os.path.join(app_config.DATA_PATH, job_id)
    try:
        if os.path.exists(job_dir):
            if os.path.isdir(job_dir):
                # Remove directory and its contents
                shutil.rmtree(job_dir)
                logger.info(f"Successfully removed directory and its contents: {job_dir}")
            else:
                # Log a warning if job_dir is not a directory
                logger.warning(f"Expected a directory but found a file: {job_dir}")
        else:
            logger.warning(f"Path not found for cleanup: {job_dir}")
    except Exception as e:
        logger.error(f"Error during cleanup of {job_dir}: {e}")