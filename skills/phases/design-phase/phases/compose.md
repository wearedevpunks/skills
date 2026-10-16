# Compose

## Entry Guard

Enter only when the router selected this gate: a scope unit lacks fresh
accepted Compositions, or current evidence holds the user's reply to
presented Compositions.

## Inputs

- the Design Target section: surface, scope units with routes, and any
  surface the user named
- DESIGN.md, accepted constraints, and the Brand Kit
- presented Compositions and the user's reply, when present
- [the image generation reference](../references/image-generation.md),
  [the shadcn-Primitive Directive](../references/shadcn-primitive-directive.md),
  and [the copy lens](../references/copy-lens.md)

## Actor-Like Gate Boundary

Compose owns the Compositions of each scope unit and their acceptance record.
It delegates image generation to Codex through the image generation reference
and keeps verification of returned files and the handoff write.

## Bounded Action

When current evidence holds the user's reply to presented Compositions:

1. Record acceptance per scope unit only from the user's explicit words,
   naming the accepted images. Those images are the Compositions.
2. For a change request, record it and regenerate only the named images as a
   new attempt with steps 3 to 7 below.

Otherwise, for each scope unit without fresh accepted Compositions:

3. Select the imagegen skills: both `imagegen-frontend-web` and
   `imagegen-frontend-mobile`, unless the user named one surface.
4. For each selected skill, activate it with a concrete target (scope unit,
   route, content, accepted constraints) and write its image brief by its
   rules.
5. Append to every brief, in this order: the full DESIGN.md, the
   [shadcn-Primitive Directive](../references/shadcn-primitive-directive.md)
   text, and the brief paragraph of [the copy lens](../references/copy-lens.md).
6. Generate the images through
   [the image generation reference](../references/image-generation.md).
7. Get durable links through `repo-asset-management`; record each image in
   the Artifact Index with scope unit, surface, local path, durable link or
   upload blocker, and the DESIGN.md it is fresh against.
8. Present the images grouped by scope unit and ask the user to accept them or
   name changes. HUMAN checkpoint: the user accepts the Compositions. Stop.

## Invariants

- Every image comes from the image ladder, and every brief carries DESIGN.md,
  the directive, and the copy lens.
- Acceptance comes only from the user's explicit words; the existence of
  images is never acceptance.

## Completion Evidence

- one brief per scope unit and selected skill, with the three appended parts
- Artifact Index rows for every image
- the user's accepting words, quoted, for each accepted scope unit

## Declared Exits

- `checkpoint` `composition_acceptance_required`: images are presented with
  durable links or recorded upload blockers.
- `complete` `compositions_accepted`: every scope unit has accepted
  Compositions.
- `blocked` `image_generation_unavailable` or `image_generation_pending`: as
  the image generation reference defines.
- `human_steering_required`: the user's direction conflicts with DESIGN.md or
  accepted constraints; the record names the decision needed.

## Durable Handoff

Write the Artifact Index rows and one gate outcome through
[the design handoff contract](../references/design-handoff.md).

## Stop Or Router Re-entry

Stop at the checkpoint, blocked, or steering exit. After
`compositions_accepted`, re-enter [`router.md`](router.md).
