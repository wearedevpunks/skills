# Quality family

This family reviews, debugs, hunts bugs, resolves debt, audits tests and architecture, researches, prototypes, and secures. Review is one chain: `$review-phase` loads `$review`, whose Standards and Spec axes each run `$autoreview` once per pass; security, skill adherence, architecture ownership and simplify concerns sit inside the Standards axis brief, so no separate lens skill loads. Findings carry a `return_route` that `$delivery-phase` consumes. Runtime failures go through `$debugging-phase`, which reproduces with `$verify-behavior` and proves causes with `$debug-agent`. Bug hunts and debt run as human-started phase pairs.

- `$review-phase` → `$review` → `$autoreview` → `return_route` → `$delivery-phase`
- `$debugging-phase` → `$verify-behavior` (reproduce) → `$debug-agent` → fix → rerun
- `$bug-discovery-phase` → human → `$bug-resolution-phase` → `$debugging-phase` | `$docs-ingest-phase`
- `$resolve-debt-phase` → `$requirements-phase` → human → `$delivery-phase` → `$resolve-debt-phase`

## `$review-phase`
Explicit-only; Pack `planning`. Readonly Code Review of one frozen delivery diff or standalone artifact bundle, ending in one retained report plus routing.
- **Use when:** delivery reaches review, or a human asks for a plan, spec, docs, branch or PR review. **Not for:** repair, debugging, debt capture, docs or closeout, which `$delivery-phase` owns.
- **Steps:** router on every entry, first match wins; load exactly one gate. 1 prepare-review: validate bounds, normalize target; delivery verifies the Architecture/SPEC pair; recover `review_count` and plan the budget; freeze target, sources and Review Packet; done when mode, lineage, run id, ordinal, bounds hash, target, snapshot and source-set hashes exist. 2 run-review: recompute hashes; two axes as parallel readonly subagents (sequential at capacity 1), each `autoreview` once; parent dedupes, verifies, assigns IDs, severity, `return_route`; smallest readonly validation (write-capable commands in a disposable checkout); write one local report. 3 retain-report: validate schema, freshness; commit only report, navigation and wiki-log; verify committed bytes = local bytes. 4 return-route: precedence `human_steering_required > debugging > implementation > debt_follow_up > docs_ingest`, empty → `closeout`. 5 Present the retained report with `$show-me`.
- **Calls:** `$review` (axes), `autoreview` helper, `$show-me`; pair gaps → Requirements Phase / `$requirements-grill`. **Called by:** `$delivery-phase` (Full delivery); human for other modes and standalone; `$finder-phase` and `$debugging-phase` hand the human the exact invocation.
- **Writes:** `<wiki-root>/content/docs/project/reviews/<review-scope-slug>-<YYYYMMDDTHHMMSSZ>-<snapshot12>-review-report.md` (slug `review-` + first 20 hex of lineage; frontmatter `type: review-report` + one ` ```review-report-json ` block); retention commit on the delivery branch or `review/<slug>-<snapshot12>`; delivery `review-handoff-v1` records, or standalone `.devpunks/review-phase/handoffs/<lineage>/<run>.md` (never pushed).
- **Stops / gates:** terminals `review_routed` (delivery), `review_complete` (standalone), `review_failed`, `review_budget_exhausted`, `human_steering_required`; checkpoint `retained_ref_approval_required`; blocked `review_state_conflict`, `review_context_blocked`, `review_not_due`. Two completed passes max in delivery; a second needs a risk trigger (architecture, security, public_contract, runtime_topology, accepted_scope); more need human direction for exactly the next ordinal. Opens no repair; creates no missing evidence. A caller resumes `$delivery-phase` itself.
- **Source:** `.agents/skills/review-phase/SKILL.md`, `phases/{router,prepare-review,run-review,retain-report,return-route}.md`, `references/{review-packet,durable-report,state-graph,targets,runtime-handoff}.md`, `scripts/review-contract.mjs`

## `$review`
Model-invoked; Pack `planning`. Two-axis core of review-phase: Standards (repo standards + Fowler smell baseline) and Spec (fidelity to issue/PRD/spec).
- **Use when:** `$review-phase` run-review loads it. **Not for:** direct review requests, which go to `$review-phase`.
- **Steps:** 1 Use the caller's frozen target unchanged. 2 Spec source supplied by review-phase. 3 Standards sources + 12-smell baseline (repo overrides; each smell a judgement call). 4 Both axes in parallel; each runs `autoreview` once. 5 Aggregate with axes kept separate.
- **Calls:** `autoreview`. **Called by:** `$review-phase`.
- **Writes:** nothing; Lens Results go into the review-phase report.
- **Stops / gates:** never merge or rerank findings across axes; skip Spec when no spec exists.
- **Source:** `.agents/skills/review/SKILL.md`

## `$autoreview`
Model-invoked; Pack `planning`. Structured engine for one review axis: one bundle, one engine call, one validated Lens Result.
- **Use when:** review-phase run-review calls it once per axis per pass. **Not for:** direct reviews, which go to `$review-phase`.
- **Steps:** `<helper> --review-packet <p> --reviewer-identity review-standards|review-spec --axis standards|spec`: validate packet identity and `facts_sha256`; build the axis brief; run the engine (default Codex `gpt-5.6-terra`, high reasoning, readonly tools); validate the Lens Result. Done when one valid Lens Result per assigned axis prints.
- **Calls:** the review engine. **Called by:** `$review` inside `$review-phase`.
- **Writes:** stdout, or `--output` / `--json-output`.
- **Stops / gates:** exit 0 clean, 1 findings, 2 incomplete; `incomplete` never completes a pass. Without `--review-packet` it exits 64 unless `AUTOREVIEW_ALLOW_DIRECT=1` (helper maintenance only). Keep the engine and model; retry the same command on capacity errors; allow up to 30 minutes. Output is advisory; the parent verifies every finding.
- **Source:** `.agents/skills/autoreview/SKILL.md`, `scripts/autoreview`

## `$debugging-phase`
Model-invoked; Pack `debug`. Runtime-evidence debugging, standalone or scoped inside delivery.
- **Use when:** broken behavior, failing smoke checks, logs, recordings; inside delivery: an `$implement-spec` verify mismatch, an `$update-verification-skill` `product-failure`, or a review finding with `return_route: debugging`. **Not for:** planning, requirements or design; a proven cause that needs only implementation (`$implement-spec`); static review (`$review-phase`).
- **Steps:** 1 Classify entry; record artifacts, repro, expected vs observed; scan routed learnings. 2 Set bounds; delivery patches stay in scope. 3 Reproduce with `$verify-behavior` reproduce when visibly exercisable; done when the evidence matrix has a cited repro status. 4 `$debug-agent`: 3-5 hypotheses, each `confirmed | rejected | inconclusive` with cited evidence, cheapest Verification Tier first, New Discriminator before an expensive rerun; `$show-me` the matrix before choosing a cause. 5 Optional readonly `$parallel-research`. 6 Fix only proven causes, smallest patch; keep instrumentation until post-fix proof. 7 Rerun the failing check; record unrelated failures.
- **Calls:** `$verify-behavior`, `$debug-agent`, `$show-me`, `$parallel-research`. **Called by:** human; `$delivery-phase` (`phases/debug.md`), `$implement-spec`, `$bug-discovery-phase`, `$bug-resolution-phase`.
- **Writes:** no mandated file; output: mode, inputs, evidence matrix, root cause, changes, verification, exit. Delivery `phases/debug.md` writes evidence, cause, fix or blocker, rerun validation and preserved counters, then re-enters routing.
- **Stops / gates:** exits fixed | blocked | `human_steering_required` (when bounds are exceeded). `parallel: true` fans out readonly research only; disjoint fixes only after a proven cause. Delivery-internal repairs go to Focused Repair Validation; standalone review needs the human to invoke `$review-phase`.
- **Source:** `.agents/skills/debugging-phase/SKILL.md`, `.agents/skills/delivery-phase/phases/debug.md`

## `$debug-agent`
Model-invoked; Pack `debug`. Hypothesis-driven debugging with NDJSON runtime logs until cited log lines prove the root cause.
- **Use when:** a bug report or unexpected behavior; `$debugging-phase` step 4. **Not for:** fixes from code reading alone.
- **Steps:** 0 `npx debug-agent --daemon` → `{sessionId, port, endpoint, logPath}`; stop if it fails. 1 Write 3-5 hypotheses. 2 Instrument 1-10 logs in `#region debug log` / `#endregion` (JS/TS fetch to endpoint; others append to `logPath`). 3 `DELETE` the session log before each run. 4 Reproduce on the agreed path. 5 Mark each hypothesis CONFIRMED / REJECTED / INCONCLUSIVE with cited lines. 6 Fix only with log proof. 7 Verify before/after; on success + user confirmation remove region blocks, grep for zero markers, check `git diff`. Done when post-fix logs prove success and instrumentation is gone.
- **Calls:** none. **Called by:** `$debugging-phase`.
- **Writes:** temporary instrumentation in source; `/tmp/debug-agent/debug-<sessionId>.log`.
- **Stops / gates:** no `setTimeout`/`sleep` fixes; secrets never logged; other sessions' logs untouched; rejected-hypothesis code reverted.
- **Source:** `.agents/skills/debug-agent/SKILL.md`

## `$bug-discovery-phase`
Explicit-only; Pack `debug`. Readonly AFK ClawPatch discovery, report and triage.
- **Use when:** a bug hunt over PR changes, a highlighted diff, supplied code or named paths; full codebase only with no PR and no certain scope, or on request. **Not for:** fixes (`$bug-resolution-phase`), runtime proof (`$debugging-phase`), debt docs (`$docs-ingest-phase`).
- **Steps:** 1 Write the Preflight Record (repo root, scope, provider, model, limit, jobs, state dir, report path, dirty posture, output format) before any long run. 2 Inherit the launcher provider; `--provider/--model` only on user override. 3 `doctor`, `status`, existing `.clawpatch/`. 4 `review` or `ci`, then `report` (`--json` to redirected stdout; `--output` is Markdown; `--include-dirty` on request). 5 Rank findings 0-10: 8-10 → `$bug-resolution-phase` or `$debugging-phase`; 5-7 → inspect, revalidate or defer; 0-4 → triage or stop.
- **Calls:** ClawPatch CLI. **Called by:** human.
- **Writes:** `.clawpatch/` state and ledger; `.clawpatch/reports/<name>.md`; optional redirected JSON.
- **Stops / gates:** stops before mutation; resolution needs a new explicit request; findings are static-review candidates; `fix --finding` and `open-pr` refused.
- **Source:** `.agents/skills/bug-discovery-phase/SKILL.md`, `REFERENCE.md`

## `$bug-resolution-phase`
Explicit-only; Pack `debug`. Resolves selected ClawPatch findings through classification, bounded fixes, triage, debt routing and revalidation.
- **Use when:** one finding ID, or a user-bounded batch sharing a root cause, file set, validation path or contract gap. **Not for:** discovery, which `$bug-discovery-phase` runs.
- **Steps:** 1 `clawpatch show` + `report`. 2 Capture ID, paths, evidence, claim, status, scope. 3 Classify `resolve-now | needs-runtime-debugging | tech-debt | false-positive | blocked`. 4 Route: resolve-now → Harness edits + focused checks; runtime → `$debugging-phase` with finding context (it owns the fix); tech-debt → ClawPatch triage, then `$docs-ingest-phase` with finding ID, evidence, reason, human-review question; false-positive → proof + `triage --status false-positive`; blocked → record the missing item. 5 Focused verification, then `clawpatch revalidate` or triage. Done when every finding has classification, route, verification and ClawPatch state.
- **Calls:** `$debugging-phase`, `$docs-ingest-phase`. **Called by:** human (after `$bug-discovery-phase`).
- **Writes:** source edits (resolve-now); `.clawpatch/` triage/state.
- **Stops / gates:** ambiguous request → ask for the finding ID; `fix --finding` / `open-pr` only on a clear user request; one fix per worker.
- **Source:** `.agents/skills/bug-resolution-phase/SKILL.md`, `REFERENCE.md`

## `$resolve-debt-phase`
Explicit-only; Pack `planning`. Takes one tech-debt item from validation through a resolution spec and a manual delivery handoff to closeout.
- **Use when:** one debt file `<wiki-root>/content/docs/project/tech-debt/<domain>/<spec>/<debt-slug>.md`. **Not for:** debt registers or campaigns; feature work without a debt file (`$requirements-phase`).
- **Steps:** 1 Locate exactly one file. 2 Read status, domain, spec, backlog mirror, evidence, proposed fix. 3 `draft`: readonly validation (optional `$parallel-research`), cited synthesis, ask accept | delete | more research. `accepted`: route the debt through `$requirements-phase` for a retained architecture/spec pair and backlog projection; present a delivery brief; tell the user to invoke `$delivery-phase`; stop. `resolved`: report links. 4 On re-invocation after delivery: set `resolved`, link spec and notes, record validation, sync the backlog mirror.
- **Calls:** `$parallel-research`, `$requirements-phase`. **Called by:** human.
- **Writes:** debt file status and links; backlog mirror sync; the resolution pair comes from `$requirements-phase`.
- **Stops / gates:** several implied files or unclear status → ask; never loads `$delivery-phase`; new residual debt only when distinct.
- **Source:** `.agents/skills/resolve-debt-phase/SKILL.md`

## `$make-tsuite`
Model-invoked; Pack `quality`. Audits a test portfolio, or implements test-only suite changes, with production behavior unchanged.
- **Use when:** suite evaluation, redundant-test removal, reorganization, added coverage. **Not for:** production behavior changes, which go through `$tdd`.
- **Steps:** 1 Classify every path/hunk as test-scoped; ambiguity blocks. 2 Mode Audit or Implement; done when mode + writable scope are named. 3 Authority per package: owner, seam, execution path, rule, gate. 4 Semantic lock: fingerprint each case (capability, seam, actor, setup, result, side effect) before ↔ after. 5 Audit: disposition `retain | strengthen | move | merge | remove` with removal proof. 6 Implement: lowest honest tier, one vertical slice per invariant, full diff inspection. 7 Report facts vs recommendations.
- **Calls:** `$tdd`. **Called by:** human.
- **Writes:** test files only.
- **Stops / gates:** production-reachable content is immutable; a product defect stays a failing test + a separate production requirement; a new required-gate RED needs authorization and quarantine.
- **Source:** `.agents/skills/make-tsuite/SKILL.md`, `references/{audit-portfolio,implement-suite,route-api-design,user-journey-design}.md`

## `$improve-codebase-architecture`
Model-invoked; Pack `research`. Finds module-deepening, seam, testability and AI-navigability opportunities with `$codebase-design` vocabulary.
- **Use when:** architecture discovery or refactor-opportunity requests; deeper redesign after review architecture findings. **Not for:** review of a frozen diff, which `$review-phase` runs.
- **Steps:** 1 Read the glossary in the grill status. 2 Explore (optional readonly subagents); note friction. 3 Present candidates: cluster, coupling, dependency category, test impact. 4 User picks one. 5 Frame constraints and a sketch. 6 3-4 parallel design subagents (minimal, flexible, common-caller, ports & adapters); opinionated recommendation. 7 User picks an interface. 8 Handoff.
- **Calls:** `$codebase-design`; `$grilling` to stress-test a chosen candidate; term changes → `$requirements-grill`. **Called by:** human.
- **Writes:** a refactor RFC at the user's destination, or `gh issue create` from the REFERENCE.md template.
- **Stops / gates:** HITL at candidate and interface choice.
- **Source:** `.agents/skills/improve-codebase-architecture/SKILL.md`, `REFERENCE.md`

## `$parallel-research`
Model-invoked; Pack `research`. Readonly parallel subagent fan-out with one durable consolidated report.
- **Use when:** readonly work splits into independent questions. **Not for:** code or test writes, coupled debugging, one quick question.
- **Steps:** 1 Confirm readonly, splittable, blocking step kept local. 2 2-4 lanes, one ask each, no overlap. 3 Minimal prompts: raw artifacts, primary sources, no leaked answer. 4 Run in parallel; keep working locally. 5 Synthesize evidence over votes; trace every claim. 6 One writer persists the report. Done when the report exists at the wiki path.
- **Calls:** readonly subagents. **Called by:** `$create-plan`, `$create-spec` (gap route), `$debugging-phase`, `$resolve-debt-phase`, `$finder-phase` (research gate); `$wayfinder` recommends it.
- **Writes:** `<wiki-root>/content/docs/project/research/<slug>-research-report.md`.
- **Stops / gates:** lanes never write; the report never chooses product direction; `$docs-ingest-phase` may curate it later.
- **Source:** `.agents/skills/parallel-research/SKILL.md`, `DURABLE-REPORT.md`

## `$prototype`
Model-invoked; Pack `research`. Throwaway code that answers one design question.
- **Use when:** `$prototype-phase` or `$design-phase` needs an artifact. **Not for:** production code; human-verdict tracking, which `$prototype-phase` owns.
- **Steps:** 1 Branch: logic → `LOGIC.md` (one self-contained HTML, pure module, free-play + guided tabs); UI → `UI.md` (3-5 radical variants via `?variant=`, floating switcher, stubbed mutations). 2 Throwaway, one-command run, no persistence, no polish or tests. 3 Commit to `prototype/<slug>`, push, verify the remote ref, link from the issue. Done when run instruction, branch, SHA, artifact path, remote ref and open question are returned.
- **Calls:** none. **Called by:** `$prototype-phase`, `$design-phase` (prototype phase), `$write-backlog` (Fog support).
- **Writes:** branch `prototype/<slug>`; the caller writes `PROTOTYPE-VERDICT.md`.
- **Stops / gates:** prototype code never merges unchanged; no real DB writes.
- **Source:** `.agents/skills/prototype/SKILL.md`, `LOGIC.md`, `UI.md`

## `$security-best-practices`
Model-invoked; Pack `security`. Language- and framework-specific secure-by-default guidance, passive detection, or a security report.
- **Use when:** an explicit security request for Python, JS/TS or Go. **Not for:** general review (`$review-phase`) or debugging (`$debugging-phase`); CI/CD audits (`$audit-cicd-security`).
- **Steps:** 1 Identify every language and framework. 2 Load each matching `references/<lang>-<framework>-*-security.md` + `<lang>-general-*`. 3 Mode: write secure code, passively flag criticals, or report on request. 4 Report: exec summary, severity sections, numeric IDs, line numbers. 5 Fix one finding at a time after the user agrees.
- **Calls:** none. **Called by:** human; `$architect-pipeline` routes app security here.
- **Writes:** `security_best_practices_report.md` or a user-given path.
- **Stops / gates:** every finding cites evidence; documented overrides and dev-only TLS stay unflagged; HSTS is recommended only with care.
- **Source:** `.agents/skills/security-best-practices/SKILL.md`, `references/*-security.md`

## `$audit-cicd-security`
Model-invoked; Pack `security`. Readonly CI/CD security audit; fixes only after explicit approval.
- **Use when:** an explicit pipeline security review: fork/MR privilege flow, deploy/publish gates, caches/artifacts, runners, credentials, supply chain. **Not for:** pipeline design, which `$architect-pipeline` owns.
- **Steps:** 1 Readonly: no edits, runs, secret reads, deploys or settings changes; contributor code never executes. 2 Discover all CI files, includes, actions, scripts; unavailable remotes → `unknown`. 3 Threat model: forks attacker-controlled; caches/artifacts are no trust boundary; poisoning confirmed only when a lower-trust writer and an unverifying higher-trust consumer share an object. 4 Provider refs (GitHub Actions, GitLab, Azure, Bitbucket, Buildkite, CircleCI, Jenkins, Tekton, Argo). 5 Output.
- **Calls:** none. **Called by:** human; `$architect-pipeline`.
- **Writes:** response report (verdict `SAFE AGAINST THIS THREAT MODEL | CONDITIONALLY SAFE | UNSAFE`, inventory, file:line findings, cache/artifact matrix, credential trace, patch proposals); patches only after approval.
- **Stops / gates:** `unknown` stays unknown; validation uses non-executing parsers only.
- **Source:** `.agents/skills/audit-cicd-security/SKILL.md`

## `$architect-pipeline`
Model-invoked; Pack `security`. Designs provider-neutral CI/CD pipelines and implements the smallest coherent config + docs change.
- **Use when:** pipeline stages, triggers, artifacts, release identity, retry/recovery, deployment gates, promotion. **Not for:** audits (`$audit-cicd-security`), app security (`$security-best-practices`), data/ML/general automation pipelines.
- **Steps:** each with an explicit done-when: 1 Contract: mode, surfaces, external-action boundary. 2 Discover the repo without running contributor scripts. 3 Stage graph + trust per stage (`references/security-by-design.md`; `references/infrastructure-deployment.md` for infra). 4 Design brief, release-identity decisions, agreement on critical choices. 5 Minimal coherent config. 6 Static checks, diff review, report.
- **Calls:** routes to `$audit-cicd-security`, `$security-best-practices`, IaC skills. **Called by:** human; Pulumi skills route pipeline work here.
- **Writes:** CI/CD config and its docs only.
- **Stops / gates:** production code, tests, manifests, lockfiles and build scripts stay untouched; every external action (publish, deploy, settings, secrets) needs separate authorization.
- **Source:** `.agents/skills/architect-pipeline/SKILL.md`, `references/security-by-design.md`, `references/infrastructure-deployment.md`
