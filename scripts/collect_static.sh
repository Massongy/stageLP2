#!/bin/bash

echo "🧹 Collecting static files for Django..."

docker compose exec backend python manage.py collectstatic --noinput

echo "✅ Static files collected to /app/staticfiles"
