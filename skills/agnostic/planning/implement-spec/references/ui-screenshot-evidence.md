# UI Screenshot Evidence

Use this reference only when implementation changes a user-visible UI, visual state, browser flow, layout, copy surface, or interaction surface. This applies to `browser` and `mixed` review tasks by default, and to `cli` tasks only when they still change rendered UI artifacts.

## Contract

For each changed UI surface:

1. Capture a **before** screenshot from the current baseline before edits, or from the closest reachable pre-change state if the exact surface does not exist yet.
2. Capture an **after** screenshot from the same route, viewport, fixture, and state after the change.
3. Store screenshots as durable assets with `repo-asset-management`: backlog attachments first, then repo-provider fallback links.
4. Link the before/after asset URLs in `IMPLEMENTATION-NOTES.md`.
5. Carry the same links into the PR body, PR comment, or PR-ready handoff snippet.

Do not link local temp files, ephemeral browser session URLs, or unpushed workspace paths as final evidence.

## Capture Rules

- Pair screenshots by surface and viewport: desktop before/after, mobile before/after, modal before/after, and so on.
- Use the same data fixture, account, flags, locale, route, query params, and viewport for both sides of a pair.
- Capture before screenshots before production edits whenever possible.
- If before capture was impossible, record why and capture the closest honest baseline, such as the old empty state, broken state, or parent page.
- If the after state requires a dev server, prefer the repo's stable local URL convention over raw `localhost:<port>` values when available.
- For responsive UI work, include the viewports needed to prove the change. Do not add extra screenshots that do not clarify review.

## Durable Asset Storage

Use `repo-asset-management` for upload/storage details. Prefer backlog attachments when the backlog item is the durable review surface; otherwise use repo-provider assets and cross-link them from the backlog item or PR handoff.

Do not duplicate provider CLI commands here. If upload cannot run, record the blocker and keep local files only as pending evidence.

## Notes Format

Add or update `## UI Evidence Links` in `IMPLEMENTATION-NOTES.md`:

| Surface | Viewport | Before | After | Notes |
|---------|----------|--------|-------|-------|
| Checkout summary | Desktop 1440x900 | [before](...) | [after](...) | Same seeded cart |

Rules:

- Every row needs both before and after links, unless the notes explain why one side is impossible.
- Notes should name the fixture, state, or exception only when needed for replay.
- Keep links provider URLs or pushed repo paths, not local paths.

## Worker Brief Hook

When spawning a worker for a UI task, include this instruction:

> Capture before/after screenshots for changed UI surfaces, upload or push them to the active provider's durable asset storage, and record the links under `## UI Evidence Links` in `IMPLEMENTATION-NOTES.md`.

If provider upload details are needed, load `repo-asset-management`; do not invent provider commands in the worker brief.

## Finalization and PR Handoff

Before final report or PR creation:

1. Verify every UI task has a linked before/after pair or an explicit reason the pair is impossible.
2. Verify `IMPLEMENTATION-NOTES.md` contains durable links, not local-only evidence.
3. Include a `UI Evidence` section in the PR body, PR comment, or PR-ready handoff snippet with the same links.
4. If PR creation is out of scope for the run, leave the exact PR-ready `UI Evidence` snippet in `IMPLEMENTATION-NOTES.md`.
