# Projects domain test fixtures
# Provides shared fixtures for project tests, including sample project objects,
# repository instances, service instances, and factory helpers.

from __future__ import annotations

import uuid
from datetime import datetime, timezone
from unittest.mock import AsyncMock, MagicMock, patch

import pytest
import pytest_asyncio

from app.core.constants import ProjectStatus, Role
from app.core.dependencies import CurrentUser
from app.domains.projects.models import Project
from app.domains.projects.repository import ProjectRepository
from app.domains.projects.schemas import ProjectCreate, ProjectUpdate
from app.domains.projects.service import ProjectService


# ---- Factory helpers ----


def make_project(
    *,
    id: str | None = None,
    name: str = "Test Project",
    description: str | None = "A test project",
    status: str = ProjectStatus.ACTIVE.value,
    owner_id: str | None = None,
    soft_deleted: bool = False,
    deleted_at: datetime | None = None,
    created_at: datetime | None = None,
    updated_at: datetime | None = None,
) -> Project:
    """Create a Project model instance for testing."""
    project = Project()
    project.id = id or str(uuid.uuid4())
    project.name = name
    project.description = description
    project.status = status
    project.owner_id = owner_id or str(uuid.uuid4())
    project.soft_deleted = soft_deleted
    project.deleted_at = deleted_at
    project.created_at = created_at or datetime.now(timezone.utc)
    project.updated_at = updated_at or datetime.now(timezone.utc)
    return project


# ---- Mock repository fixture ----


@pytest.fixture
def mock_repository() -> AsyncMock:
    """Create a mock ProjectRepository with all expected methods."""
    repo = AsyncMock(spec=ProjectRepository)
    repo.get.return_value = None
    repo.get_or_raise.return_value = None
    repo.get_multi.return_value = ([], 0)
    repo.create.return_value = None
    repo.update.return_value = None
    repo.soft_delete.return_value = None
    repo.exists.return_value = False
    repo.count.return_value = 0
    repo.get_by_owner.return_value = ([], 0)
    repo.list_by_status.return_value = ([], 0)
    repo.list_accessible_by_user.return_value = ([], 0)
    repo.name_exists.return_value = False
    return repo


# ---- Service fixture (with mock repo) ----


@pytest.fixture
def project_service(mock_repository: AsyncMock) -> ProjectService:
    """Create a ProjectService with a mock repository."""
    return ProjectService(repository=mock_repository)


# ---- Repository fixture (with real DB session) ----


@pytest_asyncio.fixture
async def project_repository(db_session) -> ProjectRepository:
    """Create a real ProjectRepository wired to the test DB session."""
    return ProjectRepository(db_session)


# ---- Sample data fixtures ----


@pytest.fixture
def sample_project_create() -> ProjectCreate:
    """Standard project creation data."""
    return ProjectCreate(
        name="My New Project",
        description="A detailed description of the project.",
    )


@pytest.fixture
def sample_project_update() -> ProjectUpdate:
    """Standard project update data."""
    return ProjectUpdate(
        name="Updated Project Name",
        description="Updated description.",
    )


@pytest.fixture
def sample_project(admin_user: CurrentUser) -> Project:
    """A pre-built Project model owned by the admin user."""
    return make_project(owner_id=admin_user.id, name="Admin's Project")


@pytest.fixture
def sample_project_owned_by_pm(pm_user: CurrentUser) -> Project:
    """A pre-built Project model owned by the PM user."""
    return make_project(owner_id=pm_user.id, name="PM's Project")

