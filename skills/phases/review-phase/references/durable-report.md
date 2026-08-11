# Durable Review Report

Every completed run creates one unique immutable report:

`apps/wiki/content/docs/project/reviews/<review-scope-slug>-<YYYYMMDDTHHMMSSZ>-<snapshot12>-review-report.md`

The report filename slug derives from `review_lineage_id`. Its content never
changes after creation.

## Required Report Fields

The report bytes start with the wiki-required YAML frontmatter, followed
immediately by exactly one fenced authority block. Optional human prose may
follow its closing fence. Missing, malformed, extra, or duplicate frontmatter
or authority blocks are invalid.

````text
---
title: "<review-scope-slug> review report"
domain: "<domain>"
type: "review-report"
surface: "project"
permission: "internal"
links: []
review_lineage_id: "<stable lineage>"
review_run_id: "<mode-specific run identity>"
review_mode: "delivery | standalone"
reviewed_at: "YYYYMMDDTHHMMSSZ"
accepted_bounds_identity: "<identity>"
accepted_bounds_hash: "<sha256>"
snapshot_hash: "<sha256>"
created: "YYYY-MM-DD"
updated: "YYYY-MM-DD"
---

```review-report-json
{"review_lineage_id":"...", "...":"..."}
```
Optional human prose.
````

The parser reads both structures from retained bytes. Frontmatter has exactly
the typed fields above: every scalar is a string, `links` is an empty array, and
the fixed wiki values are `review-report`, `project`, and `internal`. Its title
uses the derived filename slug; created and updated equal the date in
`reviewed_at`. Its lineage, run, mode, timestamp, accepted-bounds identity/hash,
and snapshot hash must agree with the JSON authority and recomputed evidence.

The parsed JSON object is report authority. Detached objects, sidecars, and
caller-supplied derived identities are never trusted. It contains exactly these fields:

- `review_lineage_id`
- `review_run_id`
- accepted-bounds identity and hash
- `reviewed_at` and mode
- normalized target
- snapshot hash and narrow excluded envelope
- source paths and hashes for Spec, Standards, scoped guidance, and every named
  skill
- canonical `source_set_hash`
- an explicit outcome for Standards, skill adherence and scoped skills,
  architecture, simplify, and Spec
- stable finding identifiers with severity, location, impact, evidence, and
  action
- routing and validation

Delivery mode also records delivery-goal identity, review ordinal, and preceding
repair ordinal when present. Standalone mode records those delivery-only fields
as null or not applicable.

`lens_outcomes` has exactly `standards`, `skill_adherence`, `architecture`,
`simplify`, and `spec`; each value is `clean` or `findings`. Every finding has
exactly stable `id`, `lens`, `severity`, `location`, `impact`, `evidence`, and
`action`. Finding IDs are unique, severity is `critical`, `high`, `medium`, or
`low`, and each lens outcome agrees with whether that lens has a finding.

`routing` has exactly `primary` and `secondary_architecture_follow_up`.
`primary` is `debugging`, `implementation`, `debt_follow_up`, `docs_ingest`, or
`closeout`; the secondary flag is boolean. `validation` is an array of records
with exactly command, isolation mode, before/after frozen hashes, outcome, and
evidence. Isolation is proven no-write, disposable checkout, or disposable
snapshot. Retained validation records require equal before/after hashes.

Delivery ordinals are 1 through 3. Review 1 has null preceding-repair ordinal;
review 2 or 3 records respectively 1 or 2. Standalone delivery-goal identity,
review ordinal, and preceding-repair ordinal are all null.

The snapshot hash excludes only the report itself, navigation metadata, and the
wiki log envelope. Navigation ordering does not affect freshness. The report and
normalized target omit raw selected bytes.

## Retention Evidence

This reference defines retention evidence only. The router-selected retention
gate owns execution. The outside-report retention envelope contains the report
path, exact report SHA-256, report commit SHA, verified retained ref, and the
commit's changed paths. Those fields are evidence, not additions to the
immutable report.

Delivery refs are the current delivery branch or another repository-approved
ref. Standalone refs are
`review/<review-scope-slug>-<snapshot12>` or another approved ref. Only a valid
retained delivery report establishes an ordinal; standalone reports have no
delivery-counter meaning.

## Valid Retained Pass

[`../scripts/review-contract.mjs`](../scripts/review-contract.mjs) is the
executable encoder, byte parser, identity implementation, and validator. It
recomputes the normalized target, scope/bounds/source/snapshot hashes, lineage,
run ID, snapshot12, slug, path, and ordinal relationships from primitive current
evidence. A candidate is a valid retained pass only when every predicate holds:

1. the immutable bytes contain valid wiki frontmatter and one authority block,
   both satisfying every exact schema, agreement, and semantic rule above;
2. mode, lineage, run id, delivery ordinal, accepted-bounds identity/hash,
   snapshot hash, source-set hash, and deterministic report path equal values
   recomputed from the canonical identity algorithm;
3. the outside-envelope report SHA-256 equals the exact retained report blob;
4. current accepted-bounds, normalized-target, and governing-source hashes still
   equal the report values;
5. the report commit changed the report path and only repository-approved
   report, navigation, and wiki-log envelope paths;
6. the approved retained ref contains that exact report commit;
7. delivery ordinal is an integer from 1 through 3; standalone delivery-only
   fields are null.

A malformed report, wrong lineage or run id, wrong blob or freshness hash,
outside-envelope commit path, missing ref containment, or invalid ordinal is not
a pass and cannot affect a counter.

## Same-Run Uniqueness

Index retained candidates by `(review_lineage_id, review_run_id)`. Validate each
candidate independently before comparison.

- No valid candidate: no pass.
- One valid candidate: unique authoritative pass.
- Repeated discovery of the same path, report blob SHA-256, and report commit:
  reuse that already-retained pass; create no new pass and project its ordinal
  at most once.
- Two valid candidates for the same run with different path, blob SHA-256, or
  report commit: `same_run_conflict`; reject the run with exact evidence, no
  authoritative pass, and no counter change.

Recovery uses only unique or identical-reuse valid passes. Any same-run conflict
blocks recovery from that run rather than choosing one candidate. Delivery
projects the highest uniquely authoritative recovered ordinal.

The review report is the frozen-snapshot handoff. After fix 3, the delivery
handoff is final clean-state authority and links report 3, final changes,
focused validation, and clean status. Report 3 remains immutable pre-fix
evidence.
