# Unit tests for projects repository
# Tests data access operations for project entities including CRUD operations,
# soft delete behavior, filtering, and pagination.

from __future__ import annotations

import uuid

import pytest
import pytest_asyncio

from app.core.constants import ProjectStatus
from app.core.exceptions import NotFoundError
from app.domains.projects.models import Project
from app.domains.projects.repository import ProjectRepository


# ============================================================
# CREATE
# ============================================================


class TestProjectRepositoryCreate:
    """Tests for project creation via repository."""

    @pytest.mark.asyncio
    async def test_create_project(self, project_repository: ProjectRepository):
        """Should create a project and return the model instance."""
        owner_id = str(uuid.uuid4())
        project = await project_repository.create(
            {
                "name": "Repo Test Project",
                "description": "Created via repo",
                "status": ProjectStatus.ACTIVE.value,
                "owner_id": owner_id,
            }
        )

        assert project.id is not None
        assert project.name == "Repo Test Project"
        assert project.description == "Created via repo"
        assert project.owner_id == owner_id
        assert project.soft_deleted is False

    @pytest.mark.asyncio
    async def test_create_project_without_description(self, project_repository: ProjectRepository):
        """Should create a project with a null description."""
        project = await project_repository.create(
            {
                "name": "No Desc",
                "status": ProjectStatus.ACTIVE.value,
                "owner_id": str(uuid.uuid4()),
            }
        )

        assert project.name == "No Desc"
        assert project.description is None


# ============================================================
# READ
# ============================================================


class TestProjectRepositoryRead:
    """Tests for project retrieval."""

    @pytest.mark.asyncio
    async def test_get_by_id(self, project_repository: ProjectRepository):
        """Should retrieve a project by its ID."""
        created = await project_repository.create(
            {
                "name": "Get By ID",
                "status": ProjectStatus.ACTIVE.value,
                "owner_id": str(uuid.uuid4()),
            }
        )

        fetched = await project_repository.get(created.id)

        assert fetched is not None
        assert fetched.id == created.id
        assert fetched.name == "Get By ID"

    @pytest.mark.asyncio
    async def test_get_nonexistent_returns_none(self, project_repository: ProjectRepository):
        """Should return None for a non-existent ID."""
        result = await project_repository.get(str(uuid.uuid4()))
        assert result is None

    @pytest.mark.asyncio
    async def test_get_or_raise_nonexistent(self, project_repository: ProjectRepository):
        """Should raise NotFoundError for a non-existent ID."""
        with pytest.raises(NotFoundError):
            await project_repository.get_or_raise(str(uuid.uuid4()))

    @pytest.mark.asyncio
    async def test_get_multi_with_pagination(self, project_repository: ProjectRepository):
        """Should return paginated results with total count."""
        owner_id = str(uuid.uuid4())
        for i in range(5):
            await project_repository.create(
                {
                    "name": f"Project {i}",
                    "status": ProjectStatus.ACTIVE.value,
                    "owner_id": owner_id,
                }
            )

        projects, total = await project_repository.get_multi(offset=0, limit=3)

        assert len(projects) == 3
        assert total == 5

    @pytest.mark.asyncio
    async def test_get_multi_offset(self, project_repository: ProjectRepository):
        """Should skip items based on offset."""
        owner_id = str(uuid.uuid4())
        for i in range(5):
            await project_repository.create(
                {
                    "name": f"Project {i}",
                    "status": ProjectStatus.ACTIVE.value,
                    "owner_id": owner_id,
                }
            )

        projects, total = await project_repository.get_multi(offset=3, limit=10)

        assert len(projects) == 2
        assert total == 5


# ============================================================
# UPDATE
# ============================================================


class TestProjectRepositoryUpdate:
    """Tests for project updates."""

    @pytest.mark.asyncio
    async def test_update_name(self, project_repository: ProjectRepository):
        """Should update the project name."""
        project = await project_repository.create(
            {
                "name": "Original",
                "status": ProjectStatus.ACTIVE.value,
                "owner_id": str(uuid.uuid4()),
            }
        )

        updated = await project_repository.update(project.id, {"name": "Updated"})

        assert updated is not None
        assert updated.name == "Updated"

    @pytest.mark.asyncio
    async def test_update_status(self, project_repository: ProjectRepository):
        """Should update project status."""
        project = await project_repository.create(
            {
                "name": "Status Test",
                "status": ProjectStatus.ACTIVE.value,
                "owner_id": str(uuid.uuid4()),
            }
        )

        updated = await project_repository.update(
            project.id, {"status": ProjectStatus.ARCHIVED.value}
        )

        assert updated is not None
        assert updated.status == ProjectStatus.ARCHIVED.value

    @pytest.mark.asyncio
    async def test_update_nonexistent_returns_none(self, project_repository: ProjectRepository):
        """Should return None when updating a non-existent project."""
        result = await project_repository.update(str(uuid.uuid4()), {"name": "Ghost"})
        assert result is None


