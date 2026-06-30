---
name: mattpocock-review
description: >-
  Review diffs with Matt Pocock's two-axis lens: Standards versus Spec. Use at
  review-flow start for branches, PRs, or review-since requests.
---

# Matt Pocock Review

Two-axis review wrapper. Use it to frame evidence, delegated review prompts,
`autoreview` context, and final aggregation.

## Steps

1. Pin the fixed point: supplied commit, branch, tag, PR base, or merge-base. If
   absent, ask. Verify `git rev-parse <fixed>` and non-empty
   `git diff <fixed>...HEAD`.
2. Capture commits with `git log <fixed>..HEAD --oneline`.
3. Find Spec source: issue or PRD referenced by commits, user-supplied path, or
   matching `docs/`, `specs/`, `.scratch/` artifact. If none, mark Spec
   unavailable; do not invent one.
4. Find Standards sources: nearest `AGENTS.md`, project standards,
   `CONTRIBUTING.md`, lint/test contracts, scoped skills, runbooks.
5. Run two readonly axes against the same fixed diff. Prefer separate
   `Standards` and `Spec` subagents when available. If one axis cannot run,
   state why.
6. Aggregate under separate `Standards` and `Spec` headings. Do not merge,
   rerank, or pick one overall winner across axes.

## Standards Axis

Ask whether the diff follows documented standards. Repo standards override
baseline smells. Smells are judgement calls, not hard violations. Skip rules
tooling already enforces.

Baseline smells:

- Mysterious Name: unclear variable, function, or type name.
- Duplicated Code: same logic shape repeated across hunks or files.
- Feature Envy: code reaches into another object's data more than its own.
- Data Clumps: same fields or params travel together repeatedly.
- Primitive Obsession: primitive/string hides domain concept.
- Repeated Switches: same conditional cascade repeats on the same type.
- Shotgun Surgery: one logical change forces scattered edits.
- Divergent Change: one module changes for unrelated reasons.
- Speculative Generality: abstraction, parameter, or hook has no real need.
- Message Chains: caller depends on long navigation through objects.
- Middle Man: function or class mostly delegates onward.
- Refused Bequest: subtype ignores or overrides most inherited behavior.

Report standards-source violations with file/rule citation. Report smells with
smell name, hunk reference, and small fix direction.

## Spec Axis

Ask whether the diff implements the originating spec.

Report:

- missing or partial requirements
- behavior not requested by the spec
- implemented-looking requirements with wrong behavior

Quote or cite the spec for each Spec finding. If Spec is unavailable, say so and
skip this axis.

## Output

Use shape:

```text
## Standards
[findings or clear pass]

## Spec
[findings, skipped reason, or clear pass]

Summary: Standards <count>, Spec <count>. Worst Standards: <item/none>. Worst Spec: <item/none>.
```
