import os
import time

def wait_for_file(file_path, timeout=10, check_interval=0.5):
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