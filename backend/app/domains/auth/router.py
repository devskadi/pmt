# Auth Router — /api/v1/auth
# --------------------------
# Endpoints:
#   POST /login          — Authenticate and return JWT pair
#   POST /register       — Create account and return JWT pair
#   POST /refresh        — Rotate access token using refresh token
#   POST /logout         — Invalidate refresh token
#   POST /forgot-password — Send password reset email
#   POST /reset-password  — Consume reset token and set new password
#
# All endpoints are public (no auth required) except /logout.
# Router must be thin — all business logic lives in service.py.
#
# Placeholder — implementation pending.
