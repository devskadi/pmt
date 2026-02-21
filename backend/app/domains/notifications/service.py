# Notifications Service
# ---------------------
# Business logic for notification lifecycle and delivery.
#
# Methods:
#   list_for_user(user_id: UUID, cursor) -> CursorPaginatedResult[NotificationRead]
#   get_unread_count(user_id: UUID) -> int
#   mark_as_read(notification_id: UUID) -> None
#   mark_all_as_read(user_id: UUID) -> None
#   delete_notification(notification_id: UUID) -> None
#
# Event handlers (subscribed via event bus):
#   on_task_assigned(event: TaskAssigned) -> None
#   on_comment_added(event: CommentAdded) -> None
#   on_sprint_started(event: SprintStarted) -> None
#   on_sprint_completed(event: SprintCompleted) -> None
#   on_member_added(event: MemberAdded) -> None
#
# Future: WebSocket push via Redis pub/sub.
#
# Placeholder — implementation pending.
