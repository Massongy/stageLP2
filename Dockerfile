FROM python:3.12-slim

# Éviter les fichiers pyc + activer logs directs
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Répertoire de travail
WORKDIR /app

# Copier tous les fichiers requirements
COPY requirements/ ./requirements/

# Installer les dépendances
RUN pip install --upgrade pip
RUN pip install --no-cache-dir -r requirements/prod.txt

# Copier entrypoint.sh et le rendre exécutable
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# Copier le reste du projet
COPY . .

# IMPORTANT: Définir le module de settings pour la production
ENV DJANGO_SETTINGS_MODULE=qualilead_backend.settings.prod

# Définir l'entrypoint
ENTRYPOINT ["/entrypoint.sh"]

# Définir la commande finale (Gunicorn sur le port 8000)
CMD ["gunicorn", "qualilead_backend.wsgi:application", "--bind", "0.0.0.0:8000"]