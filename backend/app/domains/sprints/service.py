# Sprints Service
# ---------------
# Business logic for sprint lifecycle management.
#
# Methods:
#   create_sprint(project_id: UUID, data: SprintCreate) -> SprintRead
#   list_sprints(project_id: UUID, filters, pagination) -> PaginatedResult[SprintRead]
#   get_sprint(sprint_id: UUID) -> SprintRead
#   update_sprint(sprint_id: UUID, data: SprintUpdate) -> SprintRead
#   start_sprint(sprint_id: UUID) -> SprintRead
#   complete_sprint(sprint_id: UUID) -> SprintRead
#   delete_sprint(sprint_id: UUID) -> None
#
# Business rules:
#   - Only one active sprint per project at a time
#   - Sprint can only start from PLANNING status
#   - Sprint can only complete from ACTIVE status
#   - Cannot delete active or completed sprints
#
# Publishes: SprintStarted, SprintCompleted
#
# Placeholder — implementation pending.
