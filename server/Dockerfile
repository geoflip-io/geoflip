FROM python:3.11-slim

WORKDIR /app

RUN apt-get update && apt-get install -y \
    build-essential \
    gcc \
    g++ \
    gdal-bin \
    libgdal-dev \
    libgeos-dev \
    libproj-dev \
    proj-bin \
    proj-data \
    libspatialindex-dev \
    && rm -rf /var/lib/apt/lists/*

ENV GDAL_CONFIG=/usr/bin/gdal-config
ENV CPLUS_INCLUDE_PATH=/usr/include/gdal
ENV C_INCLUDE_PATH=/usr/include/gdal
ENV PYTHONUNBUFFERED=1

COPY requirements.txt ./

RUN pip install --upgrade pip setuptools wheel
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD /bin/sh -c "\
  celery -A app.core.celery_worker.celery_app worker --concurrency=4 --loglevel=INFO & \
  gunicorn --workers=1 --threads=4 --timeout=200 \
    --worker-class=uvicorn.workers.UvicornWorker \
    --bind 0.0.0.0:8000 app.main:app"
