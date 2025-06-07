from typing import Literal, Union, Optional, List, Dict, Any
from pydantic import BaseModel, model_validator


# --- Input Section ---

class GeoJSONInput(BaseModel):
    type: Literal["geojson"]
    data: Dict[str, Any]  # FeatureCollection

class FileInput(BaseModel):
    type: Literal["shp"]

InputModel = Union[GeoJSONInput, FileInput]


# --- Transformation Section ---

class BufferParams(BaseModel):
    distance: float
    units: Literal["meters", "kilometers", "feet", "miles"]

class BufferTransformation(BaseModel):
    type: Literal["buffer"]
    params: BufferParams

class UnionTransformation(BaseModel):
    type: Literal["union"]

TransformationModel = Union[BufferTransformation, UnionTransformation]

# --- Output Section ---

class FileOutput(BaseModel):
    format: Literal["shp", "geojson"]
    epsg: Optional[int] = 4326  # Default to WGS84

    @model_validator(mode="after")
    def require_crs_unless_geojson(cls, values):
        if values.format != "geojson" and not values.epsg:
            raise ValueError(f"`epsg` is required when output type is '{values.format}'")
        return values

OutputModel = Union[FileOutput]

# --- Config and JobIn ---

class TransformIn(BaseModel):
    input: InputModel
    transformations: List[TransformationModel] = []
    output: OutputModel