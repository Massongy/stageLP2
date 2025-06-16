#!/usr/bin/env bash
set -e
cp .env.example .env 2>/dev/null || true
docker compose up -d --build
