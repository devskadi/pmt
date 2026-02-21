# Service Extraction Roadmap

**Version:** 1.0.0
**Last updated:** 2026-02-21

This document defines the strategy for decomposing the PMT modular monolith into independent services. Extraction is driven by necessity, not aspiration.

---

## Extraction Principles

1. **Extract when forced, not when bored.** Premature decomposition creates distributed monolith problems without distributed system benefits.
2. **Extract along domain boundaries.** The monolith's module boundaries are the extraction seams.
3. **Event-first migration.** Convert direct calls to domain events before extracting. The extraction itself should be a deployment change, not a code change.
4. **Data ownership follows service ownership.** When a domain is extracted, its database tables move with it.
5. **Shared-nothing between services.** No shared databases, no shared caches, no shared file systems.

---

## Extraction Readiness Criteria

A domain must meet ALL of the following before extraction is justified:

| Criteria | Measurement | Threshold |
|----------|-------------|-----------|
| Independent team | Dedicated engineers | >= 3 engineers on domain |
| Deploy frequency conflict | Blocked deploys per sprint | >= 2 per sprint |
| Scale divergence | Domain needs different scaling profile | CPU/memory requirements differ 3x from monolith average |
| Fault isolation | Domain failures cascade to other domains | >= 1 incident per month |
| Test coverage | Unit + integration coverage | >= 80% |
| Event-driven communication | All inbound calls are via events or API | 100% (no direct imports from other domains) |
| Data isolation | No inbound foreign keys from other domains | 0 inbound FKs |

If fewer than 4 criteria are met, do not extract. Optimize the monolith instead.

---

## 1. AI Module Extraction

**Priority:** First candidate (highest value, lowest coupling)
**Estimated readiness:** Year 2

### Current State

```
backend/app/ai/
├── __init__.py
├── engine.py       # Abstract interface for LLM providers
├── prompts.py      # Prompt templates
└── schemas.py      # AI-specific request/response models
```

### Extraction Path

1. **Phase 1 — Interface stabilization** (current)
   - Define `AIEngine` abstract interface in `engine.py`
   - All AI interactions go through this interface
   - AI module reads from repositories, writes to notifications via events

2. **Phase 2 — Background worker migration**
   - Move all AI processing to Celery worker tasks
   - API requests trigger async AI jobs, not synchronous processing
   - Results delivered via notification events

3. **Phase 3 — Service extraction**
   - Deploy AI module as independent FastAPI service
   - Replace repository access with REST API calls to main backend
   - Replace event publishing with message broker (Redis Streams or RabbitMQ)
   - AI service gets its own database for caching and job tracking

### Preconditions

- [ ] AI engine interface is finalized and stable
- [ ] All AI processing is asynchronous (no sync calls in request path)
- [ ] AI module has zero imports from `core/`, `services/`, or `repositories/`
- [ ] AI schemas are self-contained (no imports from main `schemas/`)
- [ ] AI module has dedicated test suite with >= 80% coverage

### Anti-Patterns to Avoid

- Do not give the AI service direct database access to the main PostgreSQL instance.
- Do not create a shared library between AI service and main backend.
- Do not route AI responses through the main backend — deliver directly to frontend via WebSocket or polling.

---

## 2. Analytics Module Extraction

**Priority:** Second candidate (read-heavy, can use separate data store)
**Estimated readiness:** Year 2-3

### Current State

```
backend/app/api/v1/analytics.py
backend/app/services/analytics_service.py
backend/app/schemas/analytics.py
```

### Extraction Path

1. **Phase 1 — Read replica** (Year 2)
   - Route all analytics queries to PostgreSQL read replica
   - No code changes required — configure at session level

2. **Phase 2 — Materialized views**
   - Create materialized views for dashboard aggregations
   - Refresh via background worker on schedule (every 5 minutes)
   - Analytics endpoints query materialized views, not raw tables

3. **Phase 3 — Dedicated data store** (Year 3)
   - Deploy analytics as independent service
   - Ingest domain events into analytics-optimized store (ClickHouse, TimescaleDB, or BigQuery)
   - Main backend publishes events; analytics service consumes them
   - Frontend analytics dashboard calls analytics service directly

### Preconditions

- [ ] All analytics queries are read-only (no writes to main database)
- [ ] Analytics data can tolerate eventual consistency (5-minute staleness acceptable)
- [ ] Dashboard queries do not join across more than 2 domain tables
- [ ] Analytics schemas are independent of main domain schemas
- [ ] Background refresh worker is operational

### Anti-Patterns to Avoid

