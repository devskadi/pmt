# PMT — Architectural Map

**Version:** 1.0.0
**Last updated:** 2026-02-21

---

## 1. System Overview

PMT is a modular monolith designed for agile project management. The system consists of two deployable units — a backend API and a frontend application — backed by PostgreSQL and Redis.

```
                    ┌─────────────────────────────────┐
                    │         Load Balancer            │
                    └──────────┬──────────────────────┘
                               │
              ┌────────────────┴────────────────┐
              │                                 │
     ┌────────▼────────┐              ┌─────────▼────────┐
     │    Frontend      │              │     Backend       │
     │  (Next.js 15)    │──── REST ───>│   (FastAPI)       │
     │  Port 3000       │              │   Port 8000       │
     └─────────────────┘              └────────┬──────────┘
                                               │
                                  ┌────────────┴──────────┐
                                  │                       │
                           ┌──────▼──────┐         ┌──────▼──────┐
                           │ PostgreSQL  │         │   Redis     │
                           │  Port 5432  │         │  Port 6379  │
                           └─────────────┘         └─────────────┘
```

---

## 2. Domain Inventory

Each domain is a bounded context within the monolith. Domains own their models, schemas, services, and repositories.

| Domain | Owner | Responsibility | Extractable |
|--------|-------|---------------|-------------|
| **Auth** | Platform | Authentication, JWT lifecycle, password management | Yes — OAuth2/OIDC microservice |
| **Users** | Platform | User profiles, role management, preferences | Partially — coupled to auth |
| **Projects** | Core | Project CRUD, membership, settings | Yes — project service |
| **Sprints** | Core | Sprint lifecycle, planning, completion | Yes — with projects |
| **Tasks** | Core | Task CRUD, status transitions, assignments, comments | Yes — task service |
| **Scorecards** | Core | Evaluation criteria, weighted scoring, rankings | Yes — evaluation service |
| **Analytics** | Intelligence | Dashboard aggregations, burndown, velocity, performance | Yes — analytics service |
| **Notifications** | Platform | In-app notifications, delivery, read tracking | Yes — notification service |
| **AI** | Intelligence | LLM integrations, insights, predictions, recommendations | Yes — AI microservice |
| **Activity Log** | Platform | Audit trail, change tracking, entity history | Yes — event store |

---

## 3. Domain Dependency Graph

```
Auth ←──── Users
              │
              ├───> Projects ──> Sprints ──> Tasks
              │         │                      │
              │         └──> Scorecards        ├──> Comments
              │                                ├──> Attachments
              │                                └──> Activity Log
              │
              └───> Notifications

AI ──reads──> Tasks, Sprints, Scorecards, Analytics
AI ──writes──> Notifications (insights delivery)

Analytics ──reads──> Tasks, Sprints, Projects, Scorecards
```

### Dependency Rules

1. Arrows indicate allowed dependency direction.
2. Reverse dependencies are prohibited.
3. `AI` and `Analytics` are read-only consumers of core domain data.
4. `AI` may write only to `Notifications` (to deliver insights).
5. `Activity Log` is a write-only sink — it receives events but is never queried by other domains (only by analytics and audit endpoints).

---

## 4. Backend Layer Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        HTTP Layer                            │
│  api/v1/*.py — Route handlers, request parsing, auth guards │
└──────────────────────────┬──────────────────────────────────┘
                           │ Depends()
┌──────────────────────────▼──────────────────────────────────┐
│                      Service Layer                           │
│  services/*_service.py — Business rules, orchestration,      │
│  domain event publishing, cross-domain coordination          │
└──────────────────────────┬──────────────────────────────────┘
                           │ Composition
┌──────────────────────────▼──────────────────────────────────┐
│                    Repository Layer                           │
│  repositories/*_repository.py — Data access, query building, │
│  pagination, filtering. Owns SQLAlchemy session interaction.  │
└──────────────────────────┬──────────────────────────────────┘
                           │ ORM
┌──────────────────────────▼──────────────────────────────────┐
│                      Model Layer                             │
│  models/*.py — SQLAlchemy ORM models, relationships,         │
│  column definitions. No logic beyond property accessors.     │
└─────────────────────────────────────────────────────────────┘
```

### Layer Rules

| Layer | May Import | Must Not Import |
|-------|-----------|-----------------|
| Router | Services, Schemas, Core | Repositories, Models, DB |
| Service | Repositories, Schemas, Core, Events | Routers, DB session directly |
| Repository | Models, DB session, Core | Services, Routers, Schemas |
| Model | SQLAlchemy, Mixins | Everything else |

---

## 5. Frontend Layer Architecture

```
┌──────────────────────────────────────────────────────────┐
│                      App Router                           │
│  app/**/*.tsx — Pages, layouts, route groups.             │
│  Thin: imports from features, calls services.            │
└────────────────────────┬─────────────────────────────────┘
                         │ imports
