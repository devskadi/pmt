# Unit tests for projects service
# Tests project management logic including creation, updates, archiving,
# permission enforcement, and soft delete behavior.

from __future__ import annotations

import uuid
from unittest.mock import AsyncMock, patch

import pytest

from app.core.constants import ProjectStatus, Role
from app.core.dependencies import CurrentUser
from app.core.exceptions import (
    BusinessRuleError,
    InsufficientPermissionError,
    NotFoundError,
)
from app.core.schemas import PaginationParams
from app.domains.projects.schemas import ProjectCreate, ProjectUpdate
from app.domains.projects.service import ProjectService

from .conftest import make_project


# ============================================================
# CREATE PROJECT — RBAC
# ============================================================


class TestCreateProjectRBAC:
    """RBAC enforcement for project creation."""

    @pytest.mark.asyncio
    async def test_admin_can_create_project(
        self, project_service: ProjectService, mock_repository: AsyncMock, admin_user: CurrentUser
    ):
        """Admin role should be allowed to create projects."""
        data = ProjectCreate(name="New Project", description="Desc")
        created = make_project(owner_id=admin_user.id, name=data.name)
        mock_repository.create.return_value = created

        result = await project_service.create_project(data, admin_user)

        assert result.name == "New Project"
        mock_repository.create.assert_called_once()

    @pytest.mark.asyncio
    async def test_pm_can_create_project(
        self, project_service: ProjectService, mock_repository: AsyncMock, pm_user: CurrentUser
    ):
        """PM role should be allowed to create projects."""
        data = ProjectCreate(name="PM Project")
        created = make_project(owner_id=pm_user.id, name=data.name)
        mock_repository.create.return_value = created

        result = await project_service.create_project(data, pm_user)

        assert result.name == "PM Project"
        mock_repository.create.assert_called_once()

    @pytest.mark.asyncio
    async def test_developer_cannot_create_project(
        self, project_service: ProjectService, developer_user: CurrentUser
    ):
        """Developer role should NOT be allowed to create projects."""
        data = ProjectCreate(name="Dev Project")

        with pytest.raises(InsufficientPermissionError):
            await project_service.create_project(data, developer_user)

    @pytest.mark.asyncio
    async def test_viewer_cannot_create_project(
        self, project_service: ProjectService, viewer_user: CurrentUser
    ):
        """Viewer role should NOT be allowed to create projects."""
        data = ProjectCreate(name="Viewer Project")

        with pytest.raises(InsufficientPermissionError):
            await project_service.create_project(data, viewer_user)

    @pytest.mark.asyncio
    async def test_created_project_is_owned_by_creator(
        self, project_service: ProjectService, mock_repository: AsyncMock, admin_user: CurrentUser
    ):
        """Project owner_id should be set to the creating user's id."""
        data = ProjectCreate(name="Owned Project")
        created = make_project(owner_id=admin_user.id, name=data.name)
        mock_repository.create.return_value = created

        result = await project_service.create_project(data, admin_user)

        # Verify the dict passed to create contains the owner_id
        call_args = mock_repository.create.call_args[0][0]
        assert call_args["owner_id"] == admin_user.id

    @pytest.mark.asyncio
    async def test_created_project_default_status_active(
        self, project_service: ProjectService, mock_repository: AsyncMock, admin_user: CurrentUser
    ):
        """New projects should default to ACTIVE status."""
        data = ProjectCreate(name="Active Default")
        created = make_project(owner_id=admin_user.id, status=ProjectStatus.ACTIVE.value)
        mock_repository.create.return_value = created

        await project_service.create_project(data, admin_user)

        call_args = mock_repository.create.call_args[0][0]
        assert call_args["status"] == ProjectStatus.ACTIVE.value


# ============================================================
# UPDATE PROJECT — RBAC
# ============================================================


