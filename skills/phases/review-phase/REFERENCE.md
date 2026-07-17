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

Start review flow with `review`. It pins the fixed point, discovers
Spec and Standards sources, carries baseline code smells, and keeps Standards
findings separate from Spec findings. Use that frame for delegated review
prompts, `autoreview` context, and final aggregation.

`autoreview` remains the core structured review runtime. Capture the exact
command and manually verify accepted findings against source, docs, scoped
skills, and dependency contracts.

Mandatory lenses:

- `review`: two-axis Standards versus Spec wrapper, fixed diff, and
  separate aggregation.
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

## Requirements Grill Wrapper Review

When reviewed spec, plan, phase, or wrapper claims to use
`requirements-grill` or design-phase grill, review that wrapper against
the `requirements-grill` inner flow, not just its outer handoff.

Check:

- Serious grill sessions pair `references/grilling-flow.md` with
  `references/artifact-output.md`.
- Before each round is yielded, it is persisted with stable question ids,
  prerequisites, and the current frontier, with a stable mapping between live
  questions and the routed log/status artifacts.
- Each response set is processed answer by answer; partially answered rounds
  preserve omitted questions as unanswered and carry them forward.
- Status is updated after each response set, and no branch reaches `100%`
  while unanswered items or shared-understanding confirmation remain.
- Routed grill log/status artifacts are created or updated when grilling
  decisions, branches, parked scope, percentages, glossary, axioms, or
  ambiguities change.
- Glossary, axiom, and status updates preserve current meaning while the
  log records accepted decisions and superseded decisions.
- Added or renamed wiki grill artifacts update routed metadata/bookkeeping:
  `content/docs/project/grilling/meta.json`, section index when missing,
  and wiki `log.md` when the repo maintains one.
- Downstream handoff evidence exists as applicable: wiki synthesis,
  backlog/user stories, spec, or phase handoff carrying closed decisions
  and parked/open branches.
- Explicit shared-understanding confirmation is recorded before downstream
  backlog, plan, spec, or prototype action.

Missing inner-flow or durable-artifact evidence is a review finding when
the wrapper promised grill behavior.

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
- fixed point, Spec source or skipped reason, Standards sources
- scoped `AGENTS.md` files and mandatory scoped skills checked
- short summary after findings
- mode: standalone readonly review or delivery-owned review

If there are no findings, say so clearly and still report validation coverage
and residual risk.
