# Application Constants
# ---------------------
# Enums, role definitions, and permission maps.

import enum


class Role(str, enum.Enum):
    """Global user roles."""

    ADMIN = "ADMIN"
    PM = "PM"
    DEVELOPER = "DEVELOPER"
    VIEWER = "VIEWER"


class ProjectRole(str, enum.Enum):
    """Per-project membership roles."""

    OWNER = "OWNER"
    ADMIN = "ADMIN"
    MEMBER = "MEMBER"
    VIEWER = "VIEWER"


class ProjectStatus(str, enum.Enum):
    """Project lifecycle status."""

    ACTIVE = "ACTIVE"
    ARCHIVED = "ARCHIVED"


class SprintStatus(str, enum.Enum):
    """Sprint lifecycle status."""

    PLANNING = "PLANNING"
    ACTIVE = "ACTIVE"
    COMPLETED = "COMPLETED"


class TaskStatus(str, enum.Enum):
    """Task board status."""

    BACKLOG = "BACKLOG"
    TODO = "TODO"
    IN_PROGRESS = "IN_PROGRESS"
    IN_REVIEW = "IN_REVIEW"
    DONE = "DONE"


class TaskPriority(str, enum.Enum):
    """Task priority levels."""

    CRITICAL = "CRITICAL"
    HIGH = "HIGH"
    MEDIUM = "MEDIUM"
    LOW = "LOW"


class TaskType(str, enum.Enum):
    """Task type classification."""

    BUG = "BUG"
    FEATURE = "FEATURE"
    TASK = "TASK"
    STORY = "STORY"
    EPIC = "EPIC"

