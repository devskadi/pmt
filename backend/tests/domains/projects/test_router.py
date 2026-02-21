# Integration tests for projects API endpoints
# Tests /api/v1/projects routes including create, list, detail, update, delete,
# and RBAC enforcement at the HTTP level.

from __future__ import annotations

import uuid
from unittest.mock import AsyncMock, patch

import pytest
import pytest_asyncio
from httpx import AsyncClient

from app.core.constants import ProjectStatus


# ============================================================
# POST /api/v1/projects — Create
# ============================================================


class TestCreateProjectEndpoint:
    """Integration tests for POST /api/v1/projects."""

    @pytest.mark.asyncio
    async def test_create_project_success(self, client: AsyncClient):
        """Admin should be able to create a project via API."""
        response = await client.post(
            "/api/v1/projects/",
            json={"name": "API Test Project", "description": "Created via API"},
        )

        assert response.status_code == 201
        data = response.json()
        assert data["name"] == "API Test Project"
        assert data["description"] == "Created via API"
        assert "id" in data

    @pytest.mark.asyncio
    async def test_create_project_without_description(self, client: AsyncClient):
        """Should create a project with null description."""
        response = await client.post(
            "/api/v1/projects/",
            json={"name": "No Desc Project"},
        )

        assert response.status_code == 201
        data = response.json()
        assert data["description"] is None

    @pytest.mark.asyncio
    async def test_create_project_validation_error_empty_name(self, client: AsyncClient):
        """Should reject project creation with empty name."""
        response = await client.post(
            "/api/v1/projects/",
            json={"name": ""},
        )

        assert response.status_code == 422

    @pytest.mark.asyncio
    async def test_create_project_validation_error_missing_name(self, client: AsyncClient):
        """Should reject project creation without name field."""
        response = await client.post(
            "/api/v1/projects/",
            json={"description": "No name provided"},
        )

        assert response.status_code == 422

    @pytest.mark.asyncio
    async def test_create_project_viewer_forbidden(self, viewer_client: AsyncClient):
        """Viewer should receive 403 when creating a project."""
        response = await viewer_client.post(
            "/api/v1/projects/",
            json={"name": "Viewer's Attempt"},
        )

        assert response.status_code == 403


# ============================================================
# GET /api/v1/projects — List
# ============================================================


class TestListProjectsEndpoint:
    """Integration tests for GET /api/v1/projects."""

    @pytest.mark.asyncio
    async def test_list_projects_empty(self, client: AsyncClient):
        """Should return empty paginated response when no projects exist."""
        response = await client.get("/api/v1/projects/")

        assert response.status_code == 200
        data = response.json()
        assert data["items"] == []
        assert data["meta"]["total"] == 0

    @pytest.mark.asyncio
    async def test_list_projects_with_pagination(self, client: AsyncClient):
        """Should respect pagination parameters."""
        # Create a few projects first
        for i in range(3):
            await client.post(
                "/api/v1/projects/",
                json={"name": f"List Project {i}"},
            )

        response = await client.get("/api/v1/projects/?page=1&per_page=2")

        assert response.status_code == 200
        data = response.json()
        assert len(data["items"]) == 2
        assert data["meta"]["total"] == 3
        assert data["meta"]["per_page"] == 2

    @pytest.mark.asyncio
    async def test_list_projects_page_2(self, client: AsyncClient):
        """Should return correct items for page 2."""
        for i in range(3):
            await client.post(
                "/api/v1/projects/",
                json={"name": f"Page Project {i}"},
            )

        response = await client.get("/api/v1/projects/?page=2&per_page=2")

        assert response.status_code == 200
        data = response.json()
        assert len(data["items"]) == 1


# ============================================================
# GET /api/v1/projects/{id} — Detail
# ============================================================


class TestGetProjectEndpoint:
    """Integration tests for GET /api/v1/projects/{id}."""

    @pytest.mark.asyncio
    async def test_get_project_success(self, client: AsyncClient):
        """Should return project details by ID."""
        create_resp = await client.post(
            "/api/v1/projects/",
            json={"name": "Detail Project", "description": "Get me"},
        )
        project_id = create_resp.json()["id"]

        response = await client.get(f"/api/v1/projects/{project_id}")

        assert response.status_code == 200
        data = response.json()
        assert data["id"] == project_id
        assert data["name"] == "Detail Project"

    @pytest.mark.asyncio
    async def test_get_project_not_found(self, client: AsyncClient):
        """Should return 404 for non-existent project ID."""
        fake_id = str(uuid.uuid4())
        response = await client.get(f"/api/v1/projects/{fake_id}")

        assert response.status_code == 404


# ============================================================
# PUT /api/v1/projects/{id} — Update
# ============================================================


