// Pure review-phase policy: route derivation, pass budget, findings and Pass
// Report validation, pass count. Callers inject every input; this module does
// no I/O.
const ROUTES = ["human_steering_required", "debugging", "implementation", "debt_follow_up", "docs_ingest"];
const PRIORITIES = ["P0", "P1", "P2"];
const KINDS = ["security", "performance", "contract", "unrequested", "smell"];
const RISK_KINDS = ["architecture", "security", "public_contract", "runtime_topology", "accepted_scope"];
const MAX_FINDINGS = 5;
const FINDING_KEYS = ["id", "priority", "kind", "location", "failure_scenario", "action", "return_route"];
const REPORT_KEYS = ["schema", "run_id", "ordinal", "mode", "base", "head", "reviewer", "findings", "route"];
const LEFT_OUT_REASONS = ["linguist-generated", "-diff", "lockfile", "generated-snapshot", "over-budget"];
const COMMIT_SHA = /^[0-9a-f]{40}(?:[0-9a-f]{24})?$/u;
const PASS_REPORT_NAME = /^pass-([1-9]\d*)\.json$/u;

const isObject = (value) => value !== null && typeof value === "object" && !Array.isArray(value);
const hasExactKeys = (value, keys) =>
  isObject(value) && Object.keys(value).length === keys.length && keys.every((key) => Object.hasOwn(value, key));
const isText = (value) => typeof value === "string" && value.trim().length > 0;
const result = (errors) => (errors.length === 0 ? { ok: true } : { ok: false, errors });

export const deriveReviewRouting = (findings) => {
  const routes = new Set(findings.map(({ return_route: route }) => route));
  const primary = ROUTES.find((route) => routes.has(route)) ?? "closeout";
  return {
    primary,
    secondary_debt: routes.has("debt_follow_up") && (primary === "debugging" || primary === "implementation"),
  };
};

// One pass by default, a second only on an accepted-risk trigger, further passes
// only with explicit human direction. Returns null when the pass may start.
export const budgetBlocker = ({ passCount, acceptedRisk, humanDirection }) => {
  if (passCount >= 2) {
    return isText(humanDirection) ? null
      : `The review budget is spent after ${passCount} passes and a further pass needs explicit human direction (--human-direction <evidence>)`;
  }
  if (passCount === 0) return null;
  const [kind, ...evidence] = (acceptedRisk ?? "").split(":");
  return RISK_KINDS.includes(kind) && isText(evidence.join(":")) ? null
    : `Pass 1 is already retained for this goal and a second pass needs an accepted-risk trigger (--accepted-risk <kind>:<evidence>, kind one of ${RISK_KINDS.join(", ")})`;
};

const findingErrors = (findings) => {
  if (!Array.isArray(findings)) return ["findings: must be an array"];
  const errors = [];
  if (findings.length > MAX_FINDINGS) {
    errors.push(`findings: must hold at most ${MAX_FINDINGS}, got ${findings.length}; keep the ${MAX_FINDINGS} highest-priority findings`);
  }
  findings.forEach((finding, index) => {
    const at = `findings[${index}]`;
    if (!hasExactKeys(finding, FINDING_KEYS)) return void errors.push(`${at}: must have exactly the keys ${FINDING_KEYS.join(", ")}`);
    const expect = (ok, key, expected) => ok || errors.push(`${at}.${key}: must be ${expected}`);
    expect(/^f\d{3}$/u.test(finding.id), "id", "f001, f002, …");
    expect(PRIORITIES.includes(finding.priority), "priority", PRIORITIES.join(" | "));
    expect(KINDS.includes(finding.kind), "kind", KINDS.join(" | "));
    expect(typeof finding.location === "string" && /^\S.*:\d+$/u.test(finding.location), "location", "path:line");
    expect(isText(finding.failure_scenario), "failure_scenario", "a non-empty string");
    expect(isText(finding.action), "action", "a non-empty string");
    expect(ROUTES.includes(finding.return_route), "return_route", ROUTES.join(" | "));
  });
  if (new Set(findings.map((finding) => finding?.id)).size !== findings.length) errors.push("findings: ids must be unique");
  return errors;
};

// The reviewer's `findings.json`: exactly `{ "findings": [...] }`.
export const validateFindings = (file) =>
  result(hasExactKeys(file, ["findings"]) ? findingErrors(file.findings) : ['findings.json: must be an object with exactly the key "findings"']);

const isCoverage = (coverage) => hasExactKeys(coverage, ["scope", "left_out"]) && Array.isArray(coverage.left_out) &&
  coverage.left_out.every((entry) => hasExactKeys(entry, ["path", "reason"]) && isText(entry.path) && LEFT_OUT_REASONS.includes(entry.reason)) &&
  coverage.scope === (coverage.left_out.some(({ reason }) => reason === "over-budget") ? "partial" : "full");

// `coverage` is optional so that v2 reports retained before it still count.
export const validatePassReport = (report) => {
  const hasCoverage = isObject(report) && Object.hasOwn(report, "coverage");
  if (!hasExactKeys(report, hasCoverage ? [...REPORT_KEYS, "coverage"] : REPORT_KEYS)) {
    return result([`report: must have exactly the keys ${REPORT_KEYS.join(", ")}, and optionally coverage`]);
  }
  const errors = [];
  const expect = (ok, key, expected) => ok || errors.push(`${key}: must be ${expected}`);
  expect(report.schema === "pass-report-v2", "schema", '"pass-report-v2"');
  expect(isText(report.run_id), "run_id", "a non-empty string");
  expect(["delivery", "standalone"].includes(report.mode), "mode", "delivery | standalone");
  expect(report.mode === "delivery" ? Number.isSafeInteger(report.ordinal) && report.ordinal > 0 : report.ordinal === null,
    "ordinal", "a positive integer in delivery mode and null in standalone mode");
  for (const key of ["base", "head"]) expect(COMMIT_SHA.test(report[key]), key, "a commit SHA");
  if (hasCoverage) {
    expect(isCoverage(report.coverage), "coverage",
      `{ scope, left_out: [{ path, reason }] }, reason one of ${LEFT_OUT_REASONS.join(", ")}, scope partial exactly when a file is over-budget`);
  }
  expect(hasExactKeys(report.reviewer, ["subagent_tokens"]) && Number.isSafeInteger(report.reviewer.subagent_tokens) &&
    report.reviewer.subagent_tokens >= 0, "reviewer", "{ subagent_tokens: a non-negative integer }");
  const findingProblems = findingErrors(report.findings);
  errors.push(...findingProblems);
  if (findingProblems.length === 0) {
    const derived = deriveReviewRouting(report.findings);
    expect(hasExactKeys(report.route, ["primary", "secondary_debt"]) && report.route.primary === derived.primary &&
      report.route.secondary_debt === derived.secondary_debt,
    "route", `the route derived from findings (${derived.primary}, secondary_debt ${derived.secondary_debt})`);
  }
  return result(errors);
};

// `entries` are a goal's `reviews/` entries as `{ name, report }`. A pass counts
// when `pass-<n>.json` holds ordinal n in a valid v2 report or a legacy v1 report.
export const recoverPassCount = (entries) =>
  entries.filter(({ name, report }) => {
    const ordinal = Number(PASS_REPORT_NAME.exec(name)?.[1]);
    return report?.ordinal === ordinal && (report.schema === "pass-report-v1" || validatePassReport(report).ok);
  }).length;
