# Review Packet and Lens Results

Preparation freezes one disposable Review Packet for one epoch. Its facts contain
accepted bounds, normalized target and snapshot, governing source identities,
delivery lineage/run, and source-attributed Spec, plan, skill guidance,
Verification evidence and relevant dependency pointers. Each pointer gives exact
scope, source identity and freshness rule. Bounded source excerpts support lookup;
source authority stays at the pointer. Reviewer conclusions and persuasion prose
have no place in the shared facts.

Prepare the packet as JSON with exactly `packet_identity`, `review_run_id`,
`accepted_bounds_hash`, `snapshot_hash`, `source_set_hash`, `facts` and
`facts_sha256`. Derive `packet_identity` using `reviewPacketIdentity` in
`review-contract.mjs`; `facts_sha256` hashes the UTF-8 facts bytes. Freeze the
packet bytes and retain their digest in task evidence. Parent verifies that facts
and pointers correspond to the normalized target and governing sources before
both axes receive those same bytes. The digest checks transport consistency;
it does not establish authority for unsourced prose.

The `review` Standards and Spec axes each receive the frozen packet bytes and
their own obligations (see the coverage table in
[Run Review](../phases/run-review.md)). Each axis invokes the `autoreview`
helper once:

```bash
<autoreview-helper> --review-packet <path> --reviewer-identity review-standards --axis standards
<autoreview-helper> --review-packet <path> --reviewer-identity review-spec --axis spec
```

Capacity one uses sequential calls with
independent fresh contexts. Calls retain native handles and evidence through
observation timeout; inspect the same live process before retrying an actual
failed call.

Each Lens Result has exactly:

- `reviewer_identity`, `coverage` (`standards` or `spec`) and `packet_identity`;
- `outcome`: `clean`, `findings`, or `incomplete`;
- `candidates`, each with only `location`, `evidence_pointer`, `impact`,
  `proposed_severity`, `proposed_return_route` and `uncertainty`;
- `unavailable_coverage`, `cause`, `follow_up`.

Complete clean coverage has zero candidates; complete findings coverage has at
least one. Both use an empty unavailable list and null cause/follow-up.
Incomplete results name missing coverage, cause and required follow-up and may
retain already-found candidates. Preserve completed matching results during a
partial attempt, identify what remains, and complete all newly applicable axes
before assembling a report. Semantic changes invalidate the epoch rather than
turning partial coverage into a clean result.

The report's `review_epoch` has exactly `protocol: "two-axis-v1"`,
`packet_identity`, `results` and `adjudications`. Results hold one Lens Result
per axis, `standards` and `spec`, from two distinct reviewer identities. A
candidate reference is the JSON-serialized triple
`[reviewer_identity, coverage, candidate_index]` (zero-based). Parent groups
duplicates and investigates every distinct claim. Each adjudication contains
`candidate_refs`, `finding_id` (accepted stable ID or null for rejection), and
`evidence` explaining verification/disposition. Account for each candidate exactly
once; accepted finding IDs must match retained findings. These references retain
per-axis provenance even when duplicates become one finding.

Use `validateRetainedPass` with parent-frozen `assignedCoverage` entries
(`reviewer_identity`, `coverage`) for both axes before retention
can consume an ordinal. Completeness includes actual assigned coverage and parent
verification, beyond mechanical schema checks. Required axis failure, unavailable
coverage or stale target/bounds/source evidence consumes no completed pass.
Retention-only failure reuses the same complete fresh immutable report. An
accepted after-pass repair follows the focused/risk policy in the state graph;
changing a reviewed artifact after completion does not automatically open another
full review.

For an explicitly human-directed additional delivery pass, retain optional
`review_epoch.human_direction` with exactly `evidence` (the verified human
instruction pointer) and `authorized_ordinal`. Pass the same parent-verified
object as `humanReviewDirection` to entry and retention helpers. It authorizes
only that next ordinal; other ordinals still hit the default ceiling. Parent
verifies the human instruction itself; candidate or reviewer assertions cannot
supply this authority. Normal epochs omit this field.
