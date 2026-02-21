# AI Engineering Governance — PMT Repository

**Version:** 1.0.0
**Effective:** 2026-02-21
**Scope:** All AI-assisted development within this repository (GitHub Copilot, Claude, GPT, or any LLM-based coding agent).

---

## Why This Exists

This repository follows a domain-driven modular monolith architecture designed for long-term scalability, service extraction, and investor-grade technical due diligence. Unconstrained AI assistance introduces structural drift, architectural violations, and compounding technical debt that degrades the system faster than manual development.

This document defines enforceable guardrails for any AI assistant operating within this codebase. Compliance is mandatory. Violations must be caught during code review.

---

## 1. Architectural Invariants

The following invariants must never be violated. No exception. No shortcut.

### 1.1 Layered Dependency Rule

```
Routers → Services → Repositories → Models
```

- Routers must never import repositories or models directly.
- Services must never import routers.
- Repositories must never import services or routers.
- Models must never import from any other layer.
- The `ai/` module must never be imported by `core/`, `db/`, or `models/`.

### 1.2 Domain Boundary Rule

Each domain module (users, projects, tasks, sprints, scorecards, analytics, notifications) must not directly import from another domain's internal files.

Cross-domain communication must use one of:
- Domain events via `core/event_bus.py`
- Service-layer composition via dependency injection
- Shared schemas from `schemas/common.py`

Direct cross-domain repository calls are prohibited.

### 1.3 Schema Separation Rule

- SQLAlchemy models (`models/`) define database structure only. No business logic.
- Pydantic schemas (`schemas/`) define API contracts only. No ORM dependencies.
- Frontend TypeScript types (`types/`) define client contracts only. No runtime validation.
- Zod schemas (`features/*/schemas/`) define client-side validation only.

These four layers must never be merged or conflated.

### 1.4 API Versioning Rule

All API endpoints must live under `/api/v1/`. No endpoint may be created outside a versioned namespace. When breaking changes are required, a new version directory (`api/v2/`) must be created. Existing versions must not be modified in backward-incompatible ways.

### 1.5 Frontend Feature Isolation Rule

Feature modules under `features/` must expose their public API exclusively through `index.ts`. No file outside the feature directory may import from a feature's internal `components/`, `hooks/`, or `schemas/` directly.

---

## 2. Prohibited Behaviors

The following actions are explicitly prohibited for any AI assistant operating in this repository:

| ID | Prohibition | Reason |
|----|-------------|--------|
| P1 | Creating files outside the established directory structure | Prevents structural drift |
| P2 | Merging two architectural layers into a single file | Violates separation of concerns |
| P3 | Adding ORM queries inside router files | Routers are thin — delegation only |
| P4 | Adding business logic inside repository files | Repositories are data access only |
| P5 | Importing from `app.db.session` in any file except `core/dependencies.py` | Session lifecycle is managed via DI |
| P6 | Creating circular imports between domain modules | Breaks extraction capability |
| P7 | Adding `pip install` or `npm install` commands without updating requirements/package.json | Dependency tracking must be explicit |
| P8 | Modifying `docker-compose.yml` without updating `docker-compose.prod.yml` | Environments must stay synchronized |
| P9 | Modifying database models without creating an Alembic migration | Schema and migrations must be in lockstep |
| P10 | Adding global mutable state outside Zustand stores (frontend) | State management must be centralized |
| P11 | Using `any` type in TypeScript without explicit justification comment | Type safety is non-negotiable |
| P12 | Removing or renaming files without updating all import references | Broken imports are deployment failures |
| P13 | Creating "util" or "helper" files at arbitrary locations | Utilities belong in `utils/` (backend) or `lib/` (frontend) only |
| P14 | Implementing authentication logic outside `core/security.py` and `services/auth_service.py` | Auth must be centralized |
| P15 | Accessing environment variables outside `core/config.py` (backend) or `lib/env.ts` (frontend) | Config must be validated and centralized |

