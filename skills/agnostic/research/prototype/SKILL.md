---
name: prototype
description: Build a throwaway prototype to answer a design question: a terminal app for logic or state, or several UI variations on one route.
disable-model-invocation: true
---

# Prototype

A prototype is throwaway code that answers a question. The question decides the shape.

## Pick A Branch

Identify which question is being answered from the user's prompt, surrounding code, or by asking if the user is around:

- **Does this logic or state model feel right?** Read [LOGIC.md](LOGIC.md). Build a tiny interactive terminal app that pushes the state machine through cases that are hard to reason about on paper.
- **What should this look like?** Read [UI.md](UI.md). Generate several radically different UI variations on a single route, switchable via a URL search param and a floating bottom bar.

The two branches produce different artifacts. If the question is genuinely ambiguous and the user is not reachable, default to whichever branch better matches the surrounding code: backend module means logic; page or component means UI. State the assumption at the top of the prototype.

## Rules

1. Mark it as throwaway from day one. Locate the prototype near the module or page it explores, and name it so a reader can see it is not production.
2. Provide one command to run. Use the project's existing task runner.
3. Use in-memory state by default. If persistence is the question, use a scratch DB or local file clearly named as prototype data.
4. Skip polish. No tests, no production abstractions, and no error handling beyond what makes the prototype runnable.
5. Surface the relevant state after every action or variant switch.
6. Delete or absorb the prototype when it has answered the question.

## Done

Capture the answer somewhere durable, along with the question it answered. If the user is around, capture it in conversation. If not, leave a `NOTES.md` next to the prototype so the verdict can be filled in before deletion.
