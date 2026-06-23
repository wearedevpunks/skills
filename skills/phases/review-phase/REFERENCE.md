# Review Phase Reference

## Use And Stop Rules

Use for review-only goals, audits, PR review, suspicious code, external edits,
merged or rebased branches, and `delivery-phase` review gates.

Do not use when the user asks for immediate implementation, pure planning,
requirements grilling, docs writing with no artifact to review, or an undefined
target that cannot be inferred from branch, diff, issue, PR, or prompt.

Standalone mode is readonly and stops after findings. Delivery mode may return
findings to delivery for fixes, debugging, docs, or validation because delivery
owns completion.

## Scope Policy

Default to the smallest certain target:

- open PR changes
- highlighted diff
- supplied code portions
- branch range
- named files, paths, packages, apps, domains, or features

Use a full-codebase scan only when no PR is open and no certain domain, portion,
or path is provided, or when the user explicitly asks for a full-codebase
review.

Pass the bounded target into every inner review step: `autoreview`,
ClawPatch-backed review, delegated readonly checks, and lens prompts. Do not run
review tooling against the full codebase when a bounded target exists.

For PR review, use the actual PR base branch. Do not assume trunk.

## Runtime And Lenses

`autoreview` is the core structured review runtime. Capture the exact command
and manually verify accepted findings against source, docs, scoped skills, and
dependency contracts.

Mandatory lenses:

- `simplify`: clarity, avoidable complexity, unnecessary abstraction, derivable
  state, naming, and scope creep.
- `improve-codebase-architecture`: boundary friction, shallow modules, module
  depth, and follow-up RFC candidates.
- Scoped local guidance: nearest relevant `AGENTS.md`, stack skills, runbooks,
  ownership rules, and skills named by those instructions.

Conditional lens:

- `parallel-research`: split independent readonly checks by subsystem, risk, or
  hypothesis. Synthesize evidence; do not vote-count disagreements.

## Evidence And Validation

Prefer primary artifacts over tracker summaries. Record exact files and
commands consulted. Include stack status or prior delivery stack evidence when
stack metadata is relevant.

Safe readonly validation may include focused tests, typecheck, lint, build,
docs link checks, or smoke commands. If a check cannot run, state why and the
residual risk.

For behavior-changing implementation plans or specs, missing RED/GREEN proof is
a blocking finding unless the task has an explicit valid `reason_not_testable`.
Reject `reason_not_testable` when the only reason is forgotten RED; the delivery
owner must recover with public-result RED and GREEN evidence.

## Findings Policy

Prioritize bugs, regressions, broken contracts, missing validation, unsafe
assumptions, and user-facing risks. Include file and line references when
available. Separate blocking findings from improvements and optional cleanup.

Do not edit code in standalone mode unless the user explicitly asks after
seeing the review scope. Do not use `simplify` as permission to refactor.

Do not flatten scoped `AGENTS.md` guidance into generic advice; cite the
concrete constraint. Do not skip scoped skills from `AGENTS.md` prompts.

Do not run mutating stack commands in review. `review-phase` reports stack
evidence only; delivery owns `stack sync`.

## Output Checklist

Lead with findings, ordered by severity. For each finding include:

- severity
- file/line or artifact reference
- issue and impact
- evidence
- recommended action

Then include:

- open questions or assumptions
- validation run and result
- exact `autoreview` command and clean/accepted-findings result
- scoped `AGENTS.md` files and mandatory scoped skills checked
- short summary after findings
- mode: standalone readonly review or delivery-owned review

If there are no findings, say so clearly and still report validation coverage
and residual risk.
