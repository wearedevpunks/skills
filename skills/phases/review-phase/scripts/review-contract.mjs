import { createHash } from "node:crypto";
import { isDeepStrictEqual } from "node:util";

const RECORD_HEADER = Buffer.from("review-identity-v1\n", "utf8");

const asText = (value, field) => {
  if (typeof value !== "string") {
    throw new TypeError(`${field} must be a string`);
  }
  return value;
};

const frame = (value) => {
  const bytes = Buffer.from(value, "utf8");
  return Buffer.concat([Buffer.from(`${bytes.length}:`, "ascii"), bytes]);
};

export const canonicalRecord = (label, fields) =>
  Buffer.concat([
    RECORD_HEADER,
    frame(asText(label, "label")),
    ...fields.map((value, index) => frame(asText(value, `field ${index}`))),
  ]);

export const sha256Hex = (bytes) =>
  createHash("sha256").update(bytes).digest("hex");

export const hashRecord = (label, fields) =>
  sha256Hex(canonicalRecord(label, fields));

export const sortUtf8 = (values) =>
  [...values].sort((left, right) =>
    Buffer.compare(Buffer.from(left, "utf8"), Buffer.from(right, "utf8")),
  );

export const inclusiveScopeHash = (entries) =>
  hashRecord("inclusive-scope", sortUtf8(entries));

export const acceptedBoundsHash = (identity, scopeEntries) =>
  hashRecord("accepted-bounds", [identity, inclusiveScopeHash(scopeEntries)]);

export const deliveryLineageId = (deliveryGoalIdentity) =>
  hashRecord("delivery-lineage", [deliveryGoalIdentity]);

export const standaloneLineageId = (locator, boundsHash) =>
  hashRecord("standalone-lineage", [locator, boundsHash]);

export const deliveryRunId = (lineageId, ordinal) => {
  if (!Number.isSafeInteger(ordinal) || ordinal < 1) {
    throw new TypeError("ordinal must be a positive safe integer");
  }
  return hashRecord("delivery-run", [lineageId, String(ordinal)]);
};

export const snapshot12 = (snapshotHash) => {
  if (!/^[0-9a-f]{64}$/u.test(snapshotHash)) {
    throw new TypeError("snapshot hash must be 64 lowercase hexadecimal digits");
  }
  return snapshotHash.slice(0, 12);
};

export const standaloneRunId = (lineageId, snapshotHash) =>
  hashRecord("standalone-run", [lineageId, snapshot12(snapshotHash)]);

export const reviewScopeSlug = (lineageId) => {
  if (!/^[0-9a-f]{64}$/u.test(lineageId)) {
    throw new TypeError("lineage id must be 64 lowercase hexadecimal digits");
  }
  return `review-${lineageId.slice(0, 20)}`;
};

export const deliverySnapshotHash = ({
  locator,
  actualBaseRef,
  fixedPointSha,
  headIdentity,
  scopeEntries,
  canonicalPatchHash,
}) =>
  hashRecord("delivery-snapshot", [
    locator,
    actualBaseRef,
    fixedPointSha,
    headIdentity,
    inclusiveScopeHash(scopeEntries),
    canonicalPatchHash,
  ]);

const orderedFiles = (files) =>
  [...files].sort((left, right) =>
    Buffer.compare(
      Buffer.from(left.identity, "utf8"),
      Buffer.from(right.identity, "utf8"),
    ),
  );

export const orderedBundleContentHash = (files) =>
  hashRecord(
    "artifact-bundle",
    orderedFiles(files).flatMap(({ identity, bytes }) => [
      identity,
      sha256Hex(bytes),
    ]),
  );

export const standaloneSnapshotHash = ({ locator, files, scopeEntries }) => {
  const ordered = orderedFiles(files);
  return hashRecord("standalone-snapshot", [
    locator,
    hashRecord(
      "ordered-files",
      ordered.map(({ identity }) => identity),
    ),
    inclusiveScopeHash(scopeEntries),
    orderedBundleContentHash(ordered),
    "no-git-fixed-point",
  ]);
};

