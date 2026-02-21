# Auth Repository
# ---------------
# Data access for auth-specific entities (refresh tokens, reset tokens).
#
# Methods:
#   store_refresh_token(user_id, token, expires_at) -> None
#   revoke_refresh_token(token: str) -> None
#   get_refresh_token(token: str) -> RefreshToken | None
#   store_reset_token(user_id, token, expires_at) -> None
#   consume_reset_token(token: str) -> ResetToken | None
#   cleanup_expired_tokens() -> int
#
# Note: This repository does NOT handle user persistence.
# User lookup goes through users.repository.
#
# Placeholder — implementation pending.
