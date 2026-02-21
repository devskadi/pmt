# Auth Service
# ------------
# Business logic for authentication and authorization.
#
# Methods:
#   login(credentials: LoginRequest) -> TokenPair
#   register(data: RegisterRequest) -> TokenPair
#   refresh_token(refresh: str) -> TokenPair
#   logout(refresh: str) -> None
#   forgot_password(email: str) -> None
#   reset_password(token: str, new_password: str) -> None
#   verify_token(token: str) -> TokenPayload
#
# Dependencies:
#   - users domain (via repository interface for user lookup)
#   - core.security (password hashing, JWT creation)
#   - core.event_bus (publish AuthEvents)
#
# Cross-domain rule: Auth reads users via UserRepository interface.
# It MUST NOT import users.service directly.
#
# Placeholder — implementation pending.
