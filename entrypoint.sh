#!/bin/sh
set -e

echo "=== DIAGNOSTIC COMPLET DÉBUT ==="
echo "🔍 Arguments reçus: $@"
echo "🔍 DJANGO_SETTINGS_MODULE: $DJANGO_SETTINGS_MODULE"
echo "🔍 Répertoire de travail: $(pwd)"
echo "🔍 Python version: $(python --version)"
echo "🔍 Pip packages installés:"
pip list | grep -E "(django|gunicorn|dj-database)"

echo "=== TEST DJANGO ==="
echo "🔍 Test manage.py check:"
python manage.py check

echo "🔍 Test d'import du WSGI:"
python -c "
try:
    from qualilead_backend.wsgi import application
    print('✅ WSGI import réussi')
    print(f'✅ Type application: {type(application)}')
except Exception as e:
    print(f'❌ ERREUR WSGI: {e}')
    import traceback
    traceback.print_exc()
"

echo "🔍 Test gunicorn disponible:"
which gunicorn || echo "❌ Gunicorn introuvable"
gunicorn --version || echo "❌ Gunicorn version indisponible"

echo "=== PRÉPARATION DJANGO ==="
echo "📦 Appliquer les migrations..."
python manage.py migrate --noinput

echo "🎨 Collecte des fichiers statiques..."
python manage.py collectstatic --noinput

echo "👤 Création du superutilisateur (si nécessaire)..."
DJANGO_SUPERUSER_EMAIL=${DJANGO_SUPERUSER_EMAIL:-admin.web@options.net}
DJANGO_SUPERUSER_FIRSTNAME=${DJANGO_SUPERUSER_FIRSTNAME:-admin}
DJANGO_SUPERUSER_LASTNAME=${DJANGO_SUPERUSER_LASTNAME:-web}
DJANGO_SUPERUSER_PASSWORD=${DJANGO_SUPERUSER_PASSWORD:-admin123}

python manage.py shell <<EOF
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
EOF

echo "✅ Préparation terminée"

echo "=== TEST GUNICORN ==="
echo "🔍 Test de syntaxe Gunicorn:"
gunicorn --check-config qualilead_backend.wsgi:application || echo "❌ Erreur config Gunicorn"

echo "🔍 Test bind sur 0.0.0.0:8000:"
python -c "
import socket
s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
try:
    s.bind(('0.0.0.0', 8000))
    print('✅ Port 8000 disponible')
    s.close()
except Exception as e:
    print(f'❌ Erreur port 8000: {e}')
"

echo "=== LANCEMENT GUNICORN ==="
echo "🚀 Commande exacte: $@"
echo "🚀 Lancement en cours..."

# Option 1: Utiliser les arguments du CMD
if [ $# -gt 0 ]; then
    echo "🚀 Utilisation des arguments CMD: $@"
    exec "$@"
else
    echo "🚀 Pas d'arguments, lancement direct de Gunicorn"
    exec gunicorn qualilead_backend.wsgi:application \
        --bind 0.0.0.0:8000 \
        --workers 1 \
        --timeout 120 \
        --log-level info \
        --access-logfile - \
        --error-logfile -
fi