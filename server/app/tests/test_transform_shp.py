import pytest
import json
from pathlib import Path

@pytest.mark.anyio
async def test_transform_shp(celery_worker, async_client):
    config = {
        "input": {"format": "shp"},
        "transformations": [
            {"type": "buffer", "params": {"distance": 500, "units": "meters"}},
            {"type": "union"}
        ],
        "output": {"format": "geojson", "epsg": 4326}
    }

    shp_path = Path(__file__).parent / "data" / "test_shp.zip"
    with open(shp_path, "rb") as f:
        response = await async_client.post(
            "/transform",
            files={
                "config": (None, json.dumps(config), "application/json"),
                "input_file": ("test_shp.zip", f, "application/zip")
            }
        )

    assert response.status_code == 200
    assert "job_id" in response.json()
    celery_worker.reload()