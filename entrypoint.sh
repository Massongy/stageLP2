#!/bin/sh
set -e

echo "🚀 DÉMARRAGE QUALILEAD BACKEND"

echo "📦 Appliquer les migrations..."
python manage.py migrate --noinput

echo "🎨 Collecte des fichiers statiques..."
# Créer le répertoire staticfiles
mkdir -p /app/staticfiles

# Collectstatic avec gestion d'erreurs améliorée
python manage.py collectstatic --noinput --clear --verbosity 2 || {
    echo "⚠️  Erreur collectstatic, création d'un répertoire vide"
    mkdir -p /app/staticfiles/admin
    echo "Fichiers statiques: répertoire créé manuellement"
}

echo "👤 Création du superutilisateur (si nécessaire)..."
DJANGO_SUPERUSER_EMAIL=${DJANGO_SUPERUSER_EMAIL:-admin.web@options.net}
DJANGO_SUPERUSER_FIRSTNAME=${DJANGO_SUPERUSER_FIRSTNAME:-admin}
DJANGO_SUPERUSER_LASTNAME=${DJANGO_SUPERUSER_LASTNAME:-web}
DJANGO_SUPERUSER_PASSWORD=${DJANGO_SUPERUSER_PASSWORD:-admin123}

python manage.py shell <<EOF || echo "⚠️ Erreur création superuser, mais on continue"
try:
    from apps.users.models import User
    if not User.objects.filter(email="$DJANGO_SUPERUSER_EMAIL").exists():
        User.objects.create_superuser(
            email="$DJANGO_SUPERUSER_EMAIL",
            password="$DJANGO_SUPERUSER_PASSWORD",
            first_name="$DJANGO_SUPERUSER_FIRSTNAME",
            last_name="$DJANGO_SUPERUSER_LASTNAME"
        )
        print("✅ Superutilisateur créé")
    else:
        print("✅ Superutilisateur existe déjà")
except Exception as e:
    print(f"⚠️  Erreur superuser: {e}")
EOF

echo "✅ Préparation terminée"
echo "🚀 Lancement de Gunicorn sur 0.0.0.0:8000"

# Lancement avec configuration optimisée pour production
exec gunicorn qualilead_backend.wsgi:application \
    --bind 0.0.0.0:8000 \
    --workers 2 \
    --worker-class sync \
    --timeout 120 \
    --keep-alive 2 \
    --max-requests 1000 \
    --max-requests-jitter 50 \
    --log-level info \
    --access-logfile - \
    --error-logfile -