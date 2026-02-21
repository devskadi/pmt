# Projects Repository
# -------------------
# Data access for project and project_members entities.
#
# Methods:
#   get_by_id(project_id: UUID) -> Project | None
#   get_by_key(key: str) -> Project | None
#   create(data: dict) -> Project
#   update(project_id: UUID, data: dict) -> Project
#   soft_delete(project_id: UUID) -> None
#   list_for_user(user_id: UUID, filters, pagination) -> tuple[list[Project], int]
#   add_member(project_id: UUID, user_id: UUID, role: str) -> None
#   remove_member(project_id: UUID, user_id: UUID) -> None
#   get_member_role(project_id: UUID, user_id: UUID) -> str | None
#   list_members(project_id: UUID) -> list[ProjectMember]
#   is_member(project_id: UUID, user_id: UUID) -> bool
#
# Placeholder — implementation pending.