class TestUpdateProjectRBAC:
    """RBAC enforcement for project updates."""

    @pytest.mark.asyncio
    async def test_admin_can_update_any_project(
        self, project_service: ProjectService, mock_repository: AsyncMock, admin_user: CurrentUser
    ):
        """Admin should be able to update any project, regardless of ownership."""
        other_owner = str(uuid.uuid4())
        project = make_project(owner_id=other_owner, name="Other's Project")
        mock_repository.get_or_raise.return_value = project
        updated = make_project(owner_id=other_owner, name="Updated Name")
        mock_repository.update.return_value = updated

        data = ProjectUpdate(name="Updated Name")
        result = await project_service.update_project(project.id, data, admin_user)

        assert result.name == "Updated Name"

    @pytest.mark.asyncio
    async def test_pm_can_update_own_project(
        self, project_service: ProjectService, mock_repository: AsyncMock, pm_user: CurrentUser
    ):
        """PM should be able to update projects they own."""
        project = make_project(owner_id=pm_user.id, name="PM's Project")
        mock_repository.get_or_raise.return_value = project
        updated = make_project(owner_id=pm_user.id, name="PM Updated")
        mock_repository.update.return_value = updated

        data = ProjectUpdate(name="PM Updated")
        result = await project_service.update_project(project.id, data, pm_user)

        assert result.name == "PM Updated"

    @pytest.mark.asyncio
    async def test_pm_cannot_update_others_project(
        self, project_service: ProjectService, mock_repository: AsyncMock, pm_user: CurrentUser
    ):
        """PM should NOT be able to update projects owned by others."""
        other_owner = str(uuid.uuid4())
        project = make_project(owner_id=other_owner, name="Not PM's Project")
        mock_repository.get_or_raise.return_value = project

        data = ProjectUpdate(name="Attempted Update")

        with pytest.raises(InsufficientPermissionError):
            await project_service.update_project(project.id, data, pm_user)

    @pytest.mark.asyncio
    async def test_developer_cannot_update_project(
        self, project_service: ProjectService, mock_repository: AsyncMock, developer_user: CurrentUser
    ):
        """Developer should NOT be able to update projects."""
        project = make_project(owner_id=str(uuid.uuid4()))
        mock_repository.get_or_raise.return_value = project

        data = ProjectUpdate(name="Dev Update")

        with pytest.raises(InsufficientPermissionError):
            await project_service.update_project(project.id, data, developer_user)

    @pytest.mark.asyncio
    async def test_viewer_cannot_update_project(
        self, project_service: ProjectService, mock_repository: AsyncMock, viewer_user: CurrentUser
    ):
        """Viewer should NOT be able to update projects."""
        project = make_project(owner_id=str(uuid.uuid4()))
        mock_repository.get_or_raise.return_value = project

        data = ProjectUpdate(name="Viewer Update")

        with pytest.raises(InsufficientPermissionError):
            await project_service.update_project(project.id, data, viewer_user)


# ============================================================
# STATUS TRANSITIONS
# ============================================================


class TestStatusTransitions:
    """Business rule enforcement for status transitions."""

    @pytest.mark.asyncio
    async def test_active_to_archived_allowed(
        self, project_service: ProjectService, mock_repository: AsyncMock, admin_user: CurrentUser
    ):
        """ACTIVE → ARCHIVED is a valid transition."""
        project = make_project(owner_id=admin_user.id, status=ProjectStatus.ACTIVE.value)
        mock_repository.get_or_raise.return_value = project
        updated = make_project(
            owner_id=admin_user.id, status=ProjectStatus.ARCHIVED.value
        )
        mock_repository.update.return_value = updated

        data = ProjectUpdate(status=ProjectStatus.ARCHIVED)
        result = await project_service.update_project(project.id, data, admin_user)

        assert result.status == ProjectStatus.ARCHIVED

    @pytest.mark.asyncio
    async def test_archived_to_active_allowed(
        self, project_service: ProjectService, mock_repository: AsyncMock, admin_user: CurrentUser
    ):
        """ARCHIVED → ACTIVE is a valid transition."""
        project = make_project(owner_id=admin_user.id, status=ProjectStatus.ARCHIVED.value)
        mock_repository.get_or_raise.return_value = project
        updated = make_project(
            owner_id=admin_user.id, status=ProjectStatus.ACTIVE.value
        )
        mock_repository.update.return_value = updated

        data = ProjectUpdate(status=ProjectStatus.ACTIVE)
        result = await project_service.update_project(project.id, data, admin_user)

        assert result.status == ProjectStatus.ACTIVE

    @pytest.mark.asyncio
    async def test_same_status_transition_is_noop(
        self, project_service: ProjectService, mock_repository: AsyncMock, admin_user: CurrentUser
    ):
        """Setting the same status should not raise an error."""
        project = make_project(owner_id=admin_user.id, status=ProjectStatus.ACTIVE.value)
        mock_repository.get_or_raise.return_value = project
        mock_repository.update.return_value = project

        data = ProjectUpdate(status=ProjectStatus.ACTIVE)
        result = await project_service.update_project(project.id, data, admin_user)

        # Should succeed — same status is a no-op
        assert result is not None


