import assert from "node:assert/strict";
import { test } from "node:test";
import * as contract from "../skills/phases/review-phase/scripts/review-contract.mjs";

const { budgetBlocker, deriveReviewRouting, recoverPassCount, validateFindings, validatePassReport } = contract;

const finding = (overrides = {}) => ({
  id: "f001",
  priority: "P1",
  kind: "contract",
  location: "src/export.mjs:12",
  failure_scenario: "an order with no customer reaches export and the CSV row drops the total",
  action: "read the total from the order, not the customer",
  return_route: "implementation",
  ...overrides,
});

const passReport = (overrides = {}) => ({
  schema: "pass-report-v2",
  run_id: "run-7f3a",
  ordinal: 1,
  mode: "delivery",
  base: "a".repeat(40),
  head: "b".repeat(40),
  reviewer: { subagent_tokens: 41000 },
  findings: [finding()],
  route: { primary: "implementation", secondary_debt: false },
  ...overrides,
});

const errorsOf = (check) => {
  assert.equal(check.ok, false, "input must be rejected");
  return check.errors.join("\n");
};

test("the library exposes only the scripted-pass interface", () => {
  assert.deepEqual(Object.keys(contract).sort(), [
    "budgetBlocker",
    "deriveReviewRouting",
    "recoverPassCount",
    "validateFindings",
    "validatePassReport",
  ]);
});

test("the review budget allows one pass, a second on accepted risk, more only on human direction", () => {
  assert.equal(budgetBlocker({ passCount: 0 }), null);
  assert.match(budgetBlocker({ passCount: 1 }), /--accepted-risk <kind>:<evidence>/u);
  assert.equal(budgetBlocker({ passCount: 1, acceptedRisk: "security:repair.md#authz: scope" }), null);
  for (const invalid of ["style:looks off", "security:", "security"]) {
    assert.match(budgetBlocker({ passCount: 1, acceptedRisk: invalid }), /accepted-risk/u, invalid);
  }
  assert.match(budgetBlocker({ passCount: 1, humanDirection: "user said so" }), /accepted-risk/u);
  assert.match(budgetBlocker({ passCount: 2, acceptedRisk: "security:x" }), /--human-direction <evidence>/u);
  assert.equal(budgetBlocker({ passCount: 2, humanDirection: "user message 2026-11-04" }), null);
  assert.equal(budgetBlocker({ passCount: 3, humanDirection: "user message 2026-11-05" }), null);
  assert.match(budgetBlocker({ passCount: 3, humanDirection: "  " }), /human direction/u);
});

test("routing takes the highest-priority finding route and flags debt behind a repair", () => {
  const route = (...routes) => deriveReviewRouting(routes.map((return_route) => ({ return_route })));
  assert.deepEqual(route(), { primary: "closeout", secondary_debt: false });
  assert.deepEqual(route("debt_follow_up"), { primary: "debt_follow_up", secondary_debt: false });
  assert.deepEqual(route("implementation", "human_steering_required"), { primary: "human_steering_required", secondary_debt: false });
  assert.deepEqual(route("debt_follow_up", "implementation", "debugging"), { primary: "debugging", secondary_debt: true });
  assert.deepEqual(route("docs_ingest", "debt_follow_up"), { primary: "debt_follow_up", secondary_debt: false });
  assert.deepEqual(route("docs_ingest"), { primary: "docs_ingest", secondary_debt: false });
});

test("findings.json holds at most five exact P0-P2 findings in the lens kinds", () => {
  assert.deepEqual(validateFindings({ findings: [] }), { ok: true });
  assert.deepEqual(validateFindings({ findings: [finding(), finding({ id: "f002", priority: "P2", kind: "smell" })] }), { ok: true });

  const five = (count) => ({ findings: Array.from({ length: count }, (_, index) => finding({ id: `f00${index + 1}` })) });
  assert.deepEqual(validateFindings(five(5)), { ok: true });
  assert.match(errorsOf(validateFindings(five(6))), /at most 5/u);

  assert.match(errorsOf(validateFindings({ findings: [], rejected: [] })), /exactly the key "findings"/u);
  assert.match(errorsOf(validateFindings(null)), /exactly the key "findings"/u);
  assert.match(errorsOf(validateFindings({ findings: [finding(), finding()] })), /unique/u);
  assert.match(errorsOf(validateFindings({ findings: [{ ...finding(), evidence: "x" }] })), /exactly the keys/u);
  const invalid = {
    id: "standards.1", priority: "P3", kind: "maintainability", location: "src/export.mjs",
    failure_scenario: " ", action: "", return_route: "closeout",
  };
  const errors = errorsOf(validateFindings({ findings: [finding(invalid)] }));
  for (const field of Object.keys(invalid)) assert.ok(errors.includes(`findings[0].${field}:`), `${field} in:\n${errors}`);
});

test("a Pass Report validates only in the exact pass-report-v2 shape", () => {
  assert.deepEqual(validatePassReport(passReport()), { ok: true });
  assert.deepEqual(validatePassReport(passReport({ mode: "standalone", ordinal: null })), { ok: true });
  assert.deepEqual(validatePassReport(passReport({ findings: [], route: { primary: "closeout", secondary_debt: false } })), { ok: true });

  assert.match(errorsOf(validatePassReport(passReport({ body: "## Findings" }))), /exactly the keys/u);
  assert.match(errorsOf(validatePassReport(passReport({ schema: "pass-report-v1" }))), /schema/u);
  assert.match(errorsOf(validatePassReport(passReport({ ordinal: null }))), /ordinal/u);
  assert.match(errorsOf(validatePassReport(passReport({ mode: "standalone" }))), /ordinal/u);
  assert.match(errorsOf(validatePassReport(passReport({ head: "HEAD" }))), /head/u);
  assert.match(errorsOf(validatePassReport(passReport({ reviewer: { subagent_tokens: -1 } }))), /reviewer/u);
  assert.match(errorsOf(validatePassReport(passReport({ route: { primary: "closeout", secondary_debt: false } }))), /route/u);
  assert.match(errorsOf(validatePassReport("---\ntitle: review\n---")), /exactly the keys/u);
});

test("the pass count counts valid v2 and legacy v1 pass-<n>.json reports whose ordinal matches", () => {
  const v2 = (ordinal) => passReport({ ordinal, run_id: `run-${ordinal}` });
  const v1 = (ordinal) => ({ schema: "pass-report-v1", ordinal, axes: {}, adjudication: {} });
  assert.equal(recoverPassCount([]), 0);
  assert.equal(
    recoverPassCount([
      { name: "pass-1.json", report: v1(1) },
      { name: "pass-2.json", report: v2(2) },
      { name: "pass-3.json", report: null },
      { name: "pass-4.json", report: { ...v2(4), schema: "two-axis-v1" } },
      { name: "pass-5.json", report: v2(6) },
      { name: "pass-6.json", report: v1(7) },
      { name: "pass-7.json.tmp", report: v2(7) },
      { name: "pass-8.json", report: passReport({ mode: "standalone", ordinal: null }) },
      { name: "review-0a1b2c-20261001T101500Z-review-report.md", report: v2(9) },
    ]),
    2,
  );
});
