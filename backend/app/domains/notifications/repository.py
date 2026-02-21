# Notifications Repository
# ------------------------
# Data access for notification entities.
#
# Methods:
#   create(data: dict) -> Notification
#   get_by_id(notification_id: UUID) -> Notification | None
#   list_for_user(user_id: UUID, cursor, limit) -> list[Notification]
#   count_unread(user_id: UUID) -> int
#   mark_read(notification_id: UUID) -> None
#   mark_all_read(user_id: UUID) -> int
#   delete(notification_id: UUID) -> None
#   cleanup_old(older_than: datetime) -> int
#
# Placeholder — implementation pending.
