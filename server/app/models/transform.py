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

TransformationModel = Union[BufferTransformation]

# --- Output Section ---

class FileOutput(BaseModel):
    type: Literal["shp", "geojson"]
    output_crs: Optional[str] = None

    @model_validator(mode="after")
    def require_crs_unless_geojson(cls, values):
        if values.type != "geojson" and not values.output_crs:
            raise ValueError(f"`output_crs` is required when output type is '{values.type}'")
        return values

OutputModel = Union[FileOutput]

# --- Config and JobIn ---

class TransformIn(BaseModel):
    input: InputModel
    transformations: List[TransformationModel] = []
    output: OutputModel