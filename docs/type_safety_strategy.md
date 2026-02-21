# Type Safety Strategy

> Governing document for aligning Pydantic v2 backend schemas
> with TypeScript frontend types across the PMT stack.

---

## 1. Problem Statement

The PMT backend defines data contracts via Pydantic v2 schemas.
The frontend consumes these contracts via TypeScript types.
Without a synchronization strategy, these definitions drift,
causing runtime errors, silent data loss, and integration bugs.

---

## 2. Current Architecture

```
Backend (Python)                    Frontend (TypeScript)
─────────────────                   ─────────────────────
Pydantic v2 Schemas                 TypeScript Interfaces
  domains/*/schemas.py               src/types/*.ts
         │                                  │
         ▼                                  ▼
  FastAPI auto-generates              Manually written
  OpenAPI 3.1 JSON schema            to match API docs
         │                                  │
         └───────── Must stay in sync ──────┘
```

### Risk

Hand-written TypeScript types can diverge from Pydantic schemas.
This is the #1 source of frontend/backend integration bugs.

---

## 3. Synchronization Strategy

### Phase 1: Manual with Validation (Current — MVP)

**Approach**: Hand-written TypeScript types validated against OpenAPI schema in CI.

**Workflow**:

1. Backend developer updates Pydantic schema in `domains/*/schemas.py`
2. FastAPI auto-generates updated OpenAPI spec
3. CI pipeline exports OpenAPI JSON and runs a diff check
4. Frontend developer updates corresponding TypeScript types in `src/types/*.ts`
5. CI validates TypeScript types compile against the OpenAPI spec

**CI Check** (in `.github/workflows/ci.yml`):

```yaml
schema-sync-check:
  name: Schema Sync Check
  needs: [backend-lint, frontend-lint]
  runs-on: ubuntu-latest
  steps:
    - uses: actions/checkout@v4
    - name: Export OpenAPI schema
      run: |
        cd backend
        pip install -r requirements/base.txt
        python -c "
          from app.main import create_app
          import json
          app = create_app()
          with open('../openapi.json', 'w') as f:
            json.dump(app.openapi(), f, indent=2)
        "
    - name: Validate types against schema
      run: |
        cd frontend
        npm ci
        npx openapi-typescript ../openapi.json -o src/types/__generated__/api.d.ts
        npm run type-check
```

### Phase 2: Auto-generated Types (Post-MVP)

**Approach**: Generate TypeScript types directly from OpenAPI schema.

**Tool**: `openapi-typescript` (npm package)

**Workflow**:

```bash
# Generate types from backend OpenAPI spec
npx openapi-typescript http://localhost:8000/api/v1/openapi.json \
  -o src/types/__generated__/api.d.ts
```

**Structure**:

```
frontend/src/types/
├── __generated__/
│   └── api.d.ts          ← Auto-generated from OpenAPI (DO NOT EDIT)
├── index.ts              ← Re-exports from generated + custom types
├── user.ts               ← Custom frontend-only types (UI state, etc.)
├── project.ts            ← Custom frontend-only types
└── ...
```

**Rules for Phase 2**:
- Generated files are committed to git (enables diffing in PRs)
- Manual edits to generated files are forbidden (enforced by lint rule)
- Custom types (UI state, form state) live in separate files
- Generated types are re-exported with friendlier names in `index.ts`

### Phase 3: Full SDK Generation (Scale)

**Approach**: Generate a complete TypeScript API client from OpenAPI.

**Tool**: `openapi-typescript-codegen` or `orval`

**Output**: Replaces hand-written `src/services/*.ts` entirely.

```bash
npx orval --config orval.config.ts
```

**Generated**:
- Type definitions
- API client functions (Axios-based)
- React Query hooks (optional)
- Zod validation schemas (optional)

---

## 4. Type Mapping Reference

### Scalar Types

| Pydantic (Python) | OpenAPI | TypeScript |
|-------------------|---------|------------|
| `str` | `string` | `string` |
| `int` | `integer` | `number` |
| `float` | `number` | `number` |
| `bool` | `boolean` | `boolean` |
| `UUID` | `string (format: uuid)` | `string` |
| `datetime` | `string (format: date-time)` | `string` (ISO 8601) |
| `date` | `string (format: date)` | `string` (YYYY-MM-DD) |
| `None / None` | `null` | `null` |
| `list[T]` | `array` | `T[]` |
| `dict[str, Any]` | `object` | `Record<string, unknown>` |

