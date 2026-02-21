# Projects Router — /api/v1/projects
# ------------------------------------
# Thin router. All business logic delegated to ProjectService.

from __future__ import annotations

from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.dependencies import AuthenticatedUser, DBSession, Pagination
from app.core.schemas import PaginatedResponse
from app.domains.projects.repository import ProjectRepository
from app.domains.projects.schemas import (
    ProjectCreate,
    ProjectResponse,
    ProjectUpdate,
)
from app.domains.projects.service import ProjectService

router = APIRouter()


# ---- Dependency: ProjectService ----


def _get_service(session: DBSession) -> ProjectService:
    """Wire the service with its repository."""
    repository = ProjectRepository(session)
    return ProjectService(repository)


# ---- Endpoints ----


@router.post(
    "/",
    response_model=ProjectResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create a new project",
)
async def create_project(
    data: ProjectCreate,
    current_user: AuthenticatedUser,
    service: ProjectService = Depends(_get_service),
) -> ProjectResponse:
    """Create a new project. Requires Admin or PM role."""
    return await service.create_project(data, current_user)


@router.get(
    "/",
    response_model=PaginatedResponse[ProjectResponse],
    summary="List projects",
)
async def list_projects(
    current_user: AuthenticatedUser,
    pagination: Pagination,
    service: ProjectService = Depends(_get_service),
) -> PaginatedResponse[ProjectResponse]:
    """List projects accessible to the current user.

    Admin sees all projects. Others see their own.
    """
    return await service.list_projects(current_user, pagination)


@router.get(
    "/{project_id}",
    response_model=ProjectResponse,
    summary="Get project details",
)
async def get_project(
    project_id: str,
    current_user: AuthenticatedUser,
    service: ProjectService = Depends(_get_service),
) -> ProjectResponse:
    """Get a single project by ID."""
    return await service.get_project(project_id, current_user)


@router.put(
    "/{project_id}",
    response_model=ProjectResponse,
    summary="Update a project",
)
async def update_project(
    project_id: str,
    data: ProjectUpdate,
    current_user: AuthenticatedUser,
    service: ProjectService = Depends(_get_service),
) -> ProjectResponse:
    """Update a project. Admin can update any. PM can update owned projects."""
    return await service.update_project(project_id, data, current_user)


@router.delete(
    "/{project_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Soft-delete a project",
)
async def delete_project(
    project_id: str,
    current_user: AuthenticatedUser,
    service: ProjectService = Depends(_get_service),
) -> None:
    """Soft-delete (archive) a project. Never hard-deletes."""
    await service.soft_delete_project(project_id, current_user)

