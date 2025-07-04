from httpx import AsyncClient
import time
import asyncio

async def run_output_test(
		job_id: str, 
		async_client: AsyncClient, 
		timeout: float = 15.0,
    	interval: float = 0.1,
	):

	deadline = time.monotonic() + timeout

	while True:
		response = await async_client.get(f"/result/status/{job_id}")
		assert response.status_code == 200
		status_json = response.json()

		state = status_json["status"]
		if state == "SUCCESS":
			break
		elif state == "FAILURE":
			raise AssertionError(f"Job {job_id} failed: {status_json}")

		if time.monotonic() > deadline:
			raise TimeoutError(f"Job {job_id} did not finish within {timeout}s")
	
		await asyncio.sleep(interval)

	# Poll until SUCCESS and download output
	output_response = await async_client.get(f"/result/output/{job_id}")
	assert output_response.status_code == 200
	assert output_response.headers["content-type"] in {
        "application/octet-stream",
        "application/json",
    }

	return "success"