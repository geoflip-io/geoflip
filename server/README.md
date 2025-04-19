# API-Boilerplate Project

## Description

This is a biolerplate project, it acts as a starting point for your backend and is based on python fast-api. It comes with user authentication with JWT tokens, logging and test infrastructure so you can get started right away making your application tables and and routes. Protect them using dependancy injection as shown in the get-user route.

## Dependancies

### Docker

You will need to setup a local postgres database instance for the application you can do this easily using the the included docker-compose but you will need to make sure you have docker desktop installed first.

    - https://docker.com

### Test Database

Before you run pytest, make sure you have a database already created in your docker postgresdb called `test-db` you can change the nasme of this in the `config.py` or even setup the docker-compose to spin that up for you automatically but you only need to do it once so I normally just use phadmin to do it manually.

## Getting set up

1. After cloneing the project, create a virtual environment with:
    - `python -m venv .venv`
2. next install all the dependancies with
    - `python -m pip install -r requirements.txt`
    - `python -m pip install -r requirements-dev.txt`
3. now setup setup your `.env` in the root of the project:
    ```
    ENV_STATE=global
    DB_NAME=api-db
    DB_HOST=localhost
    DB_PORT=5432 
    DB_SSL=prefer 
    DB_USER=postgres
    DB_PASSWORD=pa55word

    FRONTEND_URL=http://127.0.0.1:8080
    JWT_SECRET=1234abcd

    UPLOADS_PATH=uploads

    # Redis connection
    REDIS_HOST=localhost
    REDIS_PORT=6379
    REDIS_DB=0
    REDIS_PASSWORD=pa55word
    REDIS_SSL=False
    ```
3. make sure docker desktop is running then start the database via docker-compose:
    - `docker-compose up -d`
    - Note: this will also start up a docker version of the application, you can use this to test against as well. 
4. run celery in a separeate terminal first:
    - `celery -A app.celery_worker.celery_app worker --pool=solo --loglevel=INFO `

5. start the local dev environment with (note that the port is 8001 because docker will run on 8000)
    - `uvicorn app.main:app --reload --port 8001`


## How to build stuff

### Database Tables and Models

Create database tables in the database.py using SQL Alchemy. These tables will be created automatically when the application starts.

Models are used when handling data that is going to and from the users of the API. Create new models in the /api/models folder.

### Routes

### Protecting Routes

### Tests

## Deploying to Azure

There is a startup script already setup in this project called `startup.sh` you can use this as the startup command for an azure app service host environment. the .env example above also makes it easy for you to setup your environment variables the same way in the app service settings. Also make a FRONTEND_URL setting so your front end can get through CORS.

1. have this project running locally in both local dev and azure, make sure all  your tests pass then push this into your github repo.
2. Next, create an azure app service with webapp + database and link to this project via github - Azure will create the necessary pipeline file for github actions to use.
3. setup the app service config with:
    - environment variables (they should be the same as your .env but use the values of the database created with the app service app)
    - startup.sh script start up command in the settings
4. test the api works using the register user route

## ToDo

- Setup mechanism for file handling 
    - modular way to convert files or data (ie geojson) to a geodataframe for further processing
- Handle file output
    - once in GDF handle conversion back to desired output format into output folder
- Create route to retrieve output file
- Cleanup processes
    - clean up redis records and trigger clean up process on celery job expiry