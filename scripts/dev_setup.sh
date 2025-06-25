#!/usr/bin/env bash
set -e

# Copier .env.example -> .env si .env n'existe pas
cp .env.example .env 2>/dev/null || true

# Choix de l'environnement : localhost, dev, preprod, prod
ENVIRONMENT=${1:-localhost}

# Déterminer les fichiers à utiliser
COMPOSE_FILE="docker-compose.yml"
ENV_FILE=".env"

case "$ENVIRONMENT" in
  localhost)
    echo "Environnement : localhost"
    COMPOSE_OVERRIDE="docker-compose.local.yml"
    ENV_FILE=".env"
    export ENV=localhost
    ;;

  dev)
    echo "Environnement : dev.qualilead.options.net"
    COMPOSE_OVERRIDE="docker-compose.dev.yml"
    ENV_FILE=".env.dev"
    export ENV=dev
    ;;

  preprod)
    echo "Environnement : preprod.qualilead.options.net"
    COMPOSE_OVERRIDE="docker-compose.preprod.yml"
    ENV_FILE=".env.preprod"
    export ENV=preprod
    ;;

  prod)
    echo "Environnement : qualilead.options.net (PROD)"
    COMPOSE_OVERRIDE="docker-compose.prod.yml"
    ENV_FILE=".env.prod"
    export ENV=prod
    ;;

  *)
    echo "Environnement invalide: $ENVIRONMENT"
    echo "Usage: $0 [localhost|dev|preprod|prod]"
    exit 1
    ;;
esac

# Lancer Docker Compose avec les bons fichiers
docker-compose -f $COMPOSE_FILE -f $COMPOSE_OVERRIDE --env-file $ENV_FILE up -d --build
