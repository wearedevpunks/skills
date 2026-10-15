# Delivery family

This family takes one accepted spec, issue or plan to closeout. `$delivery-phase` routes one bounded goal through one durable phase at a time; each phase emits a common Phase Result and the router recomputes the next phase from durable evidence. Two gates guard every dispatch: Architecture/SPEC Pair Complete and Backlog Projection Complete; a gap routes to `$requirements-phase`. `$create-plan` composes `$grilling`, `$parallel-research`, `$swarm-planner`, `$tdd` and `$codebase-design`. `$implement-spec` is the parent: it dispatches scoped workers, applies Task Gates, and calls `$verify-behavior`, whose coverage gaps go to `$create-verification-skill` or `$update-verification-skill`. `$goalify` wraps an AFK run; `$handoff` carries a pause across sessions.

`$goalify` → `$delivery-phase` → `$create-plan` → `$implement-spec` → `$verify-behavior` → `$review-phase` → `$docs-ingest-phase` → closeout

## `$delivery-phase`
Explicit-only; Pack `planning`. Router that takes one bounded delivery goal through one durable phase at a time.
- **Use when:** an accepted spec, issue or plan needs delivery. Modes: Full delivery (end to end), Resume, HITL checkpoint (one phase, then stop), Closeout. **Not for:** a runtime failure with no active delivery, which goes to `$debugging-phase`; unclear requirements, which go to `$requirements-phase`.
- **Steps:** router, first match; each phase is done when it emits a valid Phase Result. 1 Resolve required Context Pointers (one bounded refresh, else `blocked`). 2 Keep a terminal `human_steering_required`. 3 Pair Complete gate before any dependent dispatch, also local and resumed work; gap → `phases/spec.md` → Requirements Phase. 4 Failed task → `references/failure-continuity.md`. 5 Recover review lineage: `review_due` → `phases/review.md`, `debug_active` → `phases/debug.md`, `repair_active` → `phases/implement.md`. 6 Backlog Projection Complete gate; gap → Requirements Phase. 7 Missing/stale plan → `phases/plan.md` (`$create-plan`); open plan work → `phases/implement.md` (`$implement-spec`). 8 Completed implementation → `phases/review.md` until a retained completed pass exists. 9 Docs-affecting → `phases/docs-ingest.md` (`$docs-ingest-phase`), else `phases/closeout.md`.
- **Calls:** `$create-plan`, `$implement-spec`; `$review-phase` (Full delivery invokes it at once; other modes persist `review_due` + invocation context and stop); `$debugging-phase` only for runtime evidence in scope; `$write-backlog` delivery status; `$docs-ingest-phase`; `$repo-asset-management` for UI evidence. **Called by:** human; a `$goalify` goal; briefs from `$design-phase` and `$resolve-debt-phase` tell the human to invoke it.
- **Writes:** Delivery Handoff (`references/phase-handoff.md`); Phase Result `phase, outcome (complete|blocked|failed|skipped|human_steering_required), authority_or_evidence_created, changed_facts, invalidated_evidence, next_eligible_phase, blocker_or_stop_reason, context_pointers`; review/repair projection states `review_due … clean_handoff` with `review_count`, `repair_count`, `review_run_id`; human-steering decision record; debt artifact keyed by (report commit, report path, finding ID); closeout path-limited commit.
- **Stops / gates:** one PR per delivery run unless the user explicitly asks for a split or stack. Stops at a written HITL boundary, reported closeout, ambiguous/stale scope or missing access, or `human_steering_required` (exceeds bounds, changes requirements, weakens a gate, redesign, missing authority). Review: one pass by default; a second only for architecture, security/authz, public contract, runtime/deploy topology or accepted-scope change; at two → `review_budget_exhausted` unless a human authorizes. Ordinary repair → Focused Repair Validation, rerun only invalidated Verification. `autoreview` runs only inside `$review-phase`; docs and closeout need a retained completed pass. Closeout: release classification when the final tree changed, push, CI per check (local broad run only when CI lacks the full suite/E2E), merge is never deployment evidence, Fog completion needs production evidence, Owned Stack teardown. Resume wording alone never grants Full delivery.
- **Source:** `.agents/skills/delivery-phase/SKILL.md`, `phases/router.md`, `phases/{spec,backlog,plan,implement,review,debug,human-steering,docs-ingest,closeout}.md`, `references/{artifact-state,context-continuity,phase-handoff,failure-continuity}.md`

