# Architecture Review Checklist

Use this checklist when reviewing any PR that involves structural changes, new modules, database modifications, or infrastructure changes.

---

## 1. Architectural Integrity

- [ ] No reverse dependencies between layers (Router ← Service ← Repository ← Model)
- [ ] No direct imports across domain boundaries (use events or service composition)
- [ ] New files are placed in the correct directory per the established structure
- [ ] No business logic in router files (routers are thin — validation and delegation only)
- [ ] No data access logic in service files (services delegate to repositories)
- [ ] No business logic in repository files (repositories are query builders only)
- [ ] No logic in model files beyond property accessors and relationship definitions
- [ ] API endpoints are versioned under `/api/v1/`
- [ ] Frontend feature modules expose public API through `index.ts` only

## 2. Domain Boundary Integrity

- [ ] New cross-domain interaction uses domain events, not direct imports
- [ ] No domain writes to another domain's database tables
- [ ] Association tables are explicitly defined in `models/associations.py`
- [ ] Shared data shapes use `schemas/common.py` or `types/common.ts`
- [ ] AI module does not import from core domain services (read-only access via repositories)
- [ ] Activity log entries are created for all state changes on core entities

## 3. Database Review

- [ ] Model changes are accompanied by an Alembic migration
- [ ] Migration includes both `upgrade()` and `downgrade()` functions
- [ ] New columns are nullable or have default values (no breaking changes to existing data)
- [ ] Foreign keys have explicit `ondelete` behavior (CASCADE, SET NULL, or RESTRICT)
- [ ] New indexes are justified with a performance rationale in migration docstring
- [ ] No unbounded queries (all collection queries have LIMIT)
- [ ] No N+1 query patterns (eager loading or explicit joins used)
- [ ] JSON/JSONB columns have their expected structure documented in model file header
- [ ] `docs/database-schema.md` is updated if ER relationships changed
- [ ] `db/base_class.py` imports new models for Alembic detection

## 4. API Contract Review

- [ ] New endpoints follow REST conventions (see `docs/api-conventions.md`)
- [ ] Request schemas use Pydantic v2 with proper validation
- [ ] Response schemas do not leak internal model fields (password hashes, etc.)
- [ ] Error responses follow the standard envelope format
- [ ] Pagination is implemented for all collection endpoints
- [ ] Authentication is required for all non-public endpoints
- [ ] Role-based access is enforced via `core/permissions.py`
- [ ] New required fields on existing schemas have migration path for existing clients

## 5. AI Module Isolation

- [ ] AI module changes do not modify files outside `app/ai/`
- [ ] AI module does not import from `core/security.py` or `core/dependencies.py`
- [ ] AI-specific schemas are in `ai/schemas.py`, not in `schemas/`
- [ ] LLM API keys are accessed via `core/config.py`, not hardcoded
- [ ] AI processing is asynchronous (background worker, not blocking request)
- [ ] AI outputs are validated before being stored or returned to users

## 6. Frontend Architecture

- [ ] New components are placed in correct directory (ui/ vs layout/ vs shared/ vs feature/)
- [ ] UI components (`components/ui/`) have no business logic or API calls
- [ ] Feature components import only from their own feature directory or shared infrastructure
- [ ] New pages follow the App Router convention with proper layouts
- [ ] State management uses Zustand for client state, React Query for server state
- [ ] Zod schemas validate all form inputs
- [ ] TypeScript `any` types are not used (or have explicit justification comments)
- [ ] New types are added to `types/` (global) or `features/*/types/` (feature-specific)

## 7. Infrastructure Review

- [ ] Docker Compose changes include health checks for new services
- [ ] Port numbers are configurable via environment variables
- [ ] Dockerfile changes maintain multi-stage build pattern
- [ ] Base image versions are pinned (not using `latest` tag)
- [ ] `docker-compose.prod.yml` is updated to match `docker-compose.yml` changes
- [ ] Environment variables are added to `.env.example` files
- [ ] Secrets are not committed (check `.gitignore` covers new sensitive files)

## 8. Scalability Validation

- [ ] Database queries per request are <= 3 (aim for 1-2)
- [ ] Bulk operations use batch processing, not iteration
- [ ] Cache-aside pattern is considered for read-heavy data
- [ ] Background processing is used for operations > 500ms
- [ ] No synchronous external API calls in request path (use workers)
- [ ] Pagination uses cursor-based for feeds, offset-based for tables

## 9. Testing

- [ ] New service methods have corresponding unit tests
- [ ] New API endpoints have corresponding integration tests
- [ ] Test factories are updated for new models
- [ ] Tests do not depend on execution order
- [ ] Tests clean up after themselves (no leaked state)
- [ ] Critical path tests exist (auth flow, task creation, sprint lifecycle)

## 10. Governance Compliance

- [ ] Decision logged in `.ai/decisions.md` (if structural change)
- [ ] ADR created in `docs/adr/` (if architectural decision)
- [ ] `README.md` project structure section updated (if directory structure changed)
- [ ] No prohibited behaviors from `system.md` Section 2 are violated
- [ ] Technical debt is tracked with `TODO(PMT-XXX)` format
