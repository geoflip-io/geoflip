# Geoflip Enterprise Server – Architecture & Integration Guide

This document outlines the architecture, API design, deployment model, and job structure for **Geoflip Enterprise Server**, a containerized geospatial processing platform inspired by FME Server. It supports user-defined transformations, asynchronous job processing, and output to various spatial data formats or destinations.

---

## 🔧 Architecture Overview

### Components
- **FastAPI backend** – Accepts job requests and file uploads
- **Celery worker** – Executes geospatial transformations asynchronously
- **Redis** – Used as the job queue broker
- **Local shared storage** – Used for file staging (e.g. `/data/jobs/<job_id>/`)

### Deployment Model
- All components (FastAPI + Celery) run in a **single container**
- Horizontal scaling achieved by running multiple containers
- All containers share the same local volume (`/data`) for job files

### No cloud storage required.
This approach avoids the need for S3/GCS setup and simplifies deployment in Docker Compose, App Service, or on-prem environments.

---

## 📦 Job Submission Overview

Jobs are submitted via a **single `/jobs/` endpoint**, using a `multipart/form-data` request.

### Form Fields:
| Field            | Type                 | Required | Notes |
|------------------|----------------------|----------|-------|
| `config`         | JSON (string field)  | ✅       | Job config including input, transformations, and output |
| `input_file`     | File upload          | ✅\*     | Required if `input.type` is `shp`, `dxf`, or similar |
| `clipping_file`  | File upload          | ✅\*     | Required only if using a `clip` transformation with `"source": "uploaded"` |

---

## 📄 Example Payloads

### ✅ GeoJSON (inline, no file upload)
```bash
POST /jobs/
Content-Type: multipart/form-data

Fields:
- config: {
    "input": {
      "type": "geojson",
      "data": { "type": "FeatureCollection", "features": [...] }
    },
    "transformations": [
      { "type": "buffer", "params": { "distance": 50 } }
    ],
    "output": {
      "type": "postgis",
      "host": "db.internal",
      "database": "gis",
      "schema": "public",
      "table": "buffered_data",
      "username": "gis_writer",
      "password": "secret"
    }
  }
```

---

### ✅ SHP Upload with Support Files
```bash
POST /jobs/

Fields:
- config: {
    "input": { "type": "shp" },
    "transformations": [
      { "type": "buffer", "params": { "distance": 25 } }
    ],
    "output": {
      "type": "shp",
      "output_crs": "EPSG:4326"
    }
  }

- input_file: parcels.zip (zipped shp, shx, dbf, prj)
```

---

### ✅ Clipping Transformation with File Upload
```bash
POST /jobs/

Fields:
- config: {
    "input": { "type": "shp" },
    "transformations": [
      {
        "type": "clip",
        "params": { "source": "uploaded" }
      }
    ],
    "output": {
      "type": "shp",
      "output_crs": "EPSG:4326"
    }
  }

- input_file: parcels.shp
- support_files[]: parcels.dbf, parcels.shx
- clipping_file: boundary.geojson
```

---

## ⚙️ Asynchronous Job Execution with Celery

- Jobs are stored with status: `pending`, `running`, `complete`, `failed`
- Celery runs in the same container as FastAPI (or optionally separate)
- All job files are stored under `/data/jobs/<job_id>/`
- Frontend polls job status via `GET /jobs/<job_id>`

---

## 🗃️ Storage Model

For now, the system uses **shared local storage** (`/data`) rather than cloud object storage. This simplifies deployment and avoids user setup.

- All containers must share the same volume
- You can scale horizontally if you mount the same volume into every container (e.g. Docker Compose, single-node K8s with hostPath or PVC)

---

## 🚀 Deployment Tips

### Docker Compose (simplified example)
```yaml
services:
  api:
    build: .
    command: ./entrypoint.sh
    volumes:
      - ./data:/data
    depends_on:
      - redis

  redis:
    image: redis

volumes:
  data:
```

### `entrypoint.sh`
```bash
#!/bin/bash
# Start FastAPI + Celery in same container

# Start API in background
uvicorn app.main:app --host 0.0.0.0 --port 8000 &

# Start Celery worker
celery -A app.worker worker --concurrency=2 --loglevel=info
```

---

## ✅ Summary

Geoflip Enterprise Server supports:
- Self-contained, file-based job requests
- Asynchronous execution with Celery
- Shared volume storage (no S3/GCS required)
- Simple deployment and scaling
- Extensible transformations and output formats

Cloud storage can be introduced later using a `StorageService` abstraction if needed, but is not required for deployment.
