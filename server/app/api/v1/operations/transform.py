# app/routers/tasks.py
import logging
import datetime
from celery import shared_task
from app.api.v1.operations.geoprocessing.writer import gdf_to_output

import geopandas as gpd

from app.api.v1.operations.geoprocessing.reader import input_to_gdf
from app.api.v1.operations.geoprocessing.transformation_manager import apply_transformations

logger = logging.getLogger("api") # Use a logger specific to tasks if desired

@shared_task(bind=True, name="app.routers.tasks.transform_task")
def transform_operation(self, 
        job_id: str,
        input_format: str,
        transformations: list,
        output_format: str,
        output_epsg:int,
        input_file_path: str = None, 
        data: dict = None,
    ) -> dict:
    input_gdf: gpd.GeoDataFrame = None

    logger.info(f"Task {self.request.id}: Starting transform_task")

    try:
        start_time = datetime.datetime.now()
        self.update_state(state="PROGRESS", meta={"message": "Transform task started."})

        # Read input data
        if (input_file_path or data) and not(input_file_path and data):
            input_gdf = input_to_gdf(input_format, input_file_path, data)
            logger.info(f"Task {self.request.id}: Data read successfully {input_gdf.head()}")
        else:
            raise ValueError("Either input_file_path or data must be provided - not both.")

        # Apply transformations
        input_gdf, transformations_applied = apply_transformations(gdf=input_gdf, transformations=transformations)
        logger.info(f"Task {self.request.id}: Transformations applied: {transformations_applied}")

        # write to desired output format
        if input_gdf is not None:
            output_type, output = gdf_to_output(input_gdf, output_format, output_epsg, job_id)
        else:
            logger.warning(f"Task {self.request.id}: input_gdf is None, no data to write.")
            raise ValueError("No data to write.")

        end_time = datetime.datetime.now()
        elapsed = (end_time - start_time).total_seconds()

        if output_type == "filepath":
            result_msg = {
                "message": "Data transformed successfully",
                "output_type": output_type,
                "output_filepath": output,
                "output_data": None,
                "processing_time_seconds": elapsed
            }
        elif output_type == "data":
            result_msg = {
                "message": "Data transformed successfully",
                "output_type": output_type,
                "output_filepath": None,
                "output_data": output,
                "processing_time_seconds": elapsed
            }
        else:
            raise ValueError(f"invalid output_type was returned: {output_type}")
        
        
        logger.info(f"Task {self.request.id}: Finished transform_task successfully")
        return result_msg

    except Exception as e:
        logger.error(f"Task {self.request.id}: Failed with error: {e}", exc_info=True)
        self.update_state(
            state="FAILURE",
            meta={"exc_type": type(e).__name__, "exc_message": str(e)},
        )
        raise
