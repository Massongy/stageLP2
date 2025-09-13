#!/bin/sh
set -e

echo "🚀 DÉMARRAGE QUALILEAD BACKEND"

# Appliquer les migrations
echo "📦 Appliquer les migrations..."
python manage.py migrate --noinput

# Collecter les fichiers statiques
echo "🎨 Collecte des fichiers statiques..."
python manage.py collectstatic --noinput || echo "⚠️ Collectstatic failed, continuing..."

# Créer le superutilisateur si nécessaire
echo "👤 Création du superutilisateur (si nécessaire)..."
DJANGO_SUPERUSER_EMAIL=${DJANGO_SUPERUSER_EMAIL:-admin.web@options.net}
DJANGO_SUPERUSER_FIRSTNAME=${DJANGO_SUPERUSER_FIRSTNAME:-admin}
DJANGO_SUPERUSER_LASTNAME=${DJANGO_SUPERUSER_LASTNAME:-web}
DJANGO_SUPERUSER_PASSWORD=${DJANGO_SUPERUSER_PASSWORD:-admin123}

python manage.py shell <<EOF || echo "⚠️ Superuser creation failed, continuing"
from apps.users.models import User
if not User.objects.filter(email="$DJANGO_SUPERUSER_EMAIL").exists():
    User.objects.create_superuser(
        email="$DJANGO_SUPERUSER_EMAIL",
        password="$DJANGO_SUPERUSER_PASSWORD",
        first_name="$DJANGO_SUPERUSER_FIRSTNAME",
        last_name="$DJANGO_SUPERUSER_LASTNAME"
    )
EOF

echo "✅ Préparation terminée, lancement de Gunicorn..."
exec "$@"
