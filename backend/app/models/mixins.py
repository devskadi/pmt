# Model Mixins
# ------------
# Reusable SQLAlchemy column mixins:
#
#   TimestampMixin — created_at, updated_at (auto-managed)
#   SoftDeleteMixin — deleted_at, is_deleted
#   UUIDPrimaryKeyMixin — id as UUID instead of integer
#
# All domain models should compose these mixins
# instead of duplicating timestamp/soft-delete columns.
#
# Placeholder — implementation pending.
