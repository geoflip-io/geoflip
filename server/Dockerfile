FROM python:3.12-slim

# Set working directory
WORKDIR /app

# Copy the requirements.txt file
COPY requirements.txt .

# Install Python dependencies (including Fiona)
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application code
COPY . .

# Start the application
CMD /bin/bash -c "gunicorn --workers 1 --threads 4 --timeout 200 --worker-class uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000 'app.main:app'"
