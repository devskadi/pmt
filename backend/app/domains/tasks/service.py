# Tasks Service
# -------------
# Business logic for task management, comments, and attachments.
#
# Task Methods:
#   create_task(project_id: UUID, data: TaskCreate) -> TaskRead
#   list_tasks(filters: TaskFilters, pagination) -> PaginatedResult[TaskRead]
#   get_task(task_id: UUID) -> TaskRead
#   update_task(task_id: UUID, data: TaskUpdate) -> TaskRead
#   delete_task(task_id: UUID) -> None
#   transition_status(task_id: UUID, new_status: TaskStatus) -> TaskRead
#   assign_task(task_id: UUID, assignee_id: UUID | None) -> TaskRead
#
# Comment Methods:
#   add_comment(task_id: UUID, user_id: UUID, data: CommentCreate) -> CommentRead
#   list_comments(task_id: UUID, pagination) -> PaginatedResult[CommentRead]
#
# Attachment Methods:
#   add_attachment(task_id: UUID, file: UploadFile) -> AttachmentRead
#   list_attachments(task_id: UUID) -> list[AttachmentRead]
#   remove_attachment(attachment_id: UUID) -> None
#
# Business rules:
#   - Status transitions follow defined state machine
#   - Only project members can create/edit tasks
#   - Task key auto-generated from project key + sequence
#
# Publishes: TaskCreated, TaskStatusChanged, TaskAssigned, CommentAdded
#
# Placeholder — implementation pending.
