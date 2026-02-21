# API Design Conventions

## URL Structure

```
/api/v1/{resource}              — Collection
/api/v1/{resource}/{id}         — Individual
/api/v1/{resource}/{id}/{sub}   — Nested sub-resource
```

## HTTP Methods

| Method | Purpose | Idempotent |
|--------|---------|------------|
| GET    | Read    | Yes        |
| POST   | Create  | No         |
| PATCH  | Partial update | Yes |
| PUT    | Full replace | Yes   |
| DELETE | Remove  | Yes        |

## Response Envelope

All responses follow a consistent shape:

```json
{
  "data": { ... },
  "meta": {
    "page": 1,
    "per_page": 20,
    "total": 150,
    "total_pages": 8
  }
}
```

Error responses:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Human-readable message",
    "details": [ ... ]
  }
}
```

## Pagination

- Cursor-based for feeds (activity, notifications)
- Offset-based for tabular data (tasks, projects)
- Default page size: 20, max: 100

## Authentication

- Bearer JWT in `Authorization` header
- Access token: 30 min TTL
- Refresh token: 7 day TTL (HTTP-only cookie)

## Rate Limiting

- 100 requests/minute per authenticated user
- 20 requests/minute for unauthenticated endpoints
- Headers: `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`
