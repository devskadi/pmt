# Project Schemas
# ---------------
# Pydantic v2 schemas for the projects domain:
#
#   ProjectCreate      — name, key, description?
#   ProjectUpdate      — name?, description?, status?
#   ProjectRead        — id, name, key, description, status, owner_id, created_at, member_count
#   ProjectSummary     — id, name, key (for embedding)
#   ProjectMemberAdd   — user_id, role
#   ProjectMemberUpdate — role
#   ProjectMemberRead  — user_id, full_name, avatar_url, role, joined_at
#
# Placeholder — implementation pending.
