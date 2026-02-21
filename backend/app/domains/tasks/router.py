# Tasks Router — /api/v1/tasks
# ----------------------------
# Endpoints:
#   POST   /                         — Create task
#   GET    /                         — List tasks (global, filtered)
#   GET    /{id}                     — Get task details
#   PATCH  /{id}                     — Update task
#   DELETE /{id}                     — Soft-delete task
#   PATCH  /{id}/status              — Transition task status
#   PATCH  /{id}/assign              — Assign/reassign task
#   POST   /{id}/comments            — Add comment
#   GET    /{id}/comments            — List comments
#   POST   /{id}/attachments         — Upload attachment
#   GET    /{id}/attachments         — List attachments
#   DELETE /{id}/attachments/{aid}   — Remove attachment
#
# Placeholder — implementation pending.
