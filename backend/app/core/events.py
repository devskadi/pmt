# Domain Events
# -------------
# Event definitions for cross-domain communication.
# Supports future event-driven architecture and
# decoupling between modules.
#
# Events: TaskCreated, TaskStatusChanged, SprintStarted,
#         SprintCompleted, UserAssigned, ScorecardEvaluated,
#         ProjectArchived
#
# Pattern: Each event is a frozen dataclass / Pydantic model
# that can be published to an in-process event bus (sync)
# or message broker (async) when extracting to microservices.
#
# Placeholder — implementation pending.
