# ADR 0001: Use FastAPI for Backend

## Status
Accepted

## Context
We need a Python web framework that supports:
- Async I/O for high concurrency
- Automatic OpenAPI documentation
- Native Pydantic integration for validation
- Easy dependency injection
- Strong typing support

## Decision
Use FastAPI as the backend framework.

## Consequences
**Positive:**
- Auto-generated Swagger/ReDoc documentation
- Native async/await support with asyncpg
- Pydantic v2 integration for request/response validation
- FastAPI Depends() provides clean DI without external libraries
- Strong community and ecosystem

**Negative:**
- Smaller ecosystem than Django for admin/ORM batteries
- Team must manage SQLAlchemy configuration manually
- No built-in admin panel (would need separate solution)

**Mitigation:**
- SQLAlchemy 2.0 async provides mature ORM capabilities
- Alembic handles migrations reliably
- Admin panel can be added later via FastAPI-Admin or custom dashboard