export const sourceSetHash = (sources) =>
  hashRecord(
    "source-set",
    [...sources]
      .sort((left, right) =>
        Buffer.compare(
          Buffer.from(left.path, "utf8"),
          Buffer.from(right.path, "utf8"),
        ),
      )
      .flatMap(({ path, hash }) => [path, hash]),
  );

export const reviewReportPath = ({ lineageId, reviewedAt, snapshotHash }) => {
  if (!/^\d{8}T\d{6}Z$/u.test(reviewedAt)) {
    throw new TypeError("reviewedAt must use YYYYMMDDTHHMMSSZ UTC format");
  }
  return `apps/wiki/content/docs/project/reviews/${reviewScopeSlug(lineageId)}-${reviewedAt}-${snapshot12(snapshotHash)}-review-report.md`;
};

const REPORT_BLOCK_OPEN = "```review-report-json\n";
const REPORT_BLOCK_CLOSE = "\n```";
const FRONTMATTER_KEYS = [
  "title",
  "domain",
  "type",
  "surface",
  "permission",
  "links",
  "review_lineage_id",
  "review_run_id",
  "review_mode",
  "reviewed_at",
  "accepted_bounds_identity",
  "accepted_bounds_hash",
  "snapshot_hash",
  "created",
  "updated",
];
const HEX_64 = /^[0-9a-f]{64}$/u;
const COMMIT_SHA = /^[0-9a-f]{40}(?:[0-9a-f]{24})?$/u;
const LENS_KEYS = [
  "standards",
  "skill_adherence",
  "architecture",
  "simplify",
  "spec",
];

const exactKeys = (value, keys) =>
  value !== null &&
  typeof value === "object" &&
  !Array.isArray(value) &&
  isDeepStrictEqual(Object.keys(value).sort(), [...keys].sort());

const nonemptyString = (value) =>
  typeof value === "string" && value.length > 0;

const sortedUniqueStrings = (values) =>
  Array.isArray(values) &&
  values.every(nonemptyString) &&
  new Set(values).size === values.length &&
  isDeepStrictEqual(values, sortUtf8(values));

const reportDate = (reviewedAt) => {
  if (!/^\d{8}T\d{6}Z$/u.test(reviewedAt)) {
    throw new TypeError("reviewed_at must use YYYYMMDDTHHMMSSZ");
  }
  return `${reviewedAt.slice(0, 4)}-${reviewedAt.slice(4, 6)}-${reviewedAt.slice(6, 8)}`;
};

const frontmatterFor = (report, domain) => {
  const date = reportDate(report.reviewed_at);
  return {
    title: `${reviewScopeSlug(report.review_lineage_id)} review report`,
    domain,
    type: "review-report",
    surface: "project",
    permission: "internal",
    links: [],
    review_lineage_id: report.review_lineage_id,
    review_run_id: report.review_run_id,
    review_mode: report.mode,
    reviewed_at: report.reviewed_at,
    accepted_bounds_identity: report.accepted_bounds_identity,
    accepted_bounds_hash: report.accepted_bounds_hash,
    snapshot_hash: report.snapshot_hash,
    created: date,
    updated: date,
  };
};

const encodeFrontmatter = (frontmatter) =>
  [
    "---",
    ...FRONTMATTER_KEYS.map((key) =>
      `${key}: ${key === "links" ? "[]" : JSON.stringify(frontmatter[key])}`,
    ),
    "---",
  ].join("\n");

export const encodeReviewReport = (
  report,
  { domain, trailingProse = "" },
) => {
  if (!report || typeof report !== "object" || Array.isArray(report)) {
    throw new TypeError("report must be an object");
  }
  if (!nonemptyString(domain)) throw new TypeError("domain must be a string");
  if (typeof trailingProse !== "string") {
    throw new TypeError("trailing prose must be a string");
  }
  const suffix = trailingProse.length === 0 ? "" : `\n${trailingProse}`;
  return Buffer.from(
    `${encodeFrontmatter(frontmatterFor(report, domain))}\n\n${REPORT_BLOCK_OPEN}${JSON.stringify(report)}${REPORT_BLOCK_CLOSE}${suffix}`,
    "utf8",
  );
};

const parseFrontmatter = (text) => {
  if (!text.startsWith("---\n")) throw new TypeError("missing frontmatter");
  const close = text.indexOf("\n---\n", 4);
  if (close < 0) throw new TypeError("unclosed frontmatter");
  const frontmatter = {};
  for (const line of text.slice(4, close).split("\n")) {
    const separator = line.indexOf(": ");
    if (separator < 1) throw new TypeError("malformed frontmatter line");
    const key = line.slice(0, separator);
    if (Object.hasOwn(frontmatter, key)) throw new TypeError("duplicate frontmatter key");
    const raw = line.slice(separator + 2);
    frontmatter[key] = raw === "[]" ? [] : JSON.parse(raw);
  }
  const remainder = text.slice(close + 5);
  if (!remainder.startsWith(`\n${REPORT_BLOCK_OPEN}`)) {
    throw new TypeError("authority block must immediately follow frontmatter");
  }
  return { frontmatter, authority: remainder.slice(1) };
};

export const parseReviewReport = (bytes) => {
  if (!Buffer.isBuffer(bytes)) throw new TypeError("report bytes must be a Buffer");
  const text = new TextDecoder("utf-8", { fatal: true }).decode(bytes);
  const { frontmatter, authority } = parseFrontmatter(text);
  const close = authority.indexOf(REPORT_BLOCK_CLOSE, REPORT_BLOCK_OPEN.length);
  if (close < 0) throw new TypeError("review-report-json block is unclosed");
  const trailing = authority.slice(close + REPORT_BLOCK_CLOSE.length);
  if (trailing !== "" && !trailing.startsWith("\n")) {
    throw new TypeError("report prose must follow the closed authority block");
  }
  if (trailing.includes("```review-report-json")) {
    throw new TypeError("report contains duplicate review-report-json blocks");
  }
  if (trailing.includes("\n---\n") || trailing.startsWith("\n---\n")) {
    throw new TypeError("report contains duplicate frontmatter");
  }
  const report = JSON.parse(
    authority.slice(REPORT_BLOCK_OPEN.length, close),
  );
  if (!report || typeof report !== "object" || Array.isArray(report)) {
    throw new TypeError("review-report-json must decode to one object");
  }
  return { frontmatter, report };
};

export const normalizeReviewTarget = (mode, evidence) => {
  if (mode === "delivery") {
    if (
      !nonemptyString(evidence.locator) ||
      !nonemptyString(evidence.actualBaseRef) ||
      !COMMIT_SHA.test(evidence.fixedPointSha) ||
      !nonemptyString(evidence.headIdentity) ||
      !sortedUniqueStrings(sortUtf8(evidence.scopeEntries)) ||
      !Buffer.isBuffer(evidence.canonicalPatchBytes)
    ) {
      throw new TypeError("invalid delivery target evidence");
    }
    return {
      kind: "delivery-git-diff",
      locator: evidence.locator,
      actual_base_ref: evidence.actualBaseRef,
      fixed_point_sha: evidence.fixedPointSha,
      head_identity: evidence.headIdentity,
      inclusive_scope: sortUtf8(evidence.scopeEntries),
      canonical_patch_hash: sha256Hex(evidence.canonicalPatchBytes),
    };
  }
  if (mode === "standalone") {
    const files = orderedFiles(evidence.files);
    const identities = files.map(({ identity }) => identity);
    const scope = sortUtf8(evidence.scopeEntries);
    if (
      !nonemptyString(evidence.locator) ||
      !sortedUniqueStrings(identities) ||
      !files.every(({ bytes }) => Buffer.isBuffer(bytes)) ||
      !isDeepStrictEqual(scope, identities)
    ) {
      throw new TypeError("invalid standalone target evidence");
    }
    return {
      kind: "standalone-artifact",
      locator: evidence.locator,
      ordered_file_identities: identities,
      inclusive_scope: scope,
      ordered_bundle_content_hash: orderedBundleContentHash(files),
      git_fixed_point: null,
    };
  }
  throw new TypeError("unsupported review mode");
};

