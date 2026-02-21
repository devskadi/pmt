# Scorecard Model
# ---------------
# SQLAlchemy model owned by the scorecards domain.
#
# Table: scorecards
# Fields:
#   id          — UUID, PK
#   project_id  — UUID, FK -> projects.id, indexed
#   sprint_id   — UUID, FK -> sprints.id, nullable, indexed
#   evaluator_id — UUID, FK -> users.id (who created the evaluation)
#   subject_id  — UUID, FK -> users.id, nullable (who is being evaluated)
#   title       — str, not null
#   criteria    — JSONB, not null (array of {name, weight, score, notes})
#   total_score — float, not null (computed from criteria)
#   notes       — text, nullable
#   created_at  — datetime (TimestampMixin)
#   updated_at  — datetime (TimestampMixin)
#
# Placeholder — implementation pending.
