# Task Model
# ----------
# Fields: id, title, description, project_id (FK),
#         sprint_id (FK, nullable), assignee_id (FK),
#         reporter_id (FK), status (enum: BACKLOG/TODO/
#         IN_PROGRESS/IN_REVIEW/DONE), priority (enum:
#         CRITICAL/HIGH/MEDIUM/LOW), story_points,
#         due_date, tags (JSON), created_at, updated_at
#
# Relationships: project, sprint, assignee, reporter,
#                comments, attachments, activity_logs
#
# Placeholder — implementation pending.
