# Scorecard Schemas
# -----------------
# Pydantic v2 schemas for the scorecards domain:
#
#   CriterionScore     — name, weight (0-1), score (0-10), notes?
#   ScorecardCreate    — project_id, sprint_id?, subject_id?, title, criteria[]
#   ScorecardUpdate    — title?, criteria?, notes?
#   ScorecardRead      — all fields + evaluator (summary), subject (summary)
#   ScorecardSummary   — id, title, total_score, created_at
#   ScorecardFilters   — project_id?, sprint_id?, subject_id?, evaluator_id?
#
# Placeholder — implementation pending.
