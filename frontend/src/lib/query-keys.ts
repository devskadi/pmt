/* Query Key Factory */

export const queryKeys = {
  projects: {
    all: ["projects"] as const,
    list: (params?: Record<string, unknown>) => [...queryKeys.projects.all, "list", params] as const,
    detail: (id: string) => [...queryKeys.projects.all, "detail", id] as const,
  },
  tasks: {
    all: ["tasks"] as const,
    list: (params?: Record<string, unknown>) => [...queryKeys.tasks.all, "list", params] as const,
    detail: (id: string) => [...queryKeys.tasks.all, "detail", id] as const,
  },
  sprints: {
    all: ["sprints"] as const,
    list: (params?: Record<string, unknown>) => [...queryKeys.sprints.all, "list", params] as const,
    detail: (id: string) => [...queryKeys.sprints.all, "detail", id] as const,
  },
};
