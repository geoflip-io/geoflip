import logging
import datetime
from celery import shared_task
from typing import Optional
from app.api.v1.operations.geoprocessing.reader import input_to_gdf
import geopandas as gpd

logger = logging.getLogger("api")


@shared_task(bind=True, name="app.routers.tasks.erase_task")
def erase_operation(
    self,
    job_id: str,
    target_format: str,
    target_file_path: str,
    erase_format: str,
    erase_file_path: str,
    output_format: str,
    output_epsg: int,
    erase_epsg: Optional[int] = None,
    target_epsg: Optional[int] = None,
    to_file: bool = True,
) -> dict:
    target_gdf: gpd.GeoDataFrame | None = None
    erase_gdf: gpd.GeoDataFrame | None = None

    logger.info(f"Task {self.request.id}: Starting erase_task")

    try:
        start_time = datetime.datetime.now()
        self.update_state(state="STARTED", meta={"message": "Erase task started"})

        # read input data files (target and erase) + turn them into gdf
        self.update_state(state="PROCESSING", meta={"message": "Reading data"})
        # TODO: read the files

        # apply the erase
        self.update_state(state="PROCESSING", meta={"message": "Applying erase"})
        # TODO: implement and call erase geoprocessing function

        # write to desired output format
        self.update_state(state="PROCESSING", meta={"message": "Writing output"})
        # TODO: write the resulting erased gdf to output file

        end_time = datetime.datetime.now()
        elapsed = (end_time - start_time).total_seconds()

        result_msg = {
            "message": "Target erased successfully",
            "output_type": "data",
            "output_filepath": None,
            "output_data": "{'message':'one day this will be data'}",
            "processing_time_seconds": elapsed,
        }

        return result_msg
    except Exception as e:
        logger.error(
            f"Task {self.request.id}: Failed erase task with error: {e}", exc_info=True
        )
        self.update_state(
            state="FAILURE", meta={"exc_type": type(e).__name__, "exc_message": str(e)}
        )
        raise
