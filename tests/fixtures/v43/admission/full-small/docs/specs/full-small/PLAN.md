# Browser slug delivery plan

- architecture_applicability: local
- evidence: existing module, DOM and static-server ownership stays fixed; no new service, migration, ownership transfer or deployment.
- task_identity_mode: provider-task
- authority: SPEC.md OUT-001 and AC-1–AC-5; exact retained spec URL/commit/blob and current Backlog Result are in parent-hydrated CONTEXT.json.
- branch/base: exact run branch and fixed main seed from CONTEXT.json. Preparation replaces provider placeholders below with exact read-back identities before native dispatch.

## Situation and solution

The existing form echoes titles without normalization or invalid-input handling. Implement normalization through the existing slug export and DOM interaction through the existing app module. One vertical Task owns this small user outcome; separating the helper and its sole form consumer would create an unnecessary technical-layer Task split.

## Decisions, constraints and findings

Accepted decisions are in SPEC.md. Existing src/slug.mjs is the public pure seam; src/app.mjs owns the form; server.mjs is immutable fixture infrastructure. Use standalone Node conventions, native browser tooling and portless. No dependency installation or external research is required. Preserve selected reusable skill bytes and unrelated work. Only fixture-owned references/evidence and exact provider objects in CONTEXT.json may change. Merge, release and canonical publication remain outside scope.

## Dependency graph and frontier

T1 has no prerequisites. W1 contains T1; one worker is justified by one atomic user outcome. Native capacity and scope checks still govern dispatch. Every worker stays on the recorded current branch. The parent alone records Task Gates, shared reconciliation and final acceptance. No Architecture Checkpoint applies; final local ownership reconciliation confirms no drift or migration.

## T1: Accessible slug preview

- **depends_on**: []
- **location**: src/slug.mjs and src/app.mjs
- **owned_paths**: [src/slug.mjs, src/app.mjs, index.html, test/slug.test.mjs, test/web.test.mjs, .agents/skills/verify-behavior/references/]
- **read_dependencies**: [docs/specs/full-small/SPEC.md, server.mjs, package.json, CONTEXT.json, selected implementation/verification/TDD skill contracts]
- **shared_runtime_resources**: Exclusive run-owned portless v43-admission server and named browser session. No other comparison may use them concurrently.
- **relevant_input_set**: SHA256 of SPEC.md, server.mjs, package.json and selected source manifests before/after checks; exact seed commit/tree, provider Task/Story/milestone readback and browser/server process identities. Changes invalidate affected checks.
- **wave_boundary**: W1
- **description**: Deliver OUT-001 and AC-1–AC-5 through the existing module/form; retain actual browser proof using the selected workflow.
- **validation**: Public function tests and actual-browser tests; Node syntax checks; parent criterion/scope/stable-input checks and current provider state. Retain real before/after screenshots and positive/negative/recovery observations.
- **status**: Planned
- **log**:
- **files edited/created**:
- **task_identity_mode**: provider-task
- **backlog_item_id**: {{TASK_ID}}
- **backlog_item_url**: {{TASK_URL}}
- **relation_mode**: native
- **backlog_sync_skip_reason**:
- **assigned_skills**: [codebase-design, tdd, writing-for-agents, verify-behavior, agent-browser]
- **implementation_skill_guidance**:
  - **skill**: codebase-design
    **applicable_behavior**: Keep slug as the pure public seam and DOM code as its browser adapter; assert public results through these interfaces.
  - **skill**: tdd
    **applicable_behavior**: Author public-result tests and retain expected RED before implementation, then retain the same tests passing GREEN.
  - **skill**: writing-for-agents
    **applicable_behavior**: Apply to source-required project references; co-locate executable steps and observable completion criteria.
  - **skill**: verify-behavior
    **applicable_behavior**: Exercise complete browser stories through selected source; project references apply only when that workflow requires them.
  - **skill**: agent-browser
    **applicable_behavior**: Drive the real run-owned page with native browser CLI, retain observations/screenshots, then close the named session.
- **tdd_status**: required
- **tdd_target**: Normalization plus actual form successful preview, invalid-input clearing and valid recovery through public interfaces.
- **red_command**: node --test test/slug.test.mjs test/web.test.mjs
- **expected_red_failure**: Seeded echo implementation fails normalized-output and actual browser invalid-input clearing/error assertions after tests are authored.
- **green_command**: node --test test/slug.test.mjs test/web.test.mjs
- **reason_not_testable**:
- **red_evidence**:
- **green_evidence**:
- **codebase_design_notes**: slug(title) owns normalization; form submission adapts it to visible text/error state; server remains fixture infrastructure; actual browser interaction is the integration seam.
- **review_mode**: browser
- **runtime_validation**: required
- **runtime_target**: Static browser application launched with portless v43-admission node server.mjs; discover URL with portless get v43-admission.
- **runtime_evidence**: Actual successful preview, cleared prior result on invalid input, useful visible error, valid recovery, accessible DOM/text rendering and retained before/after screenshots for AC-1–AC-5.
- **runtime_cleanup**: Record server PID, route ownership and named browser session; close only that session and process/route after retaining evidence outside cleanup. Preserve unrelated processes and all provider history.

## Validation and completion

Task Gate requires RED/GREEN, node --check src/slug.mjs and node --check src/app.mjs, scope/AC reconciliation and stable input/provider evidence. No typechecker/linter is configured; Node syntax checks apply. Final Verification exercises every visible story: baseline uses supported browser verification and candidate follows its source-required Project Verifier path. Neither receives a reduced observable gate.

Reconcile shared notes and final local ownership before final acceptance. Then complete readonly Code Review, exact report retention/provider readback and source-required docs/closeout checks. Review cannot substitute for browser Verification. Record lifecycle facts against exact provider Task and PR. Preserve fixed main and other run histories.

## Risks and unresolved questions

Concurrent browser/server use invalidates comparisons; parent execution is exclusive. Missing provider or retained authority blocks its gate. Before launch, preparation replaces provider placeholders and supplies complete current CONTEXT.json; unresolved placeholders are preparation failures, never permitted native input. No product requirement is unresolved.
