# Review Target And Identity Contract

Validate accepted bounds and normalize a supported target before mode-specific
budget evaluation. Both target forms then enter the same review graph, lens
composition, report, routing, and freshness contracts.

## Scope

Record the smallest certain inclusive scope. Full-repository expansion requires
an explicit caller request. Unsupported targets or invalid accepted bounds enter
`review_failed` with exact evidence, no report, and no counter change, including
when a delivery counter is already 3.

## Delivery Git/Diff Adapter

Freeze and record:

- locator
- actual base ref
- merge-base or fixed-point SHA
- head or dirty-worktree identity
- inclusive scope
- canonical patch hash

Use the actual PR base when a PR exists. Record the exact bounded diff command
and environment. `canonical_patch_hash` is SHA-256 of its unmodified output
bytes.

The normalized object has exactly these keys:

```text
kind: delivery-git-diff
locator:
actual_base_ref:
fixed_point_sha:
head_identity:
inclusive_scope: [sorted unique paths]
canonical_patch_hash: <64 lowercase hex>
```

The validator receives the same primitive locator/base/fixed-point/head/scope
evidence plus the canonical patch bytes, hashes those bytes itself, and rejects
any missing, extra, malformed, or inconsistent normalized field.

## Standalone Artifact Adapter

Plans, specs, and documentation freeze exact selected file bytes into one
deterministic ordered bundle. Sort file identities by their UTF-8 bytes. Hash
each file's raw bytes, then hash alternating identity/content-hash fields with
the canonical record below. Record:

- locator
- ordered file identities
- inclusive scope
- ordered bundle content hash
- explicit absence of a Git fixed point

The normalized target does not embed raw selected bytes. Standalone mode never
reads, increments, resets, or persists delivery counters.

The normalized object has exactly these keys:

```text
kind: standalone-artifact
locator:
ordered_file_identities: [sorted unique paths]
inclusive_scope: [the same sorted unique paths]
ordered_bundle_content_hash: <64 lowercase hex>
git_fixed_point: null
```

The validator receives primitive file identities and bytes, recomputes the
ordered bundle, and rejects any missing, extra, malformed, or inconsistent
normalized field.

## Canonical Hash Record

All identities use lowercase hexadecimal SHA-256. The executable reference is
[`../scripts/review-contract.mjs`](../scripts/review-contract.mjs).

`record(label, fields)` is this exact byte sequence:

1. UTF-8 bytes `review-identity-v1\n`.
2. `frame(label)`.
3. One `frame(value)` for each field in the stated fixed order.

`frame(value)` is the ASCII decimal UTF-8 byte length with no leading zero,
then ASCII `:`, then the exact UTF-8 bytes. Inputs receive no JSON encoding,
Unicode normalization, case folding, or newline rewriting. Sort set-like path
lists by unsigned UTF-8 byte order before framing. Hash raw file or patch bytes
directly before placing their lowercase hash in a record.

## Derived Identities

Use these labels and field orders exactly:

- `inclusive_scope_hash = hash(record("inclusive-scope", sorted scope entries))`
- `accepted_bounds_hash = hash(record("accepted-bounds", [accepted_bounds_identity, inclusive_scope_hash]))`
- `delivery_snapshot_hash = hash(record("delivery-snapshot", [locator, actual_base_ref, fixed_point_sha, head_identity, inclusive_scope_hash, canonical_patch_hash]))`
- `ordered_bundle_content_hash = hash(record("artifact-bundle", [file_1_identity, file_1_raw_sha256, ...]))`
- `ordered_file_identities_hash = hash(record("ordered-files", [file_1_identity, ...]))`
- `standalone_snapshot_hash = hash(record("standalone-snapshot", [locator, ordered_file_identities_hash, inclusive_scope_hash, ordered_bundle_content_hash, "no-git-fixed-point"]))`
- `source_set_hash = hash(record("source-set", [source_1_path, source_1_blob_sha256, ...]))`, with sources sorted by path bytes
- `delivery_review_lineage_id = hash(record("delivery-lineage", [delivery_goal_identity]))`
- `standalone_review_lineage_id = hash(record("standalone-lineage", [locator, accepted_bounds_hash]))`
- `delivery_review_run_id = hash(record("delivery-run", [review_lineage_id, decimal_ordinal]))`
- `standalone_review_run_id = hash(record("standalone-run", [review_lineage_id, snapshot12]))`

`snapshot12` is the first 12 lowercase hexadecimal characters of the mode's
64-character snapshot hash. `review-scope-slug` is `review-` plus the first 20
characters of `review_lineage_id`. Report UTC uses `YYYYMMDDTHHMMSSZ`.

Delivery lineage derives only from stable delivery-goal identity. Accepted-
bounds identity and hash do not enter delivery lineage. Standalone lineage
derives from target locator plus accepted-bounds hash. Delivery run identity
derives from lineage plus decimal ordinal; standalone run identity derives from
lineage plus `snapshot12`; the filename slug derives from lineage. Delivery preallocates ordinal
`recovered review_count + 1` only on explicit entry to `review_running`.
Standalone mode has no delivery-budget guard.

## Fixed Vectors

These values detect serialization drift:

- Delivery goal `goal:HI-104`, bounds identity `bounds:v1:HI-104`, scope
  `apps/cli/src/a.ts` plus `apps/wiki/spec.md`:
  - scope hash: `5fb7f4cd0577ad89de00916c8c18b122b264e50fb61df0c79249b88aba23a306`
  - bounds hash: `90dddda98e886e9b2ef511790f32d1d359847af24f5950361d25aedfe729bd8a`
  - lineage: `291c26957263b22b0cd5ad8a209415ff2992cc9a645f0018ed46ac4ba48de33b`
- With locator `repo:wearedevpunks/harness-intelligence`, base `origin/main`,
  fixed point `1111111111111111111111111111111111111111`, head
  `2222222222222222222222222222222222222222`, patch hash of 64 `a`
  characters, and ordinal 2:
  - snapshot: `f116049b650180523f8dd9ee48b900394f090a425ca8a1d7f369c56ca9d5998b`
  - run id: `9b164c914a883778fd5d4a3e242aaa2d261a44ce7601df10d1530bd9dd777e32`
  - slug: `review-291c26957263b22b0cd5`
  - report suffix identity: `20260811T120000Z-f116049b6501`
- Standalone locator `artifact:spec-v1`, bounds identity
  `bounds:v1:artifact`, files `docs/b.md` containing `beta\n` and `docs/a.md`
  containing `alpha\n`:
  - bundle hash: `107ee7c127b10e1826bf2d2899a36cc21291392ee6702af8d9e39b3e13553cb7`
  - bounds hash: `8dfde7eafe7f68b6ee5f763d23d01310f414fd5b7fca6393d5e92e90d963aa7f`
  - lineage: `ba4a5082445cac8ab133b533cfb090f936d69915266728bc9c6bd4b5b786f95a`
  - snapshot: `d4c43491a0aef9aaeb604dc224792222d0fb6c85caec76d03ff763896563a58a`
  - run id: `f165ab99100afe180bea68b41eb730fd2b61b2122347be0e50c91549140629d4`
  - slug: `review-ba4a5082445cac8ab133`

## Resume And Freshness

Delivery recovery keys on lineage and unique valid retained passes. Reconcile
the handoff projection from their highest ordinal. Separately recompute target,
accepted-bounds, and governing source hashes and select the highest fresh pass.

Standalone resume matches lineage, bounds, normalized target, and inclusive
scope; recomputes freshness; and selects the most recent unique valid report by
`reviewed_at`. It changes no delivery counter.
