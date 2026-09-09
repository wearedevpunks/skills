import { mkdtempSync, writeFileSync, rmSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
const helper = fileURLToPath(new URL("../skills/agnostic/quality/autoreview/scripts/autoreview", import.meta.url));
import assert from "node:assert/strict";
import { test } from "node:test";
import { retainedPassFixture, rewriteReport } from "./fixtures/v43/IP-453/retained-pass.mjs";
import { deliveryRunId, reviewPacketIdentity, planDeliveryReviewGate, validateRetainedPass, hashRecord, parseReviewReport, sha256Hex } from "../skills/phases/review-phase/scripts/review-contract.mjs";

test("current protocol cannot count a clean primary without complete challenger evidence", () => {
  const { candidate, expected } = retainedPassFixture();
  assert.equal(validateRetainedPass(candidate, expected).valid, true, "historical five-lens report stays valid");
  assert.equal(validateRetainedPass(candidate, { ...expected, reviewProtocol: "primary-challenger-v1" }).valid, false);
});

test("epoch-less reports require a parent-verified immutable commit binding", () => {
  const { candidate, expected } = retainedPassFixture();
  const { approvedLegacyReportCommitShas: _approved, ...unbound } = expected;
  assert.match(
    validateRetainedPass(candidate, unbound).errors.join(","),
    /missing:legacy_report_commit_binding/u,
  );
  assert.match(
    validateRetainedPass(candidate, {
      ...unbound,
      approvedLegacyReportCommitShas: ["a".repeat(40)],
    }).errors.join(","),
    /missing:legacy_report_commit_binding/u,
  );
});

test("complete current epoch retains provenance; incomplete challenger never counts", () => {
  const { candidate, expected } = retainedPassFixture();
  const packet = hashRecord("review-packet", [parseReviewReport(candidate.reportBytes).report.review_run_id, parseReviewReport(candidate.reportBytes).report.accepted_bounds_hash, parseReviewReport(candidate.reportBytes).report.snapshot_hash, parseReviewReport(candidate.reportBytes).report.source_set_hash]);
  const result = (role, coverage, outcome = "clean") => ({ reviewer_identity: role + ":native", role, coverage, packet_identity: packet, outcome, candidates: [], unavailable_coverage: outcome === "incomplete" ? [coverage] : [], cause: outcome === "incomplete" ? "capacity interrupted" : null, follow_up: outcome === "incomplete" ? "resume assigned coverage" : null });
  rewriteReport(candidate, report => { report.review_epoch = { protocol: "primary-challenger-v1", packet_identity: packet, results: [...["standards", "skill_adherence", "architecture", "simplify", "spec"].map(lens => result("primary", lens)), result("challenger", "cross-file authorization")], adjudications: [] }; });
  const assignedCoverage = parseReviewReport(candidate.reportBytes).report.review_epoch.results.map(({ reviewer_identity, role, coverage }) => ({ reviewer_identity, role, coverage }));
  const current = { ...expected, reviewProtocol: "primary-challenger-v1", assignedCoverage };
  assert.equal(validateRetainedPass(candidate, current).valid, true);
  assert.equal(validateRetainedPass(candidate, { ...current, assignedCoverage: [...assignedCoverage, { reviewer_identity: "other:challenger", role: "challenger", coverage: "extra assigned security area" }] }).valid, false, "every assigned challenger must finish");
  rewriteReport(candidate, report => { report.review_epoch.results[5] = result("challenger", "cross-file authorization", "incomplete"); });
  assert.equal(validateRetainedPass(candidate, current).valid, false);
  rewriteReport(candidate, report => { report.review_epoch.results[5] = null; });
  assert.equal(validateRetainedPass(candidate, current).valid, false, "malformed external result is rejected without throwing");
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
    const results = [...["standards", "skill_adherence", "architecture", "simplify", "spec"].map(coverage => ({role:"primary",coverage})), {role:"challenger",coverage:"security"}].map(({role,coverage}) => ({reviewer_identity:role+":native",role,coverage,packet_identity:identity,outcome:"clean",candidates:[],unavailable_coverage:[],cause:null,follow_up:null}));
    report.review_epoch = { protocol:"primary-challenger-v1",packet_identity:identity,results,adjudications:[],human_direction:direction };
  });
  const assignedCoverage = parseReviewReport(candidate.reportBytes).report.review_epoch.results.map(({reviewer_identity,role,coverage}) => ({reviewer_identity,role,coverage}));
  const current = {...expected, reviewOrdinal:3, reviewProtocol:"primary-challenger-v1",assignedCoverage,precedingRepairEvidence:null};
  assert.equal(validateRetainedPass(candidate,current).valid,false);
  assert.equal(validateRetainedPass(candidate,{...current,humanReviewDirection:direction}).valid,true);
});
