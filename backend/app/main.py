# FastAPI Application Factory
# --------------------------
# Initializes the FastAPI app, registers routers,
# middleware, exception handlers, and CORS.

from __future__ import annotations

from contextlib import asynccontextmanager
from typing import AsyncGenerator

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.v1 import api_router
from app.core.config import get_settings
from app.core.exceptions import register_exception_handlers


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator[None, None]:
    """Application lifespan: startup and shutdown events."""
    # Startup
    settings = get_settings()
    # Future: initialize DB engine pool, warm caches, etc.
    yield
    # Shutdown
    # Future: dispose DB engine, flush logs, etc.


def create_app() -> FastAPI:
    """Application factory.

    Returns a fully-configured FastAPI instance.
    """
    settings = get_settings()

    app = FastAPI(
        title=settings.APP_NAME,
        version=settings.APP_VERSION,
        docs_url="/api/docs" if not settings.is_production else None,
        redoc_url="/api/redoc" if not settings.is_production else None,
        openapi_url="/api/openapi.json" if not settings.is_production else None,
        lifespan=lifespan,
    )

    # ---- Exception handlers ----
    register_exception_handlers(app)

    # ---- Middleware ----
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.CORS_ORIGINS,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    # Future: RequestIDMiddleware, LoggingMiddleware, RateLimiterMiddleware

    # ---- Routers ----
    app.include_router(api_router)

    # ---- Health endpoint ----
    @app.get("/health", tags=["Health"])
    async def health_check() -> dict[str, str]:
        return {"status": "healthy", "version": settings.APP_VERSION}

    return app


app = create_app()
