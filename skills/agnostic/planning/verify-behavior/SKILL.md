---
name: verify-behavior
description: Verify implemented visible behavior or reproduce reported visible failures end-to-end with browser or computer-use evidence. Use when acceptance criteria are visibly exercisable, implementation needs behavioral proof, or debugging needs a pre-fix reproduction.
---

# Verify Behavior

Prove or disprove visible product behavior. The invoking workflow owns setup,
fixes, acceptance decisions, and durable publication. This skill owns the
interactive scenario and its evidence.

## Modes

- **`reproduce`**: exercise the reported failure on the baseline before
  hypotheses or fixes.
- **`verify`**: exercise the implementation head after task and runtime checks.

Infer the mode only when the caller omits it: a failure report means
`reproduce`; an implementation or acceptance check means `verify`.

## Channel

Record `Channel: browser | computer-use` and why.

- Use `browser` when browser interaction can exercise the complete scenario.
- Use `computer-use` for native apps, mobile surfaces, OS dialogs, multi-window
  paths, or interactions unavailable through the browser capability.
- When the required capability is unavailable, return `blocked` with the exact
  missing capability or access. Keep every affected check blocked.

Use only tools the current environment actually exposes. Do not invent tool
names, capture APIs, upload commands, recordings, or artifact URLs.

## Coverage

1. Read the accepted spec, product document, plan, issue, or failure report.
2. Map each in-scope user story to its acceptance criteria and an exercisable
   end-to-end path. In `reproduce`, include the path to the reported failure. In
   `verify`, include every visibly exercisable in-scope story unless the caller
   assigned one story.
3. Record checks that cannot be exercised and why. Missing interaction evidence
   cannot become a pass through inference from code or tests.

## Exercise

1. Collect the mode, branch or ref, safe setup command or URL, expected states,
   and mapped checks.
2. Establish the requested state without placing credentials or secrets in
   prompts, screenshots, recordings, or reports. Leave authentication and
   approval actions with the user when required.
3. Exercise the critical path end-to-end through the selected channel. Record
   the actions taken and the observed state for every check.
4. Retain only evidence the capability actually returns: screenshots, browser
   traces, recordings, run links, logs, or concrete observations. Caption visual
   evidence with the state or check and what it demonstrates.
5. Assign one mode-specific status. Cite the evidence or blocker behind it.

## Status

**`reproduce`:** confirmed | partially confirmed | not reproduced | blocked

**`verify`:** verified | partially verified | not verified | blocked

`not reproduced` means the complete reported path was exercised and the failure
did not occur. An unavailable capability, inaccessible state, missing
credential, or failed setup is `blocked`, not `not reproduced` or `verified`.

## Report

Return:

- mode, branch or ref, and channel
- story and acceptance-criteria checklist with per-check observations
- overall status
- evidence paths or durable links that actually exist
- blockers and next action

Do not claim reproduction or verification without cited interactive evidence.
Do not expose secrets, personal data, or sensitive state in prompts,
screenshots, recordings, or reports.
