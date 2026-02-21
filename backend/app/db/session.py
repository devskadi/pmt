# Database Session
# ----------------
# AsyncSession factory and get_db dependency.

from collections.abc import AsyncGenerator

from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine

from app.core.config import get_settings

settings = get_settings()

engine = create_async_engine(
    settings.DATABASE_URL,
    echo=settings.DEBUG,
    pool_size=5 if not settings.is_production else 20,
    max_overflow=5 if not settings.is_production else 10,
    pool_timeout=30 if not settings.is_production else 10,
    pool_recycle=3600 if not settings.is_production else 1800,
    pool_pre_ping=True,
)

async_session_factory = async_sessionmaker(
    engine,
    class_=AsyncSession,
    expire_on_commit=False,
)


async def get_db() -> AsyncGenerator[AsyncSession, None]:
    """Yield an async database session.

    Auto-commits on success, rolls back on exception.
    Used as a FastAPI dependency.
    """
    async with async_session_factory() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise

