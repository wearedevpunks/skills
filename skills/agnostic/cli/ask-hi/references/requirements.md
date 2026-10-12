# Requirements family

This family turns bounded, unclear requirements into a retained architecture/spec pair and a delivery-depth backlog. `$requirements-phase` is the only orchestrator: it owns decision closure, compile order and the authority to project delivery-depth backlog. Each compile step retains its artifact by an immutable blob URL before the next step reads it. `$requirements-grill` composes `$grilling` (scheduler), `$brainstorm`, `$domain-modeling`, `$wait-what` and `$show-me`; `$wayfinder` picks a route for one stuck unknown. The result goes to `$delivery-phase` and `$create-plan`.

`$requirements-phase` → `$requirements-grill` → `$create-architecture` → `$create-spec` → `$write-backlog`

## `$requirements-phase`
Explicit-only; Pack `requirements`. Takes bounded requirements to a retained `ARCHITECTURE.md` + `SPEC.md` pair and a delivery-depth backlog.
- **Use when:** bounded requirements need decision closure, compilation or backlog projection; optional Finder context (Fog, Finder/Research/Prototype child, durable Finder handoff) only when the caller supplies it. **Not for:** Finder intake, which goes to `$business-finder` or `$functional-finder`; an accepted pair, which goes to `$delivery-phase`.
- **Steps:** 1 Select the input contract; done when the scope is bounded or the Fog graph resolves exactly. 2 Read the grill status before the log; summarize accepted, rejected, superseded, parked, unresolved; no status → start a bounded grill. 3 Run `$requirements-grill` until every material branch is accepted or explicitly parked and the user confirms shared understanding. 4 `$create-architecture` with current status + log; done at `architecture-written`. 5 `$create-spec` with that exact retained architecture and the same sources; done at `spec-written` with both URLs verified. 6 Check the caller's provider projection boundary. 7 `$write-backlog` with the verified spec blob URL + current provider evidence. 8 Return one Requirements result.
- **Calls:** `$requirements-grill` for open decisions; `$create-architecture`, then `$create-spec`, for every delivery (fresh, resumed, local); `$write-backlog` for projection. **Called by:** human only; `$delivery-phase` (`phases/spec.md`), `$create-plan`, `$review-phase`, `$design-phase`, `$docs-onboarding`, `$implement-spec` (tiny run for out-of-goal debt ambiguity) and `$resolve-debt-phase` (accepted debt) route their work to it.
- **Writes:** nothing directly. Result: both artifact paths, immutable identities, verified blob URLs, Write Backlog result, exact residual delta.
- **Stops / gates:** no spec before a retained architecture; no backlog before a retained, verified pair. `architecture-not-ready` / `spec-not-ready` return each gap to its owner (open decisions → grill). Missing provider authority → blocked backlog delta; the pair stays retained. Counts of grill children, specs, Stories or Tasks are never prerequisites. Creates no Fog or Finder artifact.
- **Source:** `.agents/skills/requirements-phase/SKILL.md`