## `$create-plan`
Model-invoked; Pack `planning`. Composes planning skills into one run that writes an execution-ready `PLAN.md` of `Tn` tasks.
- **Use when:** a current retained agent-ready pair exists (also direct and `local` plans) and work needs decomposition before coding. **Not for:** implementation, which `$implement-spec` owns; a missing or stale pair, which goes to `$requirements-phase`.
- **Steps:** 1 Read repo, git, plan, backlog; verify the pair gate. 2 Visible control panel (locked/open decisions, next). 3 `$grilling` with `Decision / Recommendation / Question / Why it matters`; ledger updated per answer, synthesis every 5 decisions. 4 `$parallel-research` or `planning-discovery` subagent for readonly discovery; `opensrc path` + primary docs. 5 Wiki Context: done when `## Wiki Context` cites pages or says `No applicable context`; novel findings → `$docs-ingest-phase`. 6 Scoped `AGENTS.md` `## Skills` → `assigned_skills` + one `implementation_skill_guidance` per skill. 7 Architecture applicability `local | architecture-bearing` (backend/frontend-domain-structure). 8 `$swarm-planner` graph; done when the `plan-reviewer` subagent finds no gaps. 9 `$tdd` RED/GREEN per task. 10 Backlog sync; done when one `task_identity_mode` covers the plan. 11 `$show-me` graph/waves/gates. 12 `$wait-what` language check, then write and stop.
- **Calls:** as in Steps; `$codebase-design` for seams; `$requirements-grill` for pair or glossary gaps. **Called by:** `$delivery-phase` (`phases/plan.md`); the `$requirements-phase` result points to it.
- **Writes:** one `PLAN.md` in the spec folder. Plan: pair Context Pointers, `architecture_applicability`, decision ledger, `## Wiki Context`, dependency graph, waves, testing strategy, per-task/per-wave gates. Task: `id, depends_on, owned_paths, read_dependencies, shared_runtime_resources, relevant_input_set, wave_boundary, validation, task_identity_mode, backlog_item_id/url, relation_mode, assigned_skills, implementation_skill_guidance, tdd_status, red_command, expected_red_failure, green_command, review_mode, runtime_validation`. Identity: provider-task (`Tn` aliases one provider Task; `depends_on` mirrors native blockers) or planning-only (`relation_mode: unprojected` + skip reason), one mode per plan. Architecture-bearing plans add `A*` waves, Public Seam Contract, Migration Ledger. Waves are earliest-frontier labels, not barriers.
- **Stops / gates:** done when `PLAN.md` is complete and backlog sync is done or its skip recorded. `Blocked` Dependency Readiness → stop. Chooses no replacement architecture, creates no second Task identity, mutates no provider, spawns no implementation worker. Seam-design change → Requirements.
- **Source:** `.agents/skills/create-plan/SKILL.md`, `REFERENCE.md`, `references/{plan-schema,planner-task-graph,backlog-sync,architecture-convergence,tdd-shaping,grill-ambiguity,stop-conditions}.md`

## `$swarm-planner`
Model-invoked; Pack `subagents`. Dependency-aware plan of atomic `Tn` tasks for parallel agents.
- **Use when:** `$create-plan` builds its task graph, or a standalone parallel plan is asked for. **Not for:** implementation.
- **Steps:** 1 Research the codebase; stop if the architecture is unclear. 2 Docs for every external dependency. 3 Stop and ask on ambiguity, with recommendations. 4 Tasks with `id, depends_on, description, location, owned_paths, read_dependencies, shared_runtime_resources, relevant_input_set, wave_boundary, validation` (canonical schema: `create-plan/references/plan-schema.md`). 5 Save; subagent review; done when its feedback is applied.
- **Calls:** a review subagent. **Called by:** human; `$create-plan` loads it by path and sets the output to the spec-folder `PLAN.md`, review to `plan-reviewer`, questions to `$grilling`, status vocabulary to `Planned`.
- **Writes:** standalone `<topic>-plan.md` in CWD (Overview, Prerequisites, Dependency Graph, Tasks, Parallel Execution Groups, Testing Strategy, Risks).
- **Stops / gates:** never implements.
- **Source:** `.agents/skills/swarm-planner/SKILL.md`

