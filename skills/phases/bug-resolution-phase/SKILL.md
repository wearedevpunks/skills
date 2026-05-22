---
name: bug-resolution-phase
description: >-
  Resolves selected ClawPatch findings through classification, bounded fixes,
  triage, docs/debt routing, and revalidation. Use when the user selects a
  ClawPatch finding, asks for ClawPatch-backed bug resolution, or gives a
  tightly bounded finding batch for sequential or parallel handling.
---

# Bug Resolution Phase

## Contract

- **Role:** public ClawPatch selected-finding resolution phase
- **Scope:** one selected finding by default; bounded batch only when explicitly tied by root cause, owned files, validation path, or contract/test gap
- **Primary input:** ClawPatch finding ID plus report or `.clawpatch/` state path when available
- **Uses ClawPatch for:** finding context, report linkage, triage/history, optional dry-run inspection, revalidation
- **Does not use by default:** `clawpatch fix --finding`, `clawpatch open-pr --patch`
- **Patch path:** normal Harness/Codex edits unless the user explicitly requests ClawPatch patch attempts
- **Exit conditions:** resolved and revalidated, routed to debugging, recorded as debt, triaged false positive, or blocked with evidence

## Use When

- The user selects a ClawPatch finding for resolution.
- The user asks to resolve a ClawPatch finding or bounded batch.
- Discovery output needs follow-up classification and repair.
- `parallel: true` is requested for a bounded finding batch.

## Do Not Use When

- No finding is selected; use `$bug-discovery-phase` or ask for the finding ID.
- The work starts from a runtime symptom rather than a ClawPatch finding; use `$debugging-phase`.
- The user wants broad debt resolution from an existing debt artifact; use `$resolve-debt-phase`.
- The request is discovery/report generation only.

## Quick Start

1. Read the selected finding with `clawpatch show --finding <id>` and, when
   useful, `clawpatch report`. Use `report --output <path>` for Markdown or
   `report --json > <path>` for JSON.
2. Capture finding ID, report path, source evidence, affected files, claimed behavior, and current ClawPatch status.
3. Classify each finding as `resolve-now`, `needs-runtime-debugging`, `tech-debt`, `false-positive`, or `blocked`.
4. Execute the classification route:
   - `resolve-now`: patch through normal Harness/Codex edits, then test and revalidate.
   - `needs-runtime-debugging`: route into `$debugging-phase` with the finding context as input artifact.
   - `tech-debt`: after classification, run `$docs-ingest-phase` to create or update durable debt/docs context.
   - `false-positive`: run `clawpatch triage --finding <id> --status <status> --note <reason>`.
   - `blocked`: record blocker, missing evidence, and next human action.
5. Finish with centralized verification and `clawpatch revalidate --finding <id>` or a triage/status update.

## Parallel Rules

`bug-resolution-phase` may run with `parallel: true` or `parallel: false`.

- `parallel: false`: resolve one finding, or a tiny batch sequentially.
- `parallel: true`: only for bounded batches with explicit worker ownership.
- Before fan-out, prove findings are safely disjoint or intentionally share one root-cause scope.
- Assign owned finding IDs, files, tests, and allowed commands per worker.
- Workers may patch only their owned scope through normal Harness/Codex edits.
- Final verification, status decisions, and ClawPatch revalidation stay centralized.

## Reference

See [REFERENCE.md](REFERENCE.md) for classification rules, ClawPatch command guidance, tech-debt artifact requirements, and output format.
