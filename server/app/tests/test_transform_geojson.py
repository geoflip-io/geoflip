import pytest
import json
from httpx import AsyncClient

@pytest.mark.anyio
async def test_transform_geojson(celery_worker, async_client: AsyncClient):
    config = {
        "input": {
            "format": "geojson",
            "data": {
                "type": "FeatureCollection",
                "features": [
                    {
                        "type": "Feature",
                        "geometry": {"type": "Point", "coordinates": [125.6, 10.1]},
                        "properties": {"name": "Test Point"}
                    }
                ]
            }
        },
        "transformations": [
            {"type": "buffer", "params": {"distance": 50, "units": "meters"}}
        ],
        "output": {"format": "shp", "epsg": 4326}
    }

    response = await async_client.post(
        "/transform",
        files={"config": (None, json.dumps(config), "application/json")}
    )

    assert response.status_code == 200
    assert "job_id" in response.json()
    celery_worker.reload()