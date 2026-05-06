from typing import Optional
from pydantic import BaseModel, model_validator
from fastapi import HTTPException

# --- Output Section ---
SUPPORTED_OUTPUT_FORMATS = ["geojson", "shp", "dxf", "csv", "gpkg"]


class OutputModel(BaseModel):
    format: str
    epsg: Optional[int] = 4326  # default WGS-84
    to_file: bool = True

    @model_validator(mode="after")
    def validate_output(self):
        fmt = self.format.lower()

        # Supported format?
        if fmt not in {f.lower() for f in SUPPORTED_OUTPUT_FORMATS}:
            raise HTTPException(
                status_code=400,
                detail=(
                    f"Unsupported output format: '{self.format}'. "
                    f"Supported formats are: {', '.join(SUPPORTED_OUTPUT_FORMATS)}"
                ),
            )

        # If not writing to a file, only GeoJSON is allowed
        if self.to_file is False and fmt != "geojson":
            raise HTTPException(
                status_code=400,
                detail="`to_file=false` is only supported when `output.format` is 'geojson'.",
            )

        # normalise back to original case
        self.format = fmt
        return self
