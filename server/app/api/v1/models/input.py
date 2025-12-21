from typing import Optional
from pydantic import BaseModel, model_validator
from fastapi import HTTPException

# --- Input Section ---
SUPPORTED_INPUT_FORMATS = ["geojson", "shp", "dxf", "csv"]


class InputModel(BaseModel):
    format: str
    epsg: Optional[int] = None

    @model_validator(mode="after")
    def validate_format(cls, values):
        if values.format not in SUPPORTED_INPUT_FORMATS:
            raise HTTPException(
                status_code=400,
                detail=f"Unsupported input format: '{values.format}'. Supported formats are: {', '.join(SUPPORTED_INPUT_FORMATS)}",
            )

        match values.format:
            case "dxf" | "csv":
                if values.epsg is None:
                    raise HTTPException(
                        status_code=400,
                        detail=f"field 'input.epsg' is required for {values.format}",
                    )
        return values
