#!/bin/sh
set -e

export DJANGO_SETTINGS_MODULE="${DJANGO_SETTINGS_MODULE:-config.settings.production}"

echo "=== Tasty Fingers Deploy ==="
python -c "
import os
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings.production')
import django
django.setup()
from django.conf import settings
if getattr(settings, 'USE_CLOUDINARY', False):
    print('Media storage: Cloudinary (%s)' % settings.CLOUDINARY_CLOUD_NAME)
else:
    print('WARNING: Cloudinary not configured — using local media storage')
"

echo "Running migrations..."
python manage.py migrate --noinput

echo "Syncing admin user from environment variables..."
python manage.py sync_admin_user

echo "Removing legacy seed categories (if any)..."
python manage.py cleanup_legacy_categories

echo "Collecting static files..."
rm -rf staticfiles/*
DJANGO_SETTINGS_MODULE=config.settings.collectstatic \
  python manage.py collectstatic --noinput --verbosity 0

echo "Ensuring media upload directory exists..."
mkdir -p media/products media/categories media/site_assets media/testimonials media/why_choose media/about

echo "Preparing frontend template..."
mkdir -p templates
if [ -f static/frontend/index.html ]; then
  cp static/frontend/index.html templates/index.html
  echo "Frontend ready."
else
  echo "WARNING: static/frontend/index.html not found"
fi

if [ "${RUN_SEED:-false}" = "true" ]; then
  echo "Running seed data..."
  python manage.py seed_data
fi

PORT="${PORT:-8000}"
echo "Starting server on port ${PORT}..."
exec gunicorn config.wsgi:application \
  --bind "0.0.0.0:${PORT}" \
  --workers "${WEB_CONCURRENCY:-3}" \
  --timeout 120 \
  --access-logfile - \
  --error-logfile -
