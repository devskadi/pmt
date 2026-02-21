# Test Configuration
# ------------------
# Shared fixtures: test DB session, authenticated client,
# factory functions, test data builders.

from __future__ import annotations

import asyncio
import uuid
from collections.abc import AsyncGenerator, Generator
from typing import Any
from unittest.mock import AsyncMock, MagicMock

import pytest
import pytest_asyncio
from fastapi import FastAPI
from httpx import ASGITransport, AsyncClient
from sqlalchemy.ext.asyncio import (
    AsyncSession,
    async_sessionmaker,
    create_async_engine,
)

from app.core.config import Settings, get_settings
from app.core.constants import Role
from app.core.dependencies import CurrentUser, get_current_user
from app.db.base import Base
from app.main import create_app


# ---- Test settings override ----


def get_test_settings() -> Settings:
    """Return settings configured for testing."""
    return Settings(
        ENVIRONMENT="test",
        DATABASE_URL="sqlite+aiosqlite:///:memory:",
        SECRET_KEY="test-secret-key",
        DEBUG=True,
    )


# ---- Event loop fixture ----


@pytest.fixture(scope="session")
def event_loop() -> Generator[asyncio.AbstractEventLoop, None, None]:
    """Create a session-scoped event loop for async tests."""
    loop = asyncio.new_event_loop()
    yield loop
    loop.close()


# ---- Database fixtures ----


@pytest_asyncio.fixture
async def async_engine():
    """Create an in-memory SQLite engine for testing."""
    engine = create_async_engine(
        "sqlite+aiosqlite:///:memory:",
        echo=False,
    )
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield engine
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
    await engine.dispose()


@pytest_asyncio.fixture
async def db_session(async_engine) -> AsyncGenerator[AsyncSession, None]:
    """Provide a transactional database session for each test."""
    session_factory = async_sessionmaker(
        bind=async_engine,
        class_=AsyncSession,
        expire_on_commit=False,
    )
    async with session_factory() as session:
        yield session
        await session.rollback()


# ---- User fixtures ----


@pytest.fixture
def admin_user() -> CurrentUser:
    """Admin user for testing."""
    return CurrentUser(
        id=str(uuid.uuid4()),
        role=Role.ADMIN,
    )


@pytest.fixture
def pm_user() -> CurrentUser:
    """Project Manager user for testing."""
    return CurrentUser(
        id=str(uuid.uuid4()),
        role=Role.PM,
    )


@pytest.fixture
def developer_user() -> CurrentUser:
    """Developer user for testing."""
    return CurrentUser(
        id=str(uuid.uuid4()),
        role=Role.DEVELOPER,
    )


@pytest.fixture
def viewer_user() -> CurrentUser:
    """Viewer user for testing."""
    return CurrentUser(
        id=str(uuid.uuid4()),
        role=Role.VIEWER,
    )


# ---- App & client fixtures ----


@pytest_asyncio.fixture
async def app(async_engine) -> FastAPI:
    """Create a test FastAPI application."""
    application = create_app()
    application.dependency_overrides[get_settings] = get_test_settings
    return application


@pytest_asyncio.fixture
async def client(app: FastAPI, admin_user: CurrentUser) -> AsyncGenerator[AsyncClient, None]:
    """Async HTTP client with admin authentication."""
    app.dependency_overrides[get_current_user] = lambda: admin_user
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        yield ac


@pytest_asyncio.fixture
async def pm_client(app: FastAPI, pm_user: CurrentUser) -> AsyncGenerator[AsyncClient, None]:
    """Async HTTP client with PM authentication."""
    app.dependency_overrides[get_current_user] = lambda: pm_user
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        yield ac


@pytest_asyncio.fixture
async def viewer_client(app: FastAPI, viewer_user: CurrentUser) -> AsyncGenerator[AsyncClient, None]:
    """Async HTTP client with Viewer authentication."""
    app.dependency_overrides[get_current_user] = lambda: viewer_user
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        yield ac

