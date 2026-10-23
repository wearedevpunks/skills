import assert from "node:assert/strict";
import { test } from "node:test";
import * as contract from "../skills/phases/review-phase/scripts/review-contract.mjs";

const {
  deriveReviewRouting,
  planDeliveryReviewGate,
  planEngineOrder,
  recoverPassCount,
  reviewPacketIdentity,
  selectSourceContext,
  validatePassReport,
} = contract;

const passReport = (overrides = {}) => ({
  schema: "pass-report-v1",
  run_id: "run-7f3a",
  ordinal: 1,
  mode: "delivery",
  base: "a".repeat(40),
  head: "b".repeat(40),
  packet_identity: "c".repeat(64),
  axes: {
    standards: {
      lens_result: "findings",
      attempts: [
        { engine: "codex", model: "gpt-6.1-sol", seconds: 4.5, outcome: "reviewer_unavailable", usage: null },
        { engine: "claude", model: "claude-opus", seconds: 61, outcome: "findings", usage: { input_tokens: 9100, output_tokens: 800 } },
      ],
    },
    spec: {
      lens_result: "clean",
      attempts: [{ engine: "codex", model: "gpt-6.1-sol", seconds: 33, outcome: "scoped-clean", usage: null }],
    },
  },
  adjudication: {
    subagent_tokens: 41000,
    findings: [{
      id: "standards.missing-guard",
      axis: "standards",
      severity: "high",
      location: "src/export.mjs:12",
      evidence: "export reads presentation state",
      action: "move the read behind the domain port",
      return_route: "implementation",
    }],
    rejected: [{ candidate_ref: "standards#1", reason: "already handled in src/view.mjs:4" }],
  },
  route: { primary: "implementation", secondary_debt: false },
  ...overrides,
});

const errorsOf = (report) => {
  const result = validatePassReport(report);
  assert.equal(result.ok, false, "report must be rejected");
  return result.errors.join("\n");
};

test("the library exposes only the scripted-pass interface", () => {
  assert.deepEqual(Object.keys(contract).sort(), [
    "deriveReviewRouting",
    "planDeliveryReviewGate",
    "planEngineOrder",
    "recoverPassCount",
    "reviewPacketIdentity",
    "selectSourceContext",
    "validatePassReport",
  ]);
});

test("the Review Packet identity is a stable hash of run, bounds, snapshot and sources", () => {
  const packet = {
    review_run_id: "run-7f3a",
    accepted_bounds_hash: "1".repeat(64),
    snapshot_hash: "2".repeat(64),
    source_set_hash: "3".repeat(64),
  };
  assert.equal(reviewPacketIdentity(packet), "76d2db9a17f5f93daa021fc230cc0cf7675d7f5a6a2be376afb5fc9fc7c55db2");
  assert.notEqual(reviewPacketIdentity({ ...packet, snapshot_hash: "4".repeat(64) }), reviewPacketIdentity(packet));
  assert.throws(() => reviewPacketIdentity({ ...packet, source_set_hash: undefined }), TypeError);
});

test("the review budget allows one pass, a second on accepted risk, more only on human direction", () => {
  const input = {
    currentState: "implementation_complete",
    acceptedBoundsValid: true,
    targetSupported: true,
    recoveredReviewCount: 0,
    acceptedRiskTrigger: null,
    humanReviewDirection: null,
  };
  const due = { state: "review_due", handoffWrites: ["review_due_context"] };
  const risk = { kind: "security", evidence: "repair.md#authorization" };
  const direction = (authorized_ordinal) => ({ evidence: "user message 2026-10-23", authorized_ordinal });
  assert.deepEqual(planDeliveryReviewGate(input), due);
  assert.deepEqual(planDeliveryReviewGate({ ...input, recoveredReviewCount: 1 }), { state: "focused_validation", handoffWrites: [] });
  assert.deepEqual(planDeliveryReviewGate({ ...input, recoveredReviewCount: 1, acceptedRiskTrigger: risk }), due);
  assert.deepEqual(planDeliveryReviewGate({ ...input, recoveredReviewCount: 1, acceptedRiskTrigger: { ...risk, kind: "style" } }).state, "focused_validation");
  assert.deepEqual(planDeliveryReviewGate({ ...input, recoveredReviewCount: 2 }), {
    state: "review_budget_exhausted",
    priorState: "implementation_complete",
    handoffWrites: [],
  });
  assert.deepEqual(planDeliveryReviewGate({ ...input, recoveredReviewCount: 2, humanReviewDirection: direction(3) }), due);
  assert.equal(planDeliveryReviewGate({ ...input, recoveredReviewCount: 3, humanReviewDirection: direction(3) }).state, "review_budget_exhausted");
  for (const invalid of [{ acceptedBoundsValid: false }, { targetSupported: false }, { recoveredReviewCount: -1 }, { recoveredReviewCount: 1.5 }]) {
    assert.deepEqual(planDeliveryReviewGate({ ...input, ...invalid }), { state: "review_failed", handoffWrites: [] });
  }
});

test("routing takes the highest-priority finding route and flags debt behind a repair", () => {
  const route = (...routes) => deriveReviewRouting(routes.map((return_route) => ({ return_route })));
  assert.deepEqual(route(), { primary: "closeout", secondary_architecture_follow_up: false });
  assert.deepEqual(route("debt_follow_up"), { primary: "debt_follow_up", secondary_architecture_follow_up: false });
  assert.deepEqual(route("implementation", "human_steering_required"), { primary: "human_steering_required", secondary_architecture_follow_up: false });
  assert.deepEqual(route("debt_follow_up", "implementation", "debugging"), { primary: "debugging", secondary_architecture_follow_up: true });
  assert.deepEqual(route("docs_ingest", "debt_follow_up"), { primary: "debt_follow_up", secondary_architecture_follow_up: false });
  assert.throws(() => route("closeout"), /invalid finding return route/u);
});

