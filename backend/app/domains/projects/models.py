# Project Models
# --------------
# SQLAlchemy models owned by the projects domain.

from __future__ import annotations

from sqlalchemy import Enum, Index, String, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.constants import ProjectStatus
from app.db.base import Base
from app.db.mixins import SoftDeleteMixin, TimestampMixin, UUIDPrimaryKeyMixin


class Project(UUIDPrimaryKeyMixin, TimestampMixin, SoftDeleteMixin, Base):
    """Project entity — the top-level organizational unit.

    Each project has an owner, a unique human-readable key,
    and a lifecycle status (ACTIVE → ARCHIVED).
    """

    __tablename__ = "projects"

    name: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
        index=True,
    )
    description: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )
    status: Mapped[str] = mapped_column(
        Enum(ProjectStatus, name="projectstatus", create_type=True),
        nullable=False,
        default=ProjectStatus.ACTIVE.value,
        server_default=ProjectStatus.ACTIVE.value,
        index=True,
    )
    owner_id: Mapped[str] = mapped_column(
        UUID(as_uuid=False),
        nullable=False,
        index=True,
    )

    # ---- Table-level indexes ----

    __table_args__ = (
        Index("ix_projects_owner_id_status", "owner_id", "status"),
        Index("ix_projects_created_at", "created_at"),
    )

    def __repr__(self) -> str:
        return f"<Project id={self.id} name={self.name!r} status={self.status}>"

