# Sprint Model
# ------------
# SQLAlchemy model owned by the sprints domain.
#
# Table: sprints
# Fields:
#   id          — UUID, PK
#   project_id  — UUID, FK -> projects.id, indexed
#   name        — str, not null
#   goal        — text, nullable
#   status      — Enum(PLANNING, ACTIVE, COMPLETED), default=PLANNING
#   start_date  — date, nullable
#   end_date    — date, nullable
#   created_at  — datetime (TimestampMixin)
#   updated_at  — datetime (TimestampMixin)
#
# Relationships:
#   project     — M:1 -> projects
#   tasks       — 1:M backref from tasks domain
#
# Placeholder — implementation pending.
