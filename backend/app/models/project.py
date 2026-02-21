# Project Model
# -------------
# Fields: id, name, description, key (unique slug),
#         status (enum: ACTIVE/ARCHIVED/ON_HOLD),
#         owner_id (FK → users), start_date, end_date,
#         created_at, updated_at
#
# Relationships: sprints, tasks, members (M2M → users),
#                scorecards
#
# Placeholder — implementation pending.
