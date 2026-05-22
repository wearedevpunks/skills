---
name: bug-discovery-phase
description: >-
  Runs AFK ClawPatch bug discovery, reporting, and triage without source
  mutation. Use when the user asks for ClawPatch discovery, broad bug discovery,
  bug lifecycle triage, finding ledgers, AFK bug review, or durable bug reports.
---

# Bug Discovery Phase

`bug-discovery-phase` wraps ClawPatch discovery. It produces review state,
reports, and triage notes; it does not prove runtime root causes and does not
patch code by default.

See [REFERENCE.md](REFERENCE.md) for command patterns, provider warning wording,
and the full output checklist.

## Contract

- **Role:** public AFK ClawPatch discovery/report/triage phase
- **Owns:** ClawPatch setup checks, discovery scope, report path, durable state,
  finding IDs, and branch-relevant triage notes
- **Does not own:** runtime reproduction, root-cause proof, code fixes, PRs, or
  repo tech-debt docs
- **Allowed commands:** `clawpatch init`, `map`, `review`, `ci`, `report`,
  `show`, `next`, `triage`, `status`, `doctor`, `revalidate`
- **Blocked by default:** `clawpatch fix --finding`, `clawpatch open-pr`

## Use When

- The user asks for broad ClawPatch review, discovery, report, triage, or status.
- A goal needs AFK static bug-finding before humans choose findings to resolve.
- Existing `.clawpatch/` state needs inspection, report generation, or triage.
- The desired output is a durable finding ledger, not a patch.

## Do Not Use When

- There is one concrete runtime symptom; use `$debugging-phase`.
- The user asks to fix a selected ClawPatch finding; use `$bug-resolution-phase`.
- The user wants repo tech-debt docs; route that through `$docs-ingest-phase`
  after a selected finding is classified.
- The target repo, provider, or scope cannot be identified.

## Workflow

1. **Bound the run.** Record repo root, scope, provider, model, `--limit`,
   `--jobs`, state dir, report path, dirty-worktree posture, and requested output
   format before running ClawPatch.
2. **Warn on cost-sensitive routes.** Warn, but do not ban, Claude, Anthropic,
   `acpx` resolving to Claude, `pi`, Anthropic model names, or
   `ANTHROPIC_API_KEY`.
3. **Make provider explicit.** Generated goals and commands must include the
   selected provider. Include the model when known.
4. **Inspect readiness.** Prefer `clawpatch doctor`, `status`, and existing
   `.clawpatch/` state before long runs.
5. **Discover.** Use read-oriented ClawPatch commands: usually `init`, `map`,
   then `review` or `ci` with explicit provider, model, limit, jobs, state dir,
   scope, and output.
6. **Report and triage.** Generate a report under `.clawpatch/reports/` unless
   the user supplied another path. Use `clawpatch report --output <path>` for
   Markdown reports; for JSON, run `clawpatch report --json > <path>` because
   `--output` writes Markdown. Use `show`, `next`, `triage`, `status`, or
   `revalidate` only for inspection and classification.
7. **Stop before mutation.** Do not run `fix --finding` or `open-pr` unless the
   user gives a new explicit resolution request.

## Output Contract

Return:

- repo root, scope, provider, model, `--limit`, `--jobs`
- report path and durable ClawPatch ledger/state path
- commands run and validation status
- relevant finding IDs, statuses, and branch relevance
- warning that findings are static-review candidates, not proven runtime root
  causes
- next action: inspect selected finding, enter `$bug-resolution-phase`, enter
  `$debugging-phase`, or stop
