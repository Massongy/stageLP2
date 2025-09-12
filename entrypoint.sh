#!/bin/sh
set -e

echo "Appliquer les migrations..."
python manage.py makemigrations users
python manage.py migrate

echo "Collecte des fichiers statiques..."
python manage.py collectstatic --noinput

echo "Création du superutilisateur..."
# Remplace ces valeurs ou rends-les dynamiques via les variables d'env
DJANGO_SUPERUSER_EMAIL=${DJANGO_SUPERUSER_EMAIL:-admin.web@options.net}
DJANGO_SUPERUSER_FIRSTNAME=${DJANGO_SUPERUSER_FIRSTNAME:-admin}
DJANGO_SUPERUSER_LASTNAME=${DJANGO_SUPERUSER_LASTNAME:-web}
DJANGO_SUPERUSER_PASSWORD=${DJANGO_SUPERUSER_PASSWORD:-admin123}

python manage.py shell <<EOF
from apps.users.models import User  # adapte selon ton app
if not User.objects.filter(email="$DJANGO_SUPERUSER_EMAIL").exists():
    User.objects.create_superuser(
        email="$DJANGO_SUPERUSER_EMAIL",
        password="$DJANGO_SUPERUSER_PASSWORD",
        first_name="$DJANGO_SUPERUSER_FIRSTNAME",
        last_name="$DJANGO_SUPERUSER_LASTNAME"
    )
EOF

echo "Démarrage du serveur Django ..."
exec python manage.py runserver 0.0.0.0:8000