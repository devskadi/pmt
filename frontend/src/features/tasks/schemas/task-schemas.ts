import { z } from "zod";

export const createTaskSchema = z.object({
  title: z.string().min(1).max(255),
  description: z.string().max(10000).optional(),
  status: z.enum(["backlog", "todo", "in_progress", "in_review", "done"]).optional(),
  priority: z.enum(["critical", "high", "medium", "low"]).optional(),
  type: z.enum(["bug", "feature", "task", "story", "epic"]).optional(),
  assignee_id: z.string().uuid().optional(),
  project_id: z.string().uuid(),
});

export const updateTaskSchema = createTaskSchema.partial().omit({ project_id: true });

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
