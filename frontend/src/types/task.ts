/* Task Types */

export type TaskStatus = "backlog" | "todo" | "in_progress" | "in_review" | "done";
export type TaskPriority = "critical" | "high" | "medium" | "low";
export type TaskType = "bug" | "feature" | "task" | "story" | "epic";

export interface Task {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  type: TaskType;
  assignee_id: string | null;
  project_id: string;
  sprint_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface TaskSummary {
  id: string;
  title: string;
  status: TaskStatus;
  priority: TaskPriority;
}
