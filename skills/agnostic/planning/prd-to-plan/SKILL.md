---
name: prd-to-plan
description: Turn a PRD into an execution-ready multi-phase plan using tracer-bullet vertical slices, saved as a local Markdown file in ./plans/. Use when user wants to break down a PRD, create an implementation plan, plan phases from a PRD, or mentions "tracer bullets".
---

# PRD to Plan

Create the plan first. Do not implement code in this skill.

Break a PRD into a phased implementation plan using tracer-bullet vertical slices. Output is a standalone Markdown file in `./plans/`.

## Process

### 1. Confirm the PRD is in context

The PRD should already be in the conversation. If it is not, ask the user to paste it or point you to the file.

### 2. Explore the codebase

Read the repo first. Understand current architecture, existing patterns, integration layers, and durable constraints before locking phases.

### 3. Reduce ambiguity explicitly

Use `$grill-me` behavior for missing high-impact decisions only.

Ask one plan-shaping question at a time. Every plan-shaping question should use these headings, in this order:

- `Decision`
- `Recommendation`
- `Question`
- `Why it matters`

If the codebase can answer the question, inspect instead of asking.

### 4. Keep a decision ledger

After every answer, restate:

- locked decisions
- assumptions made
- open decisions

The saved plan should preserve this ledger so execution does not depend on hidden chat context.

### 5. Identify durable architectural decisions

Before slicing, identify high-level decisions that are unlikely to change throughout implementation:

- Route structures / URL patterns
- Database schema shape
- Key data models
- Authentication / authorization approach
- Third-party service boundaries
- Major UX states

These go in the plan header so every phase can reference them.

### 6. Draft vertical slices

Break the PRD into **tracer bullet** phases. Each phase is a thin vertical slice that cuts through all touched layers end-to-end, not a horizontal slice of one layer.

<vertical-slice-rules>
- Each slice delivers a narrow but complete path through every layer it touches
- A completed slice is demoable or verifiable on its own
- Prefer many thin slices over few thick ones
- Do NOT include specific file names, function names, or unstable implementation detail
- Do include durable decisions: route paths, schema shapes, key model names
</vertical-slice-rules>

### 7. Quiz the user

Present the proposed breakdown as a numbered list. For each phase show:

- **Title**: short descriptive name
- **User stories covered**: which user stories from the PRD this addresses
- **Why this slice stands alone**: what makes it independently verifiable

Ask the user:

- Does the granularity feel right? (too coarse / too fine)
- Should any phases be merged or split further?

Iterate until the user approves the breakdown.

### 8. Write the plan file

Create `./plans/` if it does not exist. Write the plan as a Markdown file named after the feature, for example `./plans/user-onboarding.md`.

The plan must stand alone without hidden conversation context. Include:

- initial situation
- issue / problem statement
- solution shape
- resolved decision ledger
- assumptions and constraints
- codebase findings
- testing strategy
- risks and mitigations
- validation gate per phase
- unresolved questions

### 9. Stop after planning

Yield after the plan is written. Do not implement code from this skill.

<plan-template>
# Plan: <Feature Name>

> Source PRD: <brief identifier or link>

## Initial situation

What exists today, what the PRD changes, and any constraints that shape the work.

## Issue

What problem must be solved.

## Solution shape

High-level approach and durable decisions that cut across phases.

## Decision ledger

- **Locked**: ...
- **Assumptions**: ...
- **Open**: ...

## Architectural decisions

Durable decisions that apply across all phases:

- **Routes**: ...
- **Schema**: ...
- **Key models**: ...
- (add/remove sections as appropriate)

---

## Phase 1: <Title>

**User stories**: <list from PRD>

### What to build

A concise description of this vertical slice. Describe the end-to-end behavior, not layer-by-layer implementation.

### Acceptance criteria

- [ ] Criterion 1
- [ ] Criterion 2
- [ ] Criterion 3

### Validation gate

- [ ] Exact test, command, or observable check that proves this phase is done

---

## Phase 2: <Title>

**User stories**: <list from PRD>

### What to build

...

### Acceptance criteria

- [ ] ...

### Validation gate

- [ ] ...

<!-- Repeat for each phase -->
</plan-template>
