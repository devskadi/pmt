/* Common / Shared Types */

export interface SelectOption {
  label: string;
  value: string;
}

export interface PaginationParams {
  page: number;
  per_page: number;
}

export interface SortParams {
  sort_by: string;
  sort_order: "asc" | "desc";
}
