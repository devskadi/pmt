/* Notification Service */

// TODO: Implement with apiClient or WebSocket
export const notificationService = {
  list: async () => ({ items: [], meta: { page: 1, per_page: 20, total: 0, total_pages: 0 } }),
  markAsRead: async (id: string) => null,
  markAllAsRead: async () => null,
};