## `$implement-spec`
Model-invoked; Pack `planning`. Implements an agent-ready spec folder through a plan-derived Execution Frontier; the parent coordinates and scoped workers edit.
- **Use when:** a retained pair and an execution-ready `PLAN.md` exist. **Not for:** a missing plan, which `$create-plan` writes; Code Review, which `$review-phase` owns.
- **Steps:** 1 Resolve the spec folder; pair gate; load `<wiki-root>/AGENTS.md`, `ARCHITECTURE.md`, `SPEC.md`, `PLAN.md`, notes, existing debt items. 2 Seed `IMPLEMENTATION-NOTES.md`. 3 Compute the Execution Frontier; reserve Active Write Scopes; dispatch workers with the worker brief, guidance forwarded unchanged. 4 Apply each Task Result's Task Gate (`passed | repair_required | blocked`) at once; recompute the frontier. 5 Review each change with `$codebase-design` vocabulary. 6 After the first meaningful pushed commit, reuse or create one draft PR. 7 In-goal debt now; out-of-goal decision debt → tiny `$requirements-phase`. 8 Provider-task facts → `$write-backlog` delivery status + readback. 9 UI evidence via `$repo-asset-management`; `runtime_validation: required` needs conclusive public-entrypoint proof. 10 `$verify-behavior` verify for visibly exercisable acceptance (stories the plan changes). 11 Acceptance audit `met | unmet | blocked`, Manual Review Checklist, finalize, `$show-me` presentation. Done when `SPEC.md` `status: implemented` and `PLAN.md` `**Status:** Complete`, only with every criterion met and architecture closure passed.
- **Calls:** `$tdd` (every testable task RED first); `$codebase-design`; `$simplify` on changed code; `$verify-behavior`; `$create-verification-skill` on Uncovered Surface (wait for `ready` + Reference Smoke Proof); `$update-verification-skill` on Uncovered Behavior (`unchanged|updated` resume, `blocked` keeps criteria blocked, `product-failure` → debugging); `$debugging-phase` on verify mismatch; `$agent-browser` for `review_mode` browser/mixed; backend/frontend-domain-structure before the first architecture wave; `$create-plan` for execution-only architecture amendments. **Called by:** `$delivery-phase` (`phases/implement.md`).
- **Writes:** `<spec-folder>/IMPLEMENTATION-NOTES.md` (Execution and Reconciliation, Skill Application Evidence, UI Evidence Links, Runtime Validation Evidence, Behavior Verification Evidence, Acceptance Criteria Status, Manual Review Checklist `Area|Check|How to perform|Expected result`); `PLAN.md` status, log, RED/GREEN evidence (parent only); one tech-debt file per item `<wiki-root>/content/docs/project/tech-debt/<domain>/<spec>/<debt-slug>.md` for out-of-goal, human-decision or external-blocker debt (debt, why not now, decision/blocker, owner/next action; `$resolve-debt-phase` input); draft PR.
- **Stops / gates:** every edit, repair included, is delegated; capacity zero = capacity blocker; no worker branches or worktrees. An Active Write Scope stays exclusive until the old writer is proven stopped. Local validation is focused; CI owns broad regression. Verification Tiers: T1 receipts, T2 focused repro on the Owned Stack, T3 plan-scoped journey; a New Discriminator precedes any expensive rerun. Forgotten RED → `recovered`. A draft PR satisfies no gate. Returns to delivery only when all gates hold.
- **Source:** `.agents/skills/implement-spec/SKILL.md`, `references/{lifecycle,parallel-orchestration,parallel-worker-brief,validation-scope,runtime-product-validation,architecture-conformance,ui-screenshot-evidence}.md`, `assets/IMPLEMENTATION-NOTES-TEMPLATE.md`

## `$tdd`
Model-invoked; Pack `quality`. Test-drives behavior changes with vertical red-green-refactor through public interfaces.
- **Use when:** behavior-changing work, or an explicit TDD / RED-GREEN request. **Not for:** docs, formatting, generated code, config without asserted behavior, scaffold bookkeeping; test-only suite work goes to `$make-tsuite`.
- **Steps:** 1 Plan: classify `tdd_status` (`required | not_testable | recovered | not_applicable`), confirm interface + prioritized behaviors, `$codebase-design`, record `red_command / expected_red_failure / green_command`. 2 Tracer bullet: one test RED → minimal GREEN. 3 One test at a time; record `red_evidence` / `green_evidence`. 4 Refactor only on GREEN.
- **Calls:** `$codebase-design`. **Called by:** `$create-plan` (RED targets), `$implement-spec` (workers), `$make-tsuite`.
- **Writes:** tests; evidence fields in `PLAN.md`.
- **Stops / gates:** Hard Law: no production code before RED. Mock only at system boundaries. HITL interface confirmation; in delivery the accepted plan's RED targets satisfy it.
- **Source:** `.agents/skills/tdd/SKILL.md`, `high-signal-tests.md`, `mocking.md`, `refactoring.md`

