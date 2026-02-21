# Health Check Router — /api/v1/health
# -------------------------------------
# Infrastructure endpoint — NOT domain-owned.
# Lives in api/v1/ because it's a cross-cutting operational concern.
#
# Endpoints:
#   GET /health          — Basic liveness check (returns 200)
#   GET /health/ready    — Readiness check (DB connectivity, Redis ping)
#   GET /health/detailed — Detailed health (admin only, includes versions, uptime)
#
# Response:
#   { "status": "healthy", "version": "x.y.z", "timestamp": "..." }
#   { "status": "degraded", "checks": { "db": "healthy", "redis": "unhealthy" } }
#
# Placeholder — implementation pending.
