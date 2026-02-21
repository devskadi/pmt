# Analytics Schemas
# -----------------
# Pydantic v2 schemas for the analytics domain:
#
#   DashboardStats     — total_projects, total_tasks, tasks_by_status, recent_activity
#   ProjectStats       — task_breakdown, velocity, completion_rate, member_contributions
#   SprintReport       — burndown_data[], velocity, completed_points, total_points, scope_changes
#   BurndownPoint      — date, remaining_points, ideal_remaining
#   UserActivity       — tasks_completed, tasks_created, comments_count, period
#   ActivityEntry      — id, user (summary), entity_type, entity_id, action, changes, created_at
#   ActivityFilters    — entity_type?, entity_id?, user_id?, action?, since?
#
# Placeholder — implementation pending.
