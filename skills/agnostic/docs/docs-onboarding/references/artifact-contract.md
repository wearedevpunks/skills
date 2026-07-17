# Docs Onboarding Artifact Contract

Use this reference while executing `docs-onboarding`.

## Project Map

Before the targeted grill starts, write:

- `<wiki-root>/content/docs/project/onboarding/project-map.md`

The Project Map must include:

- feature and UX flows
- operator/developer workflows and commands
- app, package, and code paths for each flow
- docs and backlog sources for each flow
- integrations and data boundaries
- contradictions and missing evidence
- candidate spec groupings

## Onboarding Grill Artifacts

Write and maintain:

- `<wiki-root>/content/docs/project/onboarding/onboarding-grill-status.md`
- `<wiki-root>/content/docs/project/onboarding/onboarding-grill-log.md`

In the onboarding status, persist the current round/frontier, stable question ids and prerequisites, unanswered items, and shared-understanding confirmation.

Create or update:

- `<wiki-root>/content/docs/project/onboarding/index.mdx`
- `<wiki-root>/content/docs/project/onboarding/meta.json`
- `<wiki-root>/content/docs/project/meta.json`

Add `onboarding` to the project `meta.json` pages list when missing.

## Grill Closure

The targeted grill can close when every blocking contradiction, missing backlog location, unclear feature owner, and high-impact inferred requirement is:

- confirmed
- rejected
- parked
- marked `Missing` with explicit follow-up

Do not grill every low-risk current-state fact. Carry those into `create-spec` as `Inferred`.

## Reconstructed Specs

Group reconstructed specs:

1. by backlog epic when backlog context exists
2. otherwise by user-facing or operator-facing feature flow

Use app/package boundaries as supporting evidence only.

Each reconstructed spec must include an `Evidence Level` in frontmatter and a short body evidence section.

Evidence levels:

- `Confirmed`: code, docs, or backlog evidence exists and the developer confirmed the requirement, or unambiguous docs/backlog intent backs it.
- `Inferred`: strong code, docs, or backlog evidence exists, but developer confirmation is missing.
- `Contradicted`: source evidence conflicts and needs resolution before the spec can be trusted.
- `Missing`: expected context was not found, and the spec must ask a follow-up.

Reconstructed specs must link back to relevant Project Map sections and onboarding grill decisions.