### Enum Types

| Pydantic | TypeScript |
|----------|------------|
| `class Role(str, Enum)` | `type Role = "ADMIN" \| "PM" \| "DEVELOPER" \| "VIEWER"` |
| `class TaskStatus(str, Enum)` | `type TaskStatus = "BACKLOG" \| "TODO" \| "IN_PROGRESS" \| "IN_REVIEW" \| "DONE"` |

### Complex Types

| Pydantic | TypeScript |
|----------|------------|
| `Optional[str]` | `string \| null` |
| `str \| None = None` | `string \| null` |
| `list[TaskRead]` | `TaskRead[]` |
| `PaginatedResponse[TaskRead]` | `PaginatedResponse<TaskRead>` |

---

## 5. Naming Conventions

### Backend Schemas (Pydantic)

| Pattern | Example | Usage |
|---------|---------|-------|
| `{Entity}Create` | `TaskCreate` | POST request body |
| `{Entity}Update` | `TaskUpdate` | PATCH request body |
| `{Entity}Read` | `TaskRead` | Full response object |
| `{Entity}Summary` | `TaskSummary` | Embedded in other responses |
| `{Entity}Filters` | `TaskFilters` | Query parameters |

### Frontend Types (TypeScript)

| Pattern | Example | Usage |
|---------|---------|-------|
| `{Entity}` | `Task` | Core entity (maps to `{Entity}Read`) |
| `Create{Entity}` | `CreateTask` | Form/mutation input (maps to `{Entity}Create`) |
| `Update{Entity}` | `UpdateTask` | Form/mutation input (maps to `{Entity}Update`) |
| `{Entity}Summary` | `TaskSummary` | Same name as backend |
| `{Entity}Filters` | `TaskFilters` | Same name as backend |

### Mapping Rule

```
Backend: TaskRead    → Frontend: Task
Backend: TaskCreate  → Frontend: CreateTask
Backend: TaskUpdate  → Frontend: UpdateTask
Backend: TaskSummary → Frontend: TaskSummary (unchanged)
```

---

## 6. Validation Strategy

### Backend (Pydantic v2)

- All request validation via Pydantic schemas
- Custom validators for business rules
- Errors auto-mapped to 422 responses by FastAPI

### Frontend (Zod)

- Form validation via Zod schemas
- Zod schemas SHOULD mirror Pydantic schemas
- Used with `react-hook-form` via `zodResolver`

### Alignment Rule

For every Pydantic `{Entity}Create` / `{Entity}Update` schema,
there SHOULD be a corresponding Zod schema in `features/{domain}/schemas/`.

```
Backend: domains/tasks/schemas.py → TaskCreate
Frontend: features/tasks/schemas/task-form.ts → taskCreateSchema (Zod)
```

---

## 7. API Client Type Safety

### Current Pattern (Axios + Manual Types)

```typescript
// src/services/task-service.ts
export const taskService = {
  list: (filters: TaskFilters): Promise<PaginatedResponse<Task>> =>
    apiClient.get("/tasks", { params: filters }),

  create: (data: CreateTask): Promise<Task> =>
    apiClient.post("/tasks", data),

  update: (id: string, data: UpdateTask): Promise<Task> =>
    apiClient.patch(`/tasks/${id}`, data),
};
```

### Future Pattern (Generated Client)

```typescript
// src/services/__generated__/task-service.ts (auto-generated)
// Fully typed request/response, no manual definitions needed
```

---

## 8. Review Checklist for Schema Changes

When modifying any Pydantic schema:

- [ ] Corresponding TypeScript type updated
- [ ] Zod validation schema updated (if form-related)
- [ ] API service function signature updated
- [ ] OpenAPI diff reviewed in PR
- [ ] No removed fields (backward compatibility)
- [ ] New optional fields have `| null` in TypeScript
- [ ] Enum additions reflected in both stacks
