# 🧭 Geoflip

**Geoflip** is an **open-source FastAPI-based geospatial transformation engine**. Designed for self-hosting and containerized deployment, it supports basic spatial operations like `buffer` and `union` over **GeoJSON** and **Shapefile (SHP)** inputs. Reprojection is handled automatically in each request.

Geoflip is built with developers in mind — stateless, simple to deploy, and built for automation.

---

## ✅ Features

- 🗂 Input formats: **GeoJSON**, **Shapefile (SHP)**
- 🔧 Currently Supported transformations:
  - `buffer`
  - `union`
- 🌐 Reprojection via transformation endpoint, and specifiying desired output format and crs
- ⚙️ Asynchronous job processing with Celery + Redis
- 🐳 Dockerized services for local deployment

---

## 📁 Folder Structure

```
/
├── server/         # FastAPI backend and transformation logic
├── deploy/         # Docker Compose and container configs
├── tests/          # Unit and integration tests
├── .env-example    # Sample environment variable file
└── README.md
```

---

## 🚀 Quick Start (Docker Compose)

```bash
git clone https://github.com/geoflip-io/geoflip.git
cd geoflip/deploy

# Copy environment config
cp .env-example .env

# Start API, Redis, and Worker (from the deploy folder)
cd /deploy
docker compose up --build -d
```

Refer to /server.readme.md for additional local development details
---

## 🔁 Example Transform Requests

#### GeoJSON Input

```http
POST /transform
Content-Type: multipart/form-data
```

**Form fields:**
- `config`: JSON config (see below)
- `input_file`: a `.geojson` file containing valid geojson as content

```json
{
  "input": {
    "type": "geojson"
  },
  "transformations": [
    {
      "type": "buffer",
      "params": { "distance": 50, "units": "meters" }
    }
  ],
  "output": {
    "format": "shp", // shp, geojson, dxf is currently supported
    "epsg": 4326
  }
}
```

---

#### SHP Input

```http
POST /transform
Content-Type: multipart/form-data
```

**Form fields:**
- `config`: JSON config (see below)
- `input_file`: zipped SHP (must include `.shp`, `.shx`, `.dbf`, and `.prj`)

```json
{
  "input": {
    "type": "shp"
  },
  "transformations": [
    {
      "type": "buffer",
      "params": { "distance": 500, "units": "meters" }
    },
    {
      "type": "union"
    }
  ],
  "output": {
    "format": "shp", // shp, geojson, dxf is currently supported
    "epsg": 4326
  }
}
```

---

## ⏳ Async Job Flow

All transform jobs in Geoflip are asynchronous. You submit a job, then poll for its status and fetch the result when it's ready.

### 1. Submit Transform Request
- `POST /transform`
- Returns: `{ "job_id": "<uuid>" }`

### 2. Check Job Status
```http
GET /result/status/{job_id}
```
Example response:
```json
{
  "status": "complete",
  "output_url": "/result/output/abc123"
}
```

### 3. Download Output
```http
GET /result/output/{job_id}
```
This returns the data either directly (ie GeoJSON) or the transformed file (ie zipped SHP).

---

## 🔭 Roadmap

Planned features and improvements:

- 📁 Additional formats: KML, GeoPackage, EsriJSON
- ✂️ More operations and transformations: clip, erase, simplify, append, explode
- ☁️ tests

---

## 📄 License

This project is licensed under the **Apache 2.0 License**.  
See [`LICENSE`](./LICENSE) for full details.
