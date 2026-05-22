# Bug Resolution Phase Reference

## Operating Model

`bug-resolution-phase` starts after a human or upstream discovery step selects one ClawPatch finding. ClawPatch is the ledger and context source; it is not treated as proof of runtime behavior and is not the default patching engine.

Default to one finding. Accept a batch only when the user bounds it and the findings share at least one concrete constraint:

- same confirmed or suspected root cause
- same owned file set or package boundary
- same validation path or failing check
- same contract or test coverage gap

Do not turn a broad report into an automatic repair campaign. If the request is ambiguous, ask for the finding ID or batch boundary.

## Useful ClawPatch Commands

Use commands like these for context and state:

```sh
clawpatch show --root "$REPO" --state-dir "$REPO/.clawpatch" --finding "$FINDING_ID"
clawpatch report --root "$REPO" --state-dir "$REPO/.clawpatch" --status open
clawpatch report --root "$REPO" --state-dir "$REPO/.clawpatch" --json > "$REPORT_JSON"
clawpatch triage --root "$REPO" --state-dir "$REPO/.clawpatch" --finding "$FINDING_ID" --status "$STATUS" --note "$REASON"
clawpatch revalidate --root "$REPO" --state-dir "$REPO/.clawpatch" --finding "$FINDING_ID"
clawpatch fix --root "$REPO" --state-dir "$REPO/.clawpatch" --finding "$FINDING_ID" --dry-run
```

`clawpatch report` renders the current finding ledger for context. Use it to
recover report context when a resolution goal starts from only a finding ID or
state directory. `--output <path>` writes Markdown. `--json` writes JSON to
stdout, so redirect stdout when a JSON artifact is needed.

`clawpatch fix --finding <id> --dry-run` is allowed for inspection when it clarifies the proposed patch, but do not apply it by default. `clawpatch fix --finding <id>` and `clawpatch open-pr --patch <patchAttemptId>` are explicit mutation paths and require a clear user request.

Preserve report linkage in notes and final output: finding ID, report path if known, `.clawpatch/` state path when relevant, and command outputs used for decisions.

## Classification Matrix

### `resolve-now`

Use when the finding is selected, bounded, code/docs ownership is clear, and verification is available.

Actions:

1. Inspect ClawPatch evidence and relevant source.
2. Optionally inspect `clawpatch fix --finding <id> --dry-run` for context only.
3. Patch through normal Harness/Codex edits.
4. Run focused tests, type checks, smoke checks, or docs validation appropriate to the touched scope.
5. Revalidate with `clawpatch revalidate --finding <id>` when possible.
6. If revalidation is unavailable or inconclusive, update triage/status with a clear note.

### `needs-runtime-debugging`

Use when the finding depends on runtime behavior, reproduction, logs, browser/CLI checks, flakiness, performance, or an observed symptom.

Actions:

1. Stop resolution edits unless a cause is already proven.
2. Route into `$debugging-phase`.
3. Pass input artifacts: finding ID, report path, source evidence, expected behavior, observed or suspected behavior, affected scenario, and any failed revalidation.
4. Let `$debugging-phase` own hypotheses, runtime evidence, fix, and verification.

### `tech-debt`

Use when the finding is real or plausible but too broad for selected-finding repair, needs product/architecture decisions, lacks acceptance criteria, or would require a larger spec.

Actions:

1. Classify the selected finding first. Discovery alone must not create debt docs.
2. Update ClawPatch triage/history with the tech-debt reason.
3. Run `$docs-ingest-phase` to create or update durable repo debt/docs context.
4. Preserve these fields in the durable context:
   - ClawPatch finding ID
   - ClawPatch report path or state path
   - source evidence and affected paths
   - classification reason
   - human-review question
   - why immediate resolution is unsafe or too broad
5. Do not write speculative architecture as current truth.

The debt context should be small and reviewable. It should point to the
ClawPatch report and finding instead of copying the full report. It should name
the human decision needed before architecture, product scope, or acceptance
criteria can change.

Human-review questions should be concrete, for example: "Should this contract be changed, tested, or accepted as a known limitation?"

### `false-positive`

Use when source inspection proves the finding is incorrect, stale, unreachable, already covered, or intentionally accepted behavior.

Actions:

1. Record the proof with file paths, tests, docs, or command evidence.
2. Run `clawpatch triage --finding <id> --status false-positive --note "<clear reason>"` or the closest supported false-positive status.
3. Revalidate only if it adds signal; otherwise report the triage command as the state update.

### `blocked`

Use when resolution cannot proceed because required access, artifacts, environment, owner decision, or reproduction evidence is missing.

Actions:

1. Record the blocker and the specific missing item.
2. Leave source unchanged unless partial safe cleanup was already verified.
3. Update ClawPatch triage/status when useful with a note that names the blocker.
4. Report the next human action.

## Parallel Batch Resolution

`parallel: true` means bounded batch findings can be resolved concurrently, not merely inspected concurrently.

Preconditions:

- The batch list is explicit.
- Each finding has a classification target or classification owner.
- File ownership is disjoint, or the batch intentionally shares one root-cause patch with one coordination owner.
- Validation commands are known and can be merged centrally.
- Shared files, generated files, lockfiles, migrations, docs, and schemas have a single owner.
- Every worker can state which files it may edit, which files it must not edit,
  and which validation it must run before handoff.

Worker brief must include:

- finding IDs
- classification route
- owned files and forbidden files
- allowed validation commands
- ClawPatch context command outputs or paths
- merge/revalidation handoff expectations
- explicit note that final ClawPatch status changes are centralized unless the
  coordinator assigns one worker to a single finding end to end

Central coordinator responsibilities:

1. Confirm no worker overwrote unrelated edits.
2. Review combined diff for overlap and consistency.
3. Run final focused validation.
4. Run `clawpatch revalidate --finding <id>` for each resolved finding when possible.
5. Update false-positive, tech-debt, or blocked statuses centrally.
6. Produce one final report mapping each finding to classification, changes, validation, and ClawPatch state.

If two workers discover that their findings require the same file or root-cause
patch, pause fan-out for that subset and consolidate under one owner. Do not let
parallel workers race on the same fix.

## Output Contract

Return:

- mode: `parallel: true|false`
- finding IDs and report/state paths used
- classification for each finding
- route taken: resolved, debugging, debt, false-positive, or blocked
- changes made through normal edits, if any
- ClawPatch commands run and resulting state
- verification commands and results
- debt/docs artifacts or debugging handoff, if created
- caveats, residual risk, and next human action
