import pytest
import json
from pathlib import Path
from httpx import AsyncClient
from app.tests.utils import run_output_test

@pytest.mark.anyio
async def test_transform_gpkg(async_client: AsyncClient):
    config = {
        "input": {"format": "gpkg"},
        "transformations": [
            {"type": "buffer", "params": {"distance": 500, "units": "meters"}},
            {"type": "union"}
        ],
        "output": {"format": "geojson", "epsg": 4326}
    }

    gpkg_path = Path(__file__).parent / "data" / "geoflip_gpkg_4326.gpkg"
    with open(gpkg_path, "rb") as f:
        response = await async_client.post(
            "/transform",
            files={
                "config": (None, json.dumps(config), "application/json"),
                "input_file": (gpkg_path.name, f, "application/eopackage+sqlite3")
            }
        )

    assert response.status_code == 200
    job_id = response.json()["job_id"]

    result = await run_output_test(job_id, async_client)
    assert result == "success"
