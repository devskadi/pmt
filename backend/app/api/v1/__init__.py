# API v1 Router Aggregator
# ------------------------
# Combines all domain routers under /api/v1 prefix.
#
# Pattern:
#   from app.domains.auth.router import router as auth_router
#   from app.domains.users.router import router as users_router
#   ... etc.
#
#   api_router = APIRouter(prefix="/api/v1")
#   api_router.include_router(auth_router, prefix="/auth", tags=["auth"])
#   api_router.include_router(users_router, prefix="/users", tags=["users"])
#   api_router.include_router(projects_router, prefix="/projects", tags=["projects"])
#   api_router.include_router(sprints_router, prefix="/projects/{project_id}/sprints", tags=["sprints"])
#   api_router.include_router(tasks_router, prefix="/tasks", tags=["tasks"])
#   api_router.include_router(scorecards_router, prefix="/scorecards", tags=["scorecards"])
#   api_router.include_router(analytics_router, prefix="/analytics", tags=["analytics"])
#   api_router.include_router(ai_router, prefix="/ai", tags=["ai"])
#   api_router.include_router(notifications_router, prefix="/notifications", tags=["notifications"])
#
# The old per-router files in api/v1/ are deprecated.
# Domain routers now live inside their respective domain packages.
#
# Placeholder — implementation pending.
