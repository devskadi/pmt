# Logging & Error Handling Standard

> Governing document for observability, structured logging, error handling,
> and operational health monitoring.

---

## 1. Health Endpoints

### Liveness — `GET /api/v1/health`

Returns immediately. No dependency checks. Used by container orchestration to detect process hangs.

```json
{
  "status": "alive",
  "version": "0.1.0",
  "timestamp": "2025-01-15T10:30:00Z"
}
```

**Response codes**: `200` always (if process is running).

### Readiness — `GET /api/v1/health/ready`

Checks all critical dependencies. Used by load balancers to route traffic.

```json
{
  "status": "ready",
  "checks": {
    "database": { "status": "healthy", "latency_ms": 2 },
    "redis": { "status": "healthy", "latency_ms": 1 }
  }
}
```

**Response codes**:
- `200` — all checks pass
- `503` — one or more checks fail (status becomes `"degraded"` or `"unhealthy"`)

### Detailed Health — `GET /api/v1/health/detailed` (Admin only)

Includes version info, uptime, connection pool stats. Requires admin JWT.

```json
{
  "status": "ready",
  "version": "0.1.0",
  "uptime_seconds": 86400,
  "python_version": "3.12.0",
  "checks": { ... },
  "pool": {
    "size": 20,
    "checked_in": 18,
    "checked_out": 2,
    "overflow": 0
  }
}
```

---

## 2. Metrics Placeholder

### Current (MVP)

No dedicated metrics endpoint. Health checks provide basic operational status.

### Future (post-MVP)

```
GET /metrics → Prometheus-compatible metrics
```

Planned metrics:
- `http_requests_total{method, path, status}` — Counter
- `http_request_duration_seconds{method, path}` — Histogram
- `db_connections_active` — Gauge
- `db_query_duration_seconds{query_type}` — Histogram
- `auth_login_attempts_total{result}` — Counter
- `tasks_created_total{project}` — Counter

Implementation via `prometheus-fastapi-instrumentator` or custom middleware.

---

## 3. Structured Logging Standard

### Library: `structlog`

All logs are structured JSON objects in production, human-readable in development.

### Configuration

```python
# app/core/logging.py
structlog.configure(
    processors=[
        structlog.contextvars.merge_contextvars,
        structlog.processors.add_log_level,
        structlog.processors.TimeStamper(fmt="iso"),
        structlog.processors.StackInfoRenderer(),
        structlog.processors.format_exc_info,
        # Development: ConsoleRenderer
        # Production: JSONRenderer
    ],
    wrapper_class=structlog.make_filtering_bound_logger(logging.INFO),
)
```

### Log Levels

| Level | Usage |
|-------|-------|
| `DEBUG` | Detailed diagnostic info (disabled in production) |
| `INFO` | Normal operational events (request completed, task created) |
| `WARNING` | Unexpected but recoverable (rate limit approached, deprecated endpoint used) |
| `ERROR` | Failed operation that needs attention (DB timeout, external API failure) |
| `CRITICAL` | System-level failure (cannot connect to DB, out of memory) |

### Standard Log Fields

Every log entry MUST include:

| Field | Source | Example |
|-------|--------|---------|
| `timestamp` | Auto (structlog) | `"2025-01-15T10:30:00.123Z"` |
| `level` | Auto (structlog) | `"info"` |
| `event` | Developer | `"request_completed"` |
| `request_id` | RequestIDMiddleware | `"550e8400-e29b-41d4-a716-446655440000"` |
| `user_id` | Auth middleware | `"123e4567-e89b-12d3-a456-426614174000"` or `null` |
| `method` | Request | `"POST"` |
| `path` | Request | `"/api/v1/tasks"` |
| `status_code` | Response | `201` |
| `latency_ms` | Computed | `45` |
| `domain` | Developer | `"tasks"` |

### Example Log Output (Production JSON)

