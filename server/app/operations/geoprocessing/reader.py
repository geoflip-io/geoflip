import geopandas as gpd
import os
import zipfile

def shp_to_gdf(input_zip_path: str) -> gpd.GeoDataFrame:
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
    return gdf

def geojson_to_gdf(geojson_dict: dict) -> gpd.GeoDataFrame:
    try:
        # Expecting a full GeoJSON FeatureCollection
        if geojson_dict.get("type") != "FeatureCollection":
            raise ValueError("Invalid GeoJSON: must be a FeatureCollection.")

        # Convert directly to GeoDataFrame
        gdf = gpd.GeoDataFrame.from_features(geojson_dict["features"])
        return gdf

    except Exception as e:
        raise ValueError(f"Error converting GeoJSON to GeoDataFrame: {e}")


def input_to_gdf(input_type: str, input_filepath: str = None, data: str = None) -> gpd.GeoDataFrame:
	match input_type:
		case "shp":
			return shp_to_gdf(input_filepath)
		case "geojson":
			return geojson_to_gdf(data)
		case _:
			raise ValueError(f"Unsupported file type: {type}")