## `$requirements-grill`
Model-invoked; Pack `requirements`. Turns uncertain ideas into pinned decisions, a canonical glossary and axioms, persisted as durable grill artifacts.
- **Use when:** product or architecture discovery, a long design interview, branch-by-branch closure, canonical terms, compaction-safe logs, wiki synthesis from closed decisions. **Not for:** a throwaway interview, which `$grilling` covers; backlog projection, which `$write-backlog` owns through `$requirements-phase`.
- **Steps:** 1 Create or reuse log + status; move legacy `docs/<topic>-grill-*.md` in. 2 Scan routed learnings. 3 Give `$domain-modeling` the status glossary before the first question. 4 Ground each technical branch: locate behavior, owner, primitive (stack skills, `opensrc`), consequence via `$show-me`, decision with recommendation + alternative; missing facts become prerequisites of the affected Q ids only. 5 `$brainstorm` to completion before the first frontier. 6 `$grilling` rounds, each question through `$wait-what`; a round is done when every frontier item is answered, parked or deferred and persisted. 7 Response-set checkpoint after every response set (also partial): record, re-run `$brainstorm`, trace changes, keep Q ids stable, persist the next frontier. 8 Empty frontier → final `$domain-modeling` pass → `$show-me` of the persisted understanding → confirmation `pending` → `confirmed` only on explicit user confirmation. 9 Explicit closure → wiki synthesis.
- **Calls:** `$domain-modeling`, `$brainstorm`, `$grilling`, `$wait-what`, `$show-me` as above; `$effect-service-design` for Effect ownership; subagent or `$parallel-research` for fact gaps; `$wayfinder` when one unknown needs a route. **Called by:** `$requirements-phase`, `$design-phase` (grill phase), `$docs-onboarding`; term changes from `$create-spec`, `$write-backlog`, `$create-plan`, `$implement-spec`, `$improve-codebase-architecture`, `$wait-what` and the domain-structure skills route here.
- **Writes:** `<wiki-root>/content/docs/project/grilling/<topic>-grill-log.md` (`### Q<N>`, `### Glossary Q<N>`; Q ids never reused, changes add superseding entries) and `<topic>-grill-status.md` (`## Current Round` with `R<N>`, frontier, confirmation `not-ready|pending|confirmed`; `## Technical Grounding`; `## Glossary`); `grilling/meta.json`, `grilling/index.mdx`, one `<wiki-root>/log.md` entry. After closure: `<wiki-root>/content/docs/project/domains/<context>-glossary.mdx` plus concept/flow/decision pages and one `grill` log entry.
- **Stops / gates:** HITL every round. 100% only with an empty frontier, explicit confirmation and every branch grounded. Grounding is evidence, not a plan: no edit order, estimates or tasks. Closure picks the smallest model. Parked = preserved scope. Handoff reports branch %, parked branches, next direction; closed artifacts feed `$create-architecture` through `$requirements-phase`; an incomplete grill returns to `$wayfinder`.
- **Source:** `.agents/skills/requirements-grill/SKILL.md`, `references/grilling-flow.md`, `references/artifact-output.md`, `references/wiki-output.md`

## `$grilling`
Model-invoked; Pack `planning`. Shared primitive that interviews in dependency-ordered rounds until shared understanding.
- **Use when:** the user asks to grill or stress-test a plan, idea or decision; another skill needs the round scheduler. **Not for:** decisions that must survive as artifacts, which go to `$requirements-grill`.
- **Steps:** 1 Map the design tree; frontier = decisions whose prerequisites are settled. 2 Ask the whole frontier in one numbered round: one decision each, question, recommendation, rationale. 3 A branch settles only when answered, parked or explicitly deferred; recompute and restate locked decisions, assumptions, parked items, next frontier. 4 Discoverable facts go to a subagent; only downstream questions wait. Done when the frontier is empty and the user confirms shared understanding.
- **Calls:** none. **Called by:** `$requirements-grill`, `$create-plan`, `$finder-phase` (grilling gate), `$write-backlog`, `$improve-codebase-architecture`; `$wayfinder` recommends it.
- **Writes:** nothing; the caller holds durability.
- **Stops / gates:** waits for the user each round; acts only after confirmation; a dependent question never shares a round with its open prerequisite.
- **Source:** `.agents/skills/grilling/SKILL.md`

