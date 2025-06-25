#!/bin/sh
set -e

echo "📦 Appliquer les migrations..."
python manage.py makemigrations users
python manage.py migrate

echo "🧹 Collecte des fichiers statiques..."
python manage.py collectstatic --noinput

echo "👤 Création du superutilisateur..."
# Remplace ces valeurs ou rends-les dynamiques via les variables d'env
DJANGO_SUPERUSER_EMAIL=${DJANGO_SUPERUSER_EMAIL:-admin.web@options.net}
DJANGO_SUPERUSER_USERNAME=${DJANGO_SUPERUSER_USERNAME:-admin.web}
DJANGO_SUPERUSER_PASSWORD=${DJANGO_SUPERUSER_PASSWORD:-admin123}

python manage.py shell <<EOF
from django.contrib.auth import get_user_model
User = get_user_model()
if not User.objects.filter(username="$DJANGO_SUPERUSER_USERNAME").exists():
    User.objects.create_superuser(
        "$DJANGO_SUPERUSER_USERNAME",
        "$DJANGO_SUPERUSER_EMAIL",
        "$DJANGO_SUPERUSER_PASSWORD"
    )
EOF

echo "🚀 Démarrage du serveur Django..."
exec python manage.py runserver 0.0.0.0:8000