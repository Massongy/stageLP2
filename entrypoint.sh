#!/bin/sh
set -e

echo "🚀 DÉMARRAGE DIRECT"

# Migrations rapides
python manage.py migrate --noinput

# Skip collectstatic si problématique
echo "⚠️  Skipping collectstatic pour test"

echo "🚀 Lancement Gunicorn..."
exec gunicorn qualilead_backend.wsgi:application \
    --bind 0.0.0.0:8000 \
    --workers 1 \
    --log-level debug