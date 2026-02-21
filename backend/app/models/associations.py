# Association Tables
# ------------------
# SQLAlchemy M2M association tables:
#   - project_members (projects ↔ users, with role column)
#   - task_tags (tasks ↔ tags, if tags become a first-class entity)
#
# Keeping associations separate from domain models
# prevents circular import issues and makes
# relationships explicit.
#
# Placeholder — implementation pending.