export const normalizeReviewSources = (sources) => {
  if (
    !Array.isArray(sources) ||
    sources.some(
      ({ path, bytes }) => !nonemptyString(path) || !Buffer.isBuffer(bytes),
    ) ||
    new Set(sources.map(({ path }) => path)).size !== sources.length
  ) {
    throw new TypeError("invalid source evidence");
  }
  return [...sources]
    .sort((left, right) =>
      Buffer.compare(
        Buffer.from(left.path, "utf8"),
        Buffer.from(right.path, "utf8"),
      ),
    )
    .map(({ path, bytes }) => ({ path, hash: sha256Hex(bytes) }));
};

export const planDeliveryReviewGate = ({
  currentState,
  acceptedBoundsValid,
  targetSupported,
  recoveredReviewCount,
}) => {
  if (!acceptedBoundsValid || !targetSupported) {
    return { state: "review_failed", handoffWrites: [] };
  }
  if (!Number.isSafeInteger(recoveredReviewCount) || recoveredReviewCount < 0) {
    return { state: "review_failed", handoffWrites: [] };
  }
  if (recoveredReviewCount >= 3) {
    return {
      state: "review_budget_exhausted",
      priorState: currentState,
      handoffWrites: [],
    };
  }
  return { state: "review_due", handoffWrites: ["review_due_context"] };
};

export const assessReadonlyValidation = ({ beforeHash, afterHash }) => {
  if (!HEX_64.test(beforeHash) || !HEX_64.test(afterHash)) {
    return { state: "review_failed", passConsumed: false };
  }
  if (beforeHash !== afterHash) {
    return { state: "review_due", passConsumed: false };
  }
  return { state: "validation_accepted", passConsumed: false };
};

export const requiredReportFields = [
  "review_lineage_id",
  "review_run_id",
  "accepted_bounds_identity",
  "accepted_bounds_hash",
  "reviewed_at",
  "mode",
  "normalized_target",
  "snapshot_hash",
  "excluded_envelope",
  "source_paths_and_hashes",
  "source_set_hash",
  "lens_outcomes",
  "findings",
  "routing",
  "validation",
  "delivery_goal_identity",
  "review_ordinal",
  "preceding_repair_ordinal",
];

const validateTargetSchema = (target, mode, errors) => {
  const deliveryKeys = [
    "kind",
    "locator",
    "actual_base_ref",
    "fixed_point_sha",
    "head_identity",
    "inclusive_scope",
    "canonical_patch_hash",
  ];
  const standaloneKeys = [
    "kind",
    "locator",
    "ordered_file_identities",
    "inclusive_scope",
    "ordered_bundle_content_hash",
    "git_fixed_point",
  ];
  if (!exactKeys(target, mode === "delivery" ? deliveryKeys : standaloneKeys)) {
    errors.push("malformed:normalized_target_schema");
    return;
  }
  if (!nonemptyString(target.locator) || !sortedUniqueStrings(target.inclusive_scope)) {
    errors.push("malformed:normalized_target_common_fields");
  }
  if (mode === "delivery") {
    if (
      target.kind !== "delivery-git-diff" ||
      !nonemptyString(target.actual_base_ref) ||
      !COMMIT_SHA.test(target.fixed_point_sha) ||
      !nonemptyString(target.head_identity) ||
      !HEX_64.test(target.canonical_patch_hash)
    ) {
      errors.push("malformed:delivery_target_fields");
    }
  } else if (
    target.kind !== "standalone-artifact" ||
    !sortedUniqueStrings(target.ordered_file_identities) ||
    !HEX_64.test(target.ordered_bundle_content_hash) ||
    target.git_fixed_point !== null ||
    !isDeepStrictEqual(target.inclusive_scope, target.ordered_file_identities)
  ) {
    errors.push("malformed:standalone_target_fields");
  }
};

