
From the server folder:
    - setup python virtual environment
        - `python -m venv .venv`
    - install dependancies with
        - `python -m pip install -r requirements.txt`
    - start the database via docker using the docker-compose
        - `docker-compose up -d`
    - start the local dev environment with (note that the port is 8001 because docker will run on 8000)
        - `uvicorn app.main:app --reload --port 8001`