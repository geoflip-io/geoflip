import pytest
import json
from httpx import AsyncClient
from app.tests.utils import run_output_test

input_data = {
                "type": "FeatureCollection",
                "features": [
                    {
                        "type": "Feature",
                        "geometry": {"type": "Point", "coordinates": [125.6, 10.1]},
                        "properties": {"name": "Test Point"}
                    }
                ]
            }

@pytest.mark.anyio
async def test_transform_geojson_to_shp(async_client: AsyncClient):
    config = {
        "input": {
            "format": "geojson",
            "data": input_data
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
    job_id = response.json()["job_id"]

    result = await run_output_test(job_id, async_client)
    assert result == "success"

@pytest.mark.anyio
async def test_transform_geojson_to_geojson(async_client: AsyncClient):
    config = {
        "input": {
            "format": "geojson",
            "data": input_data
        },
        "transformations": [
            {"type": "buffer", "params": {"distance": 50, "units": "meters"}}
        ],
        "output": {"format": "geojson", "to_file": True}
    }

    response = await async_client.post(
        "/transform",
        files={"config": (None, json.dumps(config), "application/json")}
    )

    assert response.status_code == 200
    job_id = response.json()["job_id"]

    result = await run_output_test(job_id, async_client)
    assert result == "success"
