# AI Service
# ----------
# Business logic for AI-powered features.
#
# Methods:
#   suggest_tasks(project_id: UUID, context: str) -> list[TaskSuggestion]
#   suggest_priorities(project_id: UUID) -> list[PriorityAdjustment]
#   summarize_sprint(sprint_id: UUID) -> SprintSummary
#   summarize_project(project_id: UUID) -> ProjectHealthSummary
#   get_usage_stats() -> AIUsageStats
#
# Dependencies:
#   - ai.engine (LLM abstraction layer)
#   - ai.prompts (prompt templates)
#   - tasks domain (read-only, for context gathering)
#   - projects domain (read-only, for context gathering)
#
# Cross-domain rule: AI reads other domains via their repository
# interfaces. It MUST NOT modify data in other domains directly.
# Any writes triggered by AI suggestions go through the originating
# domain's service layer.
#
# Placeholder — implementation pending.
