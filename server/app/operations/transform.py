# app/routers/tasks.py
import time
import logging
from celery import shared_task
from app.celery_worker import celery_app # Good practice to import the app instance if using bind=True or specific app features

logger = logging.getLogger("api") # Use a logger specific to tasks if desired

@shared_task(bind=True, name="app.routers.tasks.transform_task")
def transform_operation(self, input_filepath: str = None, data: str = None):
    logger.info(f"Task {self.request.id}: Starting transform_task")

    try:
        self.update_state(state="PROGRESS", meta={"message": "Transform task started."})

        if input_filepath:
            logger.info(f"Reading from file: {input_filepath}")
            # simulate reading file
            time.sleep(3)
        elif data:
            logger.info(f"Processing inline data string of length {len(data)}")
            # simulate processing raw data
            time.sleep(3)
        else:
            raise ValueError("Either input_filepath or data must be provided.")

        result_msg = {
            "message": "Data transformed successfully",
            "input_filepath": input_filepath,
            "used_data": bool(data),
            "output_filepath": "/path/to/output/file.gdf",
        }
        logger.info(f"Task {self.request.id}: Finished transform_task successfully")
        return result_msg

    except Exception as e:
        logger.error(f"Task {self.request.id}: Failed with error: {e}", exc_info=True)
        self.update_state(
            state="FAILURE",
            meta={"exc_type": type(e).__name__, "exc_message": str(e)},
        )
        raise
