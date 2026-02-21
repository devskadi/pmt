# Task Schemas
# ------------
# Pydantic v2 schemas for the tasks domain:
#
# Task:
#   TaskCreate        — title, description?, project_id, sprint_id?, assignee_id?,
#                       priority?, type?, story_points?, due_date?, tags?
#   TaskUpdate        — title?, description?, sprint_id?, assignee_id?,
#                       priority?, type?, story_points?, due_date?, tags?
#   TaskStatusUpdate  — status (validated against state machine)
#   TaskAssign        — assignee_id (nullable for unassign)
#   TaskRead          — all fields + reporter, assignee (summary), comment_count
#   TaskSummary       — id, key, title, status, priority, assignee (summary)
#   TaskFilters       — project_id?, sprint_id?, assignee_id?, status?, priority?, type?, search?
#
# Comment:
#   CommentCreate     — body
#   CommentRead       — id, task_id, author (summary), body, created_at
#
# Attachment:
#   AttachmentRead    — id, task_id, filename, file_url, content_type, size_bytes, created_at
#
# Placeholder — implementation pending.
