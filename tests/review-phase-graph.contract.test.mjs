import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import {
  acceptedBoundsHash,
  assessReadonlyValidation,
  deliveryLineageId,
  deliveryRunId,
  deliverySnapshotHash,
  deriveReviewRouting,
  encodeReviewReport,
  inclusiveScopeHash,
  normalizeReviewSources,
  normalizeReviewTarget,
  orderedBundleContentHash,
  parseReviewReport,
  planDeliveryReviewGate,
  recoverDeliveryCount,
  resolveRetainedRun,
  reviewReportPath,
  reviewScopeSlug,
  sha256Hex,
  snapshot12,
  sourceSetHash,
  standaloneLineageId,
  standaloneRunId,
  standaloneSnapshotHash,
  validateRetainedPass,
} from "../skills/phases/review-phase/scripts/review-contract.mjs";

const read = (path) =>
  readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

const reviewSkill = () => read("skills/phases/review-phase/SKILL.md");
const reviewRouter = () => read("skills/phases/review-phase/phases/router.md");
const reviewPrepare = () =>
  read("skills/phases/review-phase/phases/prepare-review.md");
const reviewRun = () => read("skills/phases/review-phase/phases/run-review.md");
const reviewRetain = () =>
  read("skills/phases/review-phase/phases/retain-report.md");
const reviewReturn = () =>
  read("skills/phases/review-phase/phases/return-route.md");
const reviewGraph = () =>
  read("skills/phases/review-phase/references/state-graph.md");
const reviewTargets = () =>
  read("skills/phases/review-phase/references/targets.md");
const reviewReport = () =>
  read("skills/phases/review-phase/references/durable-report.md");
const reviewHandoff = () =>
  read("skills/phases/review-phase/references/runtime-handoff.md");

const cloneCandidate = (candidate) => ({
  ...candidate,
  reportBytes: Buffer.from(candidate.reportBytes),
  resolvedReportBytes: Buffer.from(candidate.resolvedReportBytes),
  commitPaths: [...candidate.commitPaths],
});

const rewriteReport = (candidate, mutate) => {
  const parsed = parseReviewReport(candidate.reportBytes);
  const report = structuredClone(parsed.report);
  mutate(report);
  candidate.reportBytes = encodeReviewReport(report, {
    domain: parsed.frontmatter.domain,
  });
  candidate.resolvedReportBytes = Buffer.from(candidate.reportBytes);
  candidate.reportSha256 = sha256Hex(candidate.reportBytes);
};

const rewriteBytes = (candidate, mutate) => {
  const text = new TextDecoder().decode(candidate.reportBytes);
  candidate.reportBytes = Buffer.from(mutate(text), "utf8");
  candidate.resolvedReportBytes = Buffer.from(candidate.reportBytes);
  candidate.reportSha256 = sha256Hex(candidate.reportBytes);
};

const retainedPassFixture = (mode = "delivery") => {
  const delivery = mode === "delivery";
  const targetEvidence = delivery
    ? {
        locator: "repo:wearedevpunks/harness-intelligence",
        actualBaseRef: "origin/main",
        fixedPointSha: "1".repeat(40),
        headIdentity: "2".repeat(40),
        scopeEntries: ["apps/cli/src/a.ts", "apps/wiki/spec.md"],
        canonicalPatchBytes: Buffer.from("canonical patch\n"),
      }
    : {
        locator: "artifact:spec-v1",
        files: [
          { identity: "docs/b.md", bytes: Buffer.from("beta\n") },
          { identity: "docs/a.md", bytes: Buffer.from("alpha\n") },
        ],
        scopeEntries: ["docs/b.md", "docs/a.md"],
      };
  const target = normalizeReviewTarget(mode, targetEvidence);
  const boundsIdentity = delivery ? "bounds:v1:HI-104" : "bounds:v1:artifact";
  const boundsHash = acceptedBoundsHash(boundsIdentity, target.inclusive_scope);
  const deliveryGoalIdentity = delivery ? "goal:HI-104" : null;
  const lineageId = delivery
    ? deliveryLineageId(deliveryGoalIdentity)
    : standaloneLineageId(target.locator, boundsHash);
  const snapshotHash = delivery
    ? deliverySnapshotHash({
        locator: target.locator,
        actualBaseRef: target.actual_base_ref,
        fixedPointSha: target.fixed_point_sha,
        headIdentity: target.head_identity,
        scopeEntries: target.inclusive_scope,
        canonicalPatchHash: target.canonical_patch_hash,
      })
    : standaloneSnapshotHash({
        locator: targetEvidence.locator,
        files: targetEvidence.files,
        scopeEntries: targetEvidence.scopeEntries,
      });
  const ordinal = delivery ? 2 : null;
  const runId = delivery
    ? deliveryRunId(lineageId, ordinal)
    : standaloneRunId(lineageId, snapshotHash);
  const reviewedAt = delivery ? "20260811T120000Z" : "20260811T120500Z";
  const reportPath = reviewReportPath({ lineageId, reviewedAt, snapshotHash });
  const auxiliaryEnvelopePaths = [
    "apps/wiki/content/docs/project/reviews/meta.json",
    "apps/wiki/log.md",
  ];
  const envelopePaths = [reportPath, ...auxiliaryEnvelopePaths];
  const sourceEvidence = [
    {
      path: delivery ? "SPEC.md" : "Standards.md",
      bytes: Buffer.from(delivery ? "accepted spec\n" : "standards\n"),
    },
  ];
  const sources = normalizeReviewSources(sourceEvidence);
  const retainedRef = delivery
    ? "refs/heads/review-proof"
    : `review/${reviewScopeSlug(lineageId)}-${snapshot12(snapshotHash)}`;
  const report = {
    review_lineage_id: lineageId,
    review_run_id: runId,
    accepted_bounds_identity: boundsIdentity,
    accepted_bounds_hash: boundsHash,
    reviewed_at: reviewedAt,
    mode,
    normalized_target: target,
    snapshot_hash: snapshotHash,
    excluded_envelope: envelopePaths,
    source_paths_and_hashes: sources,
    source_set_hash: sourceSetHash(sources),
    lens_outcomes: Object.fromEntries(
      ["standards", "skill_adherence", "architecture", "simplify", "spec"].map(
        (lens) => [lens, "clean"],
      ),
    ),
    findings: [],
    routing: { primary: "closeout", secondary_architecture_follow_up: false },
    validation: [],
    delivery_goal_identity: deliveryGoalIdentity,
    review_ordinal: ordinal,
    preceding_repair_ordinal: delivery ? 1 : null,
  };
  const reportBytes = encodeReviewReport(
    report,
    {
      domain: delivery ? "cli" : "project",
      trailingProse: delivery ? "Human-readable review summary." : "",
    },
  );
  return {
    candidate: {
      reportPath,
      reportBytes,
      resolvedReportBytes: Buffer.from(reportBytes),
      reportSha256: sha256Hex(reportBytes),
      reportCommitSha: (delivery ? "b" : "e").repeat(40),
      retainedRef,
      refContainsCommit: true,
      commitPaths: envelopePaths,
    },
    expected: {
      mode,
      acceptedBoundsIdentity: boundsIdentity,
      targetEvidence,
      sourceEvidence,
      auxiliaryEnvelopePaths,
      approvedRetainedRefs: [retainedRef],
      wikiDomain: delivery ? "cli" : "project",
      ...(delivery ? { deliveryGoalIdentity, reviewOrdinal: ordinal } : {}),
    },
    lineageId,
  };
};

