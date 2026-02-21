# Users Service
# -------------
# Business logic for user management.
#
# Methods:
#   get_current_user(user_id: UUID) -> UserRead
#   update_profile(user_id: UUID, data: UserUpdate) -> UserRead
#   list_users(filters, pagination) -> PaginatedResult[UserRead]
#   get_user(user_id: UUID) -> UserRead
#   update_user(user_id: UUID, data: AdminUserUpdate) -> UserRead
#   deactivate_user(user_id: UUID) -> None
#   search_users(query: str) -> list[UserRead]
#
# Dependencies:
#   - users.repository (data access)
#   - core.event_bus (publish UserDeactivated, etc.)
#
# Placeholder — implementation pending.
