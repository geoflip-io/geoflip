import pytest
import json
from pathlib import Path

@pytest.mark.anyio
async def test_transform_dxf(async_client):
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
    assert "job_id" in response.json()
