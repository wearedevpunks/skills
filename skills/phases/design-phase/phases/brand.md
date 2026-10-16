# Brand

## Entry Guard

Enter only when the router selected this gate: no fresh accepted Brand Kit
exists and intake recorded no fresh brand artifacts, or current evidence holds
the user's reply to presented brand boards.

## Inputs

- the Design Target section, accepted constraints, and intake brand evidence
- presented boards and the user's reply, when present
- [the image generation reference](../references/image-generation.md)

## Actor-Like Gate Boundary

Brand owns the Brand Kit and its acceptance record. It delegates image
generation to Codex through the image generation reference and keeps
verification of returned files and the handoff write.

## Bounded Action

When current evidence holds the user's reply to presented boards:

1. Record acceptance only from the user's explicit words, naming the accepted
   boards. Those boards are the Brand Kit.
2. For a change request, record it and regenerate the named boards as a new
   attempt with steps 3 to 6 below.

Otherwise:

3. Activate `brandkit` with a concrete target: product, audience, accepted
   constraints, existing brand evidence, and scope units. Use its brief rules
   to write the board brief.
4. Generate the boards through
   [the image generation reference](../references/image-generation.md).
5. Get durable links through `repo-asset-management`; record each image in
   the Artifact Index with its local path, durable link or upload blocker, and
   the inputs it is fresh against.
6. Present the boards with their durable links and ask the user to accept
   them or name changes. HUMAN checkpoint: the user accepts the boards. Stop.

## Invariants

- Every board comes from the image ladder.
- Acceptance comes only from the user's explicit words; the existence of
  boards is never acceptance.

## Completion Evidence

- Artifact Index rows for every board
- the user's accepting words, quoted, for `brand_kit_accepted`

## Declared Exits

- `checkpoint` `brand_acceptance_required`: boards are presented with durable
  links or recorded upload blockers.
- `complete` `brand_kit_accepted`: the accepted boards are the Brand Kit.
- `blocked` `image_generation_unavailable` or `image_generation_pending`: as
  the image generation reference defines.
- `human_steering_required`: the user's direction conflicts with accepted
  constraints; the record names the decision needed.

## Durable Handoff

Write the Artifact Index rows and one gate outcome through
[the design handoff contract](../references/design-handoff.md).

## Stop Or Router Re-entry

Stop at the checkpoint, blocked, or steering exit. After
`brand_kit_accepted`, re-enter [`router.md`](router.md).
