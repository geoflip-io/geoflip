import logging
from typing import List, Tuple, Dict
import geopandas as gpd
from fastapi import HTTPException

from app.operations.geoprocessing.buffer import apply_buffer
from app.operations.geoprocessing.union import apply_union

logger = logging.getLogger("api")

def apply_transformations(gdf: gpd.GeoDataFrame, transformations: List[Dict]) -> Tuple[gpd.GeoDataFrame, List[str]]:
    """Apply transformations to a GeoDataFrame based on the request data."""
    transformations_applied = []
    output_gdf = gdf
    for transform in transformations:
        match transform["type"]:
            case "buffer":
                distance = transform["distance"]
                units = transform["units"]

                try:
                    simplify_tolerance = transform["simplify_tolerance"]
                except KeyError:
                    # setting this to none will use the default value in apply_buffer
                    # of 3% of the buffer distance
                    simplify_tolerance = None

                output_gdf = apply_buffer(output_gdf, distance, units, simplify_tolerance=simplify_tolerance)

                # calculate units consumed for buffers
                transformations_applied.append("buffer")
            case "union":
                output_gdf = apply_union(output_gdf)

                # calculate units consumed for dissolve
                transformations_applied.append("union")
            case _:
                error_message = f"Unsupported transformation type: {transform['type']}"
                logger.error(error_message)
                raise HTTPException(status_code=400, detail=error_message)

    return output_gdf, transformations_applied
