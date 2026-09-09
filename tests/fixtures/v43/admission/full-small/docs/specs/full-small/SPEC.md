---
readiness: agent-ready
status: compiled
---

# Accepted browser slug preview

Goal: a browser form previews a safe lowercase ASCII slug from a title.

## Outcome

OUT-001: A user can preview a safe slug, understand invalid input, and recover to a valid preview in one accessible browser form. AC-1–AC-5 all cover OUT-001.

## Acceptance criteria

AC-1: In the browser, enter ` Hello, WORLD! ` in Title and activate Preview slug. The visible result is exactly `hello-world` and the error region is empty.
AC-2: `slug(title)` trims whitespace, lowercases ASCII, replaces each maximal run outside `[a-z0-9]` with one hyphen, and removes boundary hyphens. The form uses this same public module.
AC-3: Empty or punctuation-only input shows a useful visible error and clears the previous result. A subsequent valid title clears the error and produces the correct result.
AC-4: Title has an accessible label, the action is a native button and result/error updates are accessible live content. User text is rendered as text, never HTML.
AC-5: Browser evidence proves successful preview, invalid-input clearing and recovery. Use the selected source workflow to retain that evidence; when it requires project-owned executable references, those preserve launch/readiness/drive/evidence/cleanup and behavior knowledge without changing shared skill source.

Bounds: dependency-free static browser application served by the provided Node server. No persistence, authentication, backend product logic or deployment. Existing server is fixture infrastructure; product implementation belongs to the module and UI task scopes. Final output maps every criterion to evidence. UI evidence must come from real native browser interaction, not test inference.

## Accepted technical and testing decisions

Keep the existing dependency-free browser module and static Node server. The slug function is the normalization seam; DOM code owns browser interaction. Drive the actual form through native browser capability. Capture failing public-result assertions before implementation, then the same passing assertions; syntax checks supplement them. Retain actual positive, invalid-input clearing and recovery observations plus before/after screenshots. The selected workflow owns any executable verification references; shared source is unchanged.

## Verification seams

The exported slug function returns the normalized string. Browser input/button interactions update visible result and error regions. The invalid-input falsifier is a retained old result or absent useful error; the recovery falsifier is a stale error or wrong new result. Inspection of the live DOM proves labels/live regions and text rendering. Evidence identifies exact product commit, URL, commands, observations and retained screenshot paths.

## Non-goals and constraints

No persistence, authentication, deployment or package dependency is introduced. Preserve existing server route allowlist and module/UI ownership. Reusable source publication, merges and releases are outside this fixture. Provider projection derives owner-ready delivery structure from this outcome; the specification does not prescribe provider identities or counts. No unresolved requirement remains.