const validateReportSemantics = (report, errors) => {
  if (!exactKeys(report, requiredReportFields)) {
    errors.push("malformed:report_schema");
    return;
  }
  if (!exactKeys(report.lens_outcomes, LENS_KEYS)) {
    errors.push("malformed:lens_keys");
  } else {
    for (const [lens, outcome] of Object.entries(report.lens_outcomes)) {
      if (outcome !== "clean" && outcome !== "findings") {
        errors.push(`malformed:lens_outcome:${lens}`);
      }
    }
  }

  if (!Array.isArray(report.findings)) {
    errors.push("malformed:findings");
  } else {
    const findingKeys = [
      "id",
      "lens",
      "severity",
      "location",
      "impact",
      "evidence",
      "action",
    ];
    const ids = new Set();
    const findingLenses = new Set();
    for (const finding of report.findings) {
      if (
        !exactKeys(finding, findingKeys) ||
        !/^[a-z0-9][a-z0-9._-]*$/u.test(finding.id ?? "") ||
        ids.has(finding.id) ||
        !LENS_KEYS.includes(finding.lens) ||
        !["critical", "high", "medium", "low"].includes(finding.severity) ||
        ![finding.location, finding.impact, finding.evidence, finding.action].every(
          nonemptyString,
        )
      ) {
        errors.push("malformed:finding");
        continue;
      }
      ids.add(finding.id);
      findingLenses.add(finding.lens);
    }
    if (exactKeys(report.lens_outcomes, LENS_KEYS)) {
      for (const lens of LENS_KEYS) {
        const hasFindings = findingLenses.has(lens);
        if ((report.lens_outcomes[lens] === "findings") !== hasFindings) {
          errors.push(`mismatch:lens_findings:${lens}`);
        }
      }
    }
  }

  if (
    !exactKeys(report.routing, ["primary", "secondary_architecture_follow_up"]) ||
    ![
      "debugging",
      "implementation",
      "debt_follow_up",
      "docs_ingest",
      "closeout",
    ].includes(report.routing?.primary) ||
    typeof report.routing?.secondary_architecture_follow_up !== "boolean"
  ) {
    errors.push("malformed:routing");
  }

  const validationKeys = [
    "command",
    "isolation",
    "before_hash",
    "after_hash",
    "outcome",
    "evidence",
  ];
  if (!Array.isArray(report.validation)) {
    errors.push("malformed:validation");
  } else {
    for (const validation of report.validation) {
      if (
        !exactKeys(validation, validationKeys) ||
        !nonemptyString(validation.command) ||
        !["proven-no-write", "disposable-checkout", "disposable-snapshot"].includes(
          validation.isolation,
        ) ||
        !HEX_64.test(validation.before_hash ?? "") ||
        validation.before_hash !== validation.after_hash ||
        !["passed", "failed", "skipped"].includes(validation.outcome) ||
        !nonemptyString(validation.evidence)
      ) {
        errors.push("malformed:validation_record");
      }
    }
  }
};

const validateFrontmatter = (
  frontmatter,
  report,
  expected,
  { lineageId, runId, snapshotHash },
  errors,
) => {
  if (!exactKeys(frontmatter, FRONTMATTER_KEYS)) {
    errors.push("malformed:frontmatter_schema");
    return;
  }
  let date;
  try {
    date = reportDate(report.reviewed_at);
  } catch {
    errors.push("malformed:frontmatter_reviewed_at");
  }
  const required = {
    title: `${reviewScopeSlug(lineageId)} review report`,
    domain: expected.wikiDomain,
    type: "review-report",
    surface: "project",
    permission: "internal",
    links: [],
    review_lineage_id: lineageId,
    review_run_id: runId,
    review_mode: report.mode,
    reviewed_at: report.reviewed_at,
    accepted_bounds_identity: report.accepted_bounds_identity,
    accepted_bounds_hash: report.accepted_bounds_hash,
    snapshot_hash: snapshotHash,
    created: date,
    updated: date,
  };
  for (const key of FRONTMATTER_KEYS) {
    if (!isDeepStrictEqual(frontmatter[key], required[key])) {
      errors.push(`mismatch:frontmatter:${key}`);
    }
  }
};