const standaloneRetainedPassFixture = () => retainedPassFixture("standalone");

test("review phase is explicit-only, readonly, and ends after retained routing", () => {
  const skill = reviewSkill();
  const router = reviewRouter();
  const prepare = reviewPrepare();
  const run = reviewRun();
  const retain = reviewRetain();
  const returnRoute = reviewReturn();
  const metadata = read("skills/phases/review-phase/agents/openai.yaml");
  const delivery = read("skills/phases/delivery-phase/SKILL.md");
  const deliveryReview = read("skills/phases/delivery-phase/phases/review.md");
  const deliveryRouter = read("skills/phases/delivery-phase/phases/router.md");
  const handoff = read("skills/phases/delivery-phase/references/phase-handoff.md");
  assert.match(skill, /disable-model-invocation:\s*true/u);
  assert.match(metadata, /allow_implicit_invocation:\s*false/u);
  assert.match(delivery, /`review-phase` is user-invoked/iu);
  assert.match(delivery, /exact `\$review-phase` invocation context.{0,100}stops/isu);
  assert.doesNotMatch(delivery, /delegate to `review-phase`/iu);
  assert.match(deliveryReview, /persist `review_due`.{0,160}exact explicit `\$review-phase` invocation\s+context/isu);
  assert.match(deliveryReview, /Return that invocation context and stop/iu);
  assert.match(deliveryReview, /Only an explicit operator invocation.{0,160}enters `review_running`/isu);
  assert.doesNotMatch(deliveryReview, /explicitly invoke `review-phase`/iu);
  assert.match(deliveryRouter, /For durable `review_due`/iu);
  assert.match(
    deliveryRouter,
    /exact explicit `\$review-phase`\s+invocation context.{0,50}stop/isu,
  );
  assert.match(handoff, /explicit_operator_invocation_required: true/u);
  assert.match(handoff, /review_invocation_skill: \$review-phase/u);
  assert.match(handoff, /`review_due` handoff leaves `review_run_id` unset/iu);
  assert.match(prepare, /explicit operator invocation/iu);
  assert.match(prepare, /fresh `review_due` evidence/iu);
  assert.match(router, /Fresh `review_running` predecessor evidence/iu);
  assert.match(run, /reviewed target remains unchanged/iu);
  assert.match(retain, /report, navigation, and\s+wiki-log envelope/iu);
  assert.match(skill, /never enters a repair/iu);
  assert.match(
    run,
    /plans no work.{0,100}assigns no implementation skills.{0,160}repairs no finding/isu,
  );
  assert.match(returnRoute, /delegates no delivery transition.{0,100}owns no repair/isu);
});

test("all model-facing root and delivery guidance preserves explicit review invocation", () => {
  const rootRouting = read(
    "skills/phases/finder-phase/references/root-routing.md",
  );
  const delivery = read("skills/phases/delivery-phase/SKILL.md");
  const deliveryReview = read("skills/phases/delivery-phase/phases/review.md");
  const deliveryRouter = read("skills/phases/delivery-phase/phases/router.md");
  const deliveryHandoff = read(
    "skills/phases/delivery-phase/references/phase-handoff.md",
  );
  const modelGuidance = [rootRouting, delivery, deliveryReview, deliveryRouter];
  modelGuidance.push(deliveryHandoff);

  assert.match(
    rootRouting,
    /Review requests persist.{0,160}exact explicit `\$review-phase` invocation/isu,
  );
  assert.match(
    rootRouting,
    /never invoke, delegate to, or\s+model-select `review-phase`/iu,
  );
  for (const document of modelGuidance) {
    assert.doesNotMatch(document, /Reviews route to `review-phase`/iu);
    assert.doesNotMatch(document, /load and call `review-phase`/iu);
    assert.doesNotMatch(document, /explicitly invoke `review-phase`/iu);
    assert.doesNotMatch(document, /delegate to `review-phase`/iu);
  }
});

