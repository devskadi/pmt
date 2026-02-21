# Database Policy

> Governing document for all database operations in the PMT project.
> Violations of this policy must be flagged during code review.

---

## 1. Migration Naming Convention

All Alembic migration files follow this format:

```
{revision_id}_{verb}_{description}.py
```

### Verbs (strictly enforced)

| Verb | Usage |
|------|-------|
| `create` | New table |
| `add` | New column or index |
| `alter` | Column type/constraint change |
| `drop` | Remove column, table, or index |
| `rename` | Rename column or table |
| `seed` | Insert reference data |
| `backfill` | Data migration for existing rows |

### Examples

```
a1b2c3d4e5f6_create_users_table.py
f6e5d4c3b2a1_add_status_index_to_tasks.py
1a2b3c4d5e6f_alter_scorecard_criteria_to_jsonb.py
6f5e4d3c2b1a_drop_legacy_tags_column.py
```

### Forbidden

- Auto-generated messages (`"auto"`, `"empty message"`)
- Non-descriptive names (`"update"`, `"fix"`, `"changes"`)
- Multiple unrelated changes in one migration

---

## 2. Migration Workflow

### Creating a Migration

```bash
# Auto-generate from model changes
alembic revision --autogenerate -m "create_users_table"

# Manual migration (data migrations, complex DDL)
alembic revision -m "backfill_user_roles"
```

### Pre-merge Checklist

1. ☐ Migration is reversible (`downgrade()` implemented and tested)
2. ☐ Migration runs in < 30 seconds on production-sized data
3. ☐ No locking operations on large tables without explicit approval
4. ☐ `alembic heads` shows single head (no branch conflicts)
5. ☐ Migration tested against a fresh database (`alembic upgrade head` from empty)
6. ☐ Migration tested against current production schema (`alembic upgrade head` from latest)

### Conflict Resolution

If `alembic heads` shows multiple heads:

```bash
alembic merge -m "merge_heads" head1 head2
```

This must be a separate PR and reviewed by backend lead.

---

## 3. Model Modification Protocol

### Adding a Column

1. Add column to domain model with `nullable=True` or `server_default`
2. Generate migration: `alembic revision --autogenerate -m "add_{column}_to_{table}"`
3. If column should be NOT NULL without default:
   - Step 1 migration: Add as nullable
   - Step 2: Backfill data
   - Step 3 migration: Alter to NOT NULL

### Removing a Column

1. Remove all code references first
2. Generate migration
3. Migration must handle both `upgrade()` and `downgrade()`
4. **Soft removal preferred**: rename column with `_deprecated` suffix, drop after 2 releases

### Renaming a Column

1. Create migration with explicit `op.alter_column(... new_column_name=...)`
2. **Never** use autogenerate for renames (it generates drop + add)
3. Update all code references in the same PR

---

## 4. Enum Modification Protocol

### Adding an Enum Value

PostgreSQL enums cannot be modified inside transactions. Use:

```python
def upgrade():
    op.execute("ALTER TYPE taskstatus ADD VALUE 'BLOCKED' AFTER 'IN_REVIEW'")

def downgrade():
    # PostgreSQL cannot remove enum values
    # Document that this is a one-way migration
    pass
```

### Rules

- **Never remove enum values** — they may exist in production data
- Add new values at the END or specify position with `AFTER`
- If enum semantics change fundamentally, create a new enum and migrate data
- All enum changes require explicit data migration plan in PR description

---

## 5. Indexing Standards

### Required Indexes

| Pattern | Index Type | Rationale |
|---------|-----------|-----------|
| Foreign key columns | B-tree | Join performance |
| `email`, `key` (unique fields) | Unique B-tree | Constraint + lookup |
| `(entity_type, entity_id)` | Composite B-tree | Polymorphic lookups |
| `(project_id, status)` on tasks | Composite B-tree | Board queries |
| `(user_id, is_read)` on notifications | Composite B-tree | Notification inbox |
| JSONB fields with queries | GIN | JSON path lookups |
| Full-text search columns | GIN (tsvector) | Search performance |

### Index Naming Convention

```
ix_{table}_{column1}_{column2}
uq_{table}_{column}
```

### Rules

- Every foreign key MUST have an index
- Every column used in WHERE/ORDER BY on large tables MUST be reviewed for indexing
- Partial indexes preferred for boolean filters: `WHERE deleted_at IS NULL`
- Unused indexes must be dropped (monitor via `pg_stat_user_indexes`)

---

## 6. Soft Delete vs Hard Delete Policy

### Soft Delete (default for all domain entities)

```python
class SoftDeleteMixin:
    deleted_at: Mapped[datetime | None]
```

**Applies to**: users, projects, tasks, sprints, scorecards, attachments

**Query discipline**: All default queries MUST filter `WHERE deleted_at IS NULL`.
Use a query helper or repository base method:

```python
def _active_query(self):
    return select(self.model).where(self.model.deleted_at.is_(None))
```

### Hard Delete (exceptions only)

**Applies to**: refresh_tokens, password_reset_tokens, activity_logs (via retention policy)

Rationale: These are ephemeral/operational records with no audit requirement.

### Retention Policy

| Entity | Soft Delete TTL | Hard Delete After |
|--------|----------------|-------------------|
| Users | Indefinite | Never (GDPR: anonymize instead) |
| Projects | 90 days | Manual admin action |
| Tasks | 90 days | With parent project |
| Activity logs | N/A | 365 days (hard delete via cron) |
| Notifications | N/A | 90 days (hard delete via cron) |
| Tokens | N/A | Immediate after expiry |

---

## 7. Transaction Boundaries

- Each API request runs in a single database transaction
- Transaction is committed at the end of the request (via middleware/dependency)
- Transaction is rolled back on any unhandled exception
- **Long-running operations** (bulk imports, reports) must use explicit savepoints
- **Cross-domain writes** within a single request are acceptable (same transaction)
- **Never** hold a transaction open while making external API calls

---

## 8. Connection Pool Settings

| Setting | Development | Production |
|---------|------------|------------|
| `pool_size` | 5 | 20 |
| `max_overflow` | 5 | 10 |
| `pool_timeout` | 30s | 10s |
| `pool_recycle` | 3600s | 1800s |
| `pool_pre_ping` | True | True |

---

## 9. Data Integrity Rules

1. **UUIDs for all primary keys** — no auto-increment integers
2. **All timestamps are timezone-aware** (`DateTime(timezone=True)`)
3. **No orphaned records** — all FKs use `ON DELETE` appropriately:
   - `CASCADE` for owned children (comments → task)
   - `SET NULL` for optional references (task.assignee_id)
   - `RESTRICT` for critical references (project_members → project)
4. **JSONB columns must have a schema** documented in the model docstring
5. **No raw SQL in application code** — all queries via SQLAlchemy ORM/Core
6. **String lengths must be explicit** — no unbounded `String()`, use `String(255)` or `Text`
