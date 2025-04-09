#!/bin/bash
gunicorn --workers 1 --threads 4 --timeout 200 --worker-class uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000 "api.main:app"
