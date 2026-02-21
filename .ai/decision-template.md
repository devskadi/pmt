# Decision Log Entry Template

Use this template when appending entries to `.ai/decisions.md`. Copy the block below and fill in all fields. Do not leave fields blank — write "None" if not applicable.

---

```markdown
## [YYYY-MM-DD HH:MM] — Decision Title

**Status:** Proposed | Accepted | Deprecated | Superseded by [XXXX]

**Context:**
What problem or situation prompted this decision? What constraints exist?

**Decision:**
What was decided? Be specific and unambiguous.

**Alternatives Considered:**

| Alternative | Pros | Cons | Why Rejected |
|-------------|------|------|-------------|
| Option A | ... | ... | ... |
| Option B | ... | ... | ... |

**Consequences:**

- Positive: What does this enable?
- Negative: What does this constrain or make harder?
- Neutral: What trade-offs are accepted?

**Architectural Impact:**

- Layers affected: [Router | Service | Repository | Model | Schema | Frontend | Infrastructure]
- Domains affected: [Auth | Users | Projects | Sprints | Tasks | Scorecards | Analytics | Notifications | AI]
- Invariants preserved: [List which invariants from system.md Section 1 are upheld]
- Invariants at risk: [List any invariants that require extra care]

**Files Affected:**
- Created: [list]
- Modified: [list]
- Deleted: [list]

**Reversibility:**
Easy | Moderate | Difficult | Irreversible

**Review Required:**
- [ ] Architecture review
- [ ] Security review
- [ ] Database review
- [ ] Infrastructure review
- [ ] None — contained within single domain

**Related ADRs:** docs/adr/XXXX-*.md (if applicable)
```

---

## Field Definitions

| Field | Description |
|-------|-------------|
| Status | Current state. Decisions start as "Accepted" unless flagged for review. |
| Context | The situation, not the solution. Should be understandable without reading the decision. |
| Decision | The specific choice made. Must be actionable and verifiable. |
| Alternatives | At least one alternative must be listed. "Do nothing" is a valid alternative. |
| Consequences | Must include at least one positive and one negative consequence. |
| Architectural Impact | Maps the decision to the system's layers and domains. |
| Files Affected | Complete list. Reviewers use this to scope their review. |
| Reversibility | How hard it would be to undo this decision in 6 months. |
| Review Required | Determines which specialist reviews are needed. |