# ============================================================
# SOFT DELETE
# ============================================================


class TestProjectRepositorySoftDelete:
    """Tests for soft delete behavior."""

    @pytest.mark.asyncio
    async def test_soft_delete_sets_flag(self, project_repository: ProjectRepository):
        """Soft delete should set soft_deleted=True."""
        project = await project_repository.create(
            {
                "name": "To Delete",
                "status": ProjectStatus.ACTIVE.value,
                "owner_id": str(uuid.uuid4()),
            }
        )

        await project_repository.soft_delete(project.id)

        # Direct get should return None (filtered by base query)
        fetched = await project_repository.get(project.id)
        assert fetched is None

    @pytest.mark.asyncio
    async def test_soft_deleted_excluded_from_list(self, project_repository: ProjectRepository):
        """Soft-deleted projects should not appear in get_multi results."""
        owner_id = str(uuid.uuid4())
        p1 = await project_repository.create(
            {"name": "Active", "status": ProjectStatus.ACTIVE.value, "owner_id": owner_id}
        )
        p2 = await project_repository.create(
            {"name": "Deleted", "status": ProjectStatus.ACTIVE.value, "owner_id": owner_id}
        )

        await project_repository.soft_delete(p2.id)

        projects, total = await project_repository.get_multi(offset=0, limit=10)

        assert total == 1
        assert projects[0].id == p1.id

    @pytest.mark.asyncio
    async def test_exists_returns_false_for_soft_deleted(self, project_repository: ProjectRepository):
        """exists() should return False for soft-deleted projects."""
        project = await project_repository.create(
            {
                "name": "Exists Test",
                "status": ProjectStatus.ACTIVE.value,
                "owner_id": str(uuid.uuid4()),
            }
        )

        await project_repository.soft_delete(project.id)

        result = await project_repository.exists(project.id)
        assert result is False

    @pytest.mark.asyncio
    async def test_count_excludes_soft_deleted(self, project_repository: ProjectRepository):
        """count() should exclude soft-deleted projects."""
        owner_id = str(uuid.uuid4())
        for i in range(3):
            p = await project_repository.create(
                {"name": f"Count {i}", "status": ProjectStatus.ACTIVE.value, "owner_id": owner_id}
            )
            if i == 0:
                await project_repository.soft_delete(p.id)

        total = await project_repository.count()
        assert total == 2


# ============================================================
# CUSTOM QUERIES
# ============================================================


class TestProjectRepositoryCustomQueries:
    """Tests for domain-specific repository methods."""

    @pytest.mark.asyncio
    async def test_get_by_owner(self, project_repository: ProjectRepository):
        """Should return only projects owned by the specified user."""
        owner_a = str(uuid.uuid4())
        owner_b = str(uuid.uuid4())

        await project_repository.create(
            {"name": "Owner A", "status": ProjectStatus.ACTIVE.value, "owner_id": owner_a}
        )
        await project_repository.create(
            {"name": "Owner B", "status": ProjectStatus.ACTIVE.value, "owner_id": owner_b}
        )

        projects, total = await project_repository.get_by_owner(owner_a, offset=0, limit=10)

        assert total == 1
        assert projects[0].owner_id == owner_a

    @pytest.mark.asyncio
    async def test_list_by_status(self, project_repository: ProjectRepository):
        """Should return only projects with the specified status."""
        owner_id = str(uuid.uuid4())
        await project_repository.create(
            {"name": "Active", "status": ProjectStatus.ACTIVE.value, "owner_id": owner_id}
        )
        await project_repository.create(
            {"name": "Archived", "status": ProjectStatus.ARCHIVED.value, "owner_id": owner_id}
        )

        projects, total = await project_repository.list_by_status(
            ProjectStatus.ARCHIVED, offset=0, limit=10
        )

        assert total == 1
        assert projects[0].name == "Archived"

    @pytest.mark.asyncio
    async def test_name_exists_true(self, project_repository: ProjectRepository):
        """Should return True when a project with the given name exists."""
        await project_repository.create(
            {
                "name": "Unique Name",
                "status": ProjectStatus.ACTIVE.value,
                "owner_id": str(uuid.uuid4()),
            }
        )

        result = await project_repository.name_exists("Unique Name")
        assert result is True

    @pytest.mark.asyncio
    async def test_name_exists_false(self, project_repository: ProjectRepository):
        """Should return False when no project with the given name exists."""
        result = await project_repository.name_exists("Nonexistent")
        assert result is False

    @pytest.mark.asyncio
    async def test_name_exists_with_exclude_id(self, project_repository: ProjectRepository):
        """Should exclude specified ID from the name check."""
        project = await project_repository.create(
            {
                "name": "Exclude Test",
                "status": ProjectStatus.ACTIVE.value,
                "owner_id": str(uuid.uuid4()),
            }
        )

        # Should return False when excluding the project's own ID
        result = await project_repository.name_exists("Exclude Test", exclude_id=project.id)
        assert result is False

