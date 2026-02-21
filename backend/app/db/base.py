# Declarative Base
# ----------------
# SQLAlchemy DeclarativeBase class definition.
# All domain models inherit from this Base.

from sqlalchemy.orm import DeclarativeBase, MappedAsDataclass


class Base(DeclarativeBase):
    """Base class for all SQLAlchemy models.

    All domain models must inherit from this class.
    Mixins (UUID, Timestamp, SoftDelete) are composed
    at the model level, not here.
    """

    pass