```json
{
  "timestamp": "2025-01-15T10:30:00.123Z",
  "level": "info",
  "event": "request_completed",
  "request_id": "550e8400-e29b-41d4-a716-446655440000",
  "user_id": "123e4567-e89b-12d3-a456-426614174000",
  "method": "POST",
  "path": "/api/v1/tasks",
  "status_code": 201,
  "latency_ms": 45,
  "domain": "tasks"
}
```

### Logging Rules

1. **Never log PII** — no passwords, tokens, email addresses in logs
2. **Never log request/response bodies** by default (opt-in per endpoint)
3. **Redact sensitive headers** — `Authorization`, `Cookie`, `X-API-Key`
4. **Use structured fields** — never format strings into log messages
5. **One log per request** — middleware logs completion, not individual operations
6. **Domain services may log** at DEBUG level for diagnostic purposes
7. **Error logs must include** traceback and contextual data (entity IDs, action attempted)

---

## 4. Request ID Middleware Pattern

### Flow

```
Client Request
  │
  ▼
┌──────────────────────┐
│ RequestIDMiddleware   │
│  1. Check X-Request-ID header
│  2. If missing: generate UUID4
│  3. Inject into request.state.request_id
│  4. Bind to structlog contextvars
│  5. Add X-Request-ID to response
└──────────────────────┘
  │
  ▼
Application Logic (request_id available via contextvars)
  │
  ▼
Response (includes X-Request-ID header)
```

### Access in Code

```python
# In any domain service:
import structlog
logger = structlog.get_logger()

async def create_task(self, data):
    # request_id is automatically included in all log entries
    logger.info("task_created", task_id=str(task.id), project_id=str(data.project_id))
```

### Frontend Integration

The frontend Axios client should:
1. Generate a `X-Request-ID` header for every API call
2. Log it alongside the request in browser console
3. Include it in error reports sent to monitoring

---

## 5. Error Handling Strategy

### Exception Hierarchy

```
AppException (base)
├── AuthenticationError (401)
│   ├── InvalidCredentialsError
│   ├── TokenExpiredError
│   └── TokenInvalidError
├── AuthorizationError (403)
│   └── InsufficientPermissionError
├── NotFoundError (404)
├── ConflictError (409)
│   └── AlreadyExistsError
├── ValidationError (422)
│   └── BusinessRuleError
├── RateLimitError (429)
└── InternalError (500)
```

### Error Response Format

All errors follow the standard envelope:

```json
{
  "error": {
    "code": "RESOURCE_NOT_FOUND",
    "message": "Task with ID 'abc-123' not found",
    "details": [
      { "field": "task_id", "value": "abc-123" }
    ],
    "request_id": "550e8400-e29b-41d4-a716-446655440000"
  }
}
```

### Handler Registration

```python
# Registered in app/main.py during startup
@app.exception_handler(AppException)
async def app_exception_handler(request, exc):
    return JSONResponse(
        status_code=exc.status_code,
        content={"error": {
            "code": exc.code,
            "message": exc.message,
            "details": exc.details,
            "request_id": request.state.request_id,
        }}
    )

@app.exception_handler(Exception)
async def unhandled_exception_handler(request, exc):
    logger.error("unhandled_exception", exc_info=exc)
    return JSONResponse(
        status_code=500,
        content={"error": {
            "code": "INTERNAL_ERROR",
            "message": "An unexpected error occurred",
            "request_id": request.state.request_id,
        }}
    )
```

### Error Logging Rules

| Status Code | Log Level | Details |
|-------------|-----------|---------|
| 4xx | `WARNING` | Log code, path, user_id. No traceback. |
| 500 (AppException) | `ERROR` | Log full traceback + context. |
| 500 (unhandled) | `CRITICAL` | Log full traceback + request details. Alert. |

---

## 6. Log Aggregation (Future)

### Production Stack (post-MVP)

```
Application → structlog (JSON) → stdout → Docker log driver → CloudWatch/ELK/Loki
```

### Development

```
Application → structlog (console) → terminal output
```

### Correlation

All logs for a single request can be traced via `request_id`:

```bash
# Search all logs for a specific request
grep "550e8400-e29b-41d4-a716-446655440000" /var/log/pmt/*.log
```
