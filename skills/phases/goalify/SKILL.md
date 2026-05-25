---
name: goalify
description: Compile messy intent, handoffs, issues, logs, specs, or notes into a ready-to-paste `/goal` prompt with a durable objective and verifiable stopping condition. Use when the user asks to goalify a task, write a goal prompt, prepare goal mode, or turn context into a long-running Codex goal.
---

# Goalify

`goalify` is a prompt compiler. It produces a `/goal` prompt; it does not run the
goal unless the user explicitly asks.

Codex goal objectives have a hard platform limit: the text after `/goal` must be
non-empty and at most 4,000 characters. Longer instructions belong in a file
that the goal points to; do not emit an over-limit `/goal` block.

Goal prompts must be short and concise. Do not write a spec, essay, transcript,
or exhaustive handoff. Write the smallest complete operating contract: direct,
detailed enough to execute, and straightforward step by step.

## Use When

- The user asks to "goalify", "write the goal prompt", "prepare a goal", or "turn this into a goal".
- The input includes messy scope, handoffs, tracker issues, specs, plans, logs, recordings, evals, examples, or repo notes.
- The work is long-running enough to need independent Codex progress across turns.
- The desired output is a self-contained goal-mode contract.

## Do Not Use When

- The user wants immediate execution, not a prompt.
- The task is tiny enough for one normal turn.
- Requirements are still materially unresolved; use requirements discovery first.
- You cannot name one objective, one stopping condition, and at least one validation signal.

## Goal Criteria

Every generated goal prompt must include:

- one durable objective
- exact repo, path, branch, worktree, or environment when known
- scope and non-goals
- read-first sources
- relevant skills, tools, phases, or plugins from the supplied context
- pinned constraints, invariants, and guardrails
- workflow checkpoints
- validation commands, scenarios, or artifacts
- evidence expectations
- stopping condition
- early-stop or blocker conditions
- progress-report expectations
- final-report expectations

Within the 4,000-character hard limit, prefer the official goal-shape fields:

- outcome
- verification surface
- constraints
- boundaries
- iteration policy
- blocked stop condition

These criteria are required, but they are not permission to be verbose. Fold
related details together, delete repetition, and keep each section short.

## Workflow

1. **Collect context.**
   - Read supplied handoffs, issues, specs, plans, logs, examples, and scoped repo guidance when available.
   - Preserve exact paths, issue ids, commands, URLs, recordings, and artifact names.
   - If sources conflict, prefer repo/spec/log evidence over stale summaries.
2. **Normalize the objective.**
   - Reduce the request to one durable objective.
   - Keep adjacent wishes as non-goals, follow-ups, or blocker conditions.
   - If one objective cannot be named, ask one clarifying question instead of drafting.
3. **Define proof.**
   - Name what proves progress and what proves done.
   - Prefer commands, test suites, browser checks, route generation, eval scores, scenario matrices, or log/event evidence.
   - If proof is manual, state the exact human-verifiable scenario.
4. **Compile the prompt.**
   - Use [EXAMPLES.md](EXAMPLES.md) for structure.
   - Include only context the future goal runner needs.
   - Make the prompt self-contained enough to survive compaction.
   - Keep the full `/goal ...` text at or below 4,000 characters.
   - Prefer short over maximal. The target is concise and complete, not "as much as fits".
   - Preserve concrete paths, constraints, proof, and stop conditions before trimming execution detail.
   - Use terse step-by-step workflow bullets with clear verbs and validation gates.
   - Compress aggressively: group files by area, collapse repeated commands, delete background, and remove non-execution-critical explanation.
   - If the real operating contract cannot fit, produce a short `/goal` that points at an existing or user-requested goal file instead of pasting the full contract.
5. **Review before returning.**
   - Confirm the prompt has one objective and one stopping condition.
   - Confirm it says what to read first.
   - Confirm it tells Codex when to stop early.
   - Confirm validation is explicit, not "make sure it works".
   - Confirm the fenced `/goal` text is non-empty and no more than 4,000 characters.
   - Confirm the prompt is short, direct, and step-by-step; cut any paragraph that merely explains context the runner does not need.

## Output Contract

Return:

1. A ready-to-paste `/goal ...` prompt in a fenced `text` block.
2. A short note with the character count for the `/goal` text and any assumptions or missing inputs.
3. No execution, no file edits, no tracker updates, and no commits unless separately requested.

## Prompt Sections

Use these headings when they fit:

- Objective
- Scope
- Use these skills/tools
- Read first
- Pinned context
- Workflow
- Validation
- Stopping condition
- Progress reports
- Final report
- Guardrails

## Gotchas

- HARD LIMIT: never output a `/goal` prompt longer than 4,000 characters.
- SHORT MEANS SHORT: the goal should feel like a compact command contract, not a plan file.
- Do not treat `/goal` as a spec dump. It is a compact operating contract.
- If a user asks for a giant goal, preserve the richest useful contract that fits, then point at a file for overflow detail.
- Do not hardcode project-specific phase families; use the skills/phases named by the context.
- Do not turn a backlog grab bag into one goal. Split or ask.
- Do not bury the stopping condition near the end in vague prose.
- Do not include secrets, private tokens, or unnecessary personal data.
- Do not tell the future runner to mutate test inputs, recordings, fixtures, or handoffs unless the user explicitly asks.
