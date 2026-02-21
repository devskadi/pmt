# API Versioning Strategy

> Governing document for API evolution, deprecation, and backward compatibility.

---

## 1. URL Structure

All API endpoints are versioned via URL prefix:

```
/api/v1/{domain}/{resource}
```

### Current Version: `v1`

The `v1` prefix is applied at the router aggregator level (`api/v1/__init__.py`), not within individual domain routers. This ensures domain routers remain version-agnostic internally.

### Router Registration Pattern

```python
# api/v1/__init__.py
api_v1_router = APIRouter(prefix="/api/v1")

api_v1_router.include_router(auth_router,          prefix="/auth",          tags=["auth"])
api_v1_router.include_router(users_router,          prefix="/users",         tags=["users"])
api_v1_router.include_router(projects_router,       prefix="/projects",      tags=["projects"])
api_v1_router.include_router(sprints_router,        prefix="/projects/{project_id}/sprints", tags=["sprints"])
api_v1_router.include_router(tasks_router,          prefix="/tasks",         tags=["tasks"])
api_v1_router.include_router(scorecards_router,     prefix="/scorecards",    tags=["scorecards"])
api_v1_router.include_router(analytics_router,      prefix="/analytics",     tags=["analytics"])
api_v1_router.include_router(ai_router,             prefix="/ai",            tags=["ai"])
api_v1_router.include_router(notifications_router,  prefix="/notifications", tags=["notifications"])
```

---

## 2. When to Create v2

A new version (`v2`) is required ONLY when:

1. **Breaking change to response shape** — removing fields, changing types, restructuring nested objects
2. **Breaking change to request contract** — removing accepted fields, changing validation rules
3. **Breaking change to authentication** — changing token format, auth flow
4. **Semantic change** — same endpoint returns fundamentally different data

### NOT a new version (handled within v1):

- Adding new optional fields to responses ✅
- Adding new optional query parameters ✅
- Adding new endpoints ✅
- Adding new enum values (additive) ✅
- Performance improvements ✅
- Bug fixes ✅

---

## 3. Deprecation Rules

### Timeline

| Phase | Duration | Action |
|-------|----------|--------|
| **Announcement** | T+0 | Add `Deprecation` header, update docs, log warnings |
| **Sunset warning** | T+90 days | Add `Sunset` header with removal date |
| **Removal** | T+180 days | Return 410 Gone with migration guide URL |

### Headers

```http
# Active but deprecated endpoint
Deprecation: true
Sunset: Sat, 01 Mar 2025 00:00:00 GMT
Link: </docs/migration/v1-to-v2>; rel="successor-version"

# Removed endpoint
HTTP/1.1 410 Gone
{
  "error": {
    "code": "ENDPOINT_REMOVED",
    "message": "This endpoint was removed on 2025-03-01. See migration guide.",
    "details": [{ "migration_url": "/docs/migration/v1-to-v2" }]
  }
}
```

### Deprecation Process

1. Create ADR documenting the breaking change and rationale
2. Implement v2 endpoint alongside v1
3. Add deprecation headers to v1
4. Update frontend to use v2
5. Monitor v1 usage in logs
6. Remove v1 after sunset period (180 days minimum)

---

## 4. Backward Compatibility Guarantees

### Within a Version (v1)

| Guarantee | Enforced |
|-----------|----------|
| Response fields are never removed | ✅ |
| Response field types never change | ✅ |
| Required request fields never added | ✅ |
| Error codes are stable | ✅ |
| Pagination format is stable | ✅ |
| Auth flow is stable | ✅ |
| New optional fields may be added | ✅ (additive OK) |
| New endpoints may be added | ✅ |
| New enum values may be added | ✅ |
| Endpoint URLs never change | ✅ |
| Default sort order is stable | ✅ |

### Breaking Change Detection

Before merging any PR that touches API schemas:

1. Compare Pydantic schema `model_json_schema()` output against baseline
2. Check for removed fields, type changes, new required fields
3. If detected → PR must include ADR and version bump plan

---

## 5. Contract Stability Guidelines

### Response Envelope (immutable within version)

```json
{
  "data": { ... },
  "meta": { "page": 1, "per_page": 20, "total": 150, "total_pages": 8 }
}
```

```json
{
  "error": { "code": "...", "message": "...", "details": [...] }
}
```

### Error Codes (additive only)

New error codes can be added. Existing codes must never change semantics.

```
AUTH_INVALID_CREDENTIALS
AUTH_TOKEN_EXPIRED
RESOURCE_NOT_FOUND
RESOURCE_ALREADY_EXISTS
VALIDATION_ERROR
PERMISSION_DENIED
RATE_LIMIT_EXCEEDED
INTERNAL_ERROR
```

### Null Handling

- `null` values are always explicit in JSON responses (never omitted)
- Optional response fields default to `null`, not absent
- This allows clients to safely check for field existence

### Date/Time Format

- All timestamps: ISO 8601 with timezone (`2025-01-15T10:30:00Z`)
- All dates: ISO 8601 (`2025-01-15`)
- Never use Unix timestamps in API responses

---

## 6. OpenAPI Documentation

### Auto-generated from code

FastAPI generates OpenAPI 3.1 schema automatically from:
- Router decorators
- Pydantic schemas
- Dependency injection signatures

### Served at

```
GET /api/v1/docs      → Swagger UI
GET /api/v1/redoc     → ReDoc
GET /api/v1/openapi.json → Raw schema
```

### Schema Versioning

The OpenAPI schema is version-controlled alongside the codebase.
CI pipeline exports and diffs the schema on every PR:

```bash
# In CI
python -c "from app.main import app; import json; print(json.dumps(app.openapi()))" > openapi.json
diff openapi.json openapi.baseline.json
```

---

## 7. Client SDK Considerations (Future)

When the API stabilizes (post-MVP):

1. Generate TypeScript client from OpenAPI schema (`openapi-typescript-codegen`)
2. Publish as npm package for frontend consumption
3. Version the SDK in lockstep with API version
4. This replaces hand-written `frontend/src/services/*.ts`
