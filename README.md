# Tasty Fingers

Premium Restaurant & Food Ordering Platform — Nigerian and continental meals with Django REST API and React frontend. Order jollof rice, soups, peppered meats, seafood, snacks, drinks, and combo meals for delivery, takeaway, or pickup.

## Tech Stack

- **Frontend:** React, Vite, TypeScript, TailwindCSS, Zustand, TanStack Query, Framer Motion
- **Backend:** Django, Django REST Framework, PostgreSQL
- **Payments:** Paystack, Flutterwave
- **Email:** Resend
- **Media:** Cloudinary (optional, falls back to local storage)
- **Deployment:** Railway (single project), Docker

## Quick Start (Development)

> **Git Bash (MINGW64)** — use forward slashes and `./venv/Scripts/python` (not PowerShell syntax).

### Backend (Terminal 1)

```bash
cd backend
python -m venv venv
./venv/Scripts/pip install -r requirements/dev.txt
./venv/Scripts/python manage.py makemigrations products orders payments notifications site_config
./venv/Scripts/python manage.py migrate
./venv/Scripts/python manage.py seed_data
./venv/Scripts/python manage.py runserver
```

### Frontend (Terminal 2)

```bash
cd frontend
npm install
npm run dev
```

### Production build (frontend)

```bash
cd frontend
npm run build
```

- Storefront: http://localhost:5173
- API: http://localhost:8000/api/v1/
- Django Admin: http://localhost:8000/admin/
- API Docs: http://localhost:8000/api/docs/

### Default Admin Credentials (after seed)

- Username: `admin`
- Password: `admin123!`

## Environment Variables

Copy `.env.example` to `.env` and configure:

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string |
| `SECRET_KEY` | Django secret key |
| `PAYSTACK_SECRET_KEY` | Paystack secret |
| `PAYSTACK_PUBLIC_KEY` | Paystack public |
| `FLUTTERWAVE_SECRET_KEY` | Flutterwave secret |
| `RESEND_API_KEY` | Resend email API key |
| `CLOUDINARY_*` | Cloudinary credentials (optional) |

## Commerce Settings

- **Delivery Fee:** ₦4,000 flat rate
- **VAT:** Not applicable
- **Checkout:** Guest only (no customer auth)

## Docker

```bash
docker-compose up --build
```

## Railway Deployment

See **[DEPLOYMENT.md](DEPLOYMENT.md)** for the complete step-by-step guide and full list of environment variables.

Quick summary:
1. Create Railway project from GitHub repo
2. Add **PostgreSQL** plugin and link `DATABASE_URL`
3. Set environment variables from `.env.example`
4. Set `RUN_SEED=true` on first deploy only
5. After deploy, update `SITE_URL`, `FRONTEND_URL`, `CORS_ALLOWED_ORIGINS`, `CSRF_TRUSTED_ORIGINS` with your live URL

Single service serves both API and React frontend on one domain.

**Production:** [Railway](https://tasty-fingers-01-production.up.railway.app/) · Future domains: [tastyfingers.com](https://tastyfingers.com) / [www.tastyfingers.com](https://www.tastyfingers.com)

## Project Structure

```
tasty-fingers-01/
├── backend/          # Django API
├── frontend/         # React SPA
├── scripts/          # Entrypoint scripts
├── Dockerfile        # Production build
├── docker-compose.yml
└── railway.toml
```
