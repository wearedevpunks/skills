---
name: goalify
description: Goalify messy intent by writing a very lean `/goal`, activating it immediately with the available goal tool, and continuing the user's task under that active goal.
---

# Goalify

`goalify` writes the smallest operating contract a goal-running Codex can adopt,
activates it immediately, then keeps working. It is a compiler, not a spec,
handoff, or plan dump.

Invocation is permission to activate now. Do not stop at printing a `/goal`
prompt or reporting the contract when a goal tool is available.

Be very lean. Target the shortest contract that can run without re-asking.
Hard limit: text after `/goal` must be non-empty and <= 4,000 characters. If
detail will not fit, point at a file instead of pasting overflow.

## Activation

- Always activate spot on: write the goal, call the available goal activation
  tool immediately, then continue the user's task under that active goal.
- If the task is tiny, unresolved, or lacks one objective, proof signal, and
  stop condition, ask one clarifying question.
- If activation is unavailable, return the ready `/goal ...` prompt and name
  that blocker.

## Goal Contract

Include only what the runner needs:

- one durable objective
- read-first refs: exact paths, issues, URLs, logs, artifacts
- boundaries: scope, non-goals, constraints, guardrails
- terse workflow checkpoints with named skills/tools/phases from context
- proof: commands, scenarios, artifacts, logs, or other done evidence
- stop: done condition, early-stop blocker, final report expectation

Cut background, section catalogs, and repeated rationale. Preserve concrete
paths, commands, ids, URLs, artifacts, and invariants.

## Workflow

1. Read supplied handoffs, specs, issues, logs, examples, and scoped repo
   guidance. Prefer current repo/spec/log evidence over summaries.
2. Reduce to one objective. Move adjacent wishes to boundaries, follow-ups, or
   blockers.
3. Write a direct, pointer-heavy `/goal` contract. Use [EXAMPLES.md](EXAMPLES.md)
   only if structure is needed.
4. Check: one objective, explicit proof, stop/blocker conditions, no secrets, no
   vague "make it work", <= 4,000 characters.
5. Activate immediately. After activation succeeds, continue execution; report
   only what helps the active task move forward.

## Fallback Output

Use only when activation cannot run:

1. fenced `text` block with the ready `/goal ...` prompt
2. character count
3. activation blocker

## Gotchas

- Do not turn a backlog grab bag into one goal; split or ask.
- Do not hardcode project-specific phase families; use the context provided.
- Do not tell the runner to mutate fixtures, recordings, handoffs, or test
  inputs unless the user explicitly asks.