test("review router exposes every runtime route class in deterministic precedence", () => {
  const rows = [...reviewRouter().matchAll(/^\| (\d+) \| (.+) \| (.+) \|$/gmu)].map(
    ([, priority, evidence, output]) => ({
      priority: Number(priority),
      evidence,
      output: output.replace(/\[(`[^`]+`)\]\([^)]+\)/gu, "$1"),
    }),
  );

  assert.deepEqual(
    rows.map(({ priority }) => priority),
    Array.from({ length: 12 }, (_, index) => index + 1),
  );
  assert.deepEqual(
    rows.map(({ output }) => output),
    [
      "terminal `review_failed`",
      "terminal `review_budget_exhausted`",
      "checkpoint `retained_ref_approval_required`",
      "blocked `review_state_conflict`",
      "blocked `review_context_blocked`",
      "blocked `review_not_due`",
      "terminal `review_complete`",
      "terminal `review_routed`",
      "`return-route.md`",
      "`retain-report.md`",
      "`run-review.md`",
      "`prepare-review.md`",
    ],
  );
  assert.match(rows[0].evidence, /Unsupported target/iu);
  assert.match(rows[8].evidence, /routing output is absent/iu);
  assert.match(rows[11].evidence, /stale target\/source evidence/iu);
});

test("runtime handoff covers both storage modes and authoritative no-write outcomes", () => {
  const handoff = reviewHandoff();
  assert.match(handoff, /caller-provided delivery handoff/iu);
  assert.match(handoff, /same `delivery_goal_identity`/iu);
  assert.match(
    handoff,
    /<repo-root>\/.devpunks\/review-phase\/handoffs\/<review_lineage_id>\/<review_run_id>\.md/u,
  );
  assert.match(handoff, /Select the highest valid `attempt`/iu);
  assert.match(handoff, /different valid records for the same attempt.{0,100}`review_state_conflict`/isu);
  assert.match(handoff, /`review_budget_exhausted`[\s\S]*`review_not_due`[\s\S]*pre-run `review_failed`[\s\S]*pre-storage `review_context_blocked`[\s\S]*`review_state_conflict`/iu);
  assert.match(handoff, /rediscovery of an identical already-recorded terminal/iu);
  assert.match(handoff, /Once storage and\s+run identity are valid, a new stateful failure or blocker uses the normal record\s+schema/iu);
});

test("bounds and target validation precede delivery budget evaluation", () => {
  const deliveryReview = read("skills/phases/delivery-phase/phases/review.md");
  const deliveryRouter = read("skills/phases/delivery-phase/phases/router.md");
  const graph = reviewGraph();

  const reviewValidation = deliveryReview.indexOf(
    "Validate accepted bounds and normalize a supported Git/diff target",
  );
  const reviewBudget = deliveryReview.indexOf("recovered `review_count >= 3`");
  assert.ok(reviewValidation >= 0 && reviewValidation < reviewBudget);
  assert.match(
    deliveryReview,
    /Unsupported targets or invalid bounds enter `review_failed`.{0,120}no counter change/isu,
  );
  assert.match(
    deliveryReview,
    /`review_count >= 3`.{0,180}zero-write no-op.{0,180}do not persist\s+`review_due`/isu,
  );
  assert.match(
    deliveryRouter,
    /validates accepted bounds and normalizes a\s+supported target before any delivery-budget evaluation/iu,
  );
  assert.ok(
    deliveryRouter.indexOf("first validates") <
      deliveryRouter.indexOf("recover `review_count`"),
  );
  assert.match(
    deliveryRouter,
    /rejection enters\s+`review_failed` even when a persisted counter is 3/iu,
  );
  assert.ok(
    graph.indexOf("Unsupported target") <
      graph.indexOf("recovered `review_count >= 3`"),
  );
  assert.ok(
    graph.indexOf("Invalid accepted bounds") <
      graph.indexOf("recovered `review_count >= 3`"),
  );

  assert.deepEqual(
    planDeliveryReviewGate({
      currentState: "implementation_complete",
      acceptedBoundsValid: true,
      targetSupported: true,
      recoveredReviewCount: 3,
    }),
    {
      state: "review_budget_exhausted",
      priorState: "implementation_complete",
      handoffWrites: [],
    },
  );
  assert.deepEqual(
    planDeliveryReviewGate({
      currentState: "implementation_complete",
      acceptedBoundsValid: true,
      targetSupported: true,
      recoveredReviewCount: 2,
    }).handoffWrites,
    ["review_due_context"],
  );
});

test("autoreview keeps ordinary closeout behavior and one bounded review-phase call", () => {
  const autoreview = read("skills/agnostic/quality/autoreview/SKILL.md");
  assert.match(autoreview, /Outside `review-phase`.{0,100}keep going until structured review returns no\s+accepted\/actionable findings/isu);
  assert.match(autoreview, /When `review-phase` supplies a frozen normalized target.{0,160}exactly\s+once as advisory candidate generation/isu);
  assert.match(autoreview, /Do not repair findings or rerun the helper in this bounded\s+call/iu);
});

test("one invocation freezes one snapshot and evaluates all lenses in parallel", () => {
  const run = reviewRun();
  assert.match(run, /exactly one frozen bounded snapshot/iu);
  assert.match(run, /Invoke `autoreview` exactly once/iu);
  assert.match(run, /Parent-verify every advisory/iu);
  assert.match(run, /independent\s+bounded work, in parallel/iu);
  assert.match(run, /Standards[\s\S]*skill adherence[\s\S]*architecture[\s\S]*simplify[\s\S]*Spec/iu);
  assert.match(run, /report and triage order only/iu);
  assert.match(run, /Standards and Spec remain distinct/iu);
});

test("review validation is narrow and reports missing RED GREEN evidence", () => {
  const run = reviewRun();
  assert.match(run, /smallest safe readonly validation/iu);
  assert.match(run, /Broader checks require explicit accepted spec\s+or plan authority/iu);
  assert.match(run, /missing required RED\/GREEN evidence as a finding/iu);
  assert.match(run, /does not create it/iu);
  assert.match(run, /Proven\s+no-write commands/iu);
  assert.match(run, /may write.{0,160}disposable\s+checkout or snapshot/isu);
  assert.match(run, /Record the frozen-target hash before and after every validation/iu);
  assert.match(run, /before\/after target-hash mismatch.{0,160}consumes no pass/isu);
  assert.deepEqual(
    assessReadonlyValidation({
      beforeHash: "a".repeat(64),
      afterHash: "b".repeat(64),
    }),
    { state: "review_due", passConsumed: false },
  );
  assert.deepEqual(
    assessReadonlyValidation({
      beforeHash: "a".repeat(64),
      afterHash: "a".repeat(64),
    }),
    { state: "validation_accepted", passConsumed: false },
  );
});

test("target adapters freeze complete mode-specific identities", () => {
  const targets = reviewTargets();
  for (const field of [
    "locator",
    "actual base ref",
    "merge-base or fixed-point SHA",
    "head or dirty-worktree identity",
    "inclusive scope",
    "canonical patch hash",
  ]) {
    assert.match(targets, new RegExp(field, "iu"));
  }
  for (const field of [
    "ordered file identities",
    "ordered bundle content hash",
    "explicit absence of a Git fixed point",
  ]) {
    assert.match(targets, new RegExp(field, "iu"));
  }
  assert.match(targets, /smallest certain inclusive scope/iu);
  assert.match(targets, /full-repository expansion.{0,100}explicit/isu);
  assert.match(targets, /does not embed raw selected bytes/iu);
});

test("delivery target normalization rejects an empty inclusive scope", () => {
  assert.throws(
    () =>
      normalizeReviewTarget("delivery", {
        locator: "repo:wearedevpunks/harness-intelligence",
        actualBaseRef: "origin/main",
        fixedPointSha: "1".repeat(40),
        headIdentity: "2".repeat(40),
        scopeEntries: [],
        canonicalPatchBytes: Buffer.from("canonical patch\n"),
      }),
    /invalid delivery target evidence/u,
  );
});

test("standalone target normalization rejects an empty artifact scope", () => {
  assert.throws(
    () =>
      normalizeReviewTarget("standalone", {
        locator: "artifact:empty",
        files: [],
        scopeEntries: [],
      }),
    /invalid standalone target evidence/u,
  );
});

test("standalone target normalization requires a scope array", () => {
  assert.throws(
    () =>
      normalizeReviewTarget("standalone", {
        locator: "artifact:string-scope",
        files: [
          { identity: "a", bytes: Buffer.from("alpha") },
          { identity: "b", bytes: Buffer.from("beta") },
        ],
        scopeEntries: "ab",
      }),
    /invalid standalone target evidence/u,
  );
});

test("governing-source normalization rejects an empty source set", () => {
  assert.throws(() => normalizeReviewSources([]), /invalid source evidence/u);
});

test("review timestamps must name a real UTC instant", () => {
  const args = {
    lineageId: "a".repeat(64),
    snapshotHash: "b".repeat(64),
  };
  for (const reviewedAt of ["20260230T120000Z", "20260811T246000Z"]) {
    assert.throws(
      () => reviewReportPath({ ...args, reviewedAt }),
      /real UTC instant/u,
    );
  }
});

test("delivery lineage rejects an empty goal identity", () => {
  assert.throws(() => deliveryLineageId(""), /delivery goal identity/u);

  const fixture = retainedPassFixture();
  assert.match(
    validateRetainedPass(fixture.candidate, {
      ...fixture.expected,
      deliveryGoalIdentity: "",
    }).errors.join(","),
    /invalid:delivery_goal_identity/u,
  );
});

test("canonical identity algorithm matches fixed vectors", () => {
  const targets = reviewTargets();
  const scope = ["apps/wiki/spec.md", "apps/cli/src/a.ts"];
  const boundsHash = acceptedBoundsHash("bounds:v1:HI-104", scope);
  const lineageId = deliveryLineageId("goal:HI-104");
  const snapshotHash = deliverySnapshotHash({
    locator: "repo:wearedevpunks/harness-intelligence",
    actualBaseRef: "origin/main",
    fixedPointSha: "1111111111111111111111111111111111111111",
    headIdentity: "2222222222222222222222222222222222222222",
    scopeEntries: scope,
    canonicalPatchHash: "a".repeat(64),
  });

  assert.equal(
    inclusiveScopeHash(scope),
    "5fb7f4cd0577ad89de00916c8c18b122b264e50fb61df0c79249b88aba23a306",
  );
  assert.equal(
    boundsHash,
    "90dddda98e886e9b2ef511790f32d1d359847af24f5950361d25aedfe729bd8a",
  );
  assert.equal(
    lineageId,
    "291c26957263b22b0cd5ad8a209415ff2992cc9a645f0018ed46ac4ba48de33b",
  );
  assert.equal(
    snapshotHash,
    "f116049b650180523f8dd9ee48b900394f090a425ca8a1d7f369c56ca9d5998b",
  );
  assert.equal(snapshot12(snapshotHash), "f116049b6501");
  assert.equal(reviewScopeSlug(lineageId), "review-291c26957263b22b0cd5");
  assert.equal(
    deliveryRunId(lineageId, 2),
    "9b164c914a883778fd5d4a3e242aaa2d261a44ce7601df10d1530bd9dd777e32",
  );
  assert.equal(
    reviewReportPath({
      lineageId,
      reviewedAt: "20260811T120000Z",
      snapshotHash,
    }),
    "apps/wiki/content/docs/project/reviews/review-291c26957263b22b0cd5-20260811T120000Z-f116049b6501-review-report.md",
  );

  const files = [
    { identity: "docs/b.md", bytes: Buffer.from("beta\n", "utf8") },
    { identity: "docs/a.md", bytes: Buffer.from("alpha\n", "utf8") },
  ];
  const standaloneBounds = acceptedBoundsHash(
    "bounds:v1:artifact",
    files.map(({ identity }) => identity),
  );
  const standaloneLineage = standaloneLineageId(
    "artifact:spec-v1",
    standaloneBounds,
  );
  const standaloneSnapshot = standaloneSnapshotHash({
    locator: "artifact:spec-v1",
    files,
    scopeEntries: files.map(({ identity }) => identity),
  });
  assert.equal(
    orderedBundleContentHash(files),
    "107ee7c127b10e1826bf2d2899a36cc21291392ee6702af8d9e39b3e13553cb7",
  );
  assert.equal(
    standaloneBounds,
    "8dfde7eafe7f68b6ee5f763d23d01310f414fd5b7fca6393d5e92e90d963aa7f",
  );
  assert.equal(
    standaloneLineage,
    "ba4a5082445cac8ab133b533cfb090f936d69915266728bc9c6bd4b5b786f95a",
  );
  assert.equal(
    standaloneSnapshot,
    "d4c43491a0aef9aaeb604dc224792222d0fb6c85caec76d03ff763896563a58a",
  );
  assert.equal(
    standaloneRunId(standaloneLineage, standaloneSnapshot),
    "f165ab99100afe180bea68b41eb730fd2b61b2122347be0e50c91549140629d4",
  );
  assert.equal(reviewScopeSlug(standaloneLineage), "review-ba4a5082445cac8ab133");
  for (const fixedValue of [
    boundsHash,
    lineageId,
    snapshotHash,
    deliveryRunId(lineageId, 2),
    orderedBundleContentHash(files),
    standaloneBounds,
    standaloneLineage,
    standaloneSnapshot,
    standaloneRunId(standaloneLineage, standaloneSnapshot),
  ]) {
    assert.match(targets, new RegExp(fixedValue, "u"));
  }
});

test("retained-pass predicate rejects malformed identity and hash evidence", () => {
  const fixture = retainedPassFixture();
  assert.deepEqual(validateRetainedPass(fixture.candidate, fixture.expected), {
    valid: true,
    errors: [],
  });

  const malformed = cloneCandidate(fixture.candidate);
  rewriteReport(malformed, (report) => delete report.routing);
  assert.equal(validateRetainedPass(malformed, fixture.expected).valid, false);

  const wrongLineage = cloneCandidate(fixture.candidate);
  rewriteReport(wrongLineage, (report) => {
    report.review_lineage_id = "0".repeat(64);
  });
  assert.match(
    validateRetainedPass(wrongLineage, fixture.expected).errors.join(","),
    /mismatch:review_lineage_id/u,
  );

  const wrongHash = cloneCandidate(fixture.candidate);
  wrongHash.reportSha256 = "0".repeat(64);
  assert.match(
    validateRetainedPass(wrongHash, fixture.expected).errors.join(","),
    /mismatch:report_sha256/u,
  );

  const staleTarget = cloneCandidate(fixture.candidate);
  rewriteReport(staleTarget, (report) => {
    report.normalized_target.head_identity = "dirty:changed";
  });
  assert.match(
    validateRetainedPass(staleTarget, fixture.expected).errors.join(","),
    /mismatch:normalized_target/u,
  );

  const staleCurrentEvidence = {
    ...fixture.expected,
    sourceEvidence: [
      { path: "SPEC.md", bytes: Buffer.from("changed spec\n", "utf8") },
    ],
  };
  assert.match(
    validateRetainedPass(fixture.candidate, staleCurrentEvidence).errors.join(","),
    /mismatch:source_set_hash|mismatch:source_paths_and_hashes/u,
  );

  const wrongReviewedAt = cloneCandidate(fixture.candidate);
  rewriteReport(wrongReviewedAt, (report) => {
    report.reviewed_at = "20260811T120001Z";
  });
  assert.match(
    validateRetainedPass(wrongReviewedAt, fixture.expected).errors.join(","),
    /mismatch:report_path/u,
  );

  const arbitraryBytes = cloneCandidate(fixture.candidate);
  arbitraryBytes.reportBytes = Buffer.from("not a review report", "utf8");
  arbitraryBytes.reportSha256 = sha256Hex(arbitraryBytes.reportBytes);
  assert.match(
    validateRetainedPass(arbitraryBytes, fixture.expected).errors.join(","),
    /malformed_report_blob/u,
  );

  const malformedBlock = cloneCandidate(fixture.candidate);
  malformedBlock.reportBytes = Buffer.from(
    "```review-report-json\n{\n```",
    "utf8",
  );
  malformedBlock.reportSha256 = sha256Hex(malformedBlock.reportBytes);
  assert.match(
    validateRetainedPass(malformedBlock, fixture.expected).errors.join(","),
    /malformed_report_blob/u,
  );

  const duplicateBlock = cloneCandidate(fixture.candidate);
  duplicateBlock.reportBytes = Buffer.concat([
    duplicateBlock.reportBytes,
    Buffer.from("\n```review-report-json\n{}\n```", "utf8"),
  ]);
  duplicateBlock.reportSha256 = sha256Hex(duplicateBlock.reportBytes);
  assert.match(
    validateRetainedPass(duplicateBlock, fixture.expected).errors.join(","),
    /malformed_report_blob/u,
  );

  const detachedSidecar = cloneCandidate(fixture.candidate);
  detachedSidecar.report = { review_lineage_id: "0".repeat(64) };
  assert.match(
    validateRetainedPass(detachedSidecar, fixture.expected).errors.join(","),
    /unexpected:detached_report_sidecar/u,
  );

  const outsideEnvelope = cloneCandidate(fixture.candidate);
  outsideEnvelope.commitPaths.push("src/reviewed-target.ts");
  assert.match(
    validateRetainedPass(outsideEnvelope, fixture.expected).errors.join(","),
    /commit_path_outside_envelope/u,
  );
});

test("retained-pass predicate reports a null inclusive scope as malformed", () => {
  const fixture = retainedPassFixture();
  const malformed = cloneCandidate(fixture.candidate);
  rewriteReport(malformed, (report) => {
    report.normalized_target.inclusive_scope = null;
  });

  let result;
  assert.doesNotThrow(() => {
    result = validateRetainedPass(malformed, fixture.expected);
  });
  assert.equal(result.valid, false);
  assert.match(result.errors.join(","), /malformed:normalized_target_common_fields/u);
});

test("retained ref containment accepts only boolean true", () => {
  const fixture = retainedPassFixture();
  const candidate = cloneCandidate(fixture.candidate);
  candidate.refContainsCommit = "false";
  assert.match(
    validateRetainedPass(candidate, fixture.expected).errors.join(","),
    /ref_missing_commit/u,
  );
});

test("retention binds local bytes to the named commit and report path", () => {
  const fixture = retainedPassFixture();
  const candidate = cloneCandidate(fixture.candidate);
  candidate.resolvedReportBytes = Buffer.from("different committed bytes\n");
  assert.match(
    validateRetainedPass(candidate, fixture.expected).errors.join(","),
    /mismatch:resolved_report_bytes/u,
  );
});

test("retained report bytes enforce wiki frontmatter before one authority block", () => {
  const fixture = retainedPassFixture();
  const parsed = parseReviewReport(fixture.candidate.reportBytes);
  assert.equal(new TextDecoder().decode(fixture.candidate.reportBytes).startsWith("---\n"), true);
  assert.equal(parsed.frontmatter.type, "review-report");
  assert.deepEqual(parsed.frontmatter.links, []);
  assert.equal(parsed.frontmatter.review_mode, parsed.report.mode);

  const expectBlobFailure = (mutate) => {
    const candidate = cloneCandidate(fixture.candidate);
    rewriteBytes(candidate, mutate);
    assert.match(
      validateRetainedPass(candidate, fixture.expected).errors.join(","),
      /malformed_report_blob/u,
    );
  };
  expectBlobFailure((text) => text.slice(text.indexOf("```review-report-json")));
  expectBlobFailure((text) => text.replace('links: []', 'links: not-yaml'));
  expectBlobFailure((text) => text.slice(0, text.indexOf("\n\n```review-report-json")));
  expectBlobFailure((text) => `${text}\n---\ntype: "review-report"\n---`);
  expectBlobFailure((text) =>
    text.replace(/```review-report-json\n[^\n]+/u, "```review-report-json\n{"),
  );

  const missingField = cloneCandidate(fixture.candidate);
  rewriteBytes(missingField, (text) =>
    text.replace(/^snapshot_hash:.*\n/mu, ""),
  );
  assert.match(
    validateRetainedPass(missingField, fixture.expected).errors.join(","),
    /malformed:frontmatter_schema/u,
  );

  for (const [line, replacement, field] of [
    ['review_mode: "delivery"', 'review_mode: "standalone"', "review_mode"],
    ['domain: "cli"', 'domain: 42', "domain"],
    [
      `title: "${reviewScopeSlug(fixture.lineageId)} review report"`,
      'title: "wrong review report"',
      "title",
    ],
    [
      /^snapshot_hash:.*$/mu,
      `snapshot_hash: "${"0".repeat(64)}"`,
      "snapshot_hash",
    ],
    [
      /^review_lineage_id:.*$/mu,
      `review_lineage_id: "${"0".repeat(64)}"`,
      "review_lineage_id",
    ],
    [
      /^review_run_id:.*$/mu,
      `review_run_id: "${"0".repeat(64)}"`,
      "review_run_id",
    ],
    [
      'reviewed_at: "20260811T120000Z"',
      'reviewed_at: "20260811T120001Z"',
      "reviewed_at",
    ],
    [
      /^accepted_bounds_hash:.*$/mu,
      `accepted_bounds_hash: "${"0".repeat(64)}"`,
      "accepted_bounds_hash",
    ],
    ['created: "2026-08-11"', 'created: "2026-08-10"', "created"],
  ]) {
    const candidate = cloneCandidate(fixture.candidate);
    rewriteBytes(candidate, (text) => text.replace(line, replacement));
    assert.match(
      validateRetainedPass(candidate, fixture.expected).errors.join(","),
      new RegExp(`mismatch:frontmatter:${field}`, "u"),
    );
  }
});

test("frontmatter parsing rejects prototype-sensitive keys without mutation", () => {
  const fixture = retainedPassFixture();
  const poisoned = Buffer.from(
    new TextDecoder()
      .decode(fixture.candidate.reportBytes)
      .replace('title: "review-', '__proto__: {"polluted":true}\ntitle: "review-'),
    "utf8",
  );

  assert.throws(
    () => parseReviewReport(poisoned),
    /prototype-sensitive frontmatter key/u,
  );
  assert.equal({}.polluted, undefined);
});

test("retained-pass relationships derive from primitive evidence in both modes", () => {
  const delivery = retainedPassFixture();
  const standalone = standaloneRetainedPassFixture();
  assert.equal(validateRetainedPass(delivery.candidate, delivery.expected).valid, true);
  assert.equal(
    validateRetainedPass(standalone.candidate, standalone.expected).valid,
    true,
  );

  const deliveryBounds = cloneCandidate(delivery.candidate);
  rewriteReport(deliveryBounds, (report) => {
    report.accepted_bounds_hash = "0".repeat(64);
  });
  assert.match(
    validateRetainedPass(deliveryBounds, delivery.expected).errors.join(","),
    /mismatch:accepted_bounds_hash/u,
  );

  const deliveryTargetSchema = cloneCandidate(delivery.candidate);
  rewriteReport(deliveryTargetSchema, (report) => {
    delete report.normalized_target.actual_base_ref;
  });
  assert.match(
    validateRetainedPass(deliveryTargetSchema, delivery.expected).errors.join(","),
    /malformed:normalized_target_schema/u,
  );

  const standaloneBundle = cloneCandidate(standalone.candidate);
  rewriteReport(standaloneBundle, (report) => {
    report.normalized_target.ordered_bundle_content_hash = "0".repeat(64);
  });
  assert.match(
    validateRetainedPass(standaloneBundle, standalone.expected).errors.join(","),
    /mismatch:normalized_target/u,
  );

  const standaloneRun = cloneCandidate(standalone.candidate);
  rewriteReport(standaloneRun, (report) => {
    report.review_run_id = "0".repeat(64);
  });
  assert.match(
    validateRetainedPass(standaloneRun, standalone.expected).errors.join(","),
    /mismatch:review_run_id/u,
  );

  const standaloneTargetSchema = cloneCandidate(standalone.candidate);
  rewriteReport(standaloneTargetSchema, (report) => {
    report.normalized_target.git_fixed_point = "1".repeat(40);
  });
  assert.match(
    validateRetainedPass(
      standaloneTargetSchema,
      standalone.expected,
    ).errors.join(","),
    /malformed:standalone_target_fields/u,
  );
});

test("retained report enforces exact lens and structured evidence semantics", () => {
  const fixture = retainedPassFixture();
  const expectInvalid = (mutate, pattern) => {
    const candidate = cloneCandidate(fixture.candidate);
    rewriteReport(candidate, mutate);
    assert.match(
      validateRetainedPass(candidate, fixture.expected).errors.join(","),
      pattern,
    );
  };

  const structured = cloneCandidate(fixture.candidate);
  rewriteReport(structured, (report) => {
    report.lens_outcomes.spec = "findings";
    report.findings = [
      {
        id: "spec.missing-proof",
        lens: "spec",
        severity: "high",
        location: "SPEC.md#AC-1",
        impact: "Acceptance evidence is absent.",
        evidence: "The frozen implementation notes omit the required check.",
        action: "Route the missing proof to implementation.",
        return_route: "implementation",
      },
    ];
    report.routing.primary = "implementation";
    report.validation = [
      {
        command: "bun test focused",
        isolation: "proven-no-write",
        before_hash: "a".repeat(64),
        after_hash: "a".repeat(64),
        outcome: "failed",
        evidence: "Required acceptance assertion failed.",
      },
    ];
  });
  assert.equal(validateRetainedPass(structured, fixture.expected).valid, true);

  expectInvalid(
    (report) => delete report.lens_outcomes.spec,
    /malformed:lens_keys/u,
  );
  expectInvalid(
    (report) => {
      report.lens_outcomes.security = "clean";
    },
    /malformed:lens_keys/u,
  );
  expectInvalid(
    (report) => {
      report.lens_outcomes.spec = "unknown";
    },
    /malformed:lens_outcome:spec/u,
  );
  expectInvalid(
    (report) => {
      report.findings = [{ id: "bad", lens: "spec" }];
    },
    /malformed:finding/u,
  );
  expectInvalid(
    (report) => {
      report.routing = "closeout";
    },
    /malformed:routing/u,
  );
  expectInvalid(
    (report) => {
      report.validation = [{ command: "bun test" }];
    },
    /malformed:validation_record/u,
  );
  expectInvalid(
    (report) => {
      report.preceding_repair_ordinal = null;
    },
    /invalid:delivery_identity_or_ordinal/u,
  );
});

test("finding routes centrally derive aggregate routing", () => {
  const finding = (return_route) => ({ return_route });
  assert.deepEqual(deriveReviewRouting([]), {
    primary: "closeout",
    secondary_architecture_follow_up: false,
  });
  assert.deepEqual(deriveReviewRouting([finding("docs_ingest")]), {
    primary: "docs_ingest",
    secondary_architecture_follow_up: false,
  });
  assert.deepEqual(deriveReviewRouting([finding("debt_follow_up")]), {
    primary: "debt_follow_up",
    secondary_architecture_follow_up: false,
  });
  assert.deepEqual(
    deriveReviewRouting([
      finding("debt_follow_up"),
      finding("implementation"),
      finding("debugging"),
    ]),
    {
      primary: "debugging",
      secondary_architecture_follow_up: true,
    },
  );
  assert.throws(
    () => deriveReviewRouting([finding("closeout")]),
    /invalid finding return route/u,
  );

  const fixture = retainedPassFixture();
  const contradictory = cloneCandidate(fixture.candidate);
  rewriteReport(contradictory, (report) => {
    report.lens_outcomes.spec = "findings";
    report.findings = [
      {
        id: "spec.docs-gap",
        lens: "spec",
        severity: "medium",
        location: "SPEC.md#Docs",
        impact: "Required documentation is incomplete.",
        evidence: "The retained docs checklist is open.",
        action: "Complete the required documentation.",
        return_route: "docs_ingest",
      },
    ];
  });
  assert.match(
    validateRetainedPass(contradictory, fixture.expected).errors.join(","),
    /mismatch:routing/u,
  );
});

test("mixed debt routes capture once before resuming their repair", () => {
  const graph = reviewGraph();
  const finding = (return_route) => ({ return_route });

  for (const [repairRoute, repairState] of [
    ["debugging", "debug_active"],
    ["implementation", "repair_active"],
  ]) {
    assert.deepEqual(
      deriveReviewRouting([
        finding(repairRoute),
        finding("debt_follow_up"),
      ]),
      {
        primary: repairRoute,
        secondary_architecture_follow_up: true,
      },
    );
    assert.match(
      graph,
      new RegExp(
        "derived primary route is `" +
          repairRoute +
          "`[^|]*secondary architecture follow-up[^|]*\\|[^|]*\\| `debt_follow_up`[^|]*\\|[^|]*\\|[^|]*post-debt route `" +
          repairRoute +
          "`",
        "iu",
      ),
    );
    assert.match(
      graph,
      new RegExp(
        "\\| `debt_follow_up` \\| Debt captured[^\\n]*\\| `" +
          repairState +
          "`[^\\n]*capture exactly once",
        "iu",
      ),
    );
  }
});

test("same-run retention reuses identical authority and rejects conflicts", () => {
  const fixture = retainedPassFixture();
  const entry = { candidate: fixture.candidate, expected: fixture.expected };
  assert.equal(resolveRetainedRun([entry]).status, "unique");
  assert.equal(
    resolveRetainedRun([
      entry,
      {
        candidate: cloneCandidate(fixture.candidate),
        expected: fixture.expected,
      },
    ]).status,
    "reuse",
  );
  assert.deepEqual(recoverDeliveryCount([entry], fixture.lineageId), {
    status: "ok",
    reviewCount: 2,
  });

  const conflictingCandidate = cloneCandidate(fixture.candidate);
  conflictingCandidate.reportBytes = Buffer.concat([
    conflictingCandidate.reportBytes,
    Buffer.from("\n", "utf8"),
  ]);
  conflictingCandidate.resolvedReportBytes = Buffer.from(
    conflictingCandidate.reportBytes,
  );
  conflictingCandidate.reportSha256 = sha256Hex(
    conflictingCandidate.reportBytes,
  );
  conflictingCandidate.reportCommitSha = "c".repeat(40);
  const conflict = {
    candidate: conflictingCandidate,
    expected: fixture.expected,
  };
  assert.equal(resolveRetainedRun([entry, conflict]).status, "conflict");
  assert.deepEqual(
    recoverDeliveryCount([entry, conflict], fixture.lineageId),
    { status: "conflict", reviewCount: null },
  );
});

test("review identity separates delivery lineage, bounds, and standalone identity", () => {
  const targets = reviewTargets();
  assert.match(targets, /delivery lineage.{0,100}only from stable delivery-goal identity/isu);
  assert.match(targets, /accepted-\s*bounds identity and hash.{0,100}not.{0,50}lineage/isu);
  assert.match(targets, /standalone lineage.{0,100}target locator.{0,100}accepted-bounds hash/isu);
  assert.match(targets, /delivery run identity.{0,100}lineage.{0,100}ordinal/isu);
  assert.match(targets, /standalone run identity.{0,100}lineage.{0,100}`snapshot12`/isu);
  assert.match(targets, /filename slug.{0,80}lineage/isu);
});

test("durable report schema and retention output are complete", () => {
  const report = reviewReport();
  assert.match(report, /apps\/wiki\/content\/docs\/project\/reviews\/<review-scope-slug>-<YYYYMMDDTHHMMSSZ>-<snapshot12>-review-report\.md/u);
  for (const field of [
    "review_lineage_id",
    "review_run_id",
    "accepted-bounds identity and hash",
    "reviewed_at",
    "normalized target",
    "snapshot hash",
    "source paths and hashes",
    "stable finding identifiers",
    "routing and validation",
  ]) {
    assert.match(report, new RegExp(field, "iu"));
  }
  assert.match(report, /content\s+never\s+changes after creation/iu);
  assert.match(report, /start with the wiki-required YAML frontmatter.{0,100}exactly one fenced authority block/isu);
  assert.match(report, /parser reads both structures from retained bytes/iu);
  assert.match(report, /parsed JSON object is report authority/iu);
  assert.match(report, /`lens_outcomes` has exactly `standards`.{0,180}`spec`/isu);
  assert.match(report, /Detached objects, sidecars.{0,100}never trusted/isu);
  assert.match(report, /report SHA-256.{0,100}report commit SHA.{0,100}verified retained ref/isu);
  assert.match(report, /outside-report retention envelope/iu);
  assert.match(report, /not additions to the\s+immutable report/iu);
});

test("retention is envelope-only, freshness-aware, and authoritative", () => {
  const report = reviewReport();
  const retain = reviewRetain();
  const graph = reviewGraph();
  assert.match(retain, /commit only\s+the report and allowed envelope/iu);
  assert.match(retain, /retained ref contains the exact report commit/iu);
  assert.match(retain, /`report_retention_pending`.{0,100}retention failed retryably/isu);
  assert.match(retain, /reuses the same fresh local report.{0,100}never reruns\s+review lenses/isu);
  assert.match(retain, /`review_due`.{0,100}target, bounds, or source freshness changed/isu);
  assert.match(retain, /unique valid retained delivery report establishes its ordinal/iu);
  assert.match(retain, /Standalone retention changes no delivery counter/iu);
  assert.match(report, /valid retained pass only when every\s+predicate holds/iu);
  assert.match(report, /malformed report, wrong lineage or run id, wrong blob or freshness hash/iu);
  assert.match(report, /Repeated discovery.{0,160}reuse that already-retained pass/isu);
  assert.match(report, /same_run_conflict/iu);
  assert.match(report, /Recovery uses only unique or identical-reuse valid passes/iu);
  assert.match(graph, /Idempotent retention recovery/iu);
  assert.match(graph, /Same-run conflict.{0,160}`review_failed`/isu);
  assert.match(graph, /Retained-pass validation rejected.{0,160}`review_failed`/isu);
});

test("review graph preserves failures, budget, routing, and the no-review-4 boundary", () => {
  const graph = reviewGraph();
  const expectedRows = [
    /`review_due`.*recovered `review_count < 3`.*`review_running`.*Preallocate ordinal/isu,
    /Current delivery state.*recovered `review_count >= 3`.*Return `review_budget_exhausted`.*no report or status mutation/isu,
    /`review_running`.*complete local report exists.*`report_retention_pending`.*no completed-pass change/isu,
    /`report_retention_pending`.*ordinal is greater than 3.*`review_budget_exhausted`.*no authoritative pass/isu,
    /`review_routed`.*runtime evidence exists.*`debug_active`.*atomic handoff/isu,
    /`review_routed`.*in-scope non-runtime blocker exists.*`repair_active`.*atomic handoff/isu,
    /`repair_active` or `debug_active`.*`review_count < 3`.*`review_due`/isu,
    /Fix 3 completes.*`review_count = 3` and `repair_count = 3`.*`focused_validation`/isu,
    /focused validation fails.*`repair_active` or `debug_active`.*unchanged counters/isu,
    /focused validation passes.*`clean_handoff`.*report-3 link/isu,
  ];
  for (const row of expectedRows) assert.match(graph, row);
  assert.match(graph, /fix 3 never opens\s+review 4/iu);
});

test("repair opening and resume are atomic and idempotent", () => {
  const graph = reviewGraph();
  assert.match(graph, /one atomic durable handoff write/iu);
  assert.match(graph, /active state.{0,100}primary route.{0,100}`repair_count = review_count`.{0,100}`review_run_id`/isu);
  assert.match(graph, /already recorded run ID.{0,100}without another increment/isu);
  assert.match(graph, /cannot\s+fall through to an unrecorded\s+guard/iu);
});

test("delivery recovery and reset rules use retained report authority", () => {
  const graph = reviewGraph();
  assert.match(graph, /highest valid retained ordinal/iu);
  assert.match(graph, /handoff counter is a projection/iu);
  assert.match(graph, /same-goal bounds revisions preserve delivery lineage and counters/iu);
  assert.match(graph, /only an explicitly\s+new delivery goal with materially changed accepted bounds/iu);
  assert.match(graph, /resume,\s+rebase, new commit, process retry, and handoff preserve/iu);
});

test("planning guidance reaches one-to-one implementation evidence unchanged", () => {
  const createPlan = read("skills/agnostic/planning/create-plan/SKILL.md");
  const planSchema = read("skills/agnostic/planning/create-plan/references/plan-schema.md");
  const plannerGraph = read("skills/agnostic/planning/create-plan/references/planner-task-graph.md");
  const implementSpec = read("skills/agnostic/planning/implement-spec/SKILL.md");
  const workerBrief = read("skills/agnostic/planning/implement-spec/references/parallel-worker-brief.md");
  const notes = read("skills/agnostic/planning/implement-spec/assets/IMPLEMENTATION-NOTES-TEMPLATE.md");
  const planned = `${createPlan}\n${planSchema}\n${plannerGraph}`;
  const executed = `${implementSpec}\n${workerBrief}\n${notes}`;
  assert.match(planned, /implementation_skill_guidance/u);
  assert.match(planned, /every\s+implementation-applicable `assigned_skills` item.{0,120}exactly one guidance\s+entry/isu);
  assert.match(planSchema, /skill identity.{0,100}applicable\s+behavior/isu);
  assert.match(executed, /forward.{0,80}guidance item unchanged/isu);
  assert.match(notes, /## Skill Application Evidence/u);
  assert.match(notes, /loaded \| applied \| not_applicable/u);
  assert.match(executed, /exactly one evidence record per guidance entry/iu);
  assert.match(executed, /`not_applicable`.{0,100}why.{0,100}where/isu);
});

test("skill-adherence lens checks claims and omissions against frozen artifacts", () => {
  const run = reviewRun();
  assert.match(run, /evidence-cardinality results/iu);
  assert.match(run, /Verify every.{0,160}claim.{0,160}against frozen changed artifacts/isu);
  assert.match(run, /Missing, extra, or\s+contradicted evidence becomes a finding/iu);
});

test("delivery owns review routes and bounded repairs", () => {
  const router = read("skills/phases/delivery-phase/phases/router.md");
  const phase = read("skills/phases/delivery-phase/phases/review.md");
  const implement = read("skills/phases/delivery-phase/phases/implement.md");
  const debug = read("skills/phases/delivery-phase/phases/debug.md");
  const closeout = read("skills/phases/delivery-phase/phases/closeout.md");
  const handoff = read("skills/phases/delivery-phase/references/phase-handoff.md");
  const all = `${router}\n${phase}\n${implement}\n${debug}\n${closeout}\n${handoff}`;
  assert.match(all, /review_budget_exhausted/iu);
  assert.match(all, /runtime.{0,100}debug/isu);
  assert.match(all, /non-runtime.{0,100}implement/isu);
  assert.match(all, /architecture.{0,100}debt/isu);
  assert.match(all, /focused_validation/iu);
  assert.match(all, /clean_handoff/iu);
  assert.match(router, /`report_retention_pending`.{0,200}without\s+rerunning lenses/isu);
  assert.match(router, /`review_routed` report.{0,120}no durable route handoff/isu);
  assert.match(handoff, /review_lineage_id/iu);
  assert.match(handoff, /review_count/iu);
  assert.match(handoff, /repair_count/iu);
});

test("review retention and delivery debt handoff are explicit and resumable", () => {
  const run = reviewRun();
  const retain = reviewRetain();
  const returnRoute = reviewReturn();
  const report = reviewReport();
  const graph = reviewGraph();
  const deliveryReview = read("skills/phases/delivery-phase/phases/review.md");
  const deliveryRouter = read("skills/phases/delivery-phase/phases/router.md");
  const handoff = read("skills/phases/delivery-phase/references/phase-handoff.md");
  const authoring = read("skills/phases/review-phase/AUTHORING-HANDOFF.md");

  assert.match(run, /accepted finding.{0,200}`return_route`/isu);
  assert.match(returnRoute, /`deriveReviewRouting`/u);
  assert.match(report, /each finding.{0,160}`return_route`/isu);
  assert.match(report, /aggregate routing.{0,120}derived/isu);
  assert.match(
    retain,
    /`reportCommitSha:reportPath`.{0,300}exact committed.{0,160}local report bytes/isu,
  );
  assert.match(
    report,
    /bytes resolved from `reportCommitSha:reportPath`.{0,160}exactly equal.{0,100}local report bytes/isu,
  );

  assert.match(handoff, /state:.*debt_follow_up/isu);
  assert.match(handoff, /post_debt_route:/u);
  assert.match(
    handoff,
    /`post_debt_route` is durable.{0,160}`debugging` or\s+`implementation` for secondary debt.{0,160}`docs_ingest` or `closeout` for\s+primary debt/isu,
  );
  assert.match(
    handoff,
    /debt follow-up key.{0,160}authoritative report commit.{0,160}report path.{0,160}stable finding id/isu,
  );
  assert.match(deliveryRouter, /`debt_follow_up`.{0,160}\[review\.md\]/isu);
  assert.match(
    deliveryRouter,
    /`debt_follow_up`.{0,240}`post_debt_route`.{0,200}`debugging`.{0,80}`implementation`.{0,200}`docs_ingest`.{0,80}`closeout`/isu,
  );
  assert.match(
    deliveryReview,
    /goal\/spec-linked debt artifact.{0,200}exactly once.{0,200}retained report.{0,160}stable finding ID/isu,
  );
  assert.match(
    deliveryReview,
    /does not implement.{0,100}debt.{0,180}`docs_ingest`.{0,100}`closeout`/isu,
  );
  assert.match(graph, /Resume debt follow-up.{0,160}`debt_follow_up`/isu);
  assert.match(
    graph,
    /Debt captured.{0,160}`post_debt_route`.{0,160}(?:`debug_active`|`repair_active`|`docs_ingest` or `closeout`)/isu,
  );

  assert.match(
    authoring,
    /installed package\s+omits the source repository test files/iu,
  );
  assert.doesNotMatch(authoring, /\b\d+\/\d+\b/u);
  assert.doesNotMatch(authoring, /all eight shared test files/iu);
});

test("primary debt successors are durable cold-resume states", () => {
  const handoff = read("skills/phases/delivery-phase/references/phase-handoff.md");
  const stateProjection = /^state:\s*(?<states>.+)$/mu.exec(handoff);
  assert.ok(stateProjection?.groups?.states, "durable state projection is required");
  const states = stateProjection.groups.states.split("|").map((state) => state.trim());
  for (const successor of ["docs_ingest", "closeout"]) {
    assert.ok(states.includes(successor), `${successor} must be a durable state`);
  }
  assert.match(
    handoff,
    /primary debt.{0,200}capture.{0,200}state = `post_debt_route`.{0,200}resume.{0,200}(?:does not|without).{0,80}repeat.{0,80}capture/isu,
  );
});

test("delivery router resumes durable terminal routes before artifact inference", () => {
  const router = read("skills/phases/delivery-phase/phases/router.md");
  const artifactInference = router.indexOf("If no matching agent-ready `SPEC.md`");
  assert.notEqual(artifactInference, -1, "artifact inference boundary is required");
  for (const [state, phase] of [
    ["docs_ingest", "docs-ingest.md"],
    ["closeout", "closeout.md"],
  ]) {
    const route = new RegExp(
      "durable `" + state + "`[^\\n]*\\[" + phase.replace(".", "\\.") + "\\]",
      "u",
    ).exec(router);
    assert.ok(route, `${state} must load ${phase}`);
    assert.ok(route.index < artifactInference, `${state} must precede artifact inference`);
  }
});

test("external GitHub and Codex PR reviewer integration stays excluded", () => {
  const all = `${reviewSkill()}\n${reviewGraph()}`;
  assert.match(all, /external GitHub and Codex PR reviewer integration.{0,80}(excluded|outside)/isu);
});
