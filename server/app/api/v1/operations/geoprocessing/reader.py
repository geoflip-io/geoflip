import geopandas as gpd
import logging
import os
import zipfile
from shapely.geometry import Point


logger = logging.getLogger("api")

def shp_to_gdf(input_zip_path: str) -> gpd.GeoDataFrame:
    try:
        # Get the directory where the zip file is located
        extract_dir = os.path.dirname(input_zip_path)

        # Extract the zip file in-place
        with zipfile.ZipFile(input_zip_path, 'r') as zip_ref:
            zip_ref.extractall(extract_dir)

        # Find the .shp file (case-insensitive)
        shp_file = None
        for filename in os.listdir(extract_dir):
            if filename.lower().endswith('.shp'):
                shp_file = os.path.join(extract_dir, filename)
                break

        if not shp_file:
            raise FileNotFoundError("No .shp file found in extracted archive.")

        # Load the shapefile into a GeoDataFrame
        gdf = gpd.read_file(shp_file)
    except Exception as e:
        logger.error(f"Error handling the zipped shape file: {e}")
        raise ValueError(f"Error handling zipped shape file: {e} - api usage as not been recorded.")
    
    return gdf

def geojson_to_gdf(geojson_dict: dict) -> gpd.GeoDataFrame:
    try:
        # Expecting a full GeoJSON FeatureCollection
        if geojson_dict.get("type") != "FeatureCollection":
            raise ValueError("Invalid GeoJSON: must be a FeatureCollection.")

        # Convert directly to GeoDataFrame
        gdf = gpd.GeoDataFrame.from_features(geojson_dict["features"])
        gdf.set_crs(epsg=4326, inplace=True)
        return gdf

    except Exception as e:
        raise ValueError(f"Error converting GeoJSON to GeoDataFrame: {e}")

def dxf_to_gdf(input_filepath: str, input_epsg: int) -> gpd.GeoDataFrame:
    try:
        gdf = gpd.read_file(input_filepath)
        gdf.crs = input_epsg
    except Exception as e:
        logger.error(f"Error handling the DXF file: {e}")
        raise ValueError(f"Error handling DXF file: {e} - api usage as not been recorded.")
    return gdf

def input_to_gdf(input_format: str, input_filepath: str = None, input_epsg: int = None, data: str = None) -> gpd.GeoDataFrame:
	match input_format:
		case "shp":
			return shp_to_gdf(input_filepath)
		case "geojson":
			return geojson_to_gdf(data)
		case "dxf":
			return dxf_to_gdf(input_filepath, input_epsg)
		case _:
			raise ValueError(f"Unsupported file type: {type}")