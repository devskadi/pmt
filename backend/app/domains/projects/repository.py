# Projects Repository
# -------------------
# Data access layer for project entities.
# Only data access logic — no business rules.

from __future__ import annotations

from typing import Any

from sqlalchemy import Select, func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.constants import ProjectStatus
from app.db.base_repository import BaseRepository
from app.domains.projects.models import Project


class ProjectRepository(BaseRepository[Project]):
    """Repository for Project entity CRUD operations.

    Extends BaseRepository with project-specific queries.
    All queries automatically filter out soft-deleted records.
    """

    def __init__(self, session: AsyncSession) -> None:
        super().__init__(session=session, model=Project)

    # ---- Custom Queries ----

    async def get_by_owner(
        self,
        owner_id: str,
        *,
        offset: int = 0,
        limit: int = 20,
    ) -> tuple[list[Project], int]:
        """List projects owned by a specific user."""
        query = self._base_query().where(Project.owner_id == owner_id)

        # Count
        count_query = select(func.count()).select_from(query.subquery())
        total_result = await self.session.execute(count_query)
        total = total_result.scalar_one()

        # Paginate
        query = query.order_by(Project.created_at.desc()).offset(offset).limit(limit)
        result = await self.session.execute(query)
        items = list(result.scalars().all())

        return items, total

    async def list_by_status(
        self,
        status: ProjectStatus,
        *,
        offset: int = 0,
        limit: int = 20,
    ) -> tuple[list[Project], int]:
        """List projects filtered by status."""
        query = self._base_query().where(Project.status == status.value)

        count_query = select(func.count()).select_from(query.subquery())
        total_result = await self.session.execute(count_query)
        total = total_result.scalar_one()

        query = query.order_by(Project.created_at.desc()).offset(offset).limit(limit)
        result = await self.session.execute(query)
        items = list(result.scalars().all())

        return items, total

    async def list_accessible_by_user(
        self,
        user_id: str,
        *,
        offset: int = 0,
        limit: int = 20,
    ) -> tuple[list[Project], int]:
        """List projects accessible to a user (owner or future member).

        Currently returns projects owned by user.
        Will be extended when project_members table is implemented.
        """
        return await self.get_by_owner(user_id, offset=offset, limit=limit)

    async def name_exists(self, name: str, *, exclude_id: str | None = None) -> bool:
        """Check if a project with the given name already exists."""
        query = self._base_query().where(Project.name == name)
        if exclude_id:
            query = query.where(Project.id != exclude_id)
        count_query = select(func.count()).select_from(query.subquery())
        result = await self.session.execute(count_query)
        return result.scalar_one() > 0

