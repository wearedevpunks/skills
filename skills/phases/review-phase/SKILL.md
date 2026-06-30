---
name: review-phase
description: >-
  Run a findings-first readonly review phase with explicit entry gates,
  delegated lenses, artifacts, and validation. Use for review-only goals,
  manual reviews, PRs, merged branches, external edits, suspicious code, or the
  mandatory review wrapper inside delivery-phase.
---

# Review Phase

Readonly findings-first review. Standalone mode reports findings only; delivery
mode hands findings back to the owning phase for fixes.

Load [REFERENCE.md](REFERENCE.md) before running review tools. Start with
`mattpocock-review` to frame fixed-point diff, Standards axis, and Spec axis.

## Contract

- Target must be a diff, PR, branch range, files, spec, plan, docs, or runtime
  evidence.
- Default scope is PR changes, highlighted diffs, supplied code portions, or
  certain paths/domains. Full-codebase scan only when no PR is open and no
  certain scope exists, or when the user explicitly asks.
- Pass bounded scope to inner `autoreview`, ClawPatch-backed review, and
  delegated readonly checks.
- Apply relevant `AGENTS.md` guidance and scoped skills for reviewed paths.
- Use `mattpocock-review` as the review-flow wrapper; keep axes separate.
- Use `autoreview` as the core structured review runtime.

## Steps

1. Identify target, scope, base/head when relevant, and readonly posture.
2. If scope is ambiguous, ask one clarifying question.
3. Gather evidence: status, diff/range/PR metadata, tests, docs, local guidance,
   and exact files/commands consulted.
4. Apply `mattpocock-review`: pin fixed point, find Spec and Standards sources,
   and prepare separate Standards/Spec review prompts.
5. Run `autoreview` on the bounded target and manually verify accepted findings.
6. Apply mandatory lenses: `simplify`, `improve-codebase-architecture`, and
   applicable scoped skills.
7. Run safe readonly validation that matches the target.
8. Report findings-first; standalone mode stops, delivery mode returns findings
   to the owning phase.

## Output

Lead with findings by severity. Include references, impact, evidence,
recommended action, validation, exact review command, fixed point, Spec source
or skipped reason, Standards sources, scoped guidance checked, residual risk,
and mode.
