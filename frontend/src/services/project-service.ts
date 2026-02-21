/* Projects API Service */

import type { Project } from "@/types/project";

export interface PaginationMeta {
  page: number;
  per_page: number;
  total: number;
  total_pages: number;
}

export interface ProjectsListResponse {
  data: Project[];
  meta: PaginationMeta;
}

const INTERNAL_API_URL =
  process.env.API_INTERNAL_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
const API_BEARER_TOKEN = process.env.PMT_API_BEARER_TOKEN;

function buildHeaders(): HeadersInit {
  const headers: Record<string, string> = {
    Accept: "application/json",
  };
  if (API_BEARER_TOKEN) {
    headers.Authorization = `Bearer ${API_BEARER_TOKEN}`;
  }
  return headers;
}

export const projectService = {
  list: async (page = 1, perPage = 20): Promise<ProjectsListResponse> => {
    const response = await fetch(
      `${INTERNAL_API_URL}/api/v1/projects?page=${page}&per_page=${perPage}`,
      {
        method: "GET",
        headers: buildHeaders(),
        cache: "no-store",
      }
    );

    if (!response.ok) {
      const message = await response.text();
      throw new Error(`GET /api/v1/projects failed (${response.status}): ${message}`);
    }

    return (await response.json()) as ProjectsListResponse;
  },
  get: async (_id: string) => null,
  create: async (_data: Record<string, unknown>) => null,
  update: async (_id: string, _data: Record<string, unknown>) => null,
  remove: async (_id: string) => null,
};
