/* Scorecards API Service */

// TODO: Implement with apiClient
export const scorecardService = {
  list: async (projectId: string) => ({ items: [], meta: { page: 1, per_page: 20, total: 0, total_pages: 0 } }),
  get: async (id: string) => null,
  update: async (id: string, data: Record<string, unknown>) => null,
};
