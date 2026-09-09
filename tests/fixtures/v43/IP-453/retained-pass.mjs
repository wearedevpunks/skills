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
} from "../../../../skills/phases/review-phase/scripts/review-contract.mjs";

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


export { retainedPassFixture, cloneCandidate, rewriteReport };
