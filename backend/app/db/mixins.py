# Model Mixins
# ------------
# Reusable SQLAlchemy column mixins for domain models.
# All domain models compose these mixins.
#
# UUIDPrimaryKeyMixin:
#   id: Mapped[UUID] = mapped_column(
#       UUID(as_uuid=True), primary_key=True, default=uuid4
#   )
#
# TimestampMixin:
#   created_at: Mapped[datetime] = mapped_column(
#       DateTime(timezone=True), server_default=func.now()
#   )
#   updated_at: Mapped[datetime] = mapped_column(
#       DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
#   )
#
# SoftDeleteMixin:
#   deleted_at: Mapped[datetime | None] = mapped_column(
#       DateTime(timezone=True), nullable=True, default=None
#   )
#   @hybrid_property
#   def is_deleted(self) -> bool:
#       return self.deleted_at is not None
#
# Usage in domain models:
#   class User(UUIDPrimaryKeyMixin, TimestampMixin, SoftDeleteMixin, Base):
#       __tablename__ = "users"
#       ...
#
# Placeholder — implementation pending.
