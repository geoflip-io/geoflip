import geopandas as gpd
from typing import cast
from pyproj import CRS


def apply_erase(
    target_gdf: gpd.GeoDataFrame, erase_gdf: gpd.GeoDataFrame
) -> gpd.GeoDataFrame:
    """
    Return target_gdf with any areas overlapping erase_gdf removed.

    This is equivalent to a geometric difference: target - erase.
    """

    if target_gdf.crs is None:
        raise ValueError("target_gdf has no CRS set")
    if erase_gdf.crs is None:
        raise ValueError("erase_gdf has no CRS set")

    target_crs = cast(CRS, target_gdf.crs)

    # Reproject if needed so both are in the same CRS
    if target_gdf.crs != erase_gdf.crs:
        erase_gdf = erase_gdf.to_crs(target_crs)

    # GeoPandas overlay with op="difference"
    result = gpd.overlay(target_gdf, erase_gdf, how="difference")

    # `overlay` keeps columns from both; if you only want target columns:
    result = result[target_gdf.columns.intersection(result.columns)]

    result = cast(gpd.GeoDataFrame, result)

    return result
