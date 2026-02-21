# Shared Schemas
# --------------
# Cross-cutting Pydantic v2 schemas used by multiple domains.
# Domain-specific schemas live inside their respective domain packages.
#
# Pagination:
#   PaginationParams   — page: int = 1, per_page: int = 20
#   PaginatedResponse[T] — data: list[T], meta: PaginationMeta
#   PaginationMeta     — page, per_page, total, total_pages
#   CursorPaginatedResponse[T] — data: list[T], meta: CursorMeta
#   CursorMeta         — next_cursor, has_more
#
# Response Envelope:
#   SuccessResponse[T] — data: T, meta: dict | None
#   ErrorResponse      — error: ErrorDetail
#   ErrorDetail        — code: str, message: str, details: list[dict] | None
#
# Common:
#   UUIDModel          — id: UUID (base for all read schemas)
#   TimestampModel     — created_at, updated_at
#   SortParams         — sort_by: str, sort_order: "asc" | "desc"
#
# Placeholder — implementation pending.
