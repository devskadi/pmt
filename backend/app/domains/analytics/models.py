# Analytics Models
# ----------------
# SQLAlchemy models owned by the analytics domain.
#
# Table: activity_logs
# Fields:
#   id          — UUID, PK
#   user_id     — UUID, FK -> users.id, indexed
#   entity_type — str, not null (e.g., "task", "project", "sprint")
#   entity_id   — UUID, not null
#   action      — str, not null (e.g., "created", "updated", "deleted", "status_changed")
#   changes     — JSONB, nullable (before/after diff)
#   metadata    — JSONB, nullable (extra context)
#   created_at  — datetime (TimestampMixin)
#
# Composite indexes:
#   (entity_type, entity_id)   — entity history queries
#   (user_id, created_at)      — user activity feed
#
# Placeholder — implementation pending.