const inspectRetainedPass = (candidate, expected) => {
  const errors = [];
  if (Object.hasOwn(candidate, "report")) {
    errors.push("unexpected:detached_report_sidecar");
  }
  let frontmatter;
  let report;
  try {
    ({ frontmatter, report } = parseReviewReport(candidate.reportBytes));
  } catch {
    return { valid: false, errors: [...errors, "malformed_report_blob"] };
  }
  validateReportSemantics(report, errors);
  validateTargetSchema(report.normalized_target, expected.mode, errors);

  let currentTarget;
  let currentSources;
  try {
    currentTarget = normalizeReviewTarget(expected.mode, expected.targetEvidence);
    currentSources = normalizeReviewSources(expected.sourceEvidence);
  } catch {
    return { valid: false, errors: [...errors, "malformed_current_evidence"] };
  }
  const scopeEntries = currentTarget.inclusive_scope;
  const boundsHash = acceptedBoundsHash(
    expected.acceptedBoundsIdentity,
    scopeEntries,
  );
  const sourceHash = sourceSetHash(currentSources);
  let lineageId;
  try {
    lineageId =
      expected.mode === "delivery"
        ? deliveryLineageId(expected.deliveryGoalIdentity)
        : standaloneLineageId(currentTarget.locator, boundsHash);
  } catch {
    errors.push("invalid:delivery_goal_identity");
  }
  const snapshotHash =
    expected.mode === "delivery"
      ? deliverySnapshotHash({
          locator: currentTarget.locator,
          actualBaseRef: currentTarget.actual_base_ref,
          fixedPointSha: currentTarget.fixed_point_sha,
          headIdentity: currentTarget.head_identity,
          scopeEntries,
          canonicalPatchHash: currentTarget.canonical_patch_hash,
        })
      : hashRecord("standalone-snapshot", [
          currentTarget.locator,
          hashRecord("ordered-files", currentTarget.ordered_file_identities),
          inclusiveScopeHash(scopeEntries),
          currentTarget.ordered_bundle_content_hash,
          "no-git-fixed-point",
        ]);
  const ordinal =
    expected.mode === "delivery" ? expected.reviewOrdinal : null;
  let runId;
  try {
    runId =
      expected.mode === "delivery"
        ? deliveryRunId(lineageId, ordinal)
        : standaloneRunId(lineageId, snapshotHash);
  } catch {
    errors.push("invalid:review_ordinal");
  }
  let reportPath;
  try {
    reportPath = reviewReportPath({
      lineageId,
      reviewedAt: report.reviewed_at,
      snapshotHash,
    });
  } catch {
    errors.push("invalid:reviewed_at");
  }
  try {
    validateFrontmatter(
      frontmatter,
      report,
      expected,
      { lineageId, runId, snapshotHash },
      errors,
    );
  } catch {
    errors.push("malformed:frontmatter_values");
  }

  const exactFields = [
    ["mode", expected.mode],
    ["review_lineage_id", lineageId],
    ["review_run_id", runId],
    ["accepted_bounds_identity", expected.acceptedBoundsIdentity],
    ["accepted_bounds_hash", boundsHash],
    ["snapshot_hash", snapshotHash],
    ["source_set_hash", sourceHash],
  ];
  for (const [field, value] of exactFields) {
    if (report[field] !== value) errors.push(`mismatch:${field}`);
  }
  if (!isDeepStrictEqual(report.normalized_target, currentTarget)) {
    errors.push("mismatch:normalized_target");
  }
  const envelopePaths = reportPath
    ? [reportPath, ...expected.auxiliaryEnvelopePaths]
    : expected.auxiliaryEnvelopePaths;
  if (!isDeepStrictEqual(report.excluded_envelope, envelopePaths)) {
    errors.push("mismatch:excluded_envelope");
  }
  if (!isDeepStrictEqual(report.source_paths_and_hashes, currentSources)) {
    errors.push("mismatch:source_paths_and_hashes");
  }

  if (candidate.reportPath !== reportPath) {
    errors.push("mismatch:report_path");
  }
  if (
    !Buffer.isBuffer(candidate.reportBytes) ||
    candidate.reportSha256 !== sha256Hex(candidate.reportBytes)
  ) {
    errors.push("mismatch:report_sha256");
  }
  if (!candidate.refContainsCommit) errors.push("ref_missing_commit");
  if (!COMMIT_SHA.test(candidate.reportCommitSha)) {
    errors.push("invalid:report_commit_sha");
  }
  if (!expected.approvedRetainedRefs.includes(candidate.retainedRef)) {
    errors.push("unapproved:retained_ref");
  }

  const changedPaths = new Set(
    Array.isArray(candidate.commitPaths) ? candidate.commitPaths : [],
  );
  const allowedPaths = new Set(envelopePaths);
  if (!changedPaths.has(reportPath)) errors.push("commit_missing_report");
  for (const path of changedPaths) {
    if (!allowedPaths.has(path)) errors.push(`commit_path_outside_envelope:${path}`);
  }

  if (expected.mode === "delivery") {
    if (
      report.delivery_goal_identity !== expected.deliveryGoalIdentity ||
      report.review_ordinal !== ordinal ||
      !Number.isSafeInteger(ordinal) ||
      ordinal < 1 ||
      ordinal > 3 ||
      report.preceding_repair_ordinal !== (ordinal === 1 ? null : ordinal - 1)
    ) {
      errors.push("invalid:delivery_identity_or_ordinal");
    }
  } else if (
    report.delivery_goal_identity !== null ||
    report.review_ordinal !== null ||
    report.preceding_repair_ordinal !== null
  ) {
    errors.push("invalid:standalone_delivery_fields");
  }

  return {
    valid: errors.length === 0,
    errors,
    derived: { lineageId, runId, ordinal, reportPath },
  };
};

