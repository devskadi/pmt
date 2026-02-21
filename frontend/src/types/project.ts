/* Project Types */

export type ProjectStatus = "ACTIVE" | "ARCHIVED";

export interface Project {
  id: string;
  name: string;
  description: string | null;
  status: ProjectStatus;
  owner_id: string;
  created_at: string;
  updated_at: string;
}

export interface ProjectSummary {
  id: string;
  name: string;
  status: ProjectStatus;
}

export interface ProjectMember {
  user_id: string;
  role: "owner" | "admin" | "member" | "viewer";
}
