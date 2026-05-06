from typing import Optional
from pydantic import BaseModel, model_validator
from fastapi import HTTPException

# --- Input Section ---
SUPPORTED_INPUT_FORMATS = ["geojson", "shp", "dxf", "csv", "gpkg"]


class InputModel(BaseModel):
    format: str
    epsg: Optional[int] = None

    @model_validator(mode="after")
    def validate_format(self):
        if self.format not in SUPPORTED_INPUT_FORMATS:
            raise HTTPException(
                status_code=400,
                detail=f"Unsupported input format: '{self.format}'. Supported formats are: {', '.join(SUPPORTED_INPUT_FORMATS)}",
            )

        match self.format:
            case "dxf" | "csv":
                if self.epsg is None:
                    raise HTTPException(
                        status_code=400,
                        detail=f"field 'input.epsg' is required for {self.format}",
                    )
        return self
