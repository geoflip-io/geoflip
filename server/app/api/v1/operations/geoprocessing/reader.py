import geopandas as gpd
import pandas as pd
import logging
import os
import zipfile
import json
from typing import Optional

logger = logging.getLogger("api")


def shp_to_gdf(input_zip_path: str) -> gpd.GeoDataFrame:
    try:
        # Get the directory where the zip file is located
        extract_dir = os.path.dirname(input_zip_path)

        # Extract the zip file in-place
        with zipfile.ZipFile(input_zip_path, "r") as zip_ref:
            zip_ref.extractall(extract_dir)

        # Find the .shp file (case-insensitive)
        shp_file = None
        for filename in os.listdir(extract_dir):
            if filename.lower().endswith(".shp"):
                shp_file = os.path.join(extract_dir, filename)
                break

        if not shp_file:
            raise FileNotFoundError("No .shp file found in extracted archive.")

        # Load the shapefile into a GeoDataFrame
        gdf = gpd.read_file(shp_file)
    except Exception as e:
        logger.error(f"Error handling the zipped shape file: {e}")
        raise ValueError(
            f"Error handling zipped shape file: {e} - api usage as not been recorded."
        )

    return gdf


def geojson_to_gdf(input_filepath: str) -> gpd.GeoDataFrame:
    """
    Load a GeoJSON FeatureCollection from `input_filepath`
    and return it as a GeoDataFrame in EPSG:4326.
    """
    try:
        # Read the GeoJSON file into a dict
        with open(input_filepath, "r", encoding="utf-8") as f:
            geojson_dict = json.load(f)

        # Basic validation
        if geojson_dict.get("type") != "FeatureCollection":
            raise ValueError("Invalid GeoJSON: expected a FeatureCollection.")

        # Build the GeoDataFrame (GeoPandas handles geometry parsing)
        gdf = gpd.GeoDataFrame.from_features(
            geojson_dict["features"],
            crs="EPSG:4326",  # Set the CRS explicitly
        )

        return gdf

    except Exception as e:
        raise ValueError(f"Error converting GeoJSON to GeoDataFrame: {e}")


def dxf_to_gdf(input_filepath: str, input_epsg: int) -> gpd.GeoDataFrame:
    try:
        gdf = gpd.read_file(input_filepath)
        gdf.crs = input_epsg
    except Exception as e:
        logger.error(f"Error handling the DXF file: {e}")
        raise ValueError(
            f"Error handling DXF file: {e} - api usage as not been recorded."
        )
    return gdf


def csv_to_gdf(
    input_filepath: str,
    input_epsg: int,
    wkt_col: str = "geom_wkt",
    encoding: Optional[str] = "utf-8",
) -> gpd.GeoDataFrame:
    """
    Load a CSV file where geometry is stored as WKT in `wkt_col` and return a GeoDataFrame.

    Parameters
    ----------
    input_filepath : str
        Path to the CSV file.
    input_epsg : int
        EPSG code for the input CRS (required, e.g., 4326).
    wkt_col : str, default "geom_wkt"
        Column name containing WKT geometries.
    encoding : Optional[str], default "utf-8"
        File encoding for the CSV. Try "utf-8-sig" or "latin-1" if needed.

    Returns
    -------
    geopandas.GeoDataFrame
        GeoDataFrame with geometries parsed from WKT and CRS set to EPSG:input_epsg.

    Raises
    ------
    ValueError
        If the file is missing, the WKT column is absent, EPSG is invalid,
        or geometries cannot be parsed.
    """
    # --- Basic validation
    if not isinstance(input_epsg, int) or input_epsg <= 0:
        raise ValueError(
            "`input_epsg` must be a positive integer EPSG code (e.g., 4326)."
        )

    if not os.path.exists(input_filepath):
        raise ValueError(f"CSV file not found: {input_filepath}")

    # --- Read CSV
    try:
        df = pd.read_csv(input_filepath, encoding=encoding)
    except UnicodeDecodeError as e:
        raise ValueError(
            f"Failed to read CSV with encoding '{encoding}': {e}. "
            "Try encoding='utf-8-sig' or 'latin-1'."
        )
    except Exception as e:
        raise ValueError(f"Error reading CSV: {e}")

    if df.empty:
        raise ValueError("CSV loaded but contains no rows.")

    if wkt_col not in df.columns:
        raise ValueError(
            f"Required WKT column '{wkt_col}' not found in CSV columns: {list(df.columns)}"
        )

    # --- Parse WKT → geometry
    try:
        # geopandas has a helper for WKT parsing
        geometry = gpd.GeoSeries.from_wkt(df[wkt_col])
    except Exception:
        # Fallback if older versions behave differently
        try:
            from shapely import wkt as _wkt

            geometry = (
                df[wkt_col]
                .astype(str)
                .apply(lambda s: _wkt.loads(s) if s and s.strip() else None)
            )
            geometry = gpd.GeoSeries(geometry)
        except Exception as e:
            raise ValueError(f"Failed to parse WKT from column '{wkt_col}': {e}")

    # --- Validate parsed geometry
    invalid_mask = geometry.isna()
    invalid_count = int(invalid_mask.sum())
    if invalid_count == len(geometry):
        raise ValueError(
            f"Failed to parse any valid geometries from '{wkt_col}'. "
            "Check WKT strings and delimiter/quoting in the CSV."
        )
    elif invalid_count > 0:
        # You can choose to raise or drop. For safety, raise with a helpful message.
        bad_indices = df.index[invalid_mask].tolist()[:10]  # show up to 10
        raise ValueError(
            f"{invalid_count} row(s) have invalid WKT in '{wkt_col}'. "
            f"Examples of bad row indices: {bad_indices}. "
            "Fix the input or pre-clean before loading."
        )

    # --- Build GeoDataFrame
    try:
        gdf = gpd.GeoDataFrame(
            df.drop(columns=[wkt_col]), geometry=geometry, crs=f"EPSG:{input_epsg}"
        )
    except Exception as e:
        raise ValueError(f"Failed to create GeoDataFrame: {e}")

    return gdf


def input_to_gdf(
    input_format: str, input_filepath: str, input_epsg: int | None
) -> gpd.GeoDataFrame:
    match input_format:
        case "shp":
            return shp_to_gdf(input_filepath)
        case "geojson":
            return geojson_to_gdf(input_filepath)
        case "dxf":
            if input_epsg:
                return dxf_to_gdf(input_filepath, input_epsg)
            else:
                raise ValueError("input_epsg is required for dxf input_format")
        case "csv":
            if input_epsg:
                return csv_to_gdf(input_filepath, input_epsg)
            else:
                raise ValueError("input_epsg is required for csv input_format")
        case _:
            raise ValueError(f"Unsupported file type: {type}")

