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
DATABASE_URL = os.getenv("DATABASE_URL")

if DATABASE_URL:
    DATABASES = {
        "default": dj_database_url.config(
            default=DATABASE_URL,
            conn_max_age=600,
            ssl_require=True
        )
    }
else:
    # Fallback SQLite
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.sqlite3',
            'NAME': BASE_DIR / 'db.sqlite3',
        }
    }

# -------------------------
# Static files - Configuration robuste
# -------------------------
STATIC_URL = '/static/'
STATIC_ROOT = BASE_DIR / "staticfiles"

# Répertoires de fichiers statiques
STATICFILES_DIRS = []

# Chercher les static files dans les apps
STATICFILES_FINDERS = [
    'django.contrib.staticfiles.finders.FileSystemFinder',
    'django.contrib.staticfiles.finders.AppDirectoriesFinder',
]

# Middleware - ajout de WhiteNoise
MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "whitenoise.middleware.WhiteNoiseMiddleware",
] + [m for m in MIDDLEWARE if m not in [
    "django.middleware.security.SecurityMiddleware",
    "whitenoise.middleware.WhiteNoiseMiddleware"
]]

# Configuration WhiteNoise
STATICFILES_STORAGE = "whitenoise.storage.CompressedStaticFilesStorage"
WHITENOISE_USE_FINDERS = True
WHITENOISE_AUTOREFRESH = True

# -------------------------
# CORS & CSRF
# -------------------------
CORS_ALLOW_ALL_ORIGINS = True
CSRF_TRUSTED_ORIGINS = []

# -------------------------
# Retirer les apps de dev
# -------------------------
for dev_app in ["django_extensions", "debug_toolbar"]:
    if dev_app in INSTALLED_APPS:
        INSTALLED_APPS.remove(dev_app)