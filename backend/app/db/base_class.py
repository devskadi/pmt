# Model Registry (import side-effect file)
# -----------------------------------------
# Imports ALL SQLAlchemy models so that Alembic's
# autogenerate can detect them via Base.metadata.
#
# This file must be imported in alembic/env.py
# BEFORE calling target_metadata = Base.metadata.
#
# Import each model as its domain is implemented.

from app.domains.projects.models import Project  # noqa: F401

# ---- Future domain models (uncomment as implemented) ----
# from app.domains.users.models import User  # noqa: F401
# from app.domains.auth.models import RefreshToken, PasswordResetToken  # noqa: F401
# from app.domains.sprints.models import Sprint  # noqa: F401
# from app.domains.tasks.models import Task, Comment, Attachment  # noqa: F401
# from app.domains.scorecards.models import Scorecard  # noqa: F401
# from app.domains.analytics.models import ActivityLog  # noqa: F401
# from app.domains.notifications.models import Notification  # noqa: F401
