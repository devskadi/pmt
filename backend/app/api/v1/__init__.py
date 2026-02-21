# API v1 Router Aggregator
# ------------------------
# Combines all domain routers under /api/v1 prefix.
# Domain routers live inside their respective domain packages.

from __future__ import annotations

from fastapi import APIRouter

# ---- Domain router imports ----
# Uncomment each as the domain is implemented.
# from app.domains.auth.router import router as auth_router
# from app.domains.users.router import router as users_router
from app.domains.projects.router import router as projects_router
# from app.domains.sprints.router import router as sprints_router
# from app.domains.tasks.router import router as tasks_router
# from app.domains.scorecards.router import router as scorecards_router
# from app.domains.analytics.router import router as analytics_router
# from app.domains.ai.router import router as ai_router
# from app.domains.notifications.router import router as notifications_router

api_router = APIRouter(prefix="/api/v1")

# ---- Register domain routers ----
# Order: auth → users → projects → sprints → tasks → scorecards → analytics → ai → notifications
# api_router.include_router(auth_router, prefix="/auth", tags=["Authentication"])
# api_router.include_router(users_router, prefix="/users", tags=["Users"])
api_router.include_router(projects_router, prefix="/projects", tags=["Projects"])
# api_router.include_router(sprints_router, prefix="/projects/{project_id}/sprints", tags=["Sprints"])
# api_router.include_router(tasks_router, prefix="/tasks", tags=["Tasks"])
# api_router.include_router(scorecards_router, prefix="/scorecards", tags=["Scorecards"])
# api_router.include_router(analytics_router, prefix="/analytics", tags=["Analytics"])
# api_router.include_router(ai_router, prefix="/ai", tags=["AI"])
# api_router.include_router(notifications_router, prefix="/notifications", tags=["Notifications"])
