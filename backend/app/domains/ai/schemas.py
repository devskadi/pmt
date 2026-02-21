# AI Schemas
# ----------
# Pydantic v2 schemas for AI domain request/response:
#
#   TaskSuggestion       — title, description, priority, type, rationale
#   PriorityAdjustment   — task_id, current_priority, suggested_priority, rationale
#   SprintSummary        — summary, highlights[], risks[], recommendations[]
#   ProjectHealthSummary — health_score (0-100), summary, bottlenecks[], suggestions[]
#   AIUsageStats         — total_requests, tokens_used, requests_by_feature{}
#   ProjectContext       — name, description, tasks[], sprints[] (input to prompts)
#   SprintContext        — name, goal, tasks[], velocity (input to prompts)
#   TaskContext          — title, status, priority, assignee, age_days (input to prompts)
#
# Placeholder — implementation pending.
