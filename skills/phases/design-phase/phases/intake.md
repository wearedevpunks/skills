# Intake

## Entry Guard

Enter only when the router selected this gate: intake evidence is missing,
low-confidence, or stale for the resolved design target.

## Inputs

- the user's request and any named surface, route, or scope
- routes, pages, flows, and the target app root
- `components.json`, DESIGN.md, theme CSS or tokens, global styles, and
  reusable component files
- brand artifacts: logos, brand guides, palettes, type, earlier Brand Kit
  boards
- screenshots (present or cheap to capture) and Figma or other design inputs
  when supplied or connector-accessible
- content sources, copy constraints, brand constraints, and known design
  decisions
- `.devpunks/settings.json` only when provider or asset evidence matters

## Actor-Like Gate Boundary

Intake owns evidence collection and the handoff's Design Target section. It
reads the app and writes only the design handoff. Design decisions belong to
later gates.

## Bounded Action

1. Record the surface: `expo` when the target app depends on `expo`,
   otherwise `web`. Cite the file that proves it.
2. Record existing-UI intent: `improve-existing` only when the user clearly
   intends to improve or rework existing UI, quoting their words; otherwise
   `new-ui`.
3. Record scope units: one per user-visible page or flow, each with its real
   route.
4. Record whether `components.json` exists and its resolved paths, the
   DESIGN.md path, theme files, and reusable components.
5. Record brand artifacts. Mark them `fresh brand artifacts` only when they
   define the identity (mark, palette, type) and match current brand
   constraints.
6. Record screenshots and design inputs; record each missing one as an
   evidence gap. Gaps alone do not block.
7. Record content sources, copy and brand constraints, and known design
   decisions.
8. Classify confidence `high`, `medium`, or `low-confidence`, and list
   staleness risks.

Low-confidence rule: intake is `low-confidence` when it holds fewer than the
routes plus one style, component, or content source. Then ask one concrete
clarification or request one screenshot, record the question, and exit
blocked. Every later design decision rests on recorded evidence, never on a
silent blank-slate design system.

## Invariants

- App code, theme files, and DESIGN.md stay unchanged.
- Each recorded fact cites its source file, URL, or the user's words.

## Completion Evidence

- Design Target section: surface, existing-UI intent, scope units with
  routes, `components.json` state, DESIGN.md and theme paths, brand artifacts
  with freshness, screenshots, evidence gaps
- confidence class and staleness risks

## Declared Exits

- `complete` `intake_complete`: confidence is `high` or `medium`; every field
  above is recorded.
- `blocked` `intake_low_confidence`: one concrete question or screenshot
  request is recorded and shown to the user.
- `human_steering_required`: the request needs work beyond the accepted goal
  (for example, a target app that does not exist); the record names the
  decision needed.

## Durable Handoff

Write the Design Target section and one gate outcome through
[the design handoff contract](../references/design-handoff.md).

## Stop Or Router Re-entry

After `intake_complete`, re-enter [`router.md`](router.md). On a blocked or
steering exit, stop.