┌────────────────────────▼─────────────────────────────────┐
│                   Feature Modules                         │
│  features/*/  — Self-contained domain UI.                │
│  Each has: components/, hooks/, schemas/, index.ts       │
└────────────────────────┬─────────────────────────────────┘
                         │ uses
┌────────────────────────▼─────────────────────────────────┐
│                  Shared Infrastructure                     │
│  components/ui/  — Atomic design primitives              │
│  components/layout/ — Structural layout                  │
│  components/shared/ — Cross-feature composites           │
│  lib/ — API client, utils, constants, query config       │
│  hooks/ — Global reusable hooks                          │
│  types/ — Shared TypeScript interfaces                   │
│  services/ — API endpoint wrappers                       │
│  store/ — Zustand state management                       │
└──────────────────────────────────────────────────────────┘
```

### Import Direction

```
app/ → features/ → components/ + lib/ + services/ + store/
```

Reverse imports are prohibited. `components/ui/` must never import from `features/`.

---

## 6. Cross-Domain Interaction Policy

### Allowed Patterns

| Pattern | When to Use | Example |
|---------|-------------|---------|
| Domain Events | Side effects triggered by domain actions | `TaskStatusChanged` → NotificationService creates notification |
| Service Composition | One service needs data from another domain | `AnalyticsService` calls `TaskRepository` (read-only) |
| Shared Schemas | Multiple domains need the same data shape | `PaginatedResponse`, `ErrorResponse` |

### Prohibited Patterns

| Pattern | Why Prohibited |
|---------|---------------|
| Direct repository cross-import | Breaks domain encapsulation |
| Shared mutable state between domains | Creates hidden coupling |
| Synchronous cascading service calls | Creates fragile call chains |
| Domain A writing to Domain B's tables | Violates data ownership |

---

## 7. Extraction Philosophy

The modular monolith is designed so that any domain can be extracted into an independent microservice when scale or team structure demands it.

### Preconditions for Extraction

A domain is ready for extraction when:
1. It has zero reverse dependencies (no other domain imports from it directly).
2. All inbound communication is via domain events or REST API calls.
3. Its repository layer can be swapped for an API client without changing the service layer.
4. It has independent test coverage (unit + integration) at 80%+.
5. Its data model has no foreign keys pointing INTO it from other domains (only outward FKs or event-based references).

### Extraction is NOT justified when:
- The domain has fewer than 3 engineers working on it concurrently.
- The domain's latency requirements are met by the monolith.
- Network latency between extracted services would degrade UX.
- The operational overhead of a new service exceeds the coupling cost.

---

## 8. Scalability Assumptions

| Dimension | Year 1 | Year 2 | Year 3 |
|-----------|--------|--------|--------|
| Users | 1,000 | 10,000 | 100,000+ |
| Concurrent sessions | 100 | 1,000 | 10,000 |
| Projects | 100 | 5,000 | 50,000 |
| Tasks | 10,000 | 500,000 | 5,000,000 |
| API requests/second | 10 | 100 | 1,000 |
| Database size | 1 GB | 50 GB | 500 GB |

### Year 1 Architecture

Monolith. Single PostgreSQL. Redis for caching and sessions. Sufficient for 1K users.

### Year 2 Inflection Points

- Read replicas for PostgreSQL (analytics queries on replica).
- Redis caching layer in repository pattern.
- Background worker queue (Celery) for email, AI, reports.
- CDN for frontend static assets.

### Year 3 Extraction Candidates

- AI module → independent service with its own compute.
- Analytics → read-optimized service with materialized views or data warehouse.
- Auth → OAuth2/OIDC provider (if multi-product or SSO needed).
- Notifications → event-driven service with WebSocket gateway.

---

## 9. Constraints and Invariants

These are non-negotiable system properties:

1. **Single source of truth:** PostgreSQL is the authoritative data store. Redis is ephemeral.
2. **Stateless backend:** No server-side session storage. All state is in JWT tokens or the database.
3. **Idempotent writes:** All PUT and PATCH operations must be idempotent.
4. **Audit completeness:** Every state change on tasks, projects, and sprints must produce an activity log entry.
5. **Backward compatibility:** API changes must not break existing clients within the same major version.
6. **Data isolation:** No shared database tables between domains. Association tables are explicit and owned by the relationship initiator.
7. **Fail-safe defaults:** Missing configuration must cause startup failure, not silent fallback to insecure defaults.