class TestUpdateProjectEndpoint:
    """Integration tests for PUT /api/v1/projects/{id}."""

    @pytest.mark.asyncio
    async def test_update_project_name(self, client: AsyncClient):
        """Should update project name."""
        create_resp = await client.post(
            "/api/v1/projects/",
            json={"name": "Before Update"},
        )
        project_id = create_resp.json()["id"]

        response = await client.put(
            f"/api/v1/projects/{project_id}",
            json={"name": "After Update"},
        )

        assert response.status_code == 200
        assert response.json()["name"] == "After Update"

    @pytest.mark.asyncio
    async def test_update_project_status_to_archived(self, client: AsyncClient):
        """Should allow status transition to archived."""
        create_resp = await client.post(
            "/api/v1/projects/",
            json={"name": "Archive Me"},
        )
        project_id = create_resp.json()["id"]

        response = await client.put(
            f"/api/v1/projects/{project_id}",
            json={"status": "archived"},
        )

        assert response.status_code == 200
        assert response.json()["status"] == "archived"

    @pytest.mark.asyncio
    async def test_update_nonexistent_project(self, client: AsyncClient):
        """Should return 404 for updating non-existent project."""
        fake_id = str(uuid.uuid4())
        response = await client.put(
            f"/api/v1/projects/{fake_id}",
            json={"name": "Ghost Update"},
        )

        assert response.status_code == 404

    @pytest.mark.asyncio
    async def test_update_project_viewer_forbidden(self, viewer_client: AsyncClient, client: AsyncClient):
        """Viewer should receive 403 when updating a project."""
        create_resp = await client.post(
            "/api/v1/projects/",
            json={"name": "Admin's Project"},
        )
        project_id = create_resp.json()["id"]

        response = await viewer_client.put(
            f"/api/v1/projects/{project_id}",
            json={"name": "Viewer Attempt"},
        )

        assert response.status_code == 403


# ============================================================
# DELETE /api/v1/projects/{id} — Soft Delete
# ============================================================


class TestDeleteProjectEndpoint:
    """Integration tests for DELETE /api/v1/projects/{id}."""

    @pytest.mark.asyncio
    async def test_delete_project_success(self, client: AsyncClient):
        """Should soft-delete and return 204."""
        create_resp = await client.post(
            "/api/v1/projects/",
            json={"name": "Delete Me"},
        )
        project_id = create_resp.json()["id"]

        response = await client.delete(f"/api/v1/projects/{project_id}")

        assert response.status_code == 204

    @pytest.mark.asyncio
    async def test_deleted_project_not_found_on_get(self, client: AsyncClient):
        """Soft-deleted project should return 404 on subsequent GET."""
        create_resp = await client.post(
            "/api/v1/projects/",
            json={"name": "Gone Project"},
        )
        project_id = create_resp.json()["id"]

        await client.delete(f"/api/v1/projects/{project_id}")

        response = await client.get(f"/api/v1/projects/{project_id}")
        assert response.status_code == 404

    @pytest.mark.asyncio
    async def test_delete_nonexistent_project(self, client: AsyncClient):
        """Should return 404 for deleting non-existent project."""
        fake_id = str(uuid.uuid4())
        response = await client.delete(f"/api/v1/projects/{fake_id}")

        assert response.status_code == 404

    @pytest.mark.asyncio
    async def test_deleted_project_excluded_from_list(self, client: AsyncClient):
        """Soft-deleted project should not appear in list results."""
        create_resp = await client.post(
            "/api/v1/projects/",
            json={"name": "Will Be Deleted"},
        )
        project_id = create_resp.json()["id"]

        await client.delete(f"/api/v1/projects/{project_id}")

        list_resp = await client.get("/api/v1/projects/")
        items = list_resp.json()["items"]
        ids = [item["id"] for item in items]
        assert project_id not in ids


# ============================================================
# RESPONSE FORMAT
# ============================================================


class TestResponseFormat:
    """Tests for response envelope and schema compliance."""

    @pytest.mark.asyncio
    async def test_create_response_has_all_fields(self, client: AsyncClient):
        """Create response should include all ProjectResponse fields."""
        response = await client.post(
            "/api/v1/projects/",
            json={"name": "Schema Test", "description": "Testing schema"},
        )

        data = response.json()
        required_fields = {"id", "name", "description", "status", "owner_id", "created_at", "updated_at"}
        assert required_fields.issubset(data.keys())

    @pytest.mark.asyncio
    async def test_list_response_pagination_meta(self, client: AsyncClient):
        """List response should include pagination metadata."""
        response = await client.get("/api/v1/projects/")

        data = response.json()
        assert "items" in data
        assert "meta" in data
        meta = data["meta"]
        assert "page" in meta
        assert "per_page" in meta
        assert "total" in meta
        assert "total_pages" in meta

    @pytest.mark.asyncio
    async def test_health_endpoint(self, client: AsyncClient):
        """Health endpoint should return status and version."""
        response = await client.get("/health")

        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "healthy"
        assert "version" in data

