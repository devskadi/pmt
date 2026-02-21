# Permissions & RBAC
# ------------------
# Central permission definitions and enforcement utilities.

from __future__ import annotations

from collections.abc import Callable
from typing import Any

from fastapi import Depends

from app.core.constants import Role
from app.core.exceptions import InsufficientPermissionError


def require_role(*allowed_roles: Role) -> Callable:
    """FastAPI dependency that enforces global role-based access.

    Usage:
        @router.get("/", dependencies=[Depends(require_role(Role.ADMIN, Role.PM))])
        async def admin_endpoint(): ...

    Or as a direct dependency:
        async def my_endpoint(user=Depends(require_role(Role.ADMIN))):
    """

    async def role_checker(current_user: Any = Depends(_get_current_user_stub)) -> Any:
        if current_user.role not in [r.value for r in allowed_roles]:
            raise InsufficientPermissionError(
                f"Required role: {', '.join(r.value for r in allowed_roles)}. "
                f"Your role: {current_user.role}"
            )
        return current_user

    return role_checker


def require_any_role(*allowed_roles: Role) -> Callable:
    """Alias for require_role — accepts any of the listed roles."""
    return require_role(*allowed_roles)


def _get_current_user_stub() -> None:
    """Placeholder — replaced by get_current_user in core/dependencies.py.

    This exists to avoid circular imports. The actual dependency
    is wired in the application factory (main.py).
    """
    raise NotImplementedError(
        "This stub should be overridden by the actual get_current_user dependency."
    )

