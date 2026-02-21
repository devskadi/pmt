/* Tasks API Service */

// TODO: Implement with apiClient
export const taskService = {
  list: async () => ({ items: [], meta: { page: 1, per_page: 20, total: 0, total_pages: 0 } }),
  get: async (id: string) => null,
  create: async (data: Record<string, unknown>) => null,
  update: async (id: string, data: Record<string, unknown>) => null,
  remove: async (id: string) => null,
};
