# FastAPI Dependencies
# --------------------
# Reusable Depends() callables for cross-cutting concerns.

from __future__ import annotations

from typing import Annotated

from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.constants import Role
from app.core.exceptions import AuthenticationError, InsufficientPermissionError
from app.core.schemas import PaginationParams
from app.core.security import decode_access_token, oauth2_scheme
from app.db.session import get_db

# ---- Database Session Dependency ----

DBSession = Annotated[AsyncSession, Depends(get_db)]


# ---- Auth Dependencies ----


class CurrentUser:
    """Lightweight user context extracted from JWT.

    This avoids a DB query on every request for role checks.
    Full user object should be loaded only when needed.
    """

    def __init__(self, id: str, role: str) -> None:
        self.id = id
        self.role = role

    def has_role(self, *roles: Role) -> bool:
        return self.role in [r.value for r in roles]


async def get_current_user(token: str = Depends(oauth2_scheme)) -> CurrentUser:
    """Extract and validate current user from JWT access token.

    Returns a lightweight CurrentUser with id and role.
    Raises AuthenticationError if token is invalid.
    """
    payload = decode_access_token(token)
    user_id = payload.get("sub")
    user_role = payload.get("role")
    if not user_id or not user_role:
        raise AuthenticationError("Invalid token payload")
    return CurrentUser(id=user_id, role=user_role)


# Annotated type for dependency injection
AuthenticatedUser = Annotated[CurrentUser, Depends(get_current_user)]


# ---- Role Enforcement ----


def require_role(*allowed_roles: Role):
    """Returns a dependency that enforces global role-based access.

    Usage:
        @router.post("/", dependencies=[Depends(require_role(Role.ADMIN, Role.PM))])
        async def create_something(): ...
    """

    async def _check(user: AuthenticatedUser) -> CurrentUser:
        if not user.has_role(*allowed_roles):
            raise InsufficientPermissionError(
                f"Required role: {', '.join(r.value for r in allowed_roles)}. "
                f"Your role: {user.role}"
            )
        return user

    return _check


# ---- Pagination Dependency ----

Pagination = Annotated[PaginationParams, Depends()]

