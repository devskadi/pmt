# AI Prompt Templates
# -------------------
# Centralized prompt management for all AI features.
#
# Pattern: Each prompt is a function that takes typed context
# and returns a formatted prompt string. This keeps prompts
# version-controlled and testable.
#
# Functions:
#   task_suggestion_prompt(project_context: ProjectContext) -> str
#   priority_adjustment_prompt(tasks: list[TaskContext]) -> str
#   sprint_summary_prompt(sprint_context: SprintContext) -> str
#   project_health_prompt(project_context: ProjectContext) -> str
#
# Placeholder — implementation pending.
