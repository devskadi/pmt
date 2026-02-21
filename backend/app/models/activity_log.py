# Activity Log Model
# ------------------
# Fields: id, entity_type, entity_id, action (enum:
#         CREATED/UPDATED/DELETED/STATUS_CHANGED),
#         changes (JSON diff), actor_id (FK),
#         created_at
#
# Purpose: Full audit trail for compliance and
#          analytics. Feeds the activity feed UI and
#          future AI insight pipelines.
#
# Placeholder — implementation pending.
