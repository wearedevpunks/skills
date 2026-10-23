// Pure review-phase policy for scripted passes. Callers inject environment,
// file lists and parsed reports; this module reads no files, processes or env.
import { createHash } from "node:crypto";

const RECORD_HEADER = Buffer.from("review-identity-v1\n", "utf8");
const HEX_64 = /^[0-9a-f]{64}$/u;
const COMMIT_SHA = /^[0-9a-f]{40}(?:[0-9a-f]{24})?$/u;
const AXES = ["standards", "spec"];
const ENGINES = ["codex", "claude"];
const SEVERITIES = ["critical", "high", "medium", "low"];
const FINDING_ROUTES = [
  "human_steering_required",
  "debugging",
  "implementation",
  "debt_follow_up",
  "docs_ingest",
];
const RISK_TRIGGERS = ["architecture", "security", "public_contract", "runtime_topology", "accepted_scope"];
const SPEC_SOURCES = ["SPEC.md", "ARCHITECTURE.md", "PLAN.md", "IMPLEMENTATION-NOTES.md"];
const PASS_REPORT_DIR = /^\.devpunks\/delivery\/(?:[^/]+\/)*reviews\//u;
const PASS_REPORT_NAME = /^pass-([1-9]\d*)\.json$/u;

const nonemptyString = (value) => typeof value === "string" && value.length > 0;
const isObject = (value) => value !== null && typeof value === "object" && !Array.isArray(value);
const exactKeys = (value, keys) =>
  isObject(value) && Object.keys(value).length === keys.length && keys.every((key) => Object.hasOwn(value, key));
const sortUtf8 = (values) =>
  [...values].sort((left, right) =>
    Buffer.compare(Buffer.from(left, "utf8"), Buffer.from(right, "utf8")),
  );

const frame = (value, field) => {
  if (typeof value !== "string") throw new TypeError(`${field} must be a string`);
  const bytes = Buffer.from(value, "utf8");
  return Buffer.concat([Buffer.from(`${bytes.length}:`, "ascii"), bytes]);
};

const hashRecord = (label, fields) =>
  createHash("sha256")
    .update(Buffer.concat([
      RECORD_HEADER,
      frame(label, "label"),
      ...fields.map((value, index) => frame(value, `field ${index}`)),
    ]))
    .digest("hex");

export const reviewPacketIdentity = (report) => hashRecord("review-packet", [
  report.review_run_id, report.accepted_bounds_hash, report.snapshot_hash, report.source_set_hash,
]);

export const deriveReviewRouting = (findings) => {
  if (
    !Array.isArray(findings) ||
    findings.some((finding) => !isObject(finding) || !FINDING_ROUTES.includes(finding.return_route))
  ) {
    throw new TypeError("invalid finding return route");
  }
  const routes = new Set(findings.map(({ return_route: route }) => route));
  const primary = FINDING_ROUTES.find((route) => routes.has(route)) ?? "closeout";
  return {
    primary,
    secondary_architecture_follow_up:
      routes.has("debt_follow_up") &&
      (primary === "debugging" || primary === "implementation"),
  };
};

export const planDeliveryReviewGate = ({
  currentState,
  acceptedBoundsValid,
  targetSupported,
  recoveredReviewCount,
  acceptedRiskTrigger,
  humanReviewDirection,
}) => {
  if (!acceptedBoundsValid || !targetSupported) {
    return { state: "review_failed", handoffWrites: [] };
  }
  if (!Number.isSafeInteger(recoveredReviewCount) || recoveredReviewCount < 0) {
    return { state: "review_failed", handoffWrites: [] };
  }
  if (recoveredReviewCount >= 2 && !(exactKeys(humanReviewDirection, ["evidence", "authorized_ordinal"]) &&
      nonemptyString(humanReviewDirection.evidence) && humanReviewDirection.authorized_ordinal === recoveredReviewCount + 1)) {
    return {
      state: "review_budget_exhausted",
      priorState: currentState,
      handoffWrites: [],
    };
  }
  if (recoveredReviewCount === 1 &&
      !(exactKeys(acceptedRiskTrigger, ["kind", "evidence"]) &&
        RISK_TRIGGERS.includes(acceptedRiskTrigger.kind) &&
        nonemptyString(acceptedRiskTrigger.evidence))) {
    return { state: "focused_validation", handoffWrites: [] };
  }
  return { state: "review_due", handoffWrites: ["review_due_context"] };
};

// The Codex marker (CODEX_THREAD_ID) and an unknown host both keep the
// upstream default order, Codex first.
export const planEngineOrder = (env) => {
  const override = env.HI_REVIEW_ENGINES;
  if (nonemptyString(override)) {
    const order = override.split(",").map((name) => name.trim());
    if (order.some((name) => !ENGINES.includes(name)) || new Set(order).size !== order.length) {
      throw new TypeError(`HI_REVIEW_ENGINES must list distinct engines from ${ENGINES.join(", ")}; got "${override}"`);
    }
    return order;
  }
  return env.CLAUDECODE === "1" ? ["claude", "codex"] : [...ENGINES];
};

