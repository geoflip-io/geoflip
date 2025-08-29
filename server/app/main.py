import logging
from contextlib import asynccontextmanager

from asgi_correlation_id import CorrelationIdMiddleware
from fastapi import FastAPI, HTTPException
from fastapi.exception_handlers import http_exception_handler
from fastapi.middleware.cors import CORSMiddleware  # Import CORS middleware

from app.core.database import database
from app.accounts.routers.users import router as user_router
from app.api.v1.routers.transform import router as transform_router
from app.api.v1.routers.result import router as result_router
from app.core.config import config
from app.core.logging_conf import configure_logging
from app.core.init import bootstrap_open_mode_defaults

from app.core.celery_worker import celery_app

logger = logging.getLogger(__name__)


# CORS settings
origins = [
    config.FRONTEND_URL,
    "https://www.geoflip.io"
]

@asynccontextmanager
async def lifespan(app: FastAPI):
    configure_logging()
    logger.info("Starting api")
    await database.connect()

    if config.IS_PUBLIC_INSTANCE:
        await bootstrap_open_mode_defaults()

    yield
    await database.disconnect()

app = FastAPI(
    title="Geoflip API",
    version="1.0.0",
    description="""
Geoflip is a **FastAPI-based geospatial transformation engine** that makes working with spatial data **simple, scalable, and automation-friendly**.

- 📥 **Input formats**: GeoJSON, Shapefile (SHP), DXF  
- 📤 **Output formats**: GeoJSON (file or inline), Shapefile (zipped), DXF (R2018)  
- 🔧 **Transformations**: buffer, union (with more coming soon)  
- 🌐 **Reprojection**: automatic reprojection into any EPSG code via `output.epsg`  
- ⏳ **Asynchronous jobs**: submit, poll status, download results  
- 🐳 **Deployment**: free public API at [api.geoflip.io](https://api.geoflip.io) or private enterprise hosting with Docker  

📖 [Read the full Geoflip API Documentation](https://docs.geoflip.io)
    """,
    contact={
        "name": "Geoflip Support",
        "email": "support@geoflip.io",
    },
    license_info={
        "name": "Business Source License (BSL)",
        "url": "https://mariadb.com/bsl11/",
    },
    lifespan=lifespan
)

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # Allow specific frontend origins
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods (GET, POST, PUT, DELETE, etc.)
    allow_headers=["*"],  # Allow all headers
)

app.add_middleware(CorrelationIdMiddleware)

# Include routers
app.include_router(user_router)
app.include_router(transform_router)
app.include_router(result_router)

@app.exception_handler(HTTPException)
async def http_exception_handler_logging(request, exc):
    logger.error(f"HTTPException: {exc.status_code} - {exc.detail}")
    return await http_exception_handler(request, exc)