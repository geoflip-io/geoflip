import os
import zipfile
import glob
import json
import ezdxf
from shapely.geometry import Point, LineString, Polygon
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

def gdf_to_geojson_data(gdf: gpd.GeoDataFrame) -> str:
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

def gdf_to_geojson_file(gdf: gpd.GeoDataFrame, output_dir: str) -> str:
    """
    Reproject (to EPSG:4326) and save a GeoDataFrame as a GeoJSON file.
    
    Parameters
    ----------
    gdf : geopandas.GeoDataFrame
        The input GeoDataFrame to write.
    output_dir : str
        Directory where the GeoJSON file will be created. The caller
        should ensure this directory exists (gdf_to_output already does).
    
    Returns
    -------
    str
        Absolute path to the written ``geoflip_geojson_4326.geojson`` file.
    """
    # Validate CRS
    if gdf.crs is None:
        raise ValueError("Input GeoDataFrame has no CRS defined.")

    # Always write GeoJSON in WGS-84
    if gdf.crs.to_epsg() != 4326:
        gdf = gdf.to_crs(epsg=4326)

    # File name & path
    output_file_name = "geoflip_geojson_4326"
    output_path = os.path.join(output_dir, f"{output_file_name}.geojson")

	# write to the file - if it fails dump it ourselves
    try:
        gdf.to_file(output_path, driver="GeoJSON")
    except Exception:
        geojson_txt = gdf.to_json()
        with open(output_path, "w", encoding="utf-8") as f:
            f.write(geojson_txt)

    return output_path


def gdf_to_dxf(gdf: gpd.GeoDataFrame, output_dir: str, output_epsg: int) -> str:
    """
    Reproject and save a GeoDataFrame to a DXF file (R2018) using ezdxf.
    """
    output_file_name = f"geoflip_dxf_{output_epsg}"
    output_path = os.path.join(output_dir, f"{output_file_name}.dxf")

    if gdf.crs is None:
        raise ValueError("Input GeoDataFrame has no CRS defined.")

    if gdf.crs.to_epsg() != output_epsg:
        gdf = gdf.to_crs(epsg=output_epsg)

    doc = ezdxf.new(dxfversion='R2018')
    msp = doc.modelspace()

    for geom in gdf.geometry:
        if isinstance(geom, Point):
            msp.add_point((geom.x, geom.y))
        elif isinstance(geom, LineString):
            msp.add_lwpolyline(list(geom.coords))
        elif isinstance(geom, Polygon):
            exterior = list(geom.exterior.coords)
            msp.add_lwpolyline(exterior, close=True)
            for interior in geom.interiors:
                msp.add_lwpolyline(list(interior.coords), close=True)
        else:
            print(f"Skipping unsupported geometry type: {geom.geom_type}")

    doc.saveas(output_path)
    return output_path

# returns the path to the output file or the content of the file
def gdf_to_output(gdf: gpd.GeoDataFrame, output_format:str, output_epsg:int, job_id:str, to_file:bool = True) -> str:
	output_dir = os.path.join(app_config.DATA_PATH, job_id, "output")
	os.makedirs(output_dir, exist_ok=True)
	
	match output_format:
		case "shp":
			output_shp_path = gdf_to_shp(gdf, output_dir, output_epsg)
			return ("filepath",output_shp_path)
		case "geojson":
			output = None
			if to_file:
				output = gdf_to_geojson_file(gdf, output_dir)
				return ("filepath",output)
			else:
				output = gdf_to_geojson_data(gdf)
				return ("data",output)
		case "dxf":
			output_dxf_path = gdf_to_dxf(gdf, output_dir, output_epsg)
			return ("filepath", output_dxf_path)
		case _:
			raise ValueError(f"Unsupported output format: {output_format}")