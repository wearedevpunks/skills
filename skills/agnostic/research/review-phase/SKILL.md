---
name: review-phase
description: Run a findings-first readonly review phase with explicit entry gates, delegated lenses, artifacts, and validation. Use for review-only goals, manual reviews, PRs, merged branches, external edits, suspicious code, or as the mandatory review wrapper inside delivery-phase.
---

# Review Phase

A phase is a wrapper skill: it defines when to enter, when to stop, which inner
skills to delegate to, what artifacts to produce, and which gates must pass.
`review-phase` is standalone and readonly by default. Inside `delivery-phase`, it
is mandatory and may hand findings back to delivery for fixes, debugging, docs,
or validation because delivery owns completion.

## Use When

- The user asks for a review, audit, second pass, PR review, suspicious-code check, or review-only goal.
- Code changed outside this session and needs independent inspection.
- A branch was merged, rebased, generated, or edited externally and needs confirmation.
- `delivery-phase` reaches its mandatory review gate.
- The desired output is findings, risks, missing tests, or recommended next actions.

## Do Not Use When

- The user asks directly for implementation with no review gate.
- The task is pure planning, requirements grilling, or docs writing with no artifact to review.
- You need to edit code immediately; ask for or enter an owning delivery/debug/fix phase instead.
- The review target is undefined and cannot be inferred from branch, diff, issue, PR, or user prompt.

## Entry Contract

1. Identify the review target: diff, PR, branch range, files, spec, plan, docs, or runtime evidence.
2. State scope and readonly posture. If scope is ambiguous, ask one clarifying question.
3. Read local guidance in checked directories, especially relevant `AGENTS.md` files under apps, packages, docs, or nested ownership boundaries.
4. Choose review lenses and say which are active.

## Review Lenses

- `parallel-research`: fan out independent readonly checks when scope can split by subsystem, risk, or hypothesis.
- `simplify`: inspect clarity, overcomplexity, unnecessary abstraction, derivable state, naming, and scope creep.
- `improve-codebase-architecture`: surface architectural friction, shallow modules, poor boundaries, and module-depth opportunities.
- Scoped local guidance: apply applicable directory instructions, stack skills, runbooks, and ownership rules discovered in checked paths.

Use only the lenses that fit the target. Do not perform ceremonial delegation when a local pass is faster and equally reliable.

## Workflow

1. Gather evidence:
   - inspect status, diff/range/PR metadata, tests, docs, and relevant local instructions
   - prefer primary artifacts over tracker summaries
   - record exact files and commands consulted
2. Split if useful:
   - use `parallel-research` for independent readonly checks
   - synthesize before reporting; disagreements need evidence, not vote counting
3. Review findings-first:
   - prioritize bugs, regressions, broken contracts, missing validation, unsafe assumptions, and user-facing risks
   - include file and line references when available
   - separate blocking findings from improvements and optional cleanup
4. Apply clarity and architecture lenses:
   - use `simplify` to flag unnecessary concepts or complexity
   - use `improve-codebase-architecture` to flag deeper boundary opportunities, usually as follow-up RFC candidates
5. Validate:
   - run readonly checks that match the target when safe: tests, typecheck, lint, build, docs link checks, or focused smoke commands
   - if a check cannot run, state why and the residual risk
6. Stop:
   - standalone mode stops after findings and recommended next actions
   - delivery mode returns findings to `delivery-phase`; delivery decides and performs fixes/debug/docs/validation

## Output Contract

Lead with findings, ordered by severity. For each finding include:

- severity
- file/line or artifact reference
- issue and impact
- evidence
- recommended action

Then include:

- open questions or assumptions
- validation run and result
- short summary only after findings
- whether this was standalone readonly review or delivery-owned review

If there are no findings, say so clearly and still report validation coverage and residual risk.

## Expected Outputs

- Review report in conversation, issue, PR comment, or handoff artifact as requested.
- Optional follow-up issue/RFC candidates for architectural opportunities.
- In delivery mode only: fix/debug/docs tasks handed back to the owning phase.

## Gotchas

- Findings-first means do not bury issues under summary prose.
- Do not edit code in standalone mode unless the user explicitly asks after seeing the review scope.
- Do not use `simplify` as permission to refactor; report simplification opportunities unless delivery owns fixes.
- Do not flatten scoped `AGENTS.md` guidance into generic advice; quote the concrete constraint that matters.
- Do not let `delivery-phase` skip this phase just because tests passed.
