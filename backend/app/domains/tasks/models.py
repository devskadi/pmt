# Task Models
# -----------
# SQLAlchemy models owned by the tasks domain.
#
# Table: tasks
# Fields:
#   id           — UUID, PK
#   project_id   — UUID, FK -> projects.id, indexed
#   sprint_id    — UUID, FK -> sprints.id, nullable, indexed
#   assignee_id  — UUID, FK -> users.id, nullable, indexed
#   reporter_id  — UUID, FK -> users.id, not null
#   key          — str, unique (e.g., "PMT-42")
#   title        — str, not null
#   description  — text, nullable
#   status       — Enum(BACKLOG, TODO, IN_PROGRESS, IN_REVIEW, DONE), default=BACKLOG
#   priority     — Enum(CRITICAL, HIGH, MEDIUM, LOW), default=MEDIUM
#   type         — Enum(BUG, FEATURE, TASK, STORY, EPIC), default=TASK
#   story_points — int, nullable
#   due_date     — date, nullable
#   tags         — JSONB, default=[]
#   created_at   — datetime (TimestampMixin)
#   updated_at   — datetime (TimestampMixin)
#   deleted_at   — datetime, nullable (SoftDeleteMixin)
#
# Composite indexes:
#   (project_id, status)    — board queries
#   (assignee_id)           — my-tasks queries
#   (sprint_id)             — sprint backlog queries
#
# Table: comments
# Fields:
#   id         — UUID, PK
#   task_id    — UUID, FK -> tasks.id, indexed
#   author_id  — UUID, FK -> users.id
#   body       — text, not null
#   created_at — datetime (TimestampMixin)
#   updated_at — datetime (TimestampMixin)
#
# Table: attachments
# Fields:
#   id           — UUID, PK
#   task_id      — UUID, FK -> tasks.id, indexed
#   uploader_id  — UUID, FK -> users.id
#   filename     — str, not null
#   file_url     — str, not null
#   content_type — str, not null
#   size_bytes   — int, not null
#   created_at   — datetime (TimestampMixin)
#
# Placeholder — implementation pending.
