# app/routers/tasks.py
import time
import logging
from celery import shared_task
from app.celery_worker import celery_app # Good practice to import the app instance if using bind=True or specific app features

logger = logging.getLogger("api") # Use a logger specific to tasks if desired

@shared_task(bind=True, name='app.routers.tasks.fake_task') # Optionally explicitly name it
def fake_task(self):
    logger.info(f"Task {self.request.id}: Starting fake_task")
    try:
        self.update_state(state="PROGRESS", meta={"msg": "Working..."})
        time.sleep(5) # Maybe increase sleep for easier testing
        result_msg = {"msg": "Task complete"}
        logger.info(f"Task {self.request.id}: Finished fake_task successfully")
        # The return value automatically sets the state to SUCCESS
        return result_msg
    except Exception as e:
        logger.error(f"Task {self.request.id}: Failed with error: {e}", exc_info=True)
        # Update state to FAILURE on error
        self.update_state(state='FAILURE', meta={'exc_type': type(e).__name__, 'exc_message': str(e)})
        # Reraise the exception so Celery knows it failed
        raise