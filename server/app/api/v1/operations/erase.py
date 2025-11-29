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

    result_msg = {
        "message": "Target erased successfully",
        "output_type": "data",
        "output_filepath": None,
        "output_data": "{'message':'one day this will be data'}",
        "processing_time_seconds": 0,
    }

    return result_msg
