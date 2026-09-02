# Delivery Status

Use this branch when a delivery caller supplies a fact it directly observed for
an exact linked Story or Task. Preserve the existing provider identities;
delegate provider mapping, mutation, and readback to the selected adapter.

Require stable provider IDs for the exact linked Story or Task. They remain the
same identities across delivery updates. This branch creates no new Story,
Task, or provider object.

## Observed Fact Handoff

The delivery caller reports only facts it directly observed. Accept one or more
of these facts, each with its evidence source and observation time:

- work started or changed to in-progress
- blocked, including the blocker reason and evidence
- review evidence and observed result
- pull request URL and observed state
- merge evidence
- staging deployment evidence
- production deployment evidence
- release branch, release name, and observed-at timestamp, when observed

For each newly observed fact, immediately record the exact linked Story or Task
delta through the provider adapter, then read back that fact before continuing.
Do not delay a start, blocker, review, or pull request update until a later
delivery event.

## Evidence Boundaries

Each fact remains distinct; one observed fact cannot infer another. Record
directly observed merge evidence as a merge fact only. Merge is never staging
deployment or production deployment. Staging is never production.
Recording merge leaves staging evidence, production evidence, and Fog
completion unchanged; the Fog remains open.

## Fog Completion

Before considering completion, read the Fog's accepted resulting scope from
immutable Grilling resolutions and provenance. This scope is the exact set of
Story and Task identities produced, plus provenance links to every Epic
enriched. Read the current production evidence linked to each exact stable
identity.

Complete the Fog only when exact production evidence covers every accepted
resulting Story and Task and therefore proves the Fog's accepted Epic
contribution reached production. A shared Epic may remain open for work outside
this Fog. Child creation, Task creation, merge, and staging deployment cannot
complete a Fog.

Cancelled and Superseded Fogs receive no completion credit, regardless of
coverage. Otherwise, list every identity missing production evidence; while any
remain, the Fog remains open. On complete coverage, record the final contextual
`V*` milestone iteration in which the last required scope reached production,
then read back the Fog status, completion iteration, scope links, and production
evidence.

## Result

The provider adapter owns status and evidence mapping, mutation, and exact
readback. Return the stable Story or Task identity, exact observed mutations,
exact readback, unchanged facts, and any unresolved delta.

On partial provider failure, stop and read back the exact observed writes and
unresolved delta. Resume from that readback and apply only the unresolved,
still-authorized fact; never replay the full update blindly.

This branch defines no CI/CD trigger, pipeline, or adapter design and performs
no automatic pipeline integration. It records evidence supplied by the caller.
