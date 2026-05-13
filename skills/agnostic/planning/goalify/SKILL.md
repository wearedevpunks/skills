---
name: goalify
description: Compile messy intent, handoffs, issues, logs, specs, or notes into a ready-to-paste `/goal` prompt with a durable objective and verifiable stopping condition. Use when the user asks to goalify a task, write a goal prompt, prepare goal mode, or turn context into a long-running Codex goal.
---

# Goalify

`goalify` is a prompt compiler. It produces a `/goal` prompt; it does not run the
goal unless the user explicitly asks.

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
5. **Review before returning.**
   - Confirm the prompt has one objective and one stopping condition.
   - Confirm it says what to read first.
   - Confirm it tells Codex when to stop early.
   - Confirm validation is explicit, not "make sure it works".

## Output Contract

Return:

1. A ready-to-paste `/goal ...` prompt in a fenced `text` block.
2. A short note listing any assumptions or missing inputs.
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

- Do not hardcode project-specific phase families; use the skills/phases named by the context.
- Do not turn a backlog grab bag into one goal. Split or ask.
- Do not bury the stopping condition near the end in vague prose.
- Do not include secrets, private tokens, or unnecessary personal data.
- Do not tell the future runner to mutate test inputs, recordings, fixtures, or handoffs unless the user explicitly asks.
