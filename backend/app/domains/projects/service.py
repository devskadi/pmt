# Projects Service
# ----------------
# Business logic for project lifecycle management.
# Enforces RBAC, business constraints, and ownership rules.

from __future__ import annotations

import structlog

from app.core.constants import ProjectStatus, Role
from app.core.dependencies import CurrentUser
from app.core.exceptions import (
    BusinessRuleError,
    InsufficientPermissionError,
    NotFoundError,
)
from app.core.schemas import PaginatedResponse, PaginationParams
from app.domains.projects.models import Project
from app.domains.projects.repository import ProjectRepository
from app.domains.projects.schemas import (
    ProjectCreate,
    ProjectResponse,
    ProjectUpdate,
)

logger = structlog.get_logger()


class ProjectService:
    """Service layer for project domain.

    All business logic, RBAC enforcement, and exception
    normalization happens here. The router is kept thin.
    """

    def __init__(self, repository: ProjectRepository) -> None:
        self.repo = repository

    # ---- Commands ----

    async def create_project(
        self,
        data: ProjectCreate,
        current_user: CurrentUser,
    ) -> ProjectResponse:
        """Create a new project.

        RBAC: Admin and PM can create projects.
        """
        self._require_create_permission(current_user)

        project = await self.repo.create(
            {
                "name": data.name,
                "description": data.description,
                "status": ProjectStatus.ACTIVE.value,
                "owner_id": current_user.id,
            }
        )

        logger.info(
            "project_created",
            project_id=project.id,
            owner_id=current_user.id,
            domain="projects",
        )

        return ProjectResponse.model_validate(project)

    async def update_project(
        self,
        project_id: str,
        data: ProjectUpdate,
        current_user: CurrentUser,
    ) -> ProjectResponse:
        """Update an existing project.

        RBAC:
          - Admin: can update any project.
          - PM: can update projects they own.
          - Developer/Viewer: no access.
        """
        project = await self.repo.get_or_raise(project_id, resource_name="Project")
        self._require_modify_permission(current_user, project)

        # Build update dict from provided fields only
        update_data = data.model_dump(exclude_unset=True)
        if not update_data:
            raise BusinessRuleError("No fields provided for update")

        # Validate status transition
        if "status" in update_data:
            self._validate_status_transition(
                current=project.status,
                target=update_data["status"],
            )
            update_data["status"] = update_data["status"].value

        updated = await self.repo.update(project_id, update_data)

        logger.info(
            "project_updated",
            project_id=project_id,
            updated_fields=list(update_data.keys()),
            user_id=current_user.id,
            domain="projects",
        )

        return ProjectResponse.model_validate(updated)

    async def soft_delete_project(
        self,
        project_id: str,
        current_user: CurrentUser,
    ) -> None:
        """Soft-delete (archive) a project.

        RBAC:
          - Admin: can delete any project.
          - PM: can delete projects they own.
          - Developer/Viewer: no access.
        """
        project = await self.repo.get_or_raise(project_id, resource_name="Project")
        self._require_modify_permission(current_user, project)

        if project.soft_deleted:
            raise BusinessRuleError("Project is already deleted")

        await self.repo.soft_delete(project_id)

        logger.info(
            "project_soft_deleted",
            project_id=project_id,
            user_id=current_user.id,
            domain="projects",
        )

    # ---- Queries ----

    async def get_project(
        self,
        project_id: str,
        current_user: CurrentUser,
    ) -> ProjectResponse:
        """Get a single project by ID.

        RBAC: All authenticated users can read projects they have access to.
        Currently: Admin sees all, others see their own.
        """
        project = await self.repo.get_or_raise(project_id, resource_name="Project")
        self._require_read_permission(current_user, project)
        return ProjectResponse.model_validate(project)

    async def list_projects(
        self,
        current_user: CurrentUser,
        pagination: PaginationParams,
    ) -> PaginatedResponse[ProjectResponse]:
        """List projects with pagination.

        RBAC:
          - Admin: sees all projects.
          - Others: see only projects they own/are members of.
        """
        if current_user.has_role(Role.ADMIN):
            items, total = await self.repo.get_multi(
                offset=pagination.offset,
                limit=pagination.per_page,
            )
        else:
            items, total = await self.repo.list_accessible_by_user(
                user_id=current_user.id,
                offset=pagination.offset,
                limit=pagination.per_page,
            )

        project_responses = [ProjectResponse.model_validate(p) for p in items]

        return PaginatedResponse.create(
            data=project_responses,
            total=total,
            page=pagination.page,
            per_page=pagination.per_page,
        )

    # ---- RBAC Enforcement (Private) ----

    def _require_create_permission(self, user: CurrentUser) -> None:
        """Only Admin and PM can create projects."""
        if not user.has_role(Role.ADMIN, Role.PM):
            raise InsufficientPermissionError(
                "Only Admin and PM roles can create projects"
            )

    def _require_modify_permission(self, user: CurrentUser, project: Project) -> None:
        """Admin can modify any. PM can modify own. Others cannot."""
        if user.has_role(Role.ADMIN):
            return
        if user.has_role(Role.PM) and project.owner_id == user.id:
            return
        raise InsufficientPermissionError(
            "You do not have permission to modify this project"
        )

    def _require_read_permission(self, user: CurrentUser, project: Project) -> None:
        """Admin can read any. Others can read own projects.

        This will be extended with project membership checks later.
        """
        if user.has_role(Role.ADMIN):
            return
        if project.owner_id == user.id:
            return
        # Future: check project_members table
        raise InsufficientPermissionError(
            "You do not have access to this project"
        )

    # ---- Business Rule Validation (Private) ----

    def _validate_status_transition(
        self,
        current: str,
        target: ProjectStatus,
    ) -> None:
        """Validate allowed status transitions.

        Allowed:
          ACTIVE → ARCHIVED
          ARCHIVED → ACTIVE (reactivation)
        """
        allowed_transitions = {
            ProjectStatus.ACTIVE.value: {ProjectStatus.ARCHIVED},
            ProjectStatus.ARCHIVED.value: {ProjectStatus.ACTIVE},
        }

        allowed = allowed_transitions.get(current, set())
        if target not in allowed:
            raise BusinessRuleError(
                f"Cannot transition project from {current} to {target.value}"
            )

