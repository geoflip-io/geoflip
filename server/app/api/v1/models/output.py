from typing import Optional
from pydantic import BaseModel, model_validator
from fastapi import HTTPException

# --- Output Section ---
SUPPORTED_OUTPUT_FORMATS = ["geojson", "shp", "dxf", "csv"]


class OutputModel(BaseModel):
    format: str
    epsg: Optional[int] = 4326  # default WGS-84
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
