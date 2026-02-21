# ============================================
# PMT — Makefile (Developer Convenience)
# ============================================

.PHONY: help dev up down build migrate test lint

help: ## Show this help
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

# ---- Docker ----
up: ## Start all services (dev)
	docker compose up -d

down: ## Stop all services
	docker compose down

build: ## Build all containers
	docker compose build

logs: ## Tail all logs
	docker compose logs -f

# ---- Backend ----
backend-shell: ## Open backend shell
	docker compose exec backend bash

migrate: ## Run database migrations
	docker compose exec backend alembic upgrade head

migrate-gen: ## Auto-generate a migration
	@read -p "Migration message: " msg; \
	docker compose exec backend alembic revision --autogenerate -m "$$msg"

backend-test: ## Run backend tests
	docker compose exec backend pytest -v

backend-lint: ## Lint backend code
	docker compose exec backend ruff check .

# ---- Frontend ----
frontend-shell: ## Open frontend shell
	docker compose exec frontend sh

frontend-test: ## Run frontend tests
	docker compose exec frontend npm run test

frontend-lint: ## Lint frontend code
	docker compose exec frontend npm run lint

# ---- Full Stack ----
test: backend-test frontend-test ## Run all tests

lint: backend-lint frontend-lint ## Lint everything

seed: ## Seed database with sample data
	docker compose exec backend python -m app.utils.seed
