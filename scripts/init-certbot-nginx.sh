#!/bin/bash

set -e

DOMAIN="qualilead.options.net"
EMAIL="admin.web@options.net"
CERT_DIR="./certbot/conf/live/$DOMAIN"
WEBROOT="./certbot/www"

echo "📦 Initialisation TLS pour $DOMAIN"

# 1. Créer des certificats auto-signés si non présents
if [ ! -f "$CERT_DIR/fullchain.pem" ]; then
  echo "🔐 Création d'un certificat auto-signé temporaire..."
  mkdir -p "$CERT_DIR"
  openssl req -x509 -nodes -newkey rsa:2048 \
    -days 1 \
    -keyout "$CERT_DIR/privkey.pem" \
    -out "$CERT_DIR/fullchain.pem" \
    -subj "/CN=localhost"
else
  echo "✅ Certificat déjà présent (même temporaire), on continue..."
fi

# 2. Démarrer/recharger nginx avec ce certificat temporaire
echo "🚀 Redémarrage de nginx avec le certificat temporaire..."
docker compose up -d nginx

# 3. Lancer Certbot en mode webroot
echo "📡 Lancement de Certbot avec webroot..."
docker run --rm \
  -v "$(pwd)/certbot/www:/var/www/certbot" \
  -v "$(pwd)/certbot/conf:/etc/letsencrypt" \
  certbot/certbot certonly \
  --webroot -w /var/www/certbot \
  -d $DOMAIN  -d www.greathire.com -d greathire.com\
  --email $EMAIL \
  --agree-tos --no-eff-email

# 4. Vérifier si les certificats ont été générés
if [ -f "$CERT_DIR/fullchain.pem" ] && [ -f "$CERT_DIR/privkey.pem" ]; then
  echo "✅ Certificat SSL Let’s Encrypt obtenu avec succès !"
  echo "♻️ Redémarrage de nginx avec les certificats valides..."
  docker compose restart nginx
else
  echo "❌ Certificat Let’s Encrypt non généré, nginx reste sur auto-signé."
fi