export const validateRetainedPass = (candidate, expected) => {
  const { valid, errors } = inspectRetainedPass(candidate, expected);
  return { valid, errors };
};

const authoritySignature = (candidate) =>
  [
    candidate.reportPath,
    candidate.reportSha256,
    candidate.reportCommitSha,
  ].join("\0");

export const resolveRetainedRun = (entries) => {
  const valid = entries
    .map((entry) => ({ entry, inspection: inspectRetainedPass(entry.candidate, entry.expected) }))
    .filter(({ inspection }) => inspection.valid);
  if (valid.length === 0) return { status: "none", pass: null };

  const runKeys = new Set(
    valid.map(({ inspection }) =>
      [inspection.derived.lineageId, inspection.derived.runId].join("\0"),
    ),
  );
  if (runKeys.size !== 1) return { status: "mixed_runs", pass: null };

  const first = authoritySignature(valid[0].entry.candidate);
  if (valid.every(({ entry }) => authoritySignature(entry.candidate) === first)) {
    return {
      status: valid.length === 1 ? "unique" : "reuse",
      pass: valid[0].entry,
    };
  }
  return { status: "conflict", pass: null };
};

export const recoverDeliveryCount = (entries, lineageId) => {
  const matching = entries
    .map((entry) => ({ entry, inspection: inspectRetainedPass(entry.candidate, entry.expected) }))
    .filter(
      ({ entry, inspection }) =>
        entry.expected.mode === "delivery" &&
        inspection.valid &&
        inspection.derived.lineageId === lineageId,
    );
  const groups = new Map();
  for (const { entry, inspection } of matching) {
    const group = groups.get(inspection.derived.runId) ?? [];
    group.push(entry);
    groups.set(inspection.derived.runId, group);
  }
  let reviewCount = 0;
  for (const group of groups.values()) {
    const resolved = resolveRetainedRun(group);
    if (resolved.status === "conflict") {
      return { status: "conflict", reviewCount: null };
    }
    if (resolved.pass) {
      const inspected = inspectRetainedPass(
        resolved.pass.candidate,
        resolved.pass.expected,
      );
      reviewCount = Math.max(reviewCount, inspected.derived.ordinal);
    }
  }
  return { status: "ok", reviewCount };
};