- Do not create real-time analytics on the primary database. Use replicas or dedicated stores.
- Do not share the analytics materialized views with the main application. They are owned by analytics.
- Do not optimize the main database schema for analytics queries. Optimize the analytics data store instead.

---

## 3. Auth Module Extraction

**Priority:** Third candidate (extract only if multi-product or SSO is needed)
**Estimated readiness:** Year 3+

### Current State

```
backend/app/api/v1/auth.py
backend/app/services/auth_service.py
backend/app/core/security.py
backend/app/core/permissions.py
backend/app/models/user.py
backend/app/schemas/auth.py
backend/app/schemas/user.py
```

### Extraction Path

1. **Phase 1 — Token standardization** (current)
   - JWT tokens contain only `user_id`, `role`, `exp`
   - Backend validates tokens without database query (stateless)
   - Token refresh uses dedicated endpoint

2. **Phase 2 — OAuth2/OIDC preparation** (Year 2)
   - Implement OAuth2 authorization code flow
   - Support external identity providers (Google, GitHub, SAML)
   - Token format aligns with OIDC claims

3. **Phase 3 — Identity service extraction** (Year 3)
   - Deploy auth as independent service (or adopt managed solution: Auth0, Keycloak, Zitadel)
   - Main backend validates tokens via JWKS endpoint (no shared secret)
   - User profile data is synchronized via events, not shared database
   - Each service validates tokens independently using the public key

### Preconditions

- [ ] JWT validation is stateless (no database query per request)
- [ ] User model has clean separation between auth fields (email, password_hash) and profile fields
- [ ] Permission checks use role claims from token, not database lookups
- [ ] All services can validate tokens independently (JWKS/public key)
- [ ] User creation/update events are published for downstream services

### Anti-Patterns to Avoid

- Do not build a custom identity provider when managed solutions exist.
- Do not store session state on the auth server. Tokens must be self-contained.
- Do not couple user profile data with authentication data. They are separate concerns.

---

## 4. Notification Module Extraction

**Priority:** Fourth candidate (extract when real-time requirements demand it)
**Estimated readiness:** Year 2-3

### Current State

```
backend/app/api/v1/notifications.py
backend/app/services/notification_service.py
backend/app/repositories/notification_repository.py
backend/app/models/notification.py
backend/app/schemas/notification.py
```

### Extraction Path

1. **Phase 1 — Event-driven ingestion** (current)
   - Domain events trigger notification creation
   - No direct service calls from other domains

2. **Phase 2 — WebSocket gateway**
   - Add WebSocket support for real-time notification delivery
   - Backend publishes to Redis pub/sub; WebSocket gateway delivers to clients

3. **Phase 3 — Notification service extraction**
   - Deploy as independent service consuming domain events from message broker
   - Owns its own database for notification storage
   - Manages delivery channels: in-app, email, push (future), Slack (future)
   - WebSocket gateway becomes part of the notification service

### Preconditions

- [ ] All notification creation is event-driven (no synchronous calls)
- [ ] Notification model has no foreign keys pointing to it from other domains
- [ ] Email delivery is already asynchronous (background worker)
- [ ] WebSocket infrastructure is in place

---

## Extraction Timeline Summary

```
Year 1:  ┃ Monolith (optimize, stabilize, ship features)
         ┃
Year 2:  ┃ AI → extract (if LLM compute needs dedicated scaling)
         ┃ Analytics → read replica + materialized views
         ┃ Notifications → WebSocket gateway
         ┃
Year 3:  ┃ Analytics → dedicated service + data store
         ┃ Auth → identity service (if multi-product/SSO needed)
         ┃ Notifications → independent service
         ┃
Year 3+: ┃ Core domains (Projects, Tasks, Sprints) extracted
         ┃ only if team size and deploy conflicts justify it.
```

---

## Global Anti-Patterns

These mistakes are common during extraction and must be avoided:

| Anti-Pattern | Consequence | Prevention |
|-------------|-------------|------------|
| Shared database between services | Coupling at the data layer defeats the purpose of extraction | Each service owns its data. Sync via events. |
| Distributed monolith | Services that must be deployed together | Ensure services have independent deployment pipelines |
| Shared libraries with business logic | Creates hidden coupling | Share only infrastructure utilities (logging, auth validation) |
| Synchronous inter-service calls in request path | Cascading failures, increased latency | Use async events. Synchronous calls only for reads with circuit breakers. |
| Extracting before stabilizing | Moving bugs from one place to two places | Achieve 80% test coverage and stable interfaces before extracting |
| Big-bang extraction | High risk, long development pause | Extract incrementally. Strangler fig pattern. Run both old and new in parallel during migration. |