---

## 3. Decision Logging Requirements

Every architectural decision, structural change, or significant implementation choice must be logged.

### 3.1 Decision Log Location

All decisions must be appended to:

```
.ai/decisions.md
```

### 3.2 Decision Log Format

```markdown
## [YYYY-MM-DD HH:MM] — Decision Title

**Context:** Why this decision was needed.
**Decision:** What was decided.
**Alternatives considered:** What was rejected and why.
**Consequences:** What this enables or constrains.
**Files affected:** List of files created, modified, or deleted.
```

### 3.3 Mandatory Decision Triggers

A decision log entry is required when:

- A new domain module is created
- A new dependency is added to requirements or package.json
- A database model is created or modified
- An API endpoint contract changes
- A new middleware is added
- The Docker configuration changes
- A new feature module is created on the frontend
- An architectural pattern is introduced or changed
- A file is moved or renamed

---

## 4. Database Modification Discipline

### 4.1 Model Changes

- Every model change must be accompanied by an Alembic migration.
- Migrations must be reversible (both `upgrade()` and `downgrade()` must be implemented).
- Column additions must have sensible defaults or be nullable.
- Column removals must go through a deprecation cycle: mark as deprecated → stop writing → stop reading → remove.
- Index changes must include a performance justification in the migration docstring.

### 4.2 Schema Evolution

- New required fields on existing API schemas must have a migration path for existing clients.
- Breaking schema changes require a new API version.
- Optional fields are always preferred over required fields for backward compatibility.

### 4.3 Data Integrity

- All foreign keys must have explicit `ondelete` behavior defined (CASCADE, SET NULL, or RESTRICT).
- Composite unique constraints must be documented in `docs/database-schema.md`.
- JSON/JSONB columns must have their expected structure documented in the model file header.

---

## 5. Docker and Infrastructure Discipline

- `docker-compose.yml` is for local development only. Production overrides go in `docker-compose.prod.yml`.
- New services added to Docker Compose must include health checks.
- Port numbers must be configurable via environment variables with sensible defaults.
- Volume mounts must never expose sensitive directories.
- Dockerfile changes must maintain the multi-stage build pattern.
- Base image versions must be pinned (e.g., `python:3.12-slim`, not `python:3-slim`).

---

## 6. Refactoring Policy

### 6.1 When Refactoring Is Permitted

- When a file exceeds 300 lines (backend) or 250 lines (frontend).
- When a function exceeds 50 lines.
- When a module has more than 5 direct dependencies on other modules.
- When test coverage for a module drops below 70%.
- When duplicate code is identified across 3 or more locations.

### 6.2 Refactoring Constraints

- Refactoring must not change external behavior (API contracts, database schema, or component props).
- Refactoring must not be combined with feature changes in the same commit.
- Refactoring must be logged in `.ai/decisions.md`.
- Large refactors (affecting 10+ files) must be broken into sequential, independently reviewable steps.

### 6.3 Anti-Overengineering Principle

Do not introduce:
- Abstract base classes unless there are 3+ concrete implementations.
- Generic type parameters unless there are 2+ distinct usages.
- New design patterns unless the current approach has a documented, measurable problem.
- Configuration-driven behavior unless there are 3+ variants that justify it.

The simplest correct solution is the best solution.

---

## 7. Scalability Mindset

When making implementation decisions, consider the following scale targets:

| Metric | Target |
|--------|--------|
| Concurrent users | 10,000 |
| Total users | 100,000+ |
| Projects per organization | 1,000 |
| Tasks per project | 10,000 |
| API response time (p95) | < 200ms |
| Database queries per request | <= 3 (aim for 1-2) |

### 7.1 Performance Constraints

- N+1 queries are prohibited. Use eager loading or explicit joins.
- Unbounded queries (no LIMIT) are prohibited on any collection endpoint.
- Bulk operations must use batch processing, not iteration.
- Cache-aside pattern should be used for read-heavy, rarely-changing data.
- WebSocket connections must be considered for real-time features (notifications, board updates).

