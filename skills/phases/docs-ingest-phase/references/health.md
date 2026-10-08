# Health

Use this reference when `docs-ingest-phase` checks or maintains the project-owned wiki, or resumes an interrupted capture or ingest.

A health outcome holds two separate records. The _structural_ record says whether the wiki is mechanically sound. The _semantic_ record says whether its knowledge is still true, connected and discoverable. Each record carries its own evidence.

## Structural record

Run every one of the wiki contract's validation commands, resolved through [wiki-contract.md](wiki-contract.md). Together they cover frontmatter, links, navigation and source references.

Record for each command:

- `command`: the exact command line as run
- `covers`: which of frontmatter, links, navigation and source references it checks
- `result`: `pass`, `fail` with the reported findings, or `unavailable` with the reason it could not run

Record each check class that no declared command covers as `unavailable`.

Done when every declared command has a `result` and every check class has a covering command or an `unavailable` entry.

A _structural_ pass proves structure only: it never claims semantic accuracy or deployed visibility. Take accuracy from the _semantic_ record and visibility from evidence of the deployed route.

## Semantic record

Scope the pass to the pages this ingest or maintenance request touches, plus the pages that link to them or share their sources. Record each material finding as one of:

- `stale_claim`: a claim that current source, code or accepted decisions no longer support
- `contradiction`: two pages, or a page and its source, assert incompatible things
- `missing_connection`: related pages lack a link, or overlapping pages lack a synthesis
- `discovery_gap`: a page future work needs is absent from the discovery map or lacks its "Applies when" cue

Give each finding `kind`, `pages`, `evidence` and a `status`: `resolved` with the change made, or `unresolved` with the reason and the owner or decision it waits on. Keep contradictions and unaccepted choices `unresolved` until accepted evidence settles them.

Done when every page in scope was read and every finding is `resolved` or `unresolved`.

## Lifecycle changes

When a finding changes a learning artifact or an operational projection, record one justified refresh outcome by [learning-artifacts.md](learning-artifacts.md#refresh-outcomes), which also owns reference repair and projection updates.

## Chronology

Record capture, ingest and maintenance events by the log rule in [wiki-ingest.md](wiki-ingest.md#log). History stays discoverable, also when older entries move to an archive; a recent-entry limit never silently discards history.

## Resume

After an interruption, retry or lost acknowledgement, continue from durable evidence, not from the earlier run's report:

1. Inspect the preserved originals and their provenance records ([source-capture.md](source-capture.md)), the Git commits that contain them, and the routed outputs and log entries already written.
2. List the work the intended outcome still needs.
3. Continue only that missing work. Reuse an original already preserved at its revision path, and claim integration complete only when no earlier claim exists for the same source revision.

Done when every part of the intended outcome has durable evidence, with no duplicate original and no second integration-complete claim.

## Overlapping writes

Before reconciling content that overlaps a canonical page, re-read the page's current state from disk and Git. Apply your change on top of that state and preserve every concurrent change. When both changes cannot stand, leave the page as found and report an explicit conflict that names the page, both changes and the decision needed.

Health work reads Project Verifier assets only; the [Project Verifier boundary](../SKILL.md#project-verifier-boundary) governs them.

## Output

Report the health outcome as:

- `structural`: the structural record
- `semantic`: the semantic record
- `refresh_outcomes`: each refresh outcome with its justification and the references repaired
- `resume`: the evidence inspected and the missing work continued, or `not_applicable`
- `conflicts`: each explicit conflict, or `none`
