---
title: "[Title]"
domain: "[Domain]"
type: architecture
status: compiled
readiness: agent-ready
links: []
created: YYYY-MM-DD
updated: YYYY-MM-DD
---

# Architecture: [Title]

<!-- Fill under ../references/artifact-contract.md. Remove instructions and
unused optional rows/sections. Keep source, disposition, coverage, and validation
records. Frontmatter is compiler state; retention proof belongs in the handoff. -->

## Context and Scope

- Capability identity: [Resolved folder and accepted capability boundary]
- Actors and outcome: [Who needs what, and why]
- In scope / non-goals: [Accepted boundaries and constraints; source Q anchors]
- Spec: [Sibling path; link only if its target exists in the retained tree]

## Canonical Terms

[Exact accepted terms, definitions, relationships, and axioms used below.
Link the current glossary and its question anchors.]

## Sources

| Source | Role | Exact location and anchor | Immutable revision or content hash |
| --- | --- | --- | --- |
| S1 | Grill status and closure | [Path; current round/branch anchors] | [Identity] |
| S2 | Durable grill log | [Path; Q entry anchors] | [Identity] |
| S3 | Current glossary | [Status glossary or separate path/anchor] | [Identity] |
| S4 | Referenced evidence | [Path:symbol or URL/anchor; current behavior or accepted design] | [Identity] |

## Source Disposition

| Question / entry | Disposition | Accepted detail, replacement, or unresolved point | Evidence | Parked owner / resume trigger |
| --- | --- | --- | --- | --- |
| [Q ID + entry anchor] | [accepted / superseded / parked / unknown] | [Exact source claim; superseding entry if any] | [S ID + anchor] | [When parked] |

## Whole System

[Explain how actors, entrypoints, components, owners, and authoritative state
connect. Place a source-labelled system map here. Show accepted design and
observed current behavior distinctly; mark unknowns.]

[Beside the map: question/evidence anchors and a short causal conclusion.]

| Block selector / component / level | Owner | State and authority | Interface / dependency | Supported constraint and source |
| --- | --- | --- | --- | --- |
| [ARC code + explicit anchor; name] | [Owner] | [Authority and mutation rights] | [Exact accepted boundary] | [Constraint; Q/evidence] |

## Critical Flows and Boundaries

[Assign stable FLOW codes and addressed STEP codes with explicit anchors. Show
those selectors beside the represented steps. Connect system intent to concrete
calls, state changes, and implementation choices. Use applicable flow/state/sequence views or pseudocode/call/file trees;
each must answer a different question. Preserve accepted order, branches, waits,
transaction/side-effect boundaries, recovery, and observable completion.]

[Beside each view: question/evidence anchors and a causal plain-language
conclusion. Include accepted dependency/lifecycle constraints where they apply.]

## Accepted Detail Coverage

| Question + exact entry/evidence anchor | Exact accepted choice and supplied detail | Provided rationale / alternatives | Architecture selector + applicable visual | System constraint served |
| --- | --- | --- | --- | --- |
| [Q; exact accepted log entry; S:anchor] | [Library/version, helper/API/path, algorithm/config/protocol, order/limit as supplied] | [Provided text or not recorded] | [ARC / FLOW-STEP / optional DEC selector] | [Why this matters across levels] |

## Spec Traceability

- State: [pending-spec-ids before SPEC; complete only after every current OUT/AC
  has a validated mapping under the artifact contract]

[Before SPEC exists, keep selectors and Q evidence ready and record that spec
codes are pending. When create-spec drafts real codes, it replaces this notice
with the completed mapping. Codes and section selectors are lookup keys; link
only to targets present in the retained tree. Pair URLs belong in the handoff.]

| Spec code / section selector | Architecture selectors | Accepted grill Q / exact log-entry and evidence anchors | Coverage explanation |
| --- | --- | --- | --- |
| [Real OUT or AC code; pending until assigned by create-spec] | [One or more ARC / FLOW-STEP / DEC links, or justified not applicable] | [Q; exact accepted entry; S:anchor] | [Constraint mapped, or reason no structural counterpart applies] |

### Retired or Superseded Selectors

| Selector | Disposition | Replacement / reason | Source |
| --- | --- | --- | --- |
| [Previously published architecture selector or spec mapping] | [retired / superseded] | [Replacement link or accepted removal] | [Q/evidence] |

## Flow Failure Coverage

[Use every exact lens label from brainstorm's Flow failure lenses; the list is
owned there. Reference accepted guarantees and their evidence.]

| Lens | Evidence / unknown / justified not applicable | Guarantee at stake | Material unresolved gap |
| --- | --- | --- | --- |
| [Canonical lens label] | [Q/evidence or explicit reason] | [Accepted constraint] | [None, or return architecture-not-ready] |

## Parked Work and Non-material Unknowns

| Question / source | Disposition and scope consequence | Owner / resume trigger | Why current guarantees remain closed |
| --- | --- | --- | --- |
| [Anchor] | [Parked work or unknown; candidates stay unaccepted] | [Required for parked work] | [Evidence-grounded reason] |

## Validation

- Decision/source/glossary reconciliation: [Evidence and result]
- Exact-detail and cross-level coverage: [Evidence and result]
- Relative links, selector targets, and visual source/order checks: [Result]
- Spec-code -> architecture -> grill coverage: [Complete OUT/AC coverage with
  exact accepted entry anchors, or pending-spec-ids for initial compilation]
- Mermaid parsing/rendering: [Actual tool/result or explicit unavailable limit]
- Existing spec agreement: [Result, exact superseded constraints to refresh, or
  absent: architecture precedes spec]
- Remaining limits: [Non-material unknowns or validation limits; no approval stamp]
