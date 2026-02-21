# Shared Schemas
# --------------
# Cross-cutting Pydantic v2 schemas used by multiple domains.

from __future__ import annotations

from datetime import datetime
from math import ceil
from typing import Generic, TypeVar

from pydantic import BaseModel, ConfigDict, Field

T = TypeVar("T")


# ---- Pagination ----


class PaginationMeta(BaseModel):
    """Metadata for offset-based pagination."""

    page: int
    per_page: int
    total: int
    total_pages: int


class PaginatedResponse(BaseModel, Generic[T]):
    """Standard paginated response envelope."""

    data: list[T]
    meta: PaginationMeta

    @classmethod
    def create(
        cls, *, data: list[T], total: int, page: int, per_page: int
    ) -> PaginatedResponse[T]:
        return cls(
            data=data,
            meta=PaginationMeta(
                page=page,
                per_page=per_page,
                total=total,
                total_pages=ceil(total / per_page) if per_page > 0 else 0,
            ),
        )


class PaginationParams(BaseModel):
    """Query parameters for pagination. Used as a dependency."""

    page: int = Field(default=1, ge=1, description="Page number (1-indexed)")
    per_page: int = Field(default=20, ge=1, le=100, description="Items per page")

    @property
    def offset(self) -> int:
        return (self.page - 1) * self.per_page


# ---- Response Envelope ----


class ErrorDetail(BaseModel):
    """Standard error response body."""

    code: str
    message: str
    details: list[dict] | None = None
    request_id: str | None = None


class ErrorResponse(BaseModel):
    """Standard error envelope."""

    error: ErrorDetail


# ---- Base Schemas ----


class TimestampSchema(BaseModel):
    """Mixin for read schemas that include timestamps."""

    model_config = ConfigDict(from_attributes=True)

    created_at: datetime
    updated_at: datetime

