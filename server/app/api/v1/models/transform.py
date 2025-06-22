from typing import Literal, Union, Optional, List, Dict, Any
from pydantic import BaseModel, model_validator, ValidationError
from fastapi import HTTPException


# --- Input Section ---
SUPPORTED_INPUT_TYPES = ["geojson", "shp"]

class GeoJSONInput(BaseModel):
    type: Literal["geojson"]
    data: Dict[str, Any]  # FeatureCollection

class ShapefileInput(BaseModel):
    type: Literal["shp"]

class InputModel(BaseModel):
    type: str
    data: Any = None  # Only required if type is 'geojson'

    @model_validator(mode="before")
    @classmethod
    def validate_type(cls, values):
        input_type = values.get("type")
        if input_type not in SUPPORTED_INPUT_TYPES:
            raise HTTPException(
                status_code=400,
                detail=f"Unsupported input type: '{input_type}'. Supported types are: {', '.join(SUPPORTED_INPUT_TYPES)}"
            )
        return values

    def to_model(self) -> BaseModel:
        data = self.model_dump()
        if self.type == "geojson":
            return GeoJSONInput(**data)
        elif self.type == "shp":
            return ShapefileInput(**data)


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