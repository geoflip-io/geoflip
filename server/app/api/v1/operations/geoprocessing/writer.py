import os
import zipfile
import glob
import json
import geopandas as gpd
from app.core.config import config as app_config

def gdf_to_shp(gdf: gpd.GeoDataFrame, output_dir: str, output_epsg: int) -> str:
    """
    Reproject and save a GeoDataFrame to a shapefile and zip all related files.
    """
    output_file_name = f"geoflip_shp_{output_epsg}"
    output_path = os.path.join(output_dir, f"{output_file_name}.shp")

    # Reproject if needed
    if gdf.crs is None:
        raise ValueError("Input GeoDataFrame has no CRS defined.")

    if gdf.crs.to_epsg() != output_epsg:
        gdf = gdf.to_crs(epsg=output_epsg)

    # Save to .shp
    gdf.to_file(output_path, driver="ESRI Shapefile")

    # Now zip all related files (.shp, .shx, .dbf, .prj, etc.)
    base_name = os.path.splitext(output_path)[0]  # remove .shp
    shapefile_parts = glob.glob(f"{base_name}.*")

    zip_output_path = os.path.join(output_dir, f"{output_file_name}.zip")
    with zipfile.ZipFile(zip_output_path, "w", zipfile.ZIP_DEFLATED) as zipf:
        for filepath in shapefile_parts:
            arcname = os.path.basename(filepath)  # filename inside zip
            zipf.write(filepath, arcname=arcname)

    return zip_output_path

def gdf_to_geojson(gdf: gpd.GeoDataFrame) -> str:
	"""
	Convert a GeoDataFrame to GeoJSON dict format.
	"""
    # Reproject if needed
	if gdf.crs is None:
		raise ValueError("Input GeoDataFrame has no CRS defined.")

	if gdf.crs.to_epsg() != 4326:
		gdf = gdf.to_crs(epsg=4326)

	geojson_dict = json.loads(gdf.to_json())
	return geojson_dict

# returns the path to the output file or the content of the file
def gdf_to_output(gdf: gpd.GeoDataFrame, output_format:str, output_epsg:int, job_id:str) -> str:
	output_dir = os.path.join(app_config.DATA_PATH, job_id, "output")
	os.makedirs(output_dir, exist_ok=True)
	
	output = None
	match output_format:
		case "shp":
			output_shp_path = gdf_to_shp(gdf, output_dir, output_epsg)
			return ("filepath",output_shp_path)
		case "geojson":
			output = gdf_to_geojson(gdf)
			return ("data",output)
		case _:
			raise ValueError(f"Unsupported output format: {output_format}")