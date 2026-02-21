# Project Schemas
# ---------------
# Pydantic v2 schemas for the projects domain.

from __future__ import annotations

from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field

from app.core.constants import ProjectStatus


# ---- Request Schemas ----


class ProjectCreate(BaseModel):
    """Schema for creating a new project."""

    name: str = Field(
        ...,
        min_length=1,
        max_length=255,
        description="Project name. Cannot be empty.",
        examples=["PMT Core Platform"],
    )
    description: str | None = Field(
        default=None,
        max_length=5000,
        description="Optional project description.",
        examples=["A scalable project management tool."],
    )


class ProjectUpdate(BaseModel):
    """Schema for updating an existing project.

    All fields are optional — only provided fields are updated.
    """

    name: str | None = Field(
        default=None,
        min_length=1,
        max_length=255,
        description="Updated project name.",
    )
    description: str | None = Field(
        default=None,
        max_length=5000,
        description="Updated project description.",
    )
    status: ProjectStatus | None = Field(
        default=None,
        description="Updated project status.",
    )


# ---- Response Schemas ----


class ProjectResponse(BaseModel):
    """Schema for project API responses."""

    model_config = ConfigDict(from_attributes=True)

    id: str
    name: str
    description: str | None
    status: ProjectStatus
    owner_id: str
    created_at: datetime
    updated_at: datetime

    class Config:
        json_schema_extra = {
            "example": {
                "id": "550e8400-e29b-41d4-a716-446655440000",
                "name": "PMT Core Platform",
                "description": "A scalable project management tool.",
                "status": "ACTIVE",
                "owner_id": "123e4567-e89b-12d3-a456-426614174000",
                "created_at": "2025-01-15T10:30:00Z",
                "updated_at": "2025-01-15T10:30:00Z",
            }
        }

