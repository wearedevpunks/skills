---
name: debugging-phase
description: >-
  Runs a standalone runtime-evidence debugging phase, or a scoped debugging
  phase inside delivery when validation or review finds runtime failure. Use
  when the user reports broken behavior, failing smoke checks, logs,
  recordings, runtime symptoms, or asks to debug a delivery-scoped failure.
---

# Debugging Phase

## Contract

- **Role:** public runtime-evidence phase
- **Entrypoint type:** standalone public skill, or inner phase of `delivery-phase`
- **Standalone inputs:** user-reported broken behavior, failing smoke checks, logs, recordings, runtime symptoms
- **Delivery-internal inputs:** `implement-spec` validation failure or `review-phase` runtime failure
- **Wraps:** `$debug-agent`, optional readonly `$parallel-research`, bounded fixes, focused tests or scenario reruns, review
- **Owns:** evidence matrices, cited log references, hypothesis status, fix verification
- **Exit conditions:** bug fixed, concrete blocker proven, or scope proven to require a spec/delivery goal

## Use When

- Runtime behavior is broken, flaky, slow, or inconsistent.
- Smoke checks, browser checks, CLI checks, recordings, or logs show a failure.
- A delivery run hits a runtime failure during validation or review.
- The user asks for evidence-backed debugging instead of code-only inspection.

## Do Not Use When

- The work is pure planning, requirements discovery, or design.
- The failure is already proven and only needs implementation inside an active spec plan.
- The fix would require broad product scope, architecture, or acceptance changes; exit to `create-spec`, `create-plan`, or a delivery goal instead.
- The request is only static code review with no runtime symptom.

## Workflow

1. **Classify entry.**
   - Standalone: record the broken behavior, artifact links/paths, reproduction command or manual scenario, expected behavior, and observed behavior.
   - Delivery-internal: cite the validation or review failure that triggered debugging and the delivery scope it belongs to.
2. **Set bounds.**
   - Define owned files, systems, and scenarios.
   - For delivery-internal debugging, patch only inside the active delivery scope.
   - If the evidence points outside that scope, record debt or open a separate debugging/debt goal.
3. **Run `$debug-agent`.**
   - Build 3-5 hypotheses.
   - Instrument or inspect with runtime evidence.
   - Keep an evidence matrix with each hypothesis marked `confirmed`, `rejected`, or `inconclusive`.
   - Cite log lines, recordings, commands, test output, or scenario evidence for every status.
4. **Optionally run readonly `$parallel-research`.**
   - Use for independent hypotheses, unfamiliar subsystems, logs, docs, or prior-art inspection.
   - Synthesize findings before fixing.
5. **Fix only proven causes.**
   - Make the smallest bounded patch that addresses confirmed evidence.
   - Remove speculative changes from rejected hypotheses.
   - Keep debug instrumentation until post-fix evidence proves success, unless the user explicitly asks for cleanup.
6. **Verify.**
   - Rerun the failing smoke check, focused test, browser path, CLI command, or manual scenario.
   - Compare before/after evidence.
   - Run review appropriate to the touched scope.
7. **Exit.**
   - Fixed: report cause, patch, verification, and residual risk.
   - Blocked: report the concrete blocker and the missing artifact/access/action.
   - Out of scope: report why this needs a spec/delivery goal or debt issue.

## Parallel Rules

`debugging-phase` may run with `parallel: true` or `parallel: false`.

- `parallel: false`: one thread owns hypotheses, instrumentation, fix, verification, and review.
- `parallel: true`: fan out readonly research for independent hypotheses only.
- Disjoint worker fixes are allowed only after the cause is proven and file ownership is explicit.
- Never let parallel workers make speculative fixes against unproven hypotheses.
- Merge worker findings into one evidence matrix before deciding on a patch.
- In delivery-internal mode, parallel workers must stay inside the delivery scope unless assigned readonly investigation.

## Output Contract

Return a concise debugging report with:

- **Mode:** standalone or delivery-internal; `parallel: true|false`
- **Input artifacts:** reports, logs, recordings, checks, or symptoms used
- **Evidence matrix:** hypotheses, status, and cited evidence
- **Root cause:** confirmed cause or why none is proven
- **Changes:** bounded patch summary, or none if blocked/out of scope
- **Verification:** commands/scenarios rerun and result
- **Exit:** fixed, blocked, or escalated to spec/delivery/debt
