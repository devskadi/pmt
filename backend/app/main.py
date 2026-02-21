# FastAPI Application Factory
# --------------------------
# This module initializes the FastAPI app instance,
# registers domain routers, middleware, exception handlers,
# CORS configuration, and lifespan events.
#
# Router Registration (domain-modular):
#   from app.domains.auth.router import router as auth_router
#   from app.domains.users.router import router as users_router
#   from app.domains.projects.router import router as projects_router
#   from app.domains.sprints.router import router as sprints_router
#   from app.domains.tasks.router import router as tasks_router
#   from app.domains.scorecards.router import router as scorecards_router
#   from app.domains.analytics.router import router as analytics_router
#   from app.domains.ai.router import router as ai_router
#   from app.domains.notifications.router import router as notifications_router
#
# All routers are prefixed under /api/v1/{domain}.
# Health endpoint is registered directly (not domain-owned).
#
# Middleware Stack (order matters):
#   1. CORSMiddleware
#   2. RequestIDMiddleware (adds X-Request-ID)
#   3. LoggingMiddleware (structured request/response logs)
#   4. RateLimiterMiddleware
#
# Lifespan Events:
#   startup: initialize DB engine, register event handlers, warm caches
#   shutdown: dispose DB engine, flush logs
#
# Placeholder — implementation pending.
