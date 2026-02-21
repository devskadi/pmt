# Tasks Repository
# ----------------
# Data access for task, comment, and attachment entities.
#
# Task Methods:
#   get_by_id(task_id: UUID) -> Task | None
#   get_by_key(key: str) -> Task | None
#   create(data: dict) -> Task
#   update(task_id: UUID, data: dict) -> Task
#   soft_delete(task_id: UUID) -> None
#   list_filtered(filters, pagination) -> tuple[list[Task], int]
#   list_for_sprint(sprint_id: UUID) -> list[Task]
#   get_next_sequence(project_id: UUID) -> int
#
# Comment Methods:
#   create_comment(data: dict) -> Comment
#   list_for_task(task_id: UUID, pagination) -> tuple[list[Comment], int]
#
# Attachment Methods:
#   create_attachment(data: dict) -> Attachment
#   list_for_task(task_id: UUID) -> list[Attachment]
#   delete_attachment(attachment_id: UUID) -> None
#
# Placeholder — implementation pending.
