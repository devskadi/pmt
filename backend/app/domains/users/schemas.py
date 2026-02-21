# User Schemas
# ------------
# Pydantic v2 schemas for the users domain:
#
#   UserBase        — email, full_name (shared fields)
#   UserCreate      — email, password, full_name
#   UserUpdate      — full_name?, avatar_url? (self-service)
#   AdminUserUpdate — role?, is_active? (admin only)
#   UserRead        — id, email, full_name, avatar_url, role, is_active, created_at
#   UserSummary     — id, full_name, avatar_url (for embedding in other responses)
#   UserProfile     — UserRead + project_count, task_count
#
# Placeholder — implementation pending.
