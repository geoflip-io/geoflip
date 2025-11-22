import logging
import datetime
from app.core.database import database, usage_logs_table

logger = logging.getLogger("api")


async def log_usage(
    tenant_id: int,
    user_id: int | None,
    job_id: str | None,
    endpoint: str,
    success: bool,
    client_ip: str | None = None,
    payload_size_bytes: int | None = None,
    response_time_seconds: float | None = None,
    processing_time_seconds: float | None = None,
):
    try:
        await database.execute(
            usage_logs_table.insert().values(
                tenant_id=tenant_id,
                user_id=user_id,
                job_id=job_id,
                endpoint=endpoint,
                request_time=datetime.datetime.now(),
                success=success,
                client_ip=client_ip,
                payload_size_bytes=payload_size_bytes,
                response_time_seconds=response_time_seconds,
                processing_time_seconds=processing_time_seconds,
            )
        )
        logger.info(
            f"Logged usage: user_id={user_id}, tenant_id={tenant_id}, job_id={job_id}, "
            f"endpoint={endpoint}, success={success}, elapsed={response_time_seconds}s"
        )
    except Exception as e:
        logger.error(f"Failed to log usage: {e}", exc_info=True)
