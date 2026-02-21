/* Sprint Types */

export type SprintStatus = "planning" | "active" | "completed";

export interface Sprint {
  id: string;
  name: string;
  goal: string | null;
  status: SprintStatus;
  project_id: string;
  start_date: string | null;
  end_date: string | null;
  created_at: string;
  updated_at: string;
}
