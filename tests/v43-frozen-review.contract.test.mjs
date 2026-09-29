import { mkdtempSync, writeFileSync, rmSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
const helper = fileURLToPath(new URL("../skills/agnostic/quality/autoreview/scripts/autoreview", import.meta.url));
import assert from "node:assert/strict";
import { test } from "node:test";
import { TWO_AXES, cleanAxisResult, retainedPassFixture, rewriteReport } from "./fixtures/v43/IP-453/retained-pass.mjs";
import { deliveryRunId, reviewPacketIdentity, planDeliveryReviewGate, validateRetainedPass, hashRecord, parseReviewReport, sha256Hex } from "../skills/phases/review-phase/scripts/review-contract.mjs";

const errorsOf = (candidate, expected) => validateRetainedPass(candidate, expected).errors.join(",");

const axisExpected = (candidate, expected) => ({
  ...expected,
  assignedCoverage: parseReviewReport(candidate.reportBytes).report.review_epoch.results.map(({ reviewer_identity, coverage }) => ({ reviewer_identity, coverage })),
});

test("a clean two-axis report is the only valid retained shape", () => {
  const { candidate, expected } = retainedPassFixture();
  assert.deepEqual(validateRetainedPass(candidate, expected), { valid: true, errors: [] });
  const report = parseReviewReport(candidate.reportBytes).report;
  assert.deepEqual(Object.keys(report.lens_outcomes).sort(), ["spec", "standards"]);
  assert.equal(report.review_epoch.protocol, "two-axis-v1");
  assert.deepEqual(report.review_epoch.results.map(({ coverage }) => coverage), ["standards", "spec"]);
});

test("epoch-less reports are invalid; no legacy binding can revive them", () => {
  const { candidate, expected } = retainedPassFixture();
  rewriteReport(candidate, report => { delete report.review_epoch; });
  assert.match(errorsOf(candidate, expected), /malformed:report_schema/u);
  assert.equal(validateRetainedPass(candidate, { ...expected, approvedLegacyReportCommitShas: [candidate.reportCommitSha] }).valid, false);
});

test("five-lens lens_outcomes and legacy protocol names are invalid", () => {
  const { candidate, expected } = retainedPassFixture();
  rewriteReport(candidate, report => {
    report.lens_outcomes = Object.fromEntries(["standards", "skill_adherence", "architecture", "simplify", "spec"].map(lens => [lens, "clean"]));
  });
  assert.match(errorsOf(candidate, expected), /malformed:lens_keys/u);
  const old = retainedPassFixture();
  rewriteReport(old.candidate, report => { report.review_epoch.protocol = "primary-challenger-v1"; });
  assert.match(errorsOf(old.candidate, old.expected), /malformed:review_epoch/u);
});

test("a Lens Result carrying role is invalid", () => {
  const { candidate, expected } = retainedPassFixture();
  rewriteReport(candidate, report => { report.review_epoch.results[0].role = "primary"; });
  assert.match(errorsOf(candidate, expected), /malformed:lens_result/u);
  assert.equal(validateRetainedPass(candidate, { ...expected, assignedCoverage: expected.assignedCoverage.map(item => ({ ...item, role: "primary" })) }).valid, false);
});

test("two axes sharing one reviewer identity are invalid", () => {
  const { candidate, expected } = retainedPassFixture();
  rewriteReport(candidate, report => { report.review_epoch.results[1].reviewer_identity = report.review_epoch.results[0].reviewer_identity; });
  assert.match(errorsOf(candidate, axisExpected(candidate, expected)), /incomplete:axis_coverage/u);
});

test("a missing, repeated, or unknown axis is invalid", () => {
  const { candidate, expected } = retainedPassFixture();
  rewriteReport(candidate, report => { report.review_epoch.results.pop(); });
  assert.match(errorsOf(candidate, axisExpected(candidate, expected)), /incomplete:axis_coverage/u);
  const repeated = retainedPassFixture();
  rewriteReport(repeated.candidate, report => { report.review_epoch.results[1].coverage = "standards"; });
  assert.match(errorsOf(repeated.candidate, axisExpected(repeated.candidate, repeated.expected)), /malformed:axis_coverage/u);
  const unknown = retainedPassFixture();
  rewriteReport(unknown.candidate, report => { report.review_epoch.results[1].coverage = "cross-file authorization"; });
  assert.match(errorsOf(unknown.candidate, axisExpected(unknown.candidate, unknown.expected)), /malformed:axis_coverage/u);
});

test("an incomplete axis never counts", () => {
  const { candidate, expected } = retainedPassFixture();
  const incomplete = { outcome: "incomplete", unavailable_coverage: ["spec"], cause: "capacity interrupted", follow_up: "resume assigned coverage" };
  rewriteReport(candidate, report => { Object.assign(report.review_epoch.results[1], incomplete); });
  assert.equal(validateRetainedPass(candidate, expected).valid, false);
  assert.match(errorsOf(candidate, expected), /incomplete:review_epoch/u);
  rewriteReport(candidate, report => { report.review_epoch.results[1] = null; });
  assert.equal(validateRetainedPass(candidate, expected).valid, false, "malformed external result is rejected without throwing");
});

test("assigned coverage is mandatory and must equal the two axis results exactly", () => {
  const { candidate, expected } = retainedPassFixture();
  const { assignedCoverage, ...unassigned } = expected;
  assert.match(errorsOf(candidate, unassigned), /missing:assigned_coverage/u);
  assert.match(errorsOf(candidate, { ...expected, assignedCoverage: [] }), /missing:assigned_coverage/u);
  assert.match(errorsOf(candidate, { ...expected, assignedCoverage: [assignedCoverage[0]] }), /mismatch:assigned_coverage/u);
  assert.match(errorsOf(candidate, { ...expected, assignedCoverage: [...assignedCoverage, { reviewer_identity: "other:reviewer", coverage: "extra assigned area" }] }), /mismatch:assigned_coverage/u);
  assert.match(errorsOf(candidate, { ...expected, assignedCoverage: assignedCoverage.map(item => ({ ...item, role: "primary" })) }), /missing:assigned_coverage/u);
});

test("axis findings keep candidate provenance through adjudication", () => {
  const { candidate, expected } = retainedPassFixture();
  rewriteReport(candidate, report => {
    report.lens_outcomes.standards = "findings";
    report.findings = [{ id: "standards.owner", lens: "standards", severity: "high", location: "a.ts:1", impact: "Cross-owner read.", evidence: "Actual call returned foreign data.", action: "Reject unmatched owner.", return_route: "implementation" }];
    report.routing.primary = "implementation";
    Object.assign(report.review_epoch.results[0], { outcome: "findings", candidates: [{ location: "a.ts:1", evidence_pointer: "run:1", impact: "Cross-owner read.", proposed_severity: "high", proposed_return_route: "implementation", uncertainty: "none" }] });
    report.review_epoch.adjudications = [{ candidate_refs: [JSON.stringify(["review-standards", "standards", 0])], finding_id: "standards.owner", evidence: "Reproduced." }];
  });
  assert.deepEqual(validateRetainedPass(candidate, expected), { valid: true, errors: [] });
  rewriteReport(candidate, report => { report.review_epoch.adjudications = []; });
  assert.match(errorsOf(candidate, expected), /incomplete:candidate_accounting/u);
});

test("delivery permits a second completed pass only for accepted risk and stops at two", () => {
  const input = { currentState: "review_due", acceptedBoundsValid: true, targetSupported: true, recoveredReviewCount: 1 };
  assert.equal(planDeliveryReviewGate(input).state, "focused_validation");
  assert.equal(planDeliveryReviewGate({ ...input, acceptedRiskTrigger: { kind: "security", evidence: "accepted-repair.md#authorization" } }).state, "review_due");
  assert.equal(planDeliveryReviewGate({ ...input, recoveredReviewCount: 2 }).state, "review_budget_exhausted");
  assert.equal(planDeliveryReviewGate({ ...input, recoveredReviewCount: 3 }).state, "review_budget_exhausted", "legacy ordinals retained without reopening allowance");
});

test("autoreview consumes prepared facts without Git target discovery", () => {
  const scratch = mkdtempSync(join(tmpdir(), "v43-packet-"));
  try {
    const report = parseReviewReport(retainedPassFixture().candidate.reportBytes).report;
    const facts = "Frozen target and rules supplied by the parent. No live target discovery.";
    const packet = { packet_identity: hashRecord("review-packet", [report.review_run_id, report.accepted_bounds_hash, report.snapshot_hash, report.source_set_hash]), review_run_id: report.review_run_id, accepted_bounds_hash: report.accepted_bounds_hash, snapshot_hash: report.snapshot_hash, source_set_hash: report.source_set_hash, facts, facts_sha256: sha256Hex(Buffer.from(facts)) };
    const path = join(scratch, "packet.json");
    writeFileSync(path, JSON.stringify(packet));
    const child = spawnSync(helper, ["--review-packet", path, "--reviewer-identity", "primary:native", "--dry-run"], { cwd: scratch, encoding: "utf8" });
    assert.equal(child.status, 0, child.stderr);
    assert.match(child.stdout, /prepared review packet/);
  } finally { rmSync(scratch, { recursive: true, force: true }); }
});

test("autoreview refuses a direct run without a prepared packet", () => {
  const scratch = mkdtempSync(join(tmpdir(), "v43-direct-"));
  try {
    const { AUTOREVIEW_ALLOW_DIRECT: _allowed, ...env } = process.env;
    const child = spawnSync(helper, ["--mode", "local", "--dry-run"], { cwd: scratch, encoding: "utf8", env });
    assert.equal(child.status, 64, child.stderr);
    assert.match(child.stderr, /forbidden outside review-phase/u);
  } finally { rmSync(scratch, { recursive: true, force: true }); }
});

test("explicit human direction permits only its authorized additional ordinal", () => {
  const input = { currentState: "review_due", acceptedBoundsValid: true, targetSupported: true, recoveredReviewCount: 2 };
  const direction = { evidence: "human-direction.md#review-3", authorized_ordinal: 3 };
  assert.equal(planDeliveryReviewGate({ ...input, humanReviewDirection: direction }).state, "review_due");
  assert.equal(planDeliveryReviewGate({ ...input, recoveredReviewCount: 3, humanReviewDirection: direction }).state, "review_budget_exhausted");
});

test("repair-triggered passes require parent-verified repair evidence", () => {
  const { candidate, expected } = retainedPassFixture();
  assert.equal(validateRetainedPass(candidate, expected).valid, true);
  assert.match(
    validateRetainedPass(candidate, {
      ...expected,
      precedingRepairEvidence: null,
    }).errors.join(","),
    /invalid:delivery_identity_or_ordinal/u,
  );
  assert.match(
    validateRetainedPass(candidate, {
      ...expected,
      precedingRepairEvidence: { ordinal: 1, evidence: "" },
    }).errors.join(","),
    /invalid:delivery_identity_or_ordinal/u,
  );
});

test("additional current report retains exact human direction without altering lineage", () => {
  const { candidate, expected, lineageId } = retainedPassFixture();
  const direction = { evidence: "human-direction.md#review-3", authorized_ordinal: 3 };
  rewriteReport(candidate, report => {
    report.review_ordinal = 3; report.preceding_repair_ordinal = null;
    report.review_run_id = deliveryRunId(lineageId, 3);
    const identity = reviewPacketIdentity(report);
    const results = TWO_AXES.map(([reviewer_identity, coverage]) => cleanAxisResult({ reviewer_identity, coverage }, identity));
    report.review_epoch = { protocol:"two-axis-v1",packet_identity:identity,results,adjudications:[],human_direction:direction };
  });
  const assignedCoverage = parseReviewReport(candidate.reportBytes).report.review_epoch.results.map(({reviewer_identity,coverage}) => ({reviewer_identity,coverage}));
  const current = {...expected, reviewOrdinal:3,assignedCoverage,precedingRepairEvidence:null};
  assert.equal(validateRetainedPass(candidate,current).valid,false);
  assert.equal(validateRetainedPass(candidate,{...current,humanReviewDirection:direction}).valid,true);
});
