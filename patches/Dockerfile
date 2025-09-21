# Simple Dockerfile for a Python Flask app
FROM python:3.11-slim
WORKDIR /app
COPY . /app
RUN pip install --upgrade pip
RUN if [ -f requirements.txt ]; then pip install -r requirements.txt; fi
ENV FLASK_APP=app.py
ENV DATABASE_URL=${DATABASE_URL}
CMD ["gunicorn", "--bind", "0.0.0.0:${PORT:-5000}", "app:app"]