---

## 8. Technical Debt Containment

### 8.1 Debt Tracking

Technical debt must be tracked as `TODO` comments with the following format:

```python
# TODO(PMT-XXX): Description of debt — [severity: low|medium|high]
```

```typescript
// TODO(PMT-XXX): Description of debt — [severity: low|medium|high]
```

Where `PMT-XXX` is a ticket reference. Orphaned TODOs (without ticket references) are prohibited.

### 8.2 Debt Limits

- No more than 5 high-severity TODOs may exist at any time.
- Medium-severity TODOs must be resolved within 2 sprints.
- Low-severity TODOs must be resolved within 4 sprints or explicitly accepted in an ADR.

---

## 9. Memory Externalization Policy

AI assistants do not have persistent memory across sessions. All context must be externalized.

### 9.1 Required External Memory Files

| File | Purpose |
|------|---------|
| `.ai/system.md` | This governance document |
| `.ai/decisions.md` | Chronological decision log |
| `docs/adr/` | Formal Architecture Decision Records |
| `docs/database-schema.md` | Current ER diagram and index strategy |
| `docs/api-conventions.md` | API design standards |
| `README.md` | Project overview and setup |

### 9.2 Context Loading

At the start of any AI-assisted session involving architectural decisions, the following files must be read before making changes:
1. `.ai/system.md` (this file)
2. `.ai/decisions.md`
3. The relevant domain's model, schema, service, and repository files

### 9.3 Context Persistence

At the end of any AI-assisted session that makes structural changes:
1. Append to `.ai/decisions.md`
2. Update `docs/database-schema.md` if models changed
3. Update `README.md` project structure section if directory structure changed

---

## 10. Response Format Expectations

When an AI assistant provides recommendations or changes:

### 10.1 For Code Changes

- State which files will be modified before making changes.
- Explain why the change is necessary (not just what it does).
- Identify which architectural layer is affected.
- Confirm no invariants from Section 1 are violated.

### 10.2 For Unclear Context

When context is insufficient to make a safe decision:

1. State what information is missing.
2. State what assumptions would be required.
3. State the risk of each assumption.
4. Do not proceed until context is clarified.

Guessing is prohibited. Asking is mandatory.

### 10.3 For Multi-File Changes

- List all affected files before starting.
- Group changes by domain module.
- Apply changes in dependency order (models → schemas → repositories → services → routers).
- Verify no circular dependencies are introduced.

---

## 11. Enforcement

This document is enforced through:

1. **Code review** — Reviewers must verify compliance with Sections 1-2.
2. **CI pipeline** — Linting and type checking catch structural violations.
3. **Architecture tests** — Import dependency rules should be codified as tests.
4. **Decision audit** — `.ai/decisions.md` is reviewed during sprint retrospectives.

Violations discovered in production are treated as incidents and require a postmortem entry in `.ai/decisions.md`.

---

## Appendix: File Ownership Map

| Directory | Owner | Authority |
|-----------|-------|-----------|
| `backend/app/core/` | Platform team | Config, security, DI changes require senior review |
| `backend/app/db/` | Platform team | Schema changes require migration + senior review |
| `backend/app/models/` | Domain team | Must coordinate with schema and migration owners |
| `backend/app/api/v1/` | API team | Contract changes require version bump discussion |
| `backend/app/ai/` | AI team | Isolated module — changes must not leak into core |
| `frontend/src/app/` | Frontend team | Route changes require navigation review |
| `frontend/src/components/ui/` | Design system team | Changes affect all features |
| `frontend/src/features/` | Feature teams | Self-contained — changes stay within feature boundary |
| `docker-compose*.yml` | DevOps | Infrastructure changes require staging validation |
| `.github/workflows/` | DevOps | Pipeline changes require senior review |
| `docs/` | All teams | Documentation is everyone's responsibility |
