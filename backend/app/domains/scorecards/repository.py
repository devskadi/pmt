# Scorecards Repository
# ---------------------
# Data access for scorecard entities.
#
# Methods:
#   get_by_id(scorecard_id: UUID) -> Scorecard | None
#   create(data: dict) -> Scorecard
#   update(scorecard_id: UUID, data: dict) -> Scorecard
#   delete(scorecard_id: UUID) -> None
#   list_filtered(filters, pagination) -> tuple[list[Scorecard], int]
#   get_for_sprint(sprint_id: UUID) -> list[Scorecard]
#   get_for_user(user_id: UUID) -> list[Scorecard]
#
# Placeholder — implementation pending.
