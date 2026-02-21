# Base Repository
# ---------------
# Generic CRUD repository pattern.

from __future__ import annotations

from datetime import datetime, timezone
from typing import Any, Generic, TypeVar
from uuid import UUID

from sqlalchemy import Select, func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.exceptions import NotFoundError
from app.db.base import Base

ModelType = TypeVar("ModelType", bound=Base)


class BaseRepository(Generic[ModelType]):
    """Generic repository providing standard CRUD operations.

    All domain repositories extend this base class.
    Soft-delete-aware by default when the model has a `soft_deleted` attribute.
    """

    def __init__(self, session: AsyncSession, model: type[ModelType]) -> None:
        self.session = session
        self.model = model

    # ---- Query Helpers ----

    def _base_query(self) -> Select:
        """Base query that filters out soft-deleted records if applicable."""
        query = select(self.model)
        if hasattr(self.model, "soft_deleted"):
            query = query.where(self.model.soft_deleted == False)  # noqa: E712
        return query

    # ---- Read ----

    async def get(self, id: str) -> ModelType | None:
        """Get a single record by ID. Returns None if not found or soft-deleted."""
        query = self._base_query().where(self.model.id == id)
        result = await self.session.execute(query)
        return result.scalar_one_or_none()

    async def get_or_raise(self, id: str, resource_name: str | None = None) -> ModelType:
        """Get a single record by ID. Raises NotFoundError if not found."""
        record = await self.get(id)
        if record is None:
            name = resource_name or self.model.__tablename__.rstrip("s").capitalize()
            raise NotFoundError(resource=name, identifier=id)
        return record

    async def get_multi(
        self,
        *,
        offset: int = 0,
        limit: int = 20,
        order_by: Any | None = None,
    ) -> tuple[list[ModelType], int]:
        """Get multiple records with pagination. Returns (items, total_count)."""
        query = self._base_query()

        # Count total
        count_query = select(func.count()).select_from(query.subquery())
        total_result = await self.session.execute(count_query)
        total = total_result.scalar_one()

        # Apply ordering
        if order_by is not None:
            query = query.order_by(order_by)
        elif hasattr(self.model, "created_at"):
            query = query.order_by(self.model.created_at.desc())

        # Apply pagination
        query = query.offset(offset).limit(limit)
        result = await self.session.execute(query)
        items = list(result.scalars().all())

        return items, total

    async def exists(self, id: str) -> bool:
        """Check if a record exists (not soft-deleted)."""
        query = self._base_query().where(self.model.id == id)
        count_query = select(func.count()).select_from(query.subquery())
        result = await self.session.execute(count_query)
        return result.scalar_one() > 0

    async def count(self) -> int:
        """Count all active (non-soft-deleted) records."""
        query = select(func.count()).select_from(self._base_query().subquery())
        result = await self.session.execute(query)
        return result.scalar_one()

    # ---- Write ----

    async def create(self, data: dict[str, Any]) -> ModelType:
        """Create a new record."""
        instance = self.model(**data)
        self.session.add(instance)
        await self.session.flush()
        await self.session.refresh(instance)
        return instance

    async def update(self, id: str, data: dict[str, Any]) -> ModelType:
        """Update an existing record. Raises NotFoundError if not found."""
        instance = await self.get_or_raise(id)
        for key, value in data.items():
            if hasattr(instance, key):
                setattr(instance, key, value)
        await self.session.flush()
        await self.session.refresh(instance)
        return instance

    async def soft_delete(self, id: str) -> ModelType:
        """Soft-delete a record. Raises NotFoundError if not found."""
        instance = await self.get_or_raise(id)
        instance.soft_deleted = True  # type: ignore[attr-defined]
        instance.deleted_at = datetime.now(timezone.utc)  # type: ignore[attr-defined]
        await self.session.flush()
        await self.session.refresh(instance)
        return instance

    async def hard_delete(self, id: str) -> None:
        """Hard-delete a record. Use only for non-audited entities."""
        instance = await self.get_or_raise(id)
        await self.session.delete(instance)
        await self.session.flush()

