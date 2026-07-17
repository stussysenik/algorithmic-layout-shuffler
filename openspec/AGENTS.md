# OpenSpec Workflow (fission model)

Two roles operate on this directory. Identify yours before touching anything.

## Parent agent (planner)

- Owns `project.md` and the change queue. Turns product direction into small change proposals; never implements them in the same session it plans them.
- To add work: create `changes/<verb-noun-id>/` with `proposal.md` (why / what changes / impact), `tasks.md` (ordered checklist), and delta specs under `changes/<id>/specs/<capability>/spec.md` using `## ADDED|MODIFIED|REMOVED Requirements` headers.
- Keep proposals independently implementable and <100 LOC of diff each; split anything bigger.

## Student agent (implementer)

1. Read `project.md`, then the target change's `proposal.md`, `tasks.md`, and delta specs. Read the current capability spec in `specs/` for context. Do NOT start work not covered by an active change.
2. Implement tasks **in order**, checking boxes in `tasks.md` as you go (`- [x]`).
3. Verify: `npx tsc && node test/smoke.mjs` green, plus the change's own acceptance criteria. Extend the smoke test whenever you add a constraint or invariant.
4. Archive: merge the delta specs into `specs/<capability>/spec.md`, move the change folder to `changes/archive/`, and note the completion date in its `proposal.md`.
5. Blocked or forced to deviate from the proposal → stop, write findings into the change's `design.md`, and hand back to the parent agent. Do not improvise scope.

## Spec format

Capability specs are requirement lists. Each requirement uses SHALL and carries at least one scenario:

```markdown
### Requirement: Deterministic generation
The kernel SHALL produce byte-identical output for identical inputs.

#### Scenario: Same seed twice
- WHEN `shuffle({ seed: 42 })` runs twice
- THEN `renderDocument` output is byte-identical
```

## Hard rules (both roles)

- Locked decisions in `project.md` override anything an agent prefers.
- No new runtime dependencies without a proposal that says so explicitly.
- Never claim done without green terminal output pasted into your report.
