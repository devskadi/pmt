# Custom Exception Classes
# ------------------------
# Application-specific exceptions and centralized
# exception handler registration.
#
# Base:
#   AppException(status_code, code, message, details?)
#       Base for all domain exceptions. Maps to API error envelope.
#
# Auth:
#   InvalidCredentialsError    — 401, wrong email/password
#   TokenExpiredError          — 401, JWT expired
#   InsufficientPermissionError — 403, RBAC violation
#
# Resource:
#   NotFoundError(resource, id)    — 404, entity not found
#   AlreadyExistsError(resource, field) — 409, unique constraint violation
#   ValidationError(details)       — 422, business rule violation
#
# Rate Limiting:
#   RateLimitExceededError         — 429, too many requests
#
# Handler Registration:
#   register_exception_handlers(app: FastAPI) -> None
#       Registers handlers that convert exceptions to the standard
#       error envelope format defined in docs/api-conventions.md.
#
# Placeholder — implementation pending.
