FROM python:3.12-slim

# Éviter les fichiers pyc + logs directs
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

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

# Définir l'entrypoint
ENTRYPOINT ["/entrypoint.sh"]

CMD [""]
