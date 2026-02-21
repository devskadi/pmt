# User Model
# ----------
# SQLAlchemy model owned by the users domain.
#
# Table: users
# Fields:
#   id            — UUID, PK (UUIDPrimaryKeyMixin)
#   email         — str, unique, indexed, not null
#   hashed_password — str, not null
#   full_name     — str, not null
#   avatar_url    — str, nullable
#   role          — Enum(ADMIN, PM, DEVELOPER, VIEWER), default=DEVELOPER
#   is_active     — bool, default=True
#   created_at    — datetime (TimestampMixin)
#   updated_at    — datetime (TimestampMixin)
#   deleted_at    — datetime, nullable (SoftDeleteMixin)
#
# Relationships:
#   projects      — M2M via project_members (projects domain owns association)
#   assigned_tasks — 1:M backref (tasks domain owns FK)
#   comments      — 1:M backref (tasks domain owns FK)
#   activity_logs — 1:M backref (analytics domain owns FK)
#   notifications — 1:M backref (notifications domain owns FK)
#
# Placeholder — implementation pending.
