import logging
import datetime
from celery import shared_task
from typing import Optional
from app.api.v1.operations.geoprocessing.reader import input_to_gdf
from app.api.v1.operations.geoprocessing.writer import gdf_to_output
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
    target_epsg: Optional[int] = None,
    erase_epsg: Optional[int] = None,
    to_file: bool = True,
) -> dict:
    target_gdf: gpd.GeoDataFrame | None = None
    erase_gdf: gpd.GeoDataFrame | None = None
    output_gdf: gpd.GeoDataFrame | None = None

    logger.info(f"Task {self.request.id}: Starting erase_task")

    try:
        start_time = datetime.datetime.now()
        self.update_state(state="STARTED", meta={"message": "Erase task started"})

        # read input data files (target and erase) + turn them into gdf
        self.update_state(state="PROCESSING", meta={"message": "Reading target file"})
        if target_format and target_file_path:
            target_gdf = input_to_gdf(target_format, target_file_path, target_epsg)
            logger.info(
                f"Task {self.request.id}: target file read successfully {target_gdf.head()}"
            )
        else:
            raise ValueError("Error converting target file into gdf")

        self.update_state(state="PROCESSING", meta={"message": "Reading erase file"})
        if erase_format and erase_file_path:
            erase_gdf = input_to_gdf(erase_format, erase_file_path, erase_epsg)
            logger.info(
                f"Task {self.request.id}: target file read successfully {erase_gdf.head()}"
            )
        else:
            raise ValueError("Error converting erase file into gdf")

        # apply the erase
        self.update_state(state="PROCESSING", meta={"message": "Applying erase"})
        # TODO: implement and call erase geoprocessing function
        # DELETE THE BELOW WHEN THIS IS IMPLEMENTED
        output_type, output = ("something", "something")
        # DELETE THE ABOVE

        # write to desired output format
        self.update_state(state="PROCESSING", meta={"message": "Writing output"})
        if output_gdf is not None:
            output_type, output = gdf_to_output(
                output_gdf, output_format, output_epsg, job_id, to_file
            )

        end_time = datetime.datetime.now()
        elapsed = (end_time - start_time).total_seconds()

        if output_type == "filepath":
            result_msg = {
                "message": "Target erased successfully",
                "output_type": output_type,
                "output_filepath": output,
                "output_data": None,
                "processing_time_seconds": elapsed,
            }
        elif output_type == "data":
            result_msg = {
                "message": "Target erased successfully",
                "output_type": output_type,
                "output_filepath": None,
                "output_data": output,
                "processing_time_seconds": elapsed,
            }
        else:
            raise ValueError(f"invalid output_type was returned: {output_type}")

        return result_msg
    except Exception as e:
        logger.error(
            f"Task {self.request.id}: Failed erase task with error: {e}", exc_info=True
        )
        self.update_state(
            state="FAILURE", meta={"exc_type": type(e).__name__, "exc_message": str(e)}
        )
        raise
