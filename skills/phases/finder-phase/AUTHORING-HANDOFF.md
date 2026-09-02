# Finder Graph Authoring Handoff

## Obligation map

| Obligation | Mandatory | Survives interruption | Evidence artifact | Owner | Audit criterion |
| --- | --- | --- | --- | --- | --- |
| Two explicit-only wrappers | yes | yes | wrapper skills and metadata | wrappers | only Business and Functional compose engine |
| One immutable-lens Fog | yes | yes | runtime handoff and provider readback | ensure gate | exact identity and original lens agree |
| Generic support graph | yes | yes | child identities, relations, evidence | engine gates | generic Grilling, Research, and Prototype have no stage cardinality |
| Evidence-based selection | yes | yes | decision plus current child reads | grilling/support gates | reuse, create, or zero-write ambiguity is explicit |
| Deterministic resume | yes | yes | router, fixture, executable contract | router | current evidence selects exactly one route |
| Bounded non-completing return | yes | yes | durable return result | return gate | outcome contains no Fog-completion claim |

## State and topology

| State | Entry guard | Exit guard | Next states |
| --- | --- | --- | --- |
| Fog absent | supported wrapper lens, no exact Fog | exact Fog and immutable lens | grilling, handback |
| Grilling active | exact Fog, bounded result missing | retained evidence or support request | research, prototype, reconcile, return, handback |
| Support active | named child and precise unknown | immutable evidence or verdict | grilling, handback |
| Projection pending | ceiling-safe optional intent | exact or unresolved result | return, handback |
| Bounded result | required retained evidence exists | durable return written | terminal return |
| Human steering | current authority cannot resolve conflict | `$handback` guard passes | terminal or router re-entry |

Graph forms cover the baseline path, lens branch, support cycles, optional
projection skip, blocked/checkpoint outcomes, cold resume, and terminal human
steering. Current direct evidence outranks workflow-native artifacts, which
outrank a committed handoff and its advisory suggested route.

## Route matrix

| Scenario | Predicted route | Derived route | Match | Repair if mismatch |
| --- | --- | --- | --- | --- |
| Baseline path | ensure-fog | ensure-fog | yes | — |
| Branch path | grilling | grilling | yes | — |
| Repair cycle | reconcile | reconcile | yes | — |
| Human checkpoint | reconcile | reconcile | yes | — |
| Failure handback terminal | human-steering | human-steering | yes | — |
| Cold resume | return-target | return-target | yes | — |
| Stale or invalid artifact | human-steering | human-steering | yes | — |
| Contradictory suggestion loses | grilling | grilling | yes | — |
| Nested executor substitution | research | research | yes | — |
| Premature completion rejected | grilling | grilling | yes | — |

## Phase: audit

Status: complete

Scope: Repaired Finder runtime graph for the accepted two-wrapper intake model.

Artifacts: Wrapper skills, Finder bootstrap, seven flat gates, runtime
references, executable route contract, route fixture, and focused contracts.

Validation: Two explicit-only wrappers compose one engine. The engine owns one
Fog with immutable lens, generic Grilling, Research, and Prototype routing,
evidence-based reuse/create/ambiguity, optional ceiling-safe projection, cold
resume, durable handoff, bounded return, and `human_steering_required`.

Domain state: Technical and staged routes are removed. Historical staged state
is compatibility evidence only. No temporary seam remains.

Next suggested route: audit-complete terminal

Blockers: none

Resume identity: current canonical source revision and route fixture
