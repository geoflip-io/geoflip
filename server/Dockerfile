FROM python:3.12-slim

WORKDIR /app

COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Start both Celery worker and FastAPI app
CMD /bin/bash -c "\
  celery -A app.celery_worker.celery_app worker --concurrency=4 --loglevel=INFO & \
  gunicorn --workers=1 --threads=4 --timeout=200 \
    --worker-class=uvicorn.workers.UvicornWorker \
    --bind 0.0.0.0:8000 app.main:app"
