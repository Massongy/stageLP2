#!/bin/bash

set -e

DATA_DIR="./db_data"
PG_VERSION="16-alpine"
POSTGRES_UID=999

echo "📦 PostgreSQL WAL repair tool"

# Étape 1 : Vérification du dossier
if [ ! -d "$DATA_DIR" ]; then
  echo "❌ Dossier $DATA_DIR introuvable."
  exit 1
fi

# Étape 2 : Arrêt du conteneur PostgreSQL
echo "🛑 Arrêt du conteneur PostgreSQL..."
docker stop qualilead-db-1 || true

# Étape 3 : Correction des permissions
echo "🔐 Correction des permissions..."
sudo chown -R ${POSTGRES_UID}:${POSTGRES_UID} "$DATA_DIR"

# Étape 4 : Application de pg_resetwal
echo "🧰 Exécution de pg_resetwal..."
docker run --rm \
  -v "$(pwd)/$DATA_DIR":/var/lib/postgresql/data \
  --user ${POSTGRES_UID}:${POSTGRES_UID} \
  postgres:${PG_VERSION} \
  pg_resetwal -f /var/lib/postgresql/data

# Étape 5 : Redémarrage PostgreSQL
echo "🚀 Redémarrage de PostgreSQL..."
docker start qualilead-db-1

echo "✅ Terminé. Vérifiez avec : docker logs -f db-1"
