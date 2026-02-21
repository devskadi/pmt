# Permissions & RBAC
# ------------------
# Central permission definitions and enforcement utilities.
#
# Roles (global):
#   ADMIN     — Full system access
#   PM        — Project management, member management
#   DEVELOPER — Task execution, commenting
#   VIEWER    — Read-only access
#
# Project Roles (per-project):
#   OWNER     — Full project control (auto-assigned to creator)
#   ADMIN     — Project settings, member management
#   MEMBER    — Task CRUD within project
#   VIEWER    — Read-only project access
#
# Permission Matrix:
#   See docs/auth_rbac.md for complete matrix.
#
# Enforcement Strategy:
#   1. Global role check via require_role() dependency
#   2. Project-level role check via require_project_role() dependency
#   3. Object-level ownership check in service layer
#
# Utilities:
#   has_permission(user: User, action: str, resource: str) -> bool
#   check_project_access(user_id: UUID, project_id: UUID, min_role: ProjectRole) -> None
#
# Placeholder — implementation pending.
