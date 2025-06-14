import geopandas as gpd
from shapely.geometry import Polygon, MultiPolygon
from shapely.ops import unary_union, polygonize

def apply_union(input_gdf):
    """
    Apply a union operation to combine overlapping geometries in the input GeoDataFrame into single geometries
    while preserving non-overlapping geometries. Ensures that all geometries are polygons before applying the union.

    Parameters:
    input_gdf (GeoDataFrame): The input GeoDataFrame containing geometries to be unioned.

    Returns:
    GeoDataFrame: A new GeoDataFrame with geometries unioned where they overlap, preserving attribute data.
    
    Raises:
    ValueError: If any geometry in the input GeoDataFrame is not a polygon.
    """
    # Check if all geometries are polygons or multipolygons
    if not all(isinstance(geom, (Polygon, MultiPolygon)) for geom in input_gdf.geometry):
        raise ValueError("All geometries must be polygons or multipolygons to apply union.")
    
    # Perform the union operation on all geometries
    all_geometries = unary_union(input_gdf.geometry)
    
    # Extract individual polygons from the unioned geometry
    unioned_polygons = list(polygonize(all_geometries))
    
    # Create a list to hold the result rows
    result_rows = []

    # For each polygon, find which input geometries it intersects with and merge their attributes
    for poly in unioned_polygons:
        intersecting_rows = input_gdf[input_gdf.geometry.intersects(poly)]
        
        # Aggregate attributes (example: concatenate strings and sum numbers)
        aggregated_attributes = {}
        for column in intersecting_rows.columns:
            if column != 'geometry':
                if intersecting_rows[column].dtype == 'object':
                    aggregated_attributes[column] = ', '.join(intersecting_rows[column].astype(str).unique())
                else:
                    aggregated_attributes[column] = intersecting_rows[column].sum()
        
        # Append the new polygon and its attributes to the result list
        result_rows.append({**aggregated_attributes, 'geometry': poly})
    
    # Create a new GeoDataFrame from the result list
    unioned_gdf = gpd.GeoDataFrame(result_rows, columns=input_gdf.columns, crs=input_gdf.crs)
    
    return unioned_gdf
