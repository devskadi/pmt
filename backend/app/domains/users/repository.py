# Users Repository
# ----------------
# Data access layer for user entities.
#
# Methods:
#   get_by_id(user_id: UUID) -> User | None
#   get_by_email(email: str) -> User | None
#   create(data: dict) -> User
#   update(user_id: UUID, data: dict) -> User
#   soft_delete(user_id: UUID) -> None
#   list_active(filters, pagination) -> tuple[list[User], int]
#   search(query: str, limit: int) -> list[User]
#   exists_by_email(email: str) -> bool
#
# Extends: core BaseRepository with User-specific queries.
#
# Placeholder — implementation pending.
