# Public Docs Path

Use this path for reader-facing product, usage, domain, command, onboarding,
changelog, and scaffold-recipient docs.

## Load References

Always read [../references/public-docs.md](../references/public-docs.md).

Also read [../references/fumadocs-routing.md](../references/fumadocs-routing.md)
when routed pages or navigation metadata will change.

## Workflow

1. Infer the repo's public docs surface from existing pages, sidebars, `meta.json`, indexes, and repo guidance.
2. Confirm whether the change is substantial public-facing docs work or a small public-doc patch.
3. For small patches, edit directly and report why the writer flow was skipped.
4. For substantial work, choose or create one durable private writer artifact bundle for the public target.
5. Inspect existing `fragments.md` in that bundle.
6. If fragments are missing or stale, run `writing-fragments` in docs-ingest artifact mode to create or refresh `fragments.md`.
7. Present the existing or generated fragments to the user and ask whether they are sufficient to continue.
8. If the user says they are insufficient, asks for changes, or says more guidance is needed, ask for the missing guidance before running `writing-beats` or `writing-shape`.
9. Once fragments are confirmed sufficient or the user has supplied enough guidance to revise them, update `fragments.md` as needed.
10. Run `writing-beats`, then `writing-shape`, then write or merge the final public page.
11. Update routed metadata, sidebars, and indexes required by the repo's docs system.

## Fragment Sufficiency Checkpoint

This checkpoint is mandatory for substantial public-doc work.

When presenting fragments:

- Say whether they were existing or generated in this pass.
- Show a concise list of the current fragment claims, examples, constraints, and open questions.
- Ask directly: "Are these fragments sufficient to continue into beats and shape?"
- Ask directly: "If not, what guidance, examples, audience detail, tone, exclusions, or missing facts should I add?"

Do not continue to beats, shape, or final public page writing while the answer is
missing or the user has said guidance is needed but has not provided it.

## Output Contract

Report:

- public docs target and audience
- writer artifact bundle used
- fragments presented, confirmed, revised, or blocked for guidance
- beats and shape artifacts written or skipped
- public pages written, merged, or skipped
- routed metadata, sidebar, or index updates
- validation commands run
- no-op reasons or blockers
