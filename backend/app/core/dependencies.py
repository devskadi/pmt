# FastAPI Dependencies
# --------------------
# Reusable Depends() callables for cross-cutting concerns.
# Domain-specific dependencies stay inside their own domain module.
#
# Session:
#   get_db() -> AsyncGenerator[AsyncSession, None]
#       Yields an async database session. Auto-commits on success,
#       rolls back on exception. Used by all repositories.
#
# Auth:
#   get_current_user(token: str = Depends(oauth2_scheme)) -> User
#       Decodes JWT, fetches user from DB, validates is_active.
#       Raises 401 if token invalid or user inactive.
#
#   get_current_active_user() -> User
#       Alias with explicit is_active check.
#
# RBAC:
#   require_role(*roles: Role) -> Callable
#       Returns a dependency that raises 403 if current user's role
#       is not in the allowed set. Usage:
#       @router.get("/", dependencies=[Depends(require_role(Role.ADMIN, Role.PM))])
#
#   require_project_role(*roles: ProjectRole) -> Callable
#       Returns a dependency that checks project-level membership role.
#       Requires project_id in path params.
#
# Pagination:
#   PaginationParams — page: int = 1, per_page: int = 20 (max 100)
#       Validates and normalizes pagination parameters.
#
# Placeholder — implementation pending.
