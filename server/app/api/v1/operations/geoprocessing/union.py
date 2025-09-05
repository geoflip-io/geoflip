import geopandas as gpd
import pandas as pd
from shapely.geometry import Polygon, MultiPolygon
from shapely.ops import unary_union
from shapely.geometry.base import BaseGeometry

def _is_polygonal(geom: BaseGeometry) -> bool:
    return isinstance(geom, (Polygon, MultiPolygon))

def apply_union(input_gdf: gpd.GeoDataFrame) -> gpd.GeoDataFrame:
    """
    Union overlapping polygons, preserving non-overlapping polygons,
    and aggregate attributes sensibly by dtype.
    """
    # 0) Guard: polygonal only
    if not all(_is_polygonal(geom) for geom in input_gdf.geometry):
        raise ValueError("All geometries must be polygons or multipolygons to apply union.")

    # 1) Build the unioned geometry and extract individual polygons
    u = unary_union(input_gdf.geometry)
    if isinstance(u, Polygon):
        unioned_polygons = [u]
    elif isinstance(u, MultiPolygon):
        unioned_polygons = list(u.geoms)
    else:
        # GeometryCollection etc. — keep only polygonal parts
        unioned_polygons = [g for g in getattr(u, "geoms", []) if isinstance(g, (Polygon, MultiPolygon))]

    # 2) Optional: create an sindex for speed
    try:
        sindex = input_gdf.sindex
    except Exception:
        sindex = None

    # 3) Helper: attribute aggregation per column based on dtype
    def aggregate_column(series: pd.Series, colname: str):
        s = series.dropna()
        if s.empty:
            # preserve dtype-ish nulls
            if pd.api.types.is_datetime64_any_dtype(series):
                return pd.NaT
            return None

        if pd.api.types.is_numeric_dtype(series):
            # numeric → sum
            return s.sum()

        if pd.api.types.is_bool_dtype(series):
            # booleans → any (or use .all() if that fits better)
            return bool(s.any())

        if pd.api.types.is_datetime64_any_dtype(series):
            # datetimes → min for "start*", max for "end*", else max
            name_lower = (colname or "").lower()
            if name_lower.startswith("start") or name_lower.endswith("start") or "start_" in name_lower:
                return s.min()
            if name_lower.startswith("end") or name_lower.endswith("end") or "end_" in name_lower:
                return s.max()
            return s.max()

        if pd.api.types.is_timedelta64_dtype(series):
            # durations → sum
            return s.sum()

        if pd.api.types.is_categorical_dtype(series):
            # categoricals → unique values as comma list
            return ", ".join(pd.unique(s.astype(str)))

        # objects/strings and anything else → unique join
        return ", ".join(pd.unique(s.astype(str)))

    result_rows = []

    # 4) For each output polygon, find intersecting inputs and aggregate attributes
    for poly in unioned_polygons:
        if sindex is not None:
            # fast bbox filter, then exact intersects
            idx = list(sindex.query(poly, predicate="intersects"))
            intersecting = input_gdf.iloc[idx]
            if not intersecting.empty:
                intersecting = intersecting[intersecting.geometry.intersects(poly)]
        else:
            intersecting = input_gdf[input_gdf.geometry.intersects(poly)]

        if intersecting.empty:
            # shouldn't normally happen, but be robust
            attrs = {col: None for col in input_gdf.columns if col != "geometry"}
        else:
            attrs = {}
            for col in input_gdf.columns:
                if col == "geometry":
                    continue
                attrs[col] = aggregate_column(intersecting[col], col)

        attrs["geometry"] = poly
        result_rows.append(attrs)

    # 5) Build GeoDataFrame; ensure the same columns order as input
    # (any missing keys will default to None/NaT)
    unioned_gdf = gpd.GeoDataFrame(result_rows, crs=input_gdf.crs)
    # Reorder and reinsert missing columns
    for col in input_gdf.columns:
        if col not in unioned_gdf.columns:
            unioned_gdf[col] = pd.NaT if pd.api.types.is_datetime64_any_dtype(input_gdf[col]) else None
    unioned_gdf = unioned_gdf[input_gdf.columns]

    return unioned_gdf
