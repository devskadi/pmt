# Sprints Repository
# ------------------
# Data access for sprint entities.
#
# Methods:
#   get_by_id(sprint_id: UUID) -> Sprint | None
#   create(data: dict) -> Sprint
#   update(sprint_id: UUID, data: dict) -> Sprint
#   delete(sprint_id: UUID) -> None
#   list_for_project(project_id: UUID, filters, pagination) -> tuple[list[Sprint], int]
#   get_active_sprint(project_id: UUID) -> Sprint | None
#   count_tasks_in_sprint(sprint_id: UUID) -> int
#
# Placeholder — implementation pending.
