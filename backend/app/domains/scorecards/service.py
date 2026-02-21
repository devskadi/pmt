# Scorecards Service
# ------------------
# Business logic for scorecard evaluation.
#
# Methods:
#   create_scorecard(data: ScorecardCreate) -> ScorecardRead
#   list_scorecards(filters, pagination) -> PaginatedResult[ScorecardRead]
#   get_scorecard(scorecard_id: UUID) -> ScorecardRead
#   update_scorecard(scorecard_id: UUID, data: ScorecardUpdate) -> ScorecardRead
#   delete_scorecard(scorecard_id: UUID) -> None
#   calculate_score(criteria: list[CriterionScore]) -> float
#
# Publishes: ScorecardEvaluated
#
# Placeholder — implementation pending.