test("engine order puts the host engine first and HI_REVIEW_ENGINES replaces it", () => {
  assert.deepEqual(planEngineOrder({ CLAUDECODE: "1" }), ["claude", "codex"]);
  assert.deepEqual(planEngineOrder({ CODEX_THREAD_ID: "thread-1" }), ["codex", "claude"]);
  assert.deepEqual(planEngineOrder({}), ["codex", "claude"]);
  assert.deepEqual(planEngineOrder({ CODEX_THREAD_ID: "" }), ["codex", "claude"]);
  assert.deepEqual(
    planEngineOrder({ CLAUDECODE: "1", HI_REVIEW_ENGINES: "codex, claude" }),
    ["codex", "claude"],
  );
  assert.deepEqual(planEngineOrder({ CODEX_THREAD_ID: "t", HI_REVIEW_ENGINES: "claude" }), ["claude"]);
  for (const bad of ["gemini", "claude,claude", "claude,,codex"]) {
    assert.throws(() => planEngineOrder({ HI_REVIEW_ENGINES: bad }), /HI_REVIEW_ENGINES/u, bad);
  }
});

test("a Pass Report validates only in the exact pass-report-v1 shape", () => {
  assert.deepEqual(validatePassReport(passReport()), { ok: true });
  assert.deepEqual(validatePassReport(passReport({ mode: "standalone", ordinal: null })), { ok: true });

  assert.match(errorsOf(passReport({ body: "## Findings" })), /body/u);
  assert.match(errorsOf(passReport({ schema: "two-axis-v1" })), /schema/u);
  assert.match(errorsOf(passReport({ ordinal: null })), /ordinal/u);
  assert.match(errorsOf(passReport({ mode: "standalone" })), /ordinal/u);
  assert.match(errorsOf(passReport({ packet_identity: "abc" })), /packet_identity/u);

  const report = passReport();
  report.axes.spec.lens_result = "incomplete";
  report.axes.standards.attempts[0].tokens = 3;
  report.adjudication.findings[0].axis = "style";
  report.adjudication.rejected[0].reason = "";
  const errors = errorsOf(report);
  for (const field of ["axes.spec.lens_result", "axes.standards.attempts[0]", "adjudication.findings[0]", "adjudication.rejected[0]"]) {
    assert.ok(errors.includes(field), `${field} must be reported in:\n${errors}`);
  }

  assert.match(errorsOf(passReport({ route: { primary: "closeout", secondary_debt: false } })), /route/u);
  assert.match(errorsOf("---\ntitle: review\n---"), /object/u);
});

test("the pass count counts only valid pass-<n>.json reports of the goal", () => {
  const valid = (ordinal) => passReport({ ordinal, run_id: `run-${ordinal}` });
  assert.equal(recoverPassCount([]), 0);
  assert.equal(
    recoverPassCount([
      { name: "pass-1.json", report: valid(1) },
      { name: "pass-2.json", report: valid(2) },
      { name: "pass-3.json", error: new SyntaxError("Unexpected end of JSON input") },
      { name: "pass-4.json", report: { ...valid(4), schema: "two-axis-v1" } },
      { name: "pass-5.json", report: valid(6) },
      { name: "pass-7.json.tmp", report: valid(7) },
      { name: "pass-8.json", report: passReport({ mode: "standalone", ordinal: null }) },
      { name: "review-0a1b2c-20261001T101500Z-0123456789ab-review-report.md", report: valid(9) },
    ]),
    2,
  );
});

test("each axis gets its own sorted source context without Pass Reports", () => {
  const sources = {
    changedPaths: ["apps/cli/src/a.ts", "apps/cli/README.md", "packages/db/x.ts", ".devpunks/delivery/goal/reviews/pass-1.json"],
    agentsFiles: [
      "AGENTS.md",
      "apps/AGENTS.md",
      "apps/cli/AGENTS.md",
      "apps/web/AGENTS.md",
      "packages/db/AGENTS.md",
      ".devpunks/AGENTS.md",
      ".devpunks/delivery/goal/reviews/AGENTS.md",
    ],
    matchedRules: [".agents/rules/b.md", ".agents/rules/a.md", ".agents/rules/a.md"],
    assignedSkillFiles: [".agents/skills/tdd/SKILL.md"],
    specFolderFiles: [
      "specs/x/SPEC.md",
      "specs/x/PLAN.md",
      "specs/x/notes.md",
      "specs/x/IMPLEMENTATION-NOTES.md",
      ".devpunks/delivery/goal/reviews/SPEC.md",
    ],
  };
  assert.deepEqual(selectSourceContext({ axis: "standards", ...sources }), [
    ".agents/rules/a.md",
    ".agents/rules/b.md",
    ".agents/skills/tdd/SKILL.md",
    "AGENTS.md",
    "apps/AGENTS.md",
    "apps/cli/AGENTS.md",
    "packages/db/AGENTS.md",
  ]);
  assert.deepEqual(selectSourceContext({ axis: "spec", ...sources }), [
    "specs/x/IMPLEMENTATION-NOTES.md",
    "specs/x/PLAN.md",
    "specs/x/SPEC.md",
  ]);
  assert.throws(() => selectSourceContext({ axis: "style", ...sources }), /axis/u);
});
