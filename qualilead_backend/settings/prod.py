from .base import *
import os
import dj_database_url

# -------------------------
# Debug
# -------------------------
DEBUG = os.getenv("DJANGO_DEBUG", "0") == "1"

# -------------------------
# Hosts
# -------------------------
ALLOWED_HOSTS = os.getenv("DJANGO_ALLOWED_HOSTS", "*").split(",")

# -------------------------
# Database
# -------------------------
DATABASES = {
    "default": dj_database_url.config(
        default=os.getenv("DATABASE_URL"),
        conn_max_age=600,
        ssl_require=True
    )
}

# -------------------------
# Static files (WhiteNoise)
# -------------------------
MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "whitenoise.middleware.WhiteNoiseMiddleware",
] + MIDDLEWARE  # WhiteNoise avant les autres middlewares

STATIC_ROOT = BASE_DIR / "staticfiles"
STATICFILES_STORAGE = "whitenoise.storage.CompressedManifestStaticFilesStorage"

# -------------------------
# CORS & CSRF (pour portfolio public)
# -------------------------
CORS_ALLOW_ALL_ORIGINS = True
CSRF_TRUSTED_ORIGINS = []

# -------------------------
# Retirer les apps de dev
# -------------------------
for dev_app in ["django_extensions", "debug_toolbar"]:
    if dev_app in INSTALLED_APPS:
        INSTALLED_APPS.remove(dev_app)
