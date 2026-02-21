# Users Router — /api/v1/users
# -----------------------------
# Endpoints:
#   GET    /me          — Current user profile
#   PATCH  /me          — Update own profile
#   GET    /            — List users (admin, PM)
#   GET    /{id}        — Get user by ID (admin, PM)
#   PATCH  /{id}        — Update user (admin only)
#   DELETE /{id}        — Soft-delete user (admin only)
#
# Router must be thin — all business logic lives in service.py.
#
# Placeholder — implementation pending.
