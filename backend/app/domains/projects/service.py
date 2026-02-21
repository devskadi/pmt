# Projects Service
# ----------------
# Business logic for project lifecycle and membership.
#
# Methods:
#   create_project(owner_id: UUID, data: ProjectCreate) -> ProjectRead
#   list_projects(user_id: UUID, filters, pagination) -> PaginatedResult[ProjectRead]
#   get_project(project_id: UUID, user_id: UUID) -> ProjectRead
#   update_project(project_id: UUID, data: ProjectUpdate) -> ProjectRead
#   archive_project(project_id: UUID) -> None
#   add_member(project_id: UUID, user_id: UUID, role: ProjectRole) -> None
#   remove_member(project_id: UUID, user_id: UUID) -> None
#   update_member_role(project_id: UUID, user_id: UUID, role: ProjectRole) -> None
#   list_members(project_id: UUID) -> list[ProjectMemberRead]
#
# Publishes: ProjectCreated, ProjectArchived, MemberAdded, MemberRemoved
#
# Placeholder — implementation pending.
