# Auth Schemas
# ------------
# Pydantic v2 schemas for the auth domain:
#
#   LoginRequest      — email, password
#   RegisterRequest   — email, password, full_name
#   TokenPair         — access_token, refresh_token, token_type, expires_in
#   TokenPayload      — sub (user_id), role, exp, iat, jti
#   RefreshRequest    — refresh_token
#   ForgotPasswordRequest — email
#   ResetPasswordRequest  — token, new_password
#
# Placeholder — implementation pending.
