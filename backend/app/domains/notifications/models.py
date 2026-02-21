# Notification Model
# ------------------
# SQLAlchemy model owned by the notifications domain.
#
# Table: notifications
# Fields:
#   id          — UUID, PK
#   user_id     — UUID, FK -> users.id, indexed
#   type        — str, not null (e.g., "task_assigned", "comment_added", "sprint_started")
#   title       — str, not null
#   body        — text, nullable
#   entity_type — str, nullable (e.g., "task", "sprint")
#   entity_id   — UUID, nullable (for deep linking)
#   is_read     — bool, default=False
#   created_at  — datetime (TimestampMixin)
#
# Composite index: (user_id, is_read, created_at DESC)
#
# Placeholder — implementation pending.
