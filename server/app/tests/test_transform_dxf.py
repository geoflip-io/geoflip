import pytest
import json
from pathlib import Path
from httpx import AsyncClient
from app.tests.utils import run_output_test

@pytest.mark.anyio
async def test_transform_dxf(async_client: AsyncClient):
    config = {
        "input": {"format": "dxf", "epsg": 4326},
        "transformations": [
            {"type": "buffer", "params": {"distance": 500, "units": "meters"}},
            {"type": "union"}
        ],
        "output": {"format": "shp", "epsg": 4326}
    }

    dxf_path = Path(__file__).parent / "data" / "test.dxf"
    with open(dxf_path, "rb") as f:
        response = await async_client.post(
            "/transform",
            files={
                "config": (None, json.dumps(config), "application/json"),
                "input_file": ("test.dxf", f, "application/octet-stream")
            }
        )

    assert response.status_code == 200
    job_id = response.json()["job_id"]

    result = await run_output_test(job_id, async_client)
    assert result == "success"

