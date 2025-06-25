# 🚀 Qualilead – Docker Environments

This project uses **Docker Compose** to manage four distinct environments:

- `localhost`
- `dev` → `dev.qualilead.options.net`
- `preprod` → `preprod.qualilead.options.net`
- `prod` → `qualilead.options.net`

---

## 📁 Project Structure

```
.
├── docker-compose.yml
├── docker-compose.local.yml          # localhost overrides
├── docker-compose.dev.yml
├── docker-compose.preprod.yml
├── docker-compose.prod.yml
├── .env.example
├── .env                              # for localhost
├── .env.dev
├── .env.preprod
├── .env.prod
├── backend/
│   └── entrypoint.sh                 # Django startup script
├── compose/
│   ├── dev/nginx/default.conf
│   ├── preprod/nginx/default.conf
│   └── prod/nginx/default.conf
└── scripts/
    ├── dev_setup.ps1 # Launcher script for Windows
    └── dev_setup.sh  # Launcher script for linux / mac
                
```

---

## 🔧 Starting an Environment

Use the `dev_setup.sh` script to launch any target environment:

```bash
sh /scripts/dev_setup.sh [localhost|dev|preprod|prod]
```

Examples Linux/Mac:

```bash
sh /scripts/dev_setup.sh           # → localhost
sh /scripts/dev_setup.sh dev       # → dev.qualilead.options.net
sh /scripts/dev_setup.sh preprod   # → preprod.qualilead.options.net
sh /scripts/dev_setup.sh prod      # → qualilead.options.net
```
Examples Windows:

```bash
.\scripts\dev_setup.ps1           # → localhost
---

## 🧩 Django Backend Behavior

The Django backend will automatically:

- apply database migrations,
- collect static files,
- create a superuser (only if it does not already exist),
- and start the development server.

### 👤 Superuser Configuration

Ensure the following variables exist in the corresponding `.env` file:

```env
DJANGO_SUPERUSER_USERNAME=admin.web
DJANGO_SUPERUSER_EMAIL=admin.web@options.net
DJANGO_SUPERUSER_PASSWORD=***********
```

> The superuser is created only if it doesn’t exist yet.

---

## 🔐 Nginx & Certbot

Each environment has its own Nginx config:

- DNS must resolve each domain to your server's IP.
- SSL certificates are auto-generated using Certbot.
- Auto-renewal runs via `crond`.

---

## 🛠️ Common Docker Commands

### Stop all containers:

```bash
docker-compose down
```

### View logs:

```bash
docker-compose logs -f
```

---
