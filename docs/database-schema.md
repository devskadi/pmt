# Database Schema Design

## Entity Relationship Overview

```
┌──────────┐     ┌───────────────┐     ┌──────────┐
│  users   │────<│project_members│>────│ projects │
└──────────┘     └───────────────┘     └──────────┘
     │                                       │
     │ assigned_to / reporter                │ belongs_to
     │                                       │
     ▼                                       ▼
┌──────────┐                           ┌──────────┐
│  tasks   │──────────────────────────>│ sprints  │
└──────────┘                           └──────────┘
     │
     ├──> comments
     ├──> attachments
     └──> activity_logs

┌──────────────┐
│  scorecards  │──> projects, users, sprints
└──────────────┘

┌────────────────┐
│ notifications  │──> users
└────────────────┘
```

## Key Design Decisions

1. **UUIDs as primary keys** — Prevents enumeration attacks, enables distributed ID generation
2. **Soft deletes** — `deleted_at` timestamp instead of hard DELETE for audit compliance
3. **JSON columns** — `scorecard.criteria` and `task.tags` use JSONB for flexibility
4. **Association tables** — `project_members` is explicit (not implicit M2M) to support role-per-project
5. **Audit trail** — `activity_logs` captures all state changes with JSON diff

## Index Strategy

- `users.email` — UNIQUE index
- `projects.key` — UNIQUE index
- `tasks.project_id` + `tasks.status` — Composite index (board queries)
- `tasks.assignee_id` — Index (my-tasks queries)
- `tasks.sprint_id` — Index (sprint backlog queries)
- `activity_logs.entity_type` + `activity_logs.entity_id` — Composite index
- `notifications.user_id` + `notifications.is_read` — Composite index
