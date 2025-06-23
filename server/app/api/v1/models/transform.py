from typing import Literal, Union, Optional, List, Any
from pydantic import BaseModel, model_validator
from fastapi import HTTPException


# --- Input Section ---
SUPPORTED_INPUT_FORMATS = ["geojson", "shp", "dxf"]

class InputModel(BaseModel):
    format: str
    data: Any = None  # Only required if type is 'geojson'
    epsg: Optional[int] = None

    @model_validator(mode="after")
    def validate_format(cls, values):
        if values.format not in SUPPORTED_INPUT_FORMATS:
            raise HTTPException(
                status_code=400,
                detail=f"Unsupported input format: '{values.format}'. Supported formats are: {', '.join(SUPPORTED_INPUT_FORMATS)}"
            )
        
        match values.format:
            case "geojson":
                if values.data is None:
                    raise HTTPException(
                        status_code=400,
                        detail=f"field 'input.data' is required for {values.format}"
                    )
            case "dxf":
                if values.epsg is None:
                    raise HTTPException(
                        status_code=400,
                        detail=f"field 'input.epsg' is required for {values.format}"
                    )
        return values

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
SUPPORTED_OUTPUT_FORMATS = ["geojson", "shp", "dxf"]

class OutputModel(BaseModel):
    format: str
    epsg: Optional[int] = 4326  # Default to WGS84

    @model_validator(mode="after")
    def validate_type(cls, values):
        if values.format not in SUPPORTED_OUTPUT_FORMATS:
            raise HTTPException(
                status_code=400,
                detail=f"Unsupported output format: '{values.format}'. Supported formats are: {', '.join(SUPPORTED_OUTPUT_FORMATS)}"
            )
        return values

# --- Config and JobIn ---

class TransformIn(BaseModel):
    input: InputModel
    transformations: List[TransformationModel] = []
    output: OutputModel