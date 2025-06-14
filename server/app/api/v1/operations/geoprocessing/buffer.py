import geopandas as gpd
import pyproj
from shapely.geometry import box

def get_utm_crs(geometry):
    """
    Determine the appropriate UTM CRS for a given geometry.
    """
    centroid = geometry.centroid
    utm_zone = int((centroid.x + 180) // 6) + 1
    hemisphere = 'north' if centroid.y >= 0 else 'south'
    return f"EPSG:326{utm_zone}" if hemisphere == 'north' else f"EPSG:327{utm_zone}"

def apply_buffer(input_gdf, distance, units, simplify_tolerance=None):
    """
    Apply a buffer transformation to a GeoDataFrame with specified distance and units,
    reprojecting if necessary to ensure accurate distance measurements in a projected CRS,
    and optionally simplifying the resulting buffered geometries.
    """
    # Convert distance to meters based on input units
    unit_factors = {
        'meters': 1,
        'kilometers': 1000,
        'miles': 1609.34,
        'feet': 0.3048
    }

    if units not in unit_factors:
        raise ValueError(f"Unsupported unit: {units}. Supported units are meters, kilometers, miles, feet.")

    distance_in_meters = distance * unit_factors[units]

    # Dynamically set simplify_tolerance if not provided
    if simplify_tolerance is None:
        simplify_tolerance = distance_in_meters * 0.03  # 3% of the buffer distance

    # Check and reproject if CRS is geographic (in degrees)
    original_crs = input_gdf.crs
    if original_crs and pyproj.CRS(original_crs).is_geographic:
        # Reproject to the most suitable UTM zone
        utm_crs = get_utm_crs(input_gdf.unary_union)
        input_gdf = input_gdf.to_crs(utm_crs)

    # Apply buffer transformation in meters
    buffered_geometry = input_gdf.buffer(distance_in_meters)

    # Simplify the buffered geometries if tolerance is greater than 0
    if simplify_tolerance > 0.0:
        buffered_geometry = buffered_geometry.simplify(simplify_tolerance)

    # Create a new GeoDataFrame with original attributes and buffered geometry
    buffered_gdf = input_gdf.copy()
    buffered_gdf['geometry'] = buffered_geometry

    # Reproject back to original CRS if needed
    if original_crs and pyproj.CRS(original_crs).is_geographic:
        buffered_gdf = buffered_gdf.to_crs(original_crs)

    return buffered_gdf
