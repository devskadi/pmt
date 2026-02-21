# 🚀 PMT — Project Management Tool

> A production-grade, AI-ready project management platform for agile teams.

[![License](https://img.shields.io/badge/license-MIT-blue.svg)]()
[![Python](https://img.shields.io/badge/python-3.12+-blue.svg)]()
[![Next.js](https://img.shields.io/badge/Next.js-15-black.svg)]()
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue.svg)]()

---

## 📋 Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Development](#development)
- [API Documentation](#api-documentation)
- [Testing](#testing)
- [Deployment](#deployment)
- [Contributing](#contributing)

---

## Overview

PMT is a scalable project management tool built for modern development teams. It supports:

- **User Authentication** — JWT-based with role-based access control
- **Role-Based Access** — Admin, Project Manager, Developer
- **Projects & Sprints** — Full agile lifecycle management
- **Task Management** — Kanban boards, filters, assignments
- **Scorecards** — Configurable weighted evaluation system
- **Analytics Dashboard** — Burndown charts, velocity, team performance
- **AI-Ready** — Pluggable AI module for future intelligent insights

---

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                      Frontend (Next.js)                 │
│   App Router · React Query · Zustand · Tailwind CSS     │
└──────────────────────┬──────────────────────────────────┘
                       │ REST API (HTTPS)
┌──────────────────────▼──────────────────────────────────┐
│                    Backend (FastAPI)                     │
│   Routers → Services → Repositories → SQLAlchemy ORM    │
│                                                         │
│   ┌──────────┐  ┌────────────┐  ┌───────────────────┐  │
│   │   Core   │  │ Middleware  │  │    AI Module      │  │
│   │ Security │  │  Logging   │  │  (Future LLM)     │  │
│   │  Config  │  │ Rate Limit │  │  Insights Engine  │  │
│   └──────────┘  └────────────┘  └───────────────────┘  │
└──────────────────────┬──────────────────────────────────┘
                       │
          ┌────────────┴────────────┐
          │                         │
   ┌──────▼──────┐         ┌───────▼──────┐
   │  PostgreSQL  │         │    Redis     │
   │   (Primary)  │         │  (Cache/Q)   │
   └─────────────┘         └──────────────┘
```

**Design Principles:**
- **Clean Architecture** — Strict separation: Routers → Services → Repositories
- **Feature-Based Frontend** — Self-contained feature modules
- **Dependency Inversion** — Services depend on abstractions, not implementations
- **API Versioning** — `/api/v1/` prefix for backward compatibility
- **Modular AI** — Isolated AI module designed for plug-and-play LLM integration

---

## Tech Stack

| Layer      | Technology                                    |
| ---------- | --------------------------------------------- |
| Frontend   | Next.js 15, React 19, TypeScript, Tailwind CSS |
| State      | Zustand (client), React Query (server)        |
| Backend    | Python 3.12+, FastAPI, Pydantic v2            |
| Database   | PostgreSQL 16, SQLAlchemy 2.0 (async)         |
| Migrations | Alembic                                       |
| Auth       | JWT (access + refresh tokens), bcrypt         |
| Validation | Zod (frontend), Pydantic (backend)            |
| Testing    | Pytest, Vitest, Testing Library               |
| DevOps     | Docker, Docker Compose, Make                  |
| Linting    | Ruff (Python), ESLint + Prettier (TypeScript) |

---

## Getting Started

### Prerequisites

- Docker & Docker Compose
- Node.js 20+ (for local frontend dev)
- Python 3.12+ (for local backend dev)
- Make (optional, for convenience commands)

### Quick Start (Docker)

```bash
# 1. Clone the repository
git clone https://github.com/devskadi/pmt.git
cd pmt

# 2. Set up environment files
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env.local

# 3. Start all services
make up
# or: docker compose up -d

# 4. Run database migrations
make migrate

# 5. Access the application
# Frontend:  http://localhost:3000
# API Docs:  http://localhost:8000/docs
# Swagger:   http://localhost:8000/redoc
```

### Local Development (Without Docker)

```bash
# Backend
cd backend
python -m venv .venv && source .venv/bin/activate
pip install -r requirements/dev.txt
uvicorn app.main:app --reload

# Frontend (separate terminal)
cd frontend
npm install
npm run dev
```

---

## Project Structure

```
pmt/
├── backend/                    # Python FastAPI Backend
│   ├── app/
│   │   ├── main.py             # FastAPI app factory & startup
│   │   ├── core/               # Config, security, dependencies, constants
│   │   ├── db/                 # Database engine, session, base model
│   │   ├── models/             # SQLAlchemy ORM models (domain entities)
│   │   ├── schemas/            # Pydantic v2 request/response schemas
│   │   ├── api/v1/             # Versioned API route handlers
│   │   ├── services/           # Business logic layer
│   │   ├── repositories/       # Data access layer (query abstraction)
│   │   ├── middleware/         # ASGI middleware (logging, rate limiting)
│   │   ├── utils/              # Shared utilities (email, datetime, slugs)
│   │   └── ai/                 # AI integration module (future LLM layer)
│   ├── alembic/                # Database migration scripts
│   ├── tests/                  # Pytest test suite (unit + integration)
│   ├── requirements/           # Pip requirements (base, dev, prod)
│   ├── Dockerfile              # Multi-stage production build
│   └── pyproject.toml          # Python project config & tool settings
│
├── frontend/                   # Next.js Frontend
│   ├── src/
│   │   ├── app/                # Next.js App Router (pages & layouts)
│   │   │   ├── (auth)/         # Auth route group (login, register)
│   │   │   └── (dashboard)/    # Protected route group (all app pages)
│   │   ├── components/         # Reusable UI components
│   │   │   ├── ui/             # Atomic primitives (Button, Input, Modal)
│   │   │   ├── layout/         # Structural (Sidebar, Topbar, Breadcrumbs)
│   │   │   └── shared/         # Composite shared components
│   │   ├── features/           # Feature modules (self-contained)
│   │   │   ├── auth/           # Auth: components, hooks, schemas
│   │   │   ├── projects/       # Projects: components, hooks, schemas
│   │   │   ├── tasks/          # Tasks: components, hooks, schemas
│   │   │   ├── sprints/        # Sprints: components, hooks, schemas
│   │   │   ├── scorecards/     # Scorecards: components, hooks, schemas
│   │   │   └── analytics/      # Analytics: components, hooks, schemas
│   │   ├── lib/                # Core utilities (API client, constants)
│   │   ├── hooks/              # Global reusable React hooks
│   │   ├── types/              # Global TypeScript type definitions
│   │   ├── services/           # API service modules (per domain)
│   │   └── store/              # Zustand state stores
│   ├── public/                 # Static assets
│   ├── __tests__/              # Frontend test suite
│   ├── Dockerfile              # Multi-stage production build
│   └── package.json            # Node.js dependencies & scripts
│
├── docker-compose.yml          # Local development orchestration
├── docker-compose.prod.yml     # Production overrides
├── Makefile                    # Developer convenience commands
├── .gitignore                  # Git ignore rules
├── .editorconfig               # Editor consistency settings
└── README.md                   # This file
```

---

## Development

### Useful Commands

```bash
make help              # Show all available commands
make up                # Start services
make down              # Stop services
make logs              # Tail all logs
make migrate           # Run DB migrations
make migrate-gen       # Generate new migration
make test              # Run all tests
make lint              # Lint everything
```

### Naming Conventions

| Context                | Convention               | Example                     |
| ---------------------- | ----------------------- | --------------------------- |
| Python files           | `snake_case`            | `task_service.py`           |
| Python classes         | `PascalCase`            | `TaskService`               |
| Python functions       | `snake_case`            | `get_task_by_id()`          |
| TypeScript files       | `kebab-case`            | `task-card.tsx`             |
| React components       | `PascalCase`            | `TaskCard`                  |
| React hooks            | `camelCase` with `use`  | `useTasks()`                |
| API routes             | `kebab-case` plural     | `/api/v1/tasks`             |
| DB tables              | `snake_case` plural     | `tasks`, `activity_logs`    |
| DB columns             | `snake_case`            | `created_at`, `assignee_id` |
| Env variables          | `SCREAMING_SNAKE_CASE`  | `DATABASE_URL`              |
| Zustand stores         | `kebab-case` + `-store` | `auth-store.ts`             |
| Feature folders        | `kebab-case`            | `scorecards/`               |

---

## API Documentation

Once the backend is running:

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc
- **OpenAPI JSON**: http://localhost:8000/openapi.json

### API Versioning

All endpoints are versioned under `/api/v1/`. When breaking changes are needed, a new version (`/api/v2/`) will be introduced while maintaining backward compatibility.

---

## Testing

```bash
# Backend (pytest)
make backend-test

# Frontend (vitest)
make frontend-test

# All tests
make test
```

### Test Organization

- `backend/tests/unit/` — Service and utility unit tests
- `backend/tests/integration/` — API endpoint integration tests
- `frontend/__tests__/` — Component and hook tests

---

## Deployment

### Production Docker

```bash
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build
```

### Environment Checklist

- [ ] Set strong `SECRET_KEY` in backend `.env`
- [ ] Configure `DATABASE_URL` for production database
- [ ] Set `ALLOWED_ORIGINS` to production frontend URL
- [ ] Enable HTTPS via reverse proxy (nginx/Caddy)
- [ ] Configure Sentry DSN for error monitoring
- [ ] Set up database backups

---

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'feat: add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Commit Convention

Follow [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` — New feature
- `fix:` — Bug fix
- `docs:` — Documentation
- `refactor:` — Code refactoring
- `test:` — Tests
- `chore:` — Build/config changes

---

## License

This project is licensed under the MIT License.

---

<p align="center">Built with ❤️ by the PMT Team</p>
