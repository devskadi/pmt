# Project Models
# --------------
# SQLAlchemy models owned by the projects domain.
#
# Table: projects
# Fields:
#   id          — UUID, PK
#   name        — str, not null
#   key         — str, unique, indexed (e.g., "PMT", "ACME")
#   description — text, nullable
#   status      — Enum(ACTIVE, ARCHIVED), default=ACTIVE
#   owner_id    — UUID, FK -> users.id
#   created_at  — datetime (TimestampMixin)
#   updated_at  — datetime (TimestampMixin)
#   deleted_at  — datetime, nullable (SoftDeleteMixin)
#
# Table: project_members (association)
# Fields:
#   id          — UUID, PK
#   project_id  — UUID, FK -> projects.id
#   user_id     — UUID, FK -> users.id
#   role        — Enum(ADMIN, PM, DEVELOPER, VIEWER)
#   joined_at   — datetime
#
# Unique constraint: (project_id, user_id)
#
# Placeholder — implementation pending.