# ============================================================
# SOFT DELETE — RBAC
# ============================================================


class TestSoftDeleteRBAC:
    """RBAC enforcement for project deletion (soft delete)."""

    @pytest.mark.asyncio
    async def test_admin_can_delete_any_project(
        self, project_service: ProjectService, mock_repository: AsyncMock, admin_user: CurrentUser
    ):
        """Admin should be able to soft-delete any project."""
        project = make_project(owner_id=str(uuid.uuid4()))
        mock_repository.get_or_raise.return_value = project

        await project_service.soft_delete_project(project.id, admin_user)

        mock_repository.soft_delete.assert_called_once_with(project.id)

    @pytest.mark.asyncio
    async def test_pm_can_delete_own_project(
        self, project_service: ProjectService, mock_repository: AsyncMock, pm_user: CurrentUser
    ):
        """PM should be able to soft-delete projects they own."""
        project = make_project(owner_id=pm_user.id)
        mock_repository.get_or_raise.return_value = project

        await project_service.soft_delete_project(project.id, pm_user)

        mock_repository.soft_delete.assert_called_once_with(project.id)

    @pytest.mark.asyncio
    async def test_pm_cannot_delete_others_project(
        self, project_service: ProjectService, mock_repository: AsyncMock, pm_user: CurrentUser
    ):
        """PM should NOT be able to soft-delete projects owned by others."""
        project = make_project(owner_id=str(uuid.uuid4()))
        mock_repository.get_or_raise.return_value = project

        with pytest.raises(InsufficientPermissionError):
            await project_service.soft_delete_project(project.id, pm_user)

    @pytest.mark.asyncio
    async def test_developer_cannot_delete_project(
        self, project_service: ProjectService, mock_repository: AsyncMock, developer_user: CurrentUser
    ):
        """Developer should NOT be able to delete projects."""
        project = make_project(owner_id=str(uuid.uuid4()))
        mock_repository.get_or_raise.return_value = project

        with pytest.raises(InsufficientPermissionError):
            await project_service.soft_delete_project(project.id, developer_user)


# ============================================================
# READ / LIST — RBAC
# ============================================================


