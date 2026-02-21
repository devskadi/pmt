# Auth Models
# -----------
# SQLAlchemy models owned by the auth domain:
#
#   RefreshToken — id, user_id (FK), token_hash, expires_at,
#                  revoked_at, created_at
#   PasswordResetToken — id, user_id (FK), token_hash,
#                        expires_at, consumed_at, created_at
#
# These models are auth-specific and distinct from the User model
# which is owned by the users domain.
#
# Placeholder — implementation pending.
