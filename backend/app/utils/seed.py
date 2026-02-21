"""Database seed script for local development.

Usage:
    python -m app.utils.seed
"""

from __future__ import annotations

import asyncio

from sqlalchemy import select

from app.core.constants import ProjectStatus
from app.db.session import async_session_factory
from app.domains.projects.models import Project

DEV_OWNER_ID = "00000000-0000-0000-0000-000000000001"

SAMPLE_PROJECTS: list[dict[str, str]] = [
    {
        "name": "PMT Platform Hardening",
        "description": "Stabilize Docker runtime, health checks, and CI pipeline.",
    },
    {
        "name": "PMT Frontend Integration",
        "description": "Wire core dashboard pages to live backend APIs.",
    },
    {
        "name": "PMT Analytics v1",
        "description": "Prepare analytics contract and initial dashboard metrics.",
    },
]


async def seed_projects() -> int:
    """Insert sample projects if they do not already exist."""
    created = 0
    async with async_session_factory() as session:
        for project in SAMPLE_PROJECTS:
            existing = await session.scalar(
                select(Project.id).where(Project.name == project["name"])
            )
            if existing:
                continue

            session.add(
                Project(
                    name=project["name"],
                    description=project["description"],
                    status=ProjectStatus.ACTIVE.value,
                    owner_id=DEV_OWNER_ID,
                )
            )
            created += 1

        await session.commit()

    return created


async def main() -> None:
    created = await seed_projects()
    print(f"seeded_projects={created}")


if __name__ == "__main__":
    asyncio.run(main())