## `$codebase-design`
Model-invoked; Pack `quality`. Shared vocabulary and method for deep modules, seams, adapters, leverage, locality and testable boundaries.
- **Use when:** designing interfaces or seams, testability, or another skill needs the vocabulary. **Not for:** discovery of refactor candidates, which `$improve-codebase-architecture` runs.
- **Steps:** apply the glossary and principles (one adapter = hypothetical seam, two = real seam; deletion test); classify dependencies in-process / local-substitutable / remote-owned / true-external; Design It Twice: frame, ≥2 alternatives, compare depth, locality, seam, test surface, migration cost, recommend.
- **Calls:** readonly subagents for alternatives. **Called by:** `$create-plan`, `$tdd`, `$implement-spec`, `$improve-codebase-architecture`.
- **Writes:** `codebase_design_notes` in `PLAN.md`.
- **Stops / gates:** none.
- **Source:** `.agents/skills/codebase-design/SKILL.md`, `DEEPENING.md`, `DESIGN-IT-TWICE.md`

## `$simplify`
Model-invoked; Pack `quality`. Refines recently modified code for clarity without behavior change.
- **Use when:** after writing code; before a code commit in HI. **Not for:** behavior changes, which go through `$tdd`.
- **Steps:** review current branch changes or the named scope; apply Names, Combine related concepts, Derivability, Scope. Done when behavior is unchanged and checks still pass.
- **Calls:** none. **Called by:** `$implement-spec`; the `$review` Standards axis covers simplify concerns.
- **Writes:** code in the named scope only.
- **Stops / gates:** none.
- **Source:** `.agents/skills/simplify/SKILL.md`

## `$verify-behavior`
Model-invoked; Pack `verification`. Drives the real product through project-owned references and returns falsifiable evidence.
- **Use when:** `$implement-spec` invokes `verify`; `$debugging-phase` invokes `reproduce`. **Not for:** Code Review (`$review-phase`), coverage repair (`$create-verification-skill` / `$update-verification-skill`), acceptance classification (the caller).
- **Steps:** 1 Select: read caller checks, identities, mode; cover only stories the caller's plan changes; read `references/README.md`, the app `README.md` and `features/README.md`; done when the selection trace is complete or a gap returns (missing app = Uncovered Surface, missing drive path = Uncovered Behavior). 2 Exercise: record Channel `browser | computer-use | cli`; freeze identities; reuse the caller's Owned Stack after controlled reset or Launch; complete the Observation Manifest before the first Drive; Doctor before Drive; drive end to end; record Scenario Falsifier and Relevant Negative Condition; owned cleanup. 3 Result.
- **Calls:** project references only. **Called by:** `$implement-spec`, `$debugging-phase`.
- **Writes:** evidence only. Project-owned files live under `.agents/skills/verify-behavior/references/` (`<app>/README.md` with Launch, Doctor, Drive, Evidence, Cleanup, Feature Map; `<app>/features/*`). Expectation classes: `invariant` and `output semantics` gate, `speculative` observes.
- **Stops / gates:** verify → `verified | partially verified | not verified | blocked`; reproduce → `confirmed | partially confirmed | not reproduced | blocked`. Uncovered gaps keep checks `blocked`; the caller owns repair. No invented tools, URLs or recordings; human auth stays with the user.
- **Source:** `.agents/skills/verify-behavior/SKILL.md`

## `$create-verification-skill`
Model-invoked; Pack `verification`. Creates and proves the missing project app reference on an Uncovered Surface.
- **Use when:** `$implement-spec` hits an Uncovered Surface. **Not for:** gaps in an existing app reference, which `$update-verification-skill` repairs.
- **Steps:** 1 Interview the repo: guidance, index, code, scripts, harnesses, wiki specs/flows; ask only for unobservable prerequisites. 2 Author below `.agents/skills/verify-behavior/references/` on the delivery branch: index pointer, app `README.md` (CLI = build once + fresh session per Drive; server = one owned instance), `features/README.md` + selected features (Sub-features, How to get to it, Driving it, Gotchas, Observation Manifest). 3 Reference Smoke Proof: Launch → Doctor → one public Drive → evidence → Cleanup.
- **Calls:** none. **Called by:** `$implement-spec`.
- **Writes:** `.agents/skills/verify-behavior/references/README.md`, `<app>/README.md`, `<app>/features/*`.
- **Stops / gates:** `ready` only with full smoke proof, else `blocked`; control returns to `$implement-spec`; smoke proof is not acceptance; no product repair; shared ownership refused.
- **Source:** `.agents/skills/create-verification-skill/SKILL.md`

