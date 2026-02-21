# ADR 0003: Repository Pattern for Data Access

## Status
Accepted

## Context
We need a consistent data access strategy that:
- Separates business logic from query mechanics
- Makes services testable with mock repositories
- Supports future database changes (e.g., read replicas)
- Enables clean extraction to microservices

## Decision
Implement a generic `BaseRepository` with CRUD operations.
Each domain entity gets a dedicated repository extending the base.
Services compose repositories — never access SQLAlchemy sessions directly.

## Consequences
**Positive:**
- Services are testable without a database
- Query logic is centralized and reusable
- Easy to add caching layer between service and repository
- Clean extraction boundary for future microservices

**Negative:**
- Additional layer of abstraction (more files)
- Complex queries may fight the repository pattern
- Risk of "repository bloat" with too many custom methods

**Mitigation:**
- Allow repositories to expose `query()` for complex, one-off queries
- Keep repository methods focused on aggregate roots
- Review for method proliferation during code reviews
