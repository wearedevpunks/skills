# Goalify Examples

Use these as structure, not fixed templates. Keep the generated goal prompt matched to the user context.

Every `/goal` block must be non-empty and at most 4,000 characters. If the
details cannot fit, make the goal point at a separate file that contains the
expanded contract.

## Delivery-Style Goal

```text
/goal Deliver <objective> in <repo/path> without stopping until the implementation is reviewed, validated, and documented or a concrete blocker is proven.

Scope:
- repo/path: <path>
- in scope: <bounded changes>
- out of scope: <explicit non-goals>

Use these skills/tools:
- <skills/phases/tools named by context>

Read first:
- <handoff/spec/plan/issue paths>
- repo AGENTS.md and relevant scoped AGENTS.md files

Pinned context:
- <architecture decisions, invariants, branch constraints>

Workflow:
1. Inspect read-first sources and confirm scope.
2. Reuse or create required artifacts.
3. Implement in checkpoints.
4. Review changed work.
5. Debug only when validation produces runtime evidence.
6. Run docs ingest or record why it is not needed.

Validation:
- <exact commands/scenarios/artifacts>

Stopping condition:
- Done when <verifiable end state>.
- Stop early only if <concrete blocker condition>.

Progress reports:
- Report current checkpoint, what was verified, what remains, and whether blocked.

Final report:
- Changed files, validation evidence, unresolved questions, and follow-up goals if split.
```

After returning the fenced block, include its character count.

## Debugging-Style Goal

```text
/goal Debug <broken behavior> in <repo/path> until the failing scenario passes with evidence or a concrete external blocker is proven.

Read first:
- <logs/handoff/issues/specs>

Inputs:
- <recordings, commands, browser paths, fixtures>

Workflow:
1. Build an evidence matrix for expected vs observed behavior.
2. Reproduce the failure with the closest existing harness.
3. Inspect logs and runtime events before patching.
4. Patch only the proven cause.
5. Add or update focused regression coverage.
6. Rerun the failing scenario and targeted tests.

Validation:
- <commands/scenarios/log evidence>

Stopping condition:
- Done when <scenario> passes and evidence shows <events/outputs>.
- Stop early only if <missing input/access/external service blocker>.
```