class TestReadProjectRBAC:
    """RBAC enforcement for project reads."""

    @pytest.mark.asyncio
    async def test_admin_can_read_any_project(
        self, project_service: ProjectService, mock_repository: AsyncMock, admin_user: CurrentUser
    ):
        """Admin should be able to read any project."""
        project = make_project(owner_id=str(uuid.uuid4()))
        mock_repository.get_or_raise.return_value = project

        result = await project_service.get_project(project.id, admin_user)

        assert result.id == project.id

    @pytest.mark.asyncio
    async def test_owner_can_read_own_project(
        self, project_service: ProjectService, mock_repository: AsyncMock, pm_user: CurrentUser
    ):
        """Project owner should be able to read their own project."""
        project = make_project(owner_id=pm_user.id)
        mock_repository.get_or_raise.return_value = project

        result = await project_service.get_project(project.id, pm_user)

        assert result.id == project.id

    @pytest.mark.asyncio
    async def test_non_owner_non_admin_cannot_read_project(
        self, project_service: ProjectService, mock_repository: AsyncMock, developer_user: CurrentUser
    ):
        """Non-owner, non-admin should NOT be able to read a project."""
        project = make_project(owner_id=str(uuid.uuid4()))
        mock_repository.get_or_raise.return_value = project

        with pytest.raises(InsufficientPermissionError):
            await project_service.get_project(project.id, developer_user)

    @pytest.mark.asyncio
    async def test_admin_lists_all_projects(
        self, project_service: ProjectService, mock_repository: AsyncMock, admin_user: CurrentUser
    ):
        """Admin should see all projects when listing."""
        projects = [make_project() for _ in range(3)]
        mock_repository.get_multi.return_value = (projects, 3)

        pagination = PaginationParams(page=1, per_page=20)
        result = await project_service.list_projects(admin_user, pagination)

        mock_repository.get_multi.assert_called_once()
        assert result.meta.total == 3

    @pytest.mark.asyncio
    async def test_pm_lists_only_own_projects(
        self, project_service: ProjectService, mock_repository: AsyncMock, pm_user: CurrentUser
    ):
        """PM should only see projects they own."""
        projects = [make_project(owner_id=pm_user.id)]
        mock_repository.get_by_owner.return_value = (projects, 1)

        pagination = PaginationParams(page=1, per_page=20)
        result = await project_service.list_projects(pm_user, pagination)

        mock_repository.get_by_owner.assert_called_once()
        assert result.meta.total == 1


# ============================================================
# EDGE CASES
# ============================================================


class TestEdgeCases:
    """Edge cases and boundary conditions."""

    @pytest.mark.asyncio
    async def test_update_nonexistent_project_raises_not_found(
        self, project_service: ProjectService, mock_repository: AsyncMock, admin_user: CurrentUser
    ):
        """Updating a non-existent project should raise NotFoundError."""
        mock_repository.get_or_raise.side_effect = NotFoundError(
            resource="Project", identifier="nonexistent-id"
        )

        data = ProjectUpdate(name="Ghost")

        with pytest.raises(NotFoundError):
            await project_service.update_project("nonexistent-id", data, admin_user)

    @pytest.mark.asyncio
    async def test_delete_nonexistent_project_raises_not_found(
        self, project_service: ProjectService, mock_repository: AsyncMock, admin_user: CurrentUser
    ):
        """Deleting a non-existent project should raise NotFoundError."""
        mock_repository.get_or_raise.side_effect = NotFoundError(
            resource="Project", identifier="nonexistent-id"
        )

        with pytest.raises(NotFoundError):
            await project_service.soft_delete_project("nonexistent-id", admin_user)

    @pytest.mark.asyncio
    async def test_update_with_no_changes(
        self, project_service: ProjectService, mock_repository: AsyncMock, admin_user: CurrentUser
    ):
        """Updating with all None fields should still succeed."""
        project = make_project(owner_id=admin_user.id)
        mock_repository.get_or_raise.return_value = project
        mock_repository.update.return_value = project

        data = ProjectUpdate()  # All fields None
        result = await project_service.update_project(project.id, data, admin_user)

        assert result is not None

    @pytest.mark.asyncio
    async def test_project_response_serialization(
        self, project_service: ProjectService, mock_repository: AsyncMock, admin_user: CurrentUser
    ):
        """Project response should correctly serialize model attributes."""
        project = make_project(
            owner_id=admin_user.id,
            name="Serialization Test",
            description="Test description",
            status=ProjectStatus.ACTIVE.value,
        )
        mock_repository.create.return_value = project

        data = ProjectCreate(name="Serialization Test", description="Test description")
        result = await project_service.create_project(data, admin_user)

        assert result.name == "Serialization Test"
        assert result.description == "Test description"
        assert result.owner_id == admin_user.id

