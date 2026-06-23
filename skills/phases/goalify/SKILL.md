---
name: goalify
description: Goalify messy intent, handoffs, issues, logs, specs, or notes by making Codex give itself a concise `/goal` objective.
---

# Goalify

Turn messy context into a tiny goal, then make Codex start that goal.

Goalify must not return a ready-to-paste goal. It must explicitly tell Codex:
`give yourself goal`.

## Use When

- The user says "goalify", "give yourself a goal", "write yourself a goal", or similar.
- The work needs a durable objective and stopping condition.
- The inputs include handoffs, issues, specs, plans, logs, notes, or tracker context.

## Do Not Use When

- The task is small enough to finish now.
- Requirements are too unclear to name one objective and one done signal.
- The user only asks to draft text for another person.

## Rules

- Output no fenced `/goal` block.
- Keep the goal after `/goal` under 4,000 characters.
- Aim for 300-900 characters. Longer needs a reason.
- Write one objective, one scope boundary, one proof surface, one stop condition.
- Prefer paths, issue IDs, commands, and artifacts over explanation.
- Delete background, motivation, repeated constraints, and nice-to-have steps.
- Do not include secrets.

## Workflow

1. Read only the sources needed to identify objective, scope, proof, and blockers.
2. Collapse the task to one outcome. If there are multiple outcomes, split or ask.
3. Draft the shortest complete `/goal` objective for Codex itself.
4. Verify it has:
   - objective
   - repo/path/branch when known
   - in/out scope
   - read-first sources
   - key constraints
   - validation
   - done condition
   - early-stop blockers
5. Invoke goal mode yourself. Say exactly: `give yourself goal`.

## Output

Do not print the goal for the user to paste. Report only that you are giving
yourself the goal, plus any missing input that prevents doing so.
