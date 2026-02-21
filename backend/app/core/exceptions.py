# Custom Exception Classes
# ------------------------
# Application-specific exceptions and centralized
# exception handler registration.

from __future__ import annotations

from typing import Any

from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse


# ---- Base Exception ----


class AppException(Exception):
    """Base exception for all application errors."""

    status_code: int = 500
    code: str = "INTERNAL_ERROR"
    message: str = "An unexpected error occurred"

    def __init__(
        self,
        message: str | None = None,
        *,
        code: str | None = None,
        status_code: int | None = None,
        details: list[dict[str, Any]] | None = None,
    ) -> None:
        self.message = message or self.__class__.message
        self.code = code or self.__class__.code
        self.status_code = status_code or self.__class__.status_code
        self.details = details
        super().__init__(self.message)


# ---- Auth Exceptions (401) ----


class AuthenticationError(AppException):
    status_code = 401
    code = "AUTHENTICATION_ERROR"
    message = "Authentication required"


class InvalidCredentialsError(AuthenticationError):
    code = "INVALID_CREDENTIALS"
    message = "Invalid email or password"


class TokenExpiredError(AuthenticationError):
    code = "TOKEN_EXPIRED"
    message = "Token has expired"


class TokenInvalidError(AuthenticationError):
    code = "TOKEN_INVALID"
    message = "Token is invalid"


# ---- Authorization Exceptions (403) ----


class AuthorizationError(AppException):
    status_code = 403
    code = "AUTHORIZATION_ERROR"
    message = "Insufficient permissions"


class InsufficientPermissionError(AuthorizationError):
    code = "PERMISSION_DENIED"
    message = "You do not have permission to perform this action"


# ---- Resource Exceptions (404, 409) ----


class NotFoundError(AppException):
    status_code = 404
    code = "RESOURCE_NOT_FOUND"
    message = "Resource not found"

    def __init__(self, resource: str, identifier: str | None = None) -> None:
        detail = f"{resource} not found"
        if identifier:
            detail = f"{resource} with ID '{identifier}' not found"
        super().__init__(
            message=detail,
            details=[{"resource": resource, "id": identifier}] if identifier else None,
        )


class AlreadyExistsError(AppException):
    status_code = 409
    code = "RESOURCE_ALREADY_EXISTS"
    message = "Resource already exists"

    def __init__(self, resource: str, field: str, value: str) -> None:
        super().__init__(
            message=f"{resource} with {field} '{value}' already exists",
            details=[{"resource": resource, "field": field, "value": value}],
        )


# ---- Validation Exceptions (422) ----


class BusinessRuleError(AppException):
    status_code = 422
    code = "BUSINESS_RULE_VIOLATION"
    message = "Business rule violation"


# ---- Rate Limiting (429) ----


class RateLimitExceededError(AppException):
    status_code = 429
    code = "RATE_LIMIT_EXCEEDED"
    message = "Too many requests. Please try again later."


# ---- Exception Handler Registration ----


def register_exception_handlers(app: FastAPI) -> None:
    """Register centralized exception handlers on the FastAPI app."""

    @app.exception_handler(AppException)
    async def app_exception_handler(request: Request, exc: AppException) -> JSONResponse:
        return JSONResponse(
            status_code=exc.status_code,
            content={
                "error": {
                    "code": exc.code,
                    "message": exc.message,
                    "details": exc.details,
                    "request_id": getattr(request.state, "request_id", None),
                }
            },
        )

    @app.exception_handler(Exception)
    async def unhandled_exception_handler(request: Request, exc: Exception) -> JSONResponse:
        # In production, log the full traceback but return a generic message.
        # Structured logging will capture exc_info via middleware.
        return JSONResponse(
            status_code=500,
            content={
                "error": {
                    "code": "INTERNAL_ERROR",
                    "message": "An unexpected error occurred",
                    "request_id": getattr(request.state, "request_id", None),
                }
            },
        )

