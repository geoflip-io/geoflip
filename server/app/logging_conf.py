import os
from logging.config import dictConfig

from app.config import DevConfig, config


def configure_logging() -> None:
    is_azure = os.getenv("WEBSITE_SITE_NAME") is not None  # Detect if running in Azure App Service
    log_dir = "/home/logs" if is_azure else "."  # Use /home/logs in Azure

    os.makedirs(log_dir, exist_ok=True)  # Ensure directory exists

    dictConfig(
        {
            "version": 1,
            "disable_existing_loggers": False,
            "filters": {
                "correlation_id": {
                    "()": "asgi_correlation_id.CorrelationIdFilter",
                    "uuid_length": 8 if isinstance(config, DevConfig) else 32,
                    "default_value": "-",
                }
            },
            "formatters": {
                "console": {
                    "class": "logging.Formatter",
                    "datefmt": "%Y-%m-%d %H:%M:%S",
                    "format": "(%(correlation_id)s) %(name)s:%(lineno)d - %(message)s",
                },
                "file": {
                    "class": "pythonjsonlogger.jsonlogger.JsonFormatter",
                    "datefmt": "%Y-%m-%d %H:%M:%S",
                    "format": "%(asctime)s.%(msecs)03d %(levelname)-8s %(correlation_id)s %(name)s%(lineno)d %(message)s",
                },
            },
            "handlers": {
                "default": {
                    "class": "rich.logging.RichHandler",
                    "level": "DEBUG",
                    "formatter": "console",
                    "filters": ["correlation_id"],
                },
                "rotating_file":{
                    "class": "logging.handlers.RotatingFileHandler",
                    "level": "DEBUG",
                    "formatter": "file",
                    "filename": f"{log_dir}/api.log",
                    "maxBytes": 1024 * 1024 * 3, # 3MB
                    "backupCount": 3,
                    "encoding": "utf-8",
                    "filters": ["correlation_id"],
                }
            },
            "loggers": {
                "api": {
                    "handlers": ["default", "rotating_file"],
                    "level": "DEBUG" if isinstance(config, DevConfig) else "INFO",
                    "propagate": False,
                },
                "uvicorn": {"handlers": ["default"], "level": "INFO"},
                "databases": {
                    "handlers": ["default"],
                    "level": "WARNING",
                },
                "aiosqlite": {
                    "handlers": ["default"],
                    "level": "WARNING",
                },
            },
        }
    )
