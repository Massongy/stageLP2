FROM python:3.12-slim
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1
WORKDIR /app
COPY requirements/base.txt .
COPY entrypoint.sh /entrypoint.sh
RUN pip install --upgrade pip && pip install -r base.txt
COPY . .
RUN chmod +x /entrypoint.sh
CMD ["gunicorn", "qualilead_backend.wsgi:application", "--bind", "0.0.0.0:8000"]
