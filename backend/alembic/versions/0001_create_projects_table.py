"""create_projects_table

Revision ID: 0001
Revises:
Create Date: 2025-01-01 00:00:00.000000

"""
from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

# revision identifiers, used by Alembic.
revision: str = "0001"
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Create the ProjectStatus enum type
    projectstatus_enum = sa.Enum(
        "active",
        "archived",
        name="projectstatus",
        create_type=True,
    )

    op.create_table(
        "projects",
        sa.Column(
            "id",
            sa.Uuid(),
            server_default=sa.text("gen_random_uuid()"),
            nullable=False,
        ),
        sa.Column("name", sa.String(length=255), nullable=False),
        sa.Column("description", sa.Text(), nullable=True),
        sa.Column(
            "status",
            projectstatus_enum,
            server_default="active",
            nullable=False,
        ),
        sa.Column("owner_id", sa.Uuid(), nullable=False),
        sa.Column(
            "soft_deleted",
            sa.Boolean(),
            server_default=sa.text("false"),
            nullable=False,
        ),
        sa.Column("deleted_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.func.now(),
            nullable=False,
        ),
        sa.Column(
            "updated_at",
            sa.DateTime(timezone=True),
            server_default=sa.func.now(),
            onupdate=sa.func.now(),
            nullable=False,
        ),
        sa.PrimaryKeyConstraint("id"),
    )

    # Single-column indexes
    op.create_index("ix_projects_name", "projects", ["name"])
    op.create_index("ix_projects_status", "projects", ["status"])
    op.create_index("ix_projects_owner_id", "projects", ["owner_id"])
    op.create_index("ix_projects_soft_deleted", "projects", ["soft_deleted"])

    # Composite indexes for common query patterns
    op.create_index(
        "ix_projects_owner_id_status",
        "projects",
        ["owner_id", "status"],
    )
    op.create_index(
        "ix_projects_created_at",
        "projects",
        ["created_at"],
    )


def downgrade() -> None:
    # Drop indexes first
    op.drop_index("ix_projects_created_at", table_name="projects")
    op.drop_index("ix_projects_owner_id_status", table_name="projects")
    op.drop_index("ix_projects_soft_deleted", table_name="projects")
    op.drop_index("ix_projects_owner_id", table_name="projects")
    op.drop_index("ix_projects_status", table_name="projects")
    op.drop_index("ix_projects_name", table_name="projects")

    # Drop the table
    op.drop_table("projects")

    # Drop the enum type
    sa.Enum(name="projectstatus").drop(op.get_bind(), checkfirst=True)