## `$update-verification-skill`
Model-invoked; Pack `verification`. Repairs selected executable coverage on an Uncovered Behavior; full Project Verifier audit only on explicit invocation.
- **Use when:** `$implement-spec` hits an Uncovered Behavior; an explicit full audit. **Not for:** a missing app, which goes back to `$implement-spec` for `$create-verification-skill`.
- **Steps:** 1 Select and reconcile: locate the app via the index; read wiki + source; preserve unrelated bytes; retire entries only with source + authority proof. 2 Drive and triage with live proof, Doctor before each session: reference drift, missing manifest (unsupported assertion → `speculative`), helper repair, Doctor drift (retry once), inaccessible state (blocked), wrong product behavior (`product-failure`).
- **Calls:** none. **Called by:** `$implement-spec`.
- **Writes:** files under `.agents/skills/verify-behavior/references/`; no separate maintenance PR.
- **Stops / gates:** exactly one of `unchanged | updated | blocked | product-failure`; never rewrites expected product semantics.
- **Source:** `.agents/skills/update-verification-skill/SKILL.md`

## `$repo-asset-management`
Model-invoked; Packs `planning`, `requirements`. Durable links for visual evidence and approved assets.
- **Use when:** screenshots, recordings or design assets need a stable URL. **Not for:** temporary paths or transient browser URLs as final evidence.
- **Steps:** 1 Prefer backlog attachments. 2 Fall back to repo-provider storage. 3 Provider from `.devpunks/settings.json`, else repo hints. 4 Load one provider reference (GitHub release, GitLab package, Azure blob, Bitbucket Downloads). 5 Return stable URLs + original filenames.
- **Calls:** none. **Called by:** `$implement-spec`, `$delivery-phase`, `$design-phase`.
- **Writes:** uploaded assets; returned URLs.
- **Stops / gates:** upload failure = recorded blocker, local path only as pending evidence; callers link this skill and copy no commands.
- **Source:** `.agents/skills/repo-asset-management/SKILL.md`

## `$goalify`
Model-invoked; Pack `planning`. Turns messy intent into one lean `/goal`, activates it at once, and keeps working under it.
- **Use when:** an AFK or compaction-safe run needs one goal. **Not for:** planning the work itself, which the goal's named workflow does.
- **Steps:** read handoffs, specs, issues, logs, guidance; reduce to one objective with proof + stop; write the smallest goal (objective, context, workflow, proof, stop; pointer-heavy, no secrets, ≤4,000 chars); activate; report only progress, blockers, proof. Done when the goal is active and work continues.
- **Calls:** none; the goal text names `$delivery-phase`. **Called by:** human.
- **Writes:** the active goal.
- **Stops / gates:** the goal must state end-to-end delivery to select Full delivery. It stops on closeout, `human_steering_required`, `review_budget_exhausted`, a blocked pointer, or missing access.
- **Source:** `.agents/skills/goalify/SKILL.md`, `EXAMPLES.md`

## `$handoff`
Model-invoked; Pack `planning`. Compacts the conversation into a handoff document for another agent.
- **Use when:** work pauses across sessions or agents. **Not for:** the `hi` Post-Command Handoff, which `$hi-cli` owns.
- **Steps:** write to the OS temp dir outside the workspace; delivery work follows the Delivery Handoff envelope; other work keeps next action, artifact pointers, blocker, unknowns, skill pointers; redact secrets. Done when the next action is provable, every pointer has identity + freshness, and completed vs remaining mutations are distinct.
- **Calls:** none. **Called by:** human.
- **Writes:** handoff file; returns its absolute path + a continuation prompt.
- **Stops / gates:** the receiver cold-routes; the Delivery Context Packet is never persisted.
- **Source:** `.agents/skills/handoff/SKILL.md`, `.agents/skills/delivery-phase/references/phase-handoff.md`
