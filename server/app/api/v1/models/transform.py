from typing import Literal, Union, Optional, List
from pydantic import BaseModel, model_validator
from fastapi import HTTPException


# --- Input Section ---
SUPPORTED_INPUT_FORMATS = ["geojson", "shp", "dxf"]

class InputModel(BaseModel):
    format: str
    epsg: Optional[int] = None

    @model_validator(mode="after")
    def validate_format(cls, values):
        if values.format not in SUPPORTED_INPUT_FORMATS:
            raise HTTPException(
                status_code=400,
                detail=f"Unsupported input format: '{values.format}'. Supported formats are: {', '.join(SUPPORTED_INPUT_FORMATS)}"
            )
        
        match values.format:
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
SUPPORTED_OUTPUT_FORMATS = ["geojson", "shp", "dxf", "csv"]

class OutputModel(BaseModel):
    format: str
    epsg: Optional[int] = 4326          # default WGS-84
    to_file: bool = True                

    @model_validator(mode="after")
    def validate_output(cls, values):
        fmt = values.format.lower()

        # Supported format?
        if fmt not in {f.lower() for f in SUPPORTED_OUTPUT_FORMATS}:
            raise HTTPException(
                status_code=400,
                detail=(
                    f"Unsupported output format: '{values.format}'. "
                    f"Supported formats are: {', '.join(SUPPORTED_OUTPUT_FORMATS)}"
                ),
            )

        # If not writing to a file, only GeoJSON is allowed
        if values.to_file is False and fmt != "geojson":
            raise HTTPException(
                status_code=400,
                detail="`to_file=false` is only supported when `format` is 'geojson'.",
            )

        # normalise back to original case
        values.format = fmt
        return values

# --- Config and JobIn ---

class TransformIn(BaseModel):
    input: InputModel
    transformations: List[TransformationModel] = []
    output: OutputModel