const baseName = (path) => path.slice(path.lastIndexOf("/") + 1);
const reviewable = (paths) => paths.filter((path) => !PASS_REPORT_DIR.test(path));

export const selectSourceContext = ({
  axis,
  changedPaths = [],
  agentsFiles = [],
  matchedRules = [],
  assignedSkillFiles = [],
  specFolderFiles = [],
}) => {
  let selected;
  if (axis === "standards") {
    const touched = reviewable(changedPaths);
    const chain = agentsFiles.filter((file) => {
      if (baseName(file) !== "AGENTS.md") return false;
      const directory = file.slice(0, -"AGENTS.md".length);
      return touched.some((path) => path.startsWith(directory));
    });
    selected = [...chain, ...matchedRules, ...assignedSkillFiles];
  } else if (axis === "spec") {
    selected = specFolderFiles.filter((file) => SPEC_SOURCES.includes(baseName(file)));
  } else {
    throw new TypeError(`unknown review axis "${axis}"`);
  }
  return sortUtf8(new Set(reviewable(selected)));
};

// Schema checks push "<field path>: <problem>" messages into `errors`.
const fieldPath = (path, key) => (path ? `${path}.${key}` : key);
const is = (accepts, expected) => (value, path, errors) => {
  if (!accepts(value)) errors.push(`${path}: must be ${expected}`);
};
const oneOf = (values) => is((value) => values.includes(value), values.join(" | "));
const text = is(nonemptyString, "a non-empty string");
const commitSha = is((value) => COMMIT_SHA.test(value), "a commit SHA");
const shape = (fields) => (value, path, errors) => {
  if (!isObject(value)) return void errors.push(`${path || "report"}: must be an object`);
  for (const key of Object.keys(value)) {
    if (!Object.hasOwn(fields, key)) errors.push(`${fieldPath(path, key)}: unknown field`);
  }
  for (const [key, check] of Object.entries(fields)) check(value[key], fieldPath(path, key), errors);
};
const listOf = (item, { nonEmpty = false } = {}) => (value, path, errors) => {
  if (!Array.isArray(value) || (nonEmpty && value.length === 0)) {
    return void errors.push(`${path}: must be ${nonEmpty ? "a non-empty" : "an"} array`);
  }
  value.forEach((entry, index) => item(entry, `${path}[${index}]`, errors));
};

const axisReport = shape({
  lens_result: oneOf(["clean", "findings"]),
  attempts: listOf(shape({
    engine: oneOf(ENGINES),
    model: text,
    seconds: is((value) => Number.isFinite(value) && value >= 0, "a non-negative number"),
    outcome: text,
    usage: is((value) => value === null || isObject(value), "an object or null"),
  }), { nonEmpty: true }),
});

const passReportShape = shape({
  schema: oneOf(["pass-report-v1"]),
  run_id: text,
  ordinal: is((value) => value === null || (Number.isSafeInteger(value) && value > 0), "a positive integer or null"),
  mode: oneOf(["delivery", "standalone"]),
  base: commitSha,
  head: commitSha,
  packet_identity: is((value) => HEX_64.test(value), "64 lowercase hexadecimal digits"),
  axes: shape({ standards: axisReport, spec: axisReport }),
  adjudication: shape({
    subagent_tokens: is((value) => Number.isSafeInteger(value) && value >= 0, "a non-negative integer"),
    findings: listOf(shape({
      id: text,
      axis: oneOf(AXES),
      severity: oneOf(SEVERITIES),
      location: text,
      evidence: text,
      action: text,
      return_route: oneOf(FINDING_ROUTES),
    })),
    rejected: listOf(shape({ candidate_ref: text, reason: text })),
  }),
  route: shape({ primary: oneOf([...FINDING_ROUTES, "closeout"]), secondary_debt: oneOf([true, false]) }),
});

export const validatePassReport = (report) => {
  const errors = [];
  passReportShape(report, "", errors);
  if (errors.length > 0) return { ok: false, errors };
  if ((report.mode === "delivery") !== (report.ordinal !== null)) {
    errors.push("ordinal: must be a positive integer in delivery mode and null in standalone mode");
  }
  const { findings } = report.adjudication;
  if (new Set(findings.map(({ id }) => id)).size !== findings.length) {
    errors.push("adjudication.findings: finding ids must be unique");
  }
  const derived = deriveReviewRouting(findings);
  if (report.route.primary !== derived.primary || report.route.secondary_debt !== derived.secondary_architecture_follow_up) {
    errors.push(`route: must equal the route derived from findings (${derived.primary}, secondary_debt ${derived.secondary_architecture_follow_up})`);
  }
  return errors.length === 0 ? { ok: true } : { ok: false, errors };
};

// `entries` are the goal's `reviews/` directory entries: `{ name, report }`
// for parsed JSON or `{ name, error }` for a parse failure. Only valid reports
// whose ordinal matches their `pass-<n>.json` name count (delivery mode only).
export const recoverPassCount = (entries) =>
  entries.filter(({ name, report }) => {
    const match = PASS_REPORT_NAME.exec(name);
    return match !== null && validatePassReport(report).ok && report.ordinal === Number(match[1]);
  }).length;
