# Model Registry (import side-effect file)
# -----------------------------------------
# Imports ALL SQLAlchemy models so that Alembic's
# autogenerate can detect them via Base.metadata.
#
# This file must be imported in alembic/env.py
# BEFORE calling target_metadata = Base.metadata.
#
# Pattern:
#   from app.models.user import User        # noqa: F401
#   from app.models.project import Project  # noqa: F401
#   from app.models.sprint import Sprint    # noqa: F401
#   ... etc.
#
# Placeholder — implementation pending.
