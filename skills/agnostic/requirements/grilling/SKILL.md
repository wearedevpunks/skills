---
name: grilling
description: Grill a plan, requirement, design, or unclear decision through one-question-at-a-time pressure testing. Use when the user asks to grill, stress-test, interrogate, or sharpen an idea before building, or when another skill needs a grilling primitive.
---

# Grilling

Interview the user relentlessly until the plan, requirement, or design is clear enough to proceed.

## Core Behavior

- Ask one question at a time.
- Provide your recommended answer with each question.
- Explain why the recommendation is preferred.
- Walk the design tree branch by branch, resolving dependent decisions in order.
- If a question can be answered from code, docs, artifacts, or logs, inspect those sources instead of asking.
- When multiple interpretations exist, force a precise choice.
- Stop only when the active branch is closed, parked, or explicitly deferred.

## Question Contract

Each question should make the decision obvious:

- the decision being made
- your recommended answer
- the question the user must answer
- why the answer matters

Do not bundle unrelated decisions into one question.

## Closure

Before leaving a branch, restate:

- locked decisions
- assumptions made
- deferred or parked questions
- next branch or next workflow
