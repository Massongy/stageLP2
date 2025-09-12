FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

WORKDIR /app

# Copier requirements prod
COPY requirements/prod.txt ./requirements.txt

# Installer les dépendances
RUN pip install --upgrade pip
RUN pip install --no-cache-dir -r requirements.txt

# Copier le code
COPY . .

# Collecter les fichiers statiques
RUN python manage.py collectstatic --noinput

# Donner les droits si entrypoint
RUN chmod +x /entrypoint.sh

# Lancer Gunicorn
CMD ["gunicorn", "qualilead_backend.wsgi:application", "--bind", "0.0.0.0:8000"]
