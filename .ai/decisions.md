# AI Decision Log — PMT Repository

This file records all architectural and structural decisions made during AI-assisted development sessions. Entries are appended chronologically. Do not modify or delete existing entries.

---

## [2026-02-21 00:00] — Initial Repository Architecture Scaffolding

**Context:** Blank repository required complete project structure for a production-grade Project Management Tool supporting user auth, RBAC, projects, sprints, tasks, scorecards, analytics, and future AI integrations.

**Decision:** Implemented a domain-driven modular monolith with strict layer separation (routers → services → repositories → models) on the backend, and feature-based module organization on the frontend.

**Alternatives considered:**
- Microservices from day one — Rejected. Premature complexity for current team size and feature set. The modular monolith is designed for future extraction.
- Django + DRF — Rejected. FastAPI provides better async support, native Pydantic integration, and auto-generated OpenAPI docs.
- Redux for frontend state — Rejected. Zustand is sufficient for the minimal client-side state. Server state is managed by React Query.
- Layer-based frontend (components/, pages/, hooks/) — Rejected. Feature-based organization provides better encapsulation and enables independent feature development.

**Consequences:**
- All domain modules are independently extractable into microservices.
- Cross-domain communication is constrained to domain events.
- Frontend features are self-contained and can be lazy-loaded.
- The AI module is isolated and can be swapped or extracted without touching core logic.

**Files affected:** 248 files created across 79 directories (initial scaffold).

---

## [2026-02-21 00:01] — Architecture Review and Structural Refinement

**Context:** Post-scaffold architecture review identified 16 structural weaknesses, including missing domain events, no CI/CD pipeline, no ADRs, missing Next.js middleware auth guard, and incomplete schema/test coverage.

**Decision:** Applied 16 structural fixes:
1. Added `core/events.py` and `core/event_bus.py` for domain event communication.
2. Added `models/associations.py` for M2M tables (prevents circular imports).
3. Added `models/mixins.py` for TimestampMixin and SoftDeleteMixin.
4. Clarified `db/base.py` vs `db/base_class.py` responsibilities.
5. Added missing Pydantic schemas for Notification and Attachment.
6. Added `workers/` module for background task processing.
7. Added `utils/seed.py` for development data seeding.
8. Added `src/middleware.ts` for Next.js Edge Runtime auth guard.
9. Added `src/app/providers.tsx` for React provider composition.
10. Added `shared/auth-guard.tsx` and `shared/role-gate.tsx`.
11. Added `types/api.ts` and `types/analytics.ts`.
12. Added missing frontend services (notification, user).
13. Added `.github/workflows/ci.yml` and `deploy.yml`.
14. Added `.github/pull_request_template.md`.
15. Added `docs/adr/` with sample ADRs.
16. Added missing test files for sprints and scorecards + E2E directory.

**Alternatives considered:** None — these were gap-fill corrections, not design alternatives.

**Consequences:** Structure increased from 216 → 248 files. All identified architectural gaps are addressed. CI/CD pipeline ensures automated quality gates.

**Files affected:** 32 files added, 2 files modified.

---

## [2026-02-21 00:02] — AI Engineering Governance Document

**Context:** AI-assisted development requires explicit guardrails to prevent structural drift, architectural violations, and compounding technical debt.

**Decision:** Created `.ai/system.md` defining 15 prohibited behaviors, 5 architectural invariants, decision logging requirements, database modification discipline, refactoring policies, and memory externalization rules.

**Alternatives considered:**
- Relying on code review alone — Rejected. AI can make changes faster than humans can review. Preemptive guardrails are more effective.
- Embedding rules in CI linting only — Rejected. Structural and architectural rules cannot all be codified as lint rules. Document-based governance supplements automated checks.

**Consequences:** All AI-assisted sessions must read `.ai/system.md` before making structural changes. All decisions must be logged here. Enforcement is through code review, CI, and architecture tests.

**Files affected:** `.ai/system.md`, `.ai/decisions.md`
