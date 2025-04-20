import os
import time
import logging
from app.config import config as app_config
from werkzeug.utils import secure_filename
from fastapi import HTTPException, UploadFile

logger = logging.getLogger("api")

def wait_for_file(file_path:str, timeout:int=10, check_interval:float=0.5):
    """
    Waits for a file to be accessible within a given timeout period.

    :param file_path: Path to the file.
    :param timeout: Maximum time to wait for the file (in seconds).
    :param check_interval: Time interval between checks (in seconds).
    :raises FileNotFoundError: If the file is not accessible within the timeout period.
    """
    start_time = time.time()
    while time.time() - start_time < timeout:
        if os.path.exists(file_path) and os.path.getsize(file_path) > 0:
            return True
        time.sleep(check_interval)
    raise FileNotFoundError(f"File not accessible: {file_path}")

async def save_file(input_file: UploadFile, job_id: str) -> str:
    job_dir = os.path.join(app_config.DATA_PATH, job_id)
    os.makedirs(job_dir, exist_ok=True)

    input_dir = os.path.join(job_dir, "input")
    os.makedirs(input_dir, exist_ok=True)

    filename = secure_filename(input_file.filename)
    filePath = os.path.join(input_dir, filename)
    with open(filePath, "wb") as f:
        f.write(await input_file.read())

    # Check if the file is accessible
    try:
        wait_for_file(filePath)
    except FileNotFoundError as e:
        logger.error(f"File save failed or file not accessible: {e}")
        raise HTTPException(status_code=400, description="File save failed or not accessible.")

    return filePath 