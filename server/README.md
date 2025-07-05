# Geoflip 

## Description

Geoflip is a lightweight, developer-friendly geoprocessing API designed to perform spatial data transformations such as buffer, clip, union, and reprojection or data format conversions. It allows users to submit spatial data (e.g., GeoJSON, SHP, DXF, GPKG) along with transformation instructions, and receive the processed output in a chosen format and projection. Inspired by tools like FME and GDAL, Geoflip is built using FastAPI and is designed to be easily deployable in both local and cloud environments.

## Dependancies

### Docker

You will need to setup a local postgres database and redis instance for the application you can do this easily using the the included docker-compose but you will need to make sure you have docker desktop installed first.

    - https://docker.com

## Quick Start

1. First setup setup your `.env` in the root of the project:
    ```
    ENV_STATE=global

    COMPOSE_PROJECT_NAME=geoflip

    JWT_SECRET=1234abcd
    FRONTEND_URL=http://localhost:8080
    BACKEND_URL=http://localhost:8001
    DATA_PATH=data

    # database details 
    DB_NAME=api-db
    DB_HOST=localhost
    DB_PORT=5432 
    DB_SSL=prefer 
    DB_USER=postgres
    DB_PASSWORD=pa55word

    # Redis connection
    REDIS_HOST=localhost
    REDIS_PORT=6379
    REDIS_DB=0
    REDIS_PASSWORD=pa55word
    REDIS_SSL=False

    # Operational Adjustments
    JOB_EXPIRY_TIME = 30
    ```
3. make sure docker desktop is running then change directory to the `/deploy` folder:
    - `cd /deploy`
4. next,  run the below command to start up the geoflip docker containers
    - `docker-compose up --build -d`
    - Note: this will also start up a docker version of the application, see below to setup your local dev environment for easier development otherwise if you just want to run Geoflip then you can stop here and just use it.
5. Run geoflip in a local dev environment first by stopping the geoflip container in docker.
6. Next, change dir to the `/server` folder then start a celery worker in a terminal window with:
    - `celery -A app.core.celery_worker.celery_app worker --pool=solo --loglevel=INFO`
7. next, make sure you are in the `/server` dir then in another terminal window start the geoflip application with:
    - `uvicorn app.main:app --reload --port 8001`

## Running Tests

### Test Dependancies

Run a postgres and redis docker container locally (ie through the docker-compose in the deploy folder) before running pytest. The tests need to have database called "test-db" in the database to work properly so make sure you make that first.

### Running pytest with coverage report

1. first make sure you install the dev dependancies in `requirements-dev.txt`
    `python -m pip install -r requirements-dev.txt`
   Also make sure you are running your local celery instance (check step 6 of quick start above)
2. then run pytest with coverage
    `coverage run -m pytest`
3. now to view the report run
    `coverage report` or `coverage html`

## How to build stuff

### Adding reader formats

Follow the steps below to add new reader formats, reader formats is how geoflip reads input data.

1. update the `InputModel` and `SUPPORTED_INPUT_FORMATS` for your new format in the `models\transform.py`:
    - `\geoflip\server\app\api\v1\models\transform.py`
2. update `binary_input_types` and `string_input_types` with your new format in the `routers\transform.py`
3. finally, update the `reader.py` to support your new input format:
    - `\geoflip\server\app\api\v1\operations\geoprocessing\reader.py`
   create a new `[format]_to_gdf()` function here and update the `input_to_gdf` to use it

### Adding writer formats

1. update the `OutputModel` and `SUPPORTED_OUTPUT_FORMATS` for your new format in the `models\transform.py`:
    - `\geoflip\server\app\api\v1\models\transform.py` 
2. update the `writer.py` to support your new input format:
    - `\geoflip\server\app\api\v1\operations\geoprocessing\writer.py`
   create a new `gdf_to_[format]()` function here and update the `gdf_to_output` to use it.

### Adding transformations

### Adding operations

## ToDo

~~- Setup mechanism for file handling~~
~~- clean up __init__.py  and .env usage ~~
- ~~Handle file output~~
    - ~~once in GDF handle conversion back to desired output format into output folder~~
    - ~~cleanup output handling~~
- ~~Create route to retrieve output file~~
- ~~Cleanup processes~~
    - ~~clean up redis records and trigger clean up process on celery job expire~~
- ~~Add in transformations pipeline into the transform operation~~
- ~~Add string  format to_file option~~
- need to validate input and output epsg values sent from the user
    - should be in `\geoflip\server\app\api\v1\models\transform.py`
- Support addtional data formats
    - ~~DXF~~
    - KML
    - EsriJSON
    - Geopackage
- Additional Operations
    - append
    - merge
    - erase
    - clip
- Additional transformations
    - explode