## `$brainstorm`
Model-invoked; Pack `requirements`. Analyses a bounded system from the operating agent's seat and returns evidence-grounded observations and candidate decisions.
- **Use when:** asked to brainstorm a system; `$requirements-grill` or `$create-architecture` invokes it. **Not for:** accepting decisions; the caller owns acceptance.
- **Steps:** 1 Bound system, operator, constraints, evidence; unsupported premises = unknown. 2 Trace intake, state, control, feedback, recovery, handoff; apply the 10 Flow failure lenses; done when each lens has evidence, an explicit unknown or a not-applicable reason. 3 Derive the smallest changes. 4 Return observations + unresolved decisions, each traced to evidence or an explicit unknown.
- **Lenses:** Entry points and path convergence; Critical execution paths; State ownership and authority; Transaction and side-effect boundaries; Concurrency and stale state; Idempotency and retries; Partial failure and recovery; Execution lifetime and durability; Lifecycle and dependency transitions; Completion and observability. `$create-architecture` reuses them as Flow Failure Coverage rows.
- **Calls:** none. **Called by:** `$requirements-grill` (before the first frontier, after every response set), `$create-architecture` (once per compile).
- **Writes:** nothing, unless the caller authorizes doc or plan edits.
- **Stops / gates:** output stays candidate until the caller accepts it; proposes mechanisms only for supported risks.
- **Source:** `.agents/skills/brainstorm/SKILL.md`

## `$domain-modeling`
Model-invoked; Pack `requirements`. Challenges and sharpens domain terms; records glossary terms and ADRs inline as they crystallise.
- **Use when:** terminology changes, a `GLOSSARY.md` edit, an ADR. **Not for:** only reading the glossary.
- **Steps:** challenge terms against the glossary; sharpen fuzzy terms; invent concrete scenarios; cross-check code; update the glossary inline, not batched.
- **Calls:** none. **Called by:** `$requirements-grill` (before Q1, on each term change, final pass).
- **Writes:** standalone: root `GLOSSARY.md` (or `GLOSSARY-MAP.md` + per-context `GLOSSARY.md`) and ADRs `docs/adr/NNNN-slug.md`, created lazily. Inside a grill: the grill status `## Glossary` only; implementation consequences go to grill artifacts and `SPEC.md`.
- **Stops / gates:** an ADR only when the decision is hard to reverse, surprising and a real trade-off; definitions are 1-2 sentences, project-specific terms only.
- **Source:** `.agents/skills/domain-modeling/SKILL.md`, `GLOSSARY-FORMAT.md`, `ADR-FORMAT.md`

## `$create-architecture`
Model-invoked; Pack `planning`. Compiles closed grill decisions into a source-attributed whole-system `ARCHITECTURE.md` before any `SPEC.md`.
- **Use when:** a new delivery after grill closure; a refresh after its sources change. **Not for:** interviewing or filling gaps, which go back to `$requirements-grill`; backlog items, which `$write-backlog` owns.
- **Steps:** 1 Read the contract; read status, then log; reconcile Q ids, supersession, glossary, evidence, learnings. 2 Resolve the folder with create-spec `references/folder-naming.md`; reserve the sibling `SPEC.md` path without creating it. 3 `$brainstorm` on the accepted flow; account for every lens. 4 Compile from the template; keep every accepted detail; assign selectors; Spec Traceability `pending-spec-ids`. 5 `$show-me` views embedded in the document (system map, flow/state/sequence). 6 Check links, selectors, coverage, visuals; run a Mermaid parser or record it unavailable. 7 Save + create-spec `references/wiki-bookkeeping.md` with `Compiled`. 8 Dedicated commit, push, immutable blob URL pinned to full SHA + path, byte readback; done at `architecture-written`.
- **Calls:** `$brainstorm`, `$show-me`. **Called by:** `$requirements-phase`; `$create-spec` amends only its traceability metadata.
- **Writes:** `<wiki-root>/content/docs/project/specs/<domain>/<topic>/ARCHITECTURE.md` (`type: architecture`, `status: compiled`, `readiness: agent-ready`). Selectors `ARC-###`, `FLOW-###`, `FLOW-###-STEP-###`, optional `DEC-###`, never reused or renumbered. Sources S1 status, S2 log, S3 glossary, S4 evidence with immutable revisions; grill evidence by `Q<N>` + exact log anchor. Sections include Spec Traceability and Flow Failure Coverage.
- **Stops / gates:** inputs need closed decisions, explicit confirmation, grounded branches, parked items with owner + resume trigger; else one atomic `architecture-not-ready` listing every gap, prior artifact kept. Retention failure is also not-ready. `status` implies no human approval. Stores neither its own SHA nor the SPEC identity.
- **Source:** `.agents/skills/create-architecture/SKILL.md`, `references/artifact-contract.md`, `assets/ARCHITECTURE-TEMPLATE.md`

## `$create-spec`
Model-invoked; Pack `planning`. No-interview compiler of confirmed decisions + retained `ARCHITECTURE.md` into a provider-neutral `SPEC.md`.
- **Use when:** requirements are closed or explicitly parked and a retained sibling `ARCHITECTURE.md` has a verified blob URL. **Not for:** questions, which go to `$requirements-grill`; provider writes, which `$write-backlog` owns.
- **Steps:** 1 Read the glossary in the grill status; term changes → `$requirements-grill`. 2 Resolve the folder. 3 Validate readiness; else one atomic `spec-not-ready`, no partial file. 4 Draft from the template; keep existing OUT/AC. 5 `$show-me` views from confirmed decisions only. 6 Fill the architecture's Spec Traceability; validate both drafts before replacing either. 7 Retain the enriched architecture first; write its final identity in `Architecture Source` + frontmatter `links`. 8 Quality bar, bookkeeping, dedicated commit, push, verified stable blob URL; done at `spec-written` with both immutable URLs.
- **Calls:** `$show-me`; readiness gaps route to `$requirements-phase` / `$requirements-grill`, `$parallel-research`, `$prototype-phase`, `$finder-phase`. **Called by:** `$requirements-phase`.
- **Writes:** `<wiki-root>/content/docs/project/specs/<domain>/<folder>/SPEC.md` (fallback roots per `folder-naming.md`; kebab-case, `PROJ-123-` prefix when ticketed). Frontmatter `type: spec`, `status: compiled`, `readiness: agent-ready`. `### OUT-###`; `AC-###` with `Covers: OUT-###` + architecture backlink; Dependency Readiness `No Stack Required|Ready`; Branch/Base Intent; Verification Seams; Prototype Verdicts. Bookkeeping: `<domain>/<domain>-specs.md`, `meta.json`, specs index, one `spec` `Compiled` entry in `log.md`.
- **Stops / gates:** never `Blocked` with `agent-ready`; every OUT has ≥1 AC; ids unique, retired codes never reused; no invented Q, decision or rationale; folder collision with another capability → `spec-not-ready`; no approval stop, approval never inferred; OUT codes set no backlog cardinality.
- **Source:** `.agents/skills/create-spec/SKILL.md`, `references/readiness.md`, `references/folder-naming.md`, `references/spec-quality-bar.md`, `references/wiki-bookkeeping.md`, `assets/SPEC-TEMPLATE.md`

## `$write-backlog`
Model-invoked; Pack `requirements`. Sole provider mutation authority: reconcile, preview, write, exact readback, residual delta.
- **Use when:** one semantic operation: initialize/reconstruct, Fog/Grilling/support intake, Business or Functional projection, delivery projection from an immutable `SPEC.md` blob URL, Normalization, delivery status, issue reconciliation. **Not for:** plan detail (files, commands, workers), which belongs in `PLAN.md` via `$create-plan`.
- **Steps:** 1 Read the glossary. 2 Project context: settings, Root, wiki, repo, provider workspace; a legacy destination gets zero writes. 3 Fresh reads by stable identity. 4 Reconcile: zero matches → create; one match with the same wiki identity → enrich; ambiguity → stop; a title match is discovery only. 5 Load exactly one branch reference. 6 Build the full delta; validate authority, hierarchy, links, `V*`, `scripts/validate-task-blocker-graph.mjs`. 7 `$show-me` topology preview; structural changes need explicit approval. 8 One adapter from `backlogProvider` (Linear | GitHub); write; read back everything. Done when IDs, URLs, wiki identities, approvals, readback and residual are returned.
- **Calls:** `$show-me` (preview), `$wait-what` (wording), `$grilling` / `$prototype` (Fog support). **Called by:** `$requirements-phase`, `$finder-phase`, `$business-finder`, `$functional-finder`, `$docs-onboarding`, `$delivery-phase` (projection, delivery status), `$implement-spec` (delivery status), `$create-plan` (readback only).
- **Writes:** provider items: Root > Product Area > Initiative > Epic > Story (one `V*`) > Task (same `V*` + native blockers); Fog is lateral provenance. Linear: Root = Initiative, Product Area = Project, others = Issues labelled `Kind/<kind>`. GitHub: one Projects V2, Area/Initiative/Kind fields, sub-issues, milestone `V*`. Delivery projection: shippable Stories, atomic owner-ready Tasks; OUT-### is traceability only.
- **Stops / gates:** missing, mutable or ambiguous authority → every gap listed, zero writes. Partial failure → stop with observed writes + residual. Only exact readback proves success; never replay a batch blindly. Merge ≠ staging ≠ production; a Fog completes only on production evidence for every accepted Story/Task.
- **Source:** `.agents/skills/write-backlog/SKILL.md`, `REFERENCE.md`, `references/technical-projection.md`, `references/issue-reconciliation.md`, `references/delivery-status.md`, `references/providers/linear.md`, `references/providers/github.md`, `assets/concepts/story-shape.md`

## `$wait-what`
Model-invoked; Pack `misc`. Re-pitches a message that did not land: context, ASD-STE100, ubiquitous language.
- **Use when:** an explanation or question missed. **Not for:** renaming terms, which goes to `$requirements-grill`.
- **Steps:** read the canonical glossary in the routed grill status; keep its terms; re-pitch.
- **Calls:** none. **Called by:** `$requirements-grill` (every question), `$write-backlog` (wording), `$create-plan` (final language check), `$business-finder`, `$functional-finder`, `$finder-phase`; human.
- **Writes:** nothing.
- **Stops / gates:** keeps glossary terms unchanged.
- **Source:** `.agents/skills/wait-what/SKILL.md`

## `$show-me`
Model-invoked; Pack `misc`. Presents the current topic in the smallest visual view, with a textual conclusion beside it.
- **Use when:** an explicit ask, or ≥3 mappings, branches, dependencies, steps, states or interacting parts. **Not for:** decisions or approval; the owning workflow holds them.
- **Steps:** pick one view (pseudocode, call tree, component tree, shallow file tree, Mermaid, diff, whole block); add a second only when one is not enough; HTML only with explicit artifact intent and a supported opener.
- **Calls:** none. **Called by:** `$requirements-grill` (live + pre-approval), `$create-architecture` and `$create-spec` (embedded views), `$write-backlog` (topology preview), `$create-plan`, `$implement-spec`, `$debugging-phase`, `$review-phase`, `$docs-ingest-phase`, `$finder-phase`, Finder wrappers, `$prototype-phase`.
- **Writes:** nothing itself; callers embed its views.
- **Stops / gates:** presentation only; adds no decision, evidence, approval or certainty; a visual is never approval.
- **Source:** `.agents/skills/show-me/SKILL.md`

## `$wayfinder`
Model-invoked; Pack `planning`. Nonmutating decision support: one route for one precise unknown owned by an active workflow.
- **Use when:** a grill question depends on an unknown that is neither a plain human choice nor a quick fact. **Not for:** state changes; the owning workflow keeps state.
- **Steps:** 1 Read the unknown, owning item, evidence, decision owner. 2 Recommend exactly one: grilling (human choice closes it), research (`$parallel-research`, readonly evidence), prototype (`$prototype-phase`, artifact + human verdict). 3 Return the recommendation, selecting evidence, owning item, and the result needed to resume.
- **Calls:** none; it recommends. **Called by:** `$requirements-grill` (by name, when a grill stays incomplete).
- **Writes:** nothing.
- **Stops / gates:** creates no item, changes no provider, authorizes no projection or delivery.
- **Source:** `.agents/skills/wayfinder/SKILL.md`
