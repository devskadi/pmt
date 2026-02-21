/* Analytics Types */

export interface DashboardSummary {
  total_projects: number;
  total_tasks: number;
  active_sprints: number;
  completion_rate: number;
}

export interface BurndownDataPoint {
  date: string;
  remaining: number;
  ideal: number;
}

export interface VelocityMetric {
  sprint_name: string;
  completed_points: number;
  planned_points: number;
}

export interface TeamPerformanceData {
  user_id: string;
  name: string;
  tasks_completed: number;
  velocity: number;
}
