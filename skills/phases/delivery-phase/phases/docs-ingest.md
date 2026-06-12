# Docs Ingest Phase

Use this phase when the delivered change affects product behavior,
architecture, setup, operator workflow, docs contracts, or spec domain
knowledge.

## Delegate

Load `docs-ingest-phase` only after this phase is selected.

## Checks Before Delegating

- Verify implementation and review are complete enough to document current truth.
- Classify docs target: public docs, private/project docs, root docs, runbook,
  wiki navigation, or explicit no-op.
- Do not document speculative future behavior as current truth.

## Completion State

Write or verify:

- docs pages, metadata, runbooks, or explicit no-op reason
- validation commands for docs changes
- source spec/change referenced by docs
- any follow-up docs debt

Then stop or re-enter `delivery-phase` for routing.
