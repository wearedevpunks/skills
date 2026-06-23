---
name: review-phase
description: >-
  Run a findings-first readonly review phase with explicit entry gates,
  delegated lenses, artifacts, and validation. Use for review-only goals,
  manual reviews, PRs, merged branches, external edits, suspicious code, or as
  the mandatory review wrapper inside delivery-phase.
---

# Review Phase

Readonly findings-first review. Standalone mode reports findings only; delivery
mode hands findings back to the owning phase for fixes.

Load [REFERENCE.md](REFERENCE.md) before running review tools.

## Contract

- Target must be a diff, PR, branch range, files, spec, plan, docs, or runtime
  evidence.
- Default scope is PR changes, highlighted diffs, supplied code portions, or
  certain paths/domains. Full-codebase scan only when no PR is open and no
  certain scope exists, or when the user explicitly asks.
- Pass that bounded scope to inner `autoreview`, ClawPatch-backed review, or
  delegated readonly checks.
- Apply relevant `AGENTS.md` guidance and scoped skills for reviewed paths.
- Use `autoreview` as the core structured review runtime.

## Steps

1. Identify target, scope, base/head when relevant, and readonly posture.
2. If scope is ambiguous, ask one clarifying question.
3. Gather evidence: status, diff/range/PR metadata, tests, docs, local guidance,
   and exact files/commands consulted.
4. Run `autoreview` on the bounded target and manually verify accepted findings.
5. Apply mandatory lenses: `simplify`, `improve-codebase-architecture`, and
   applicable scoped skills.
6. Run safe readonly validation that matches the target.
7. Report findings-first; standalone mode stops, delivery mode returns findings
   to the owning phase.

## Output

Lead with findings by severity. Include references, impact, evidence,
recommended action, validation, exact review command, scoped guidance checked,
residual risk, and mode.
