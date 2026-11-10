// Side-effect shell of review-phase: Git, files and the private run directory.
// Policy comes from review-contract.mjs. Each subcommand prints exactly one JSON
// line on stdout; diagnostics go to stderr.
import { execFileSync } from "node:child_process";
import { randomBytes } from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { parseArgs } from "node:util";
import { budgetBlocker, deriveReviewRouting, recoverPassCount, validateFindings, validatePassReport } from "./review-contract.mjs";

const PASS_REPORT_PATH = /^\.devpunks\/delivery\/(?:[^/]+\/)*reviews\//u;
const SPEC_SOURCES = ["SPEC.md", "ARCHITECTURE.md", "PLAN.md"];
const PACKET_SCHEMA = "review-packet-v3";
// One reviewer reads every reviewed diff in one context, so a larger change gets
// a partial review. About 75k tokens, which leaves room to verify findings.
const REVIEW_BUDGET_BYTES = 256_000;
const LOCKFILES = new Set([
  "bun.lock", "bun.lockb", "package-lock.json", "npm-shrinkwrap.json", "pnpm-lock.yaml", "yarn.lock", "deno.lock",
  "Cargo.lock", "uv.lock", "poetry.lock", "Pipfile.lock", "Gemfile.lock", "composer.lock", "go.sum", "flake.lock",
  "Package.resolved", "Podfile.lock", "pubspec.lock", "mix.lock",
]);
// Drizzle migration snapshots and test-runner snapshot directories.
const GENERATED_SNAPSHOT = /(?:^|\/)(?:meta\/\d+_snapshot\.json|__snapshots__\/.+)$/u;

const HELP = `review.mjs — one Full Code Review Pass; each subcommand prints one JSON line.

  status  --goal <delivery-dir>                        next step, run dir and pass count
  prepare --goal <delivery-dir> --base <sha> [--spec <folder>]
          [--accepted-risk <kind>:<evidence>] [--human-direction <evidence>]
  prepare --standalone <commit|base..head> [--spec <folder>]
                                                       write the Review Packet
  retain  --run-dir <dir> --subagent-tokens <n>        write and commit the Pass Report
`;

class Blocker extends Error {}

const short = (sha) => sha.slice(0, 12);
// The run root is shared by every user of the machine, so it is sticky like /tmp
// and only a private directory of this user counts as a run directory.
const runsRoot = () => path.join(os.tmpdir(), "hi-review");
const isOwnRunDir = (stat) => Boolean(stat?.isDirectory() && stat.uid === process.getuid() && (stat.mode & 0o022) === 0);
const reportPathOf = ({ mode, goal, ordinal, base, head, run_id: runId }) => mode === "delivery"
  ? `${goal}/reviews/pass-${ordinal}.json`
  : `.devpunks/delivery/standalone/reviews/${short(base)}-${short(head)}-${runId}.json`;
const sentence = (text) => String(text).replace(/\s+/gu, " ").trim().split(/(?<=\.)\s/u)[0].replace(/\.$/u, "");

// Whole-tree listings of real repositories exceed Node's 1 MiB default;
// 512 MiB is near V8's maximum string length, the real ceiling of a utf8 result.
const GIT_MAX_BUFFER = 512 * 1024 * 1024;
const git = (repo, args, input) => execFileSync("git", args, {
  cwd: repo, encoding: "utf8", maxBuffer: GIT_MAX_BUFFER, input, stdio: [input === undefined ? "ignore" : "pipe", "pipe", "pipe"],
}).trimEnd();
const gitOk = (repo, args) => {
  try {
    return git(repo, args);
  } catch {
    return null;
  }
};
const commitOf = (repo, ref) =>
  ref && !ref.startsWith("-") ? gitOk(repo, ["rev-parse", "--verify", "--quiet", "--end-of-options", `${ref}^{commit}`]) : null;
const zList = (output) => output.split("\0").filter(Boolean);

// undefined when the file is absent, null when it is not valid JSON.
const readJson = (file) => {
  let text;
  try {
    text = fs.readFileSync(file, "utf8");
  } catch (error) {
    if (error.code === "ENOENT") return undefined;
    throw error;
  }
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
};
const writeJson = (file, value) => fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`);

const repoRoot = () => {
  const root = gitOk(process.cwd(), ["rev-parse", "--show-toplevel"]);
  if (!root) throw new Blocker("review.mjs must run inside a Git repository");
  return root;
};
const goalPath = (repo, goal) => {
  const relative = path.relative(repo, path.resolve(goal)).split(path.sep).join("/");
  if (!/^\.devpunks\/delivery\/[^/]+/u.test(relative) || PASS_REPORT_PATH.test(`${relative}/`)) {
    throw new Blocker(`Goal ${goal} must be a delivery directory under .devpunks/delivery/`);
  }
  return relative;
};
const passEntries = (repo, goalRel) => {
  const dir = path.join(repo, goalRel, "reviews");
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).map((name) => ({ name, report: readJson(path.join(dir, name)) }));
};
const goalRuns = (repo, goalRel) => {
  if (!fs.existsSync(runsRoot())) return [];
  return fs.readdirSync(runsRoot())
    .map((name) => path.join(runsRoot(), name))
    .filter((dir) => isOwnRunDir(fs.lstatSync(dir, { throwIfNoEntry: false })))
    .map((dir) => ({ dir, packet: readJson(path.join(dir, "packet.json")) }))
    .filter(({ packet }) => packet?.repo_root === repo && packet.goal === goalRel)
    .sort((left, right) => left.packet.created_at.localeCompare(right.packet.created_at));
};

// ---------- prepare ----------

const resolveTarget = (repo, { mode, base, standalone }) => {
  if (mode === "delivery") {
    const baseSha = commitOf(repo, base);
    if (!baseSha) throw new Blocker(`Base ${base} is not a commit in this repository`);
    return { base: baseSha, head: commitOf(repo, "HEAD"), locator: `${baseSha}..HEAD` };
  }
  const [from, to, extra] = standalone.split("..");
  const [baseSha, headSha] = to === undefined ? [commitOf(repo, `${from}^`), commitOf(repo, from)] : [commitOf(repo, from), commitOf(repo, to)];
  if (extra !== undefined || to === "" || standalone.includes("...") || !baseSha || !headSha) {
    throw new Blocker(`Standalone target ${standalone} is not a Git commit or commit range; commit the artifacts and pass a commit or <base>..<head>`);
  }
  return { base: baseSha, head: headSha, locator: standalone };
};

const ticked = (cell) => [...cell.matchAll(/`([^`]+)`/gu)].map((match) => match[1]);
// Rules whose `path trigger` globs match a changed path, from `.agents/rules/index.md`.
const matchRules = (index, changed) => {
  const rows = (index ?? "").split("\n")
    .filter((line) => line.trim().startsWith("|"))
    .map((line) => line.trim().replace(/^\||\|$/gu, "").split("|").map((cell) => cell.trim()));
  const columns = (rows[0] ?? []).map((cell) => cell.toLowerCase());
  const trigger = columns.indexOf("path trigger");
  const file = columns.indexOf("file");
  if (trigger < 0 || file < 0) return [];
  return rows.slice(1)
    .filter((row) => ticked(row[trigger] ?? "").some((glob) => changed.some((p) => path.posix.matchesGlob(p, glob))))
    .map((row) => `.agents/rules/${row[file].replaceAll("`", "")}`);
};

// Source before tests before docs, larger diffs first within a tier.
const tierOf = (file) => /(?:^|\/)(?:tests?|__tests__)\/|[._-](?:test|spec)\.[^/]+$/u.test(file) ? 1
  : /\.(?:md|mdx|txt|rst|adoc)$/u.test(file) || /(?:^|\/)docs?\//u.test(file) ? 2 : 0;
const DIFF = ["diff", "--no-ext-diff", "--no-color", "--no-renames", "--src-prefix=a/", "--dst-prefix=b/"];
// Diff bytes per path from one patch, split at each `diff --git a/<p> b/<p>`
// header; a path whose header Git quotes is measured with its own diff.
const diffSizer = (repo, target) => {
  const sizes = new Map();
  for (const block of git(repo, ["-c", "core.quotePath=false", ...DIFF, target.base, target.head]).split(/^(?=diff --git )/mu)) {
    const header = block.slice("diff --git a/".length, block.indexOf("\n"));
    const file = header.slice(0, (header.length - 3) / 2);
    if (header === `${file} b/${file}`) sizes.set(file, (sizes.get(file) ?? 0) + Buffer.byteLength(block));
  }
  return (file) => sizes.get(file) ?? Buffer.byteLength(git(repo, ["--literal-pathspecs", ...DIFF, target.base, target.head, "--", file]));
};

// Generated files stay out of the review payload. When the rest exceeds the
// budget, the first-ranked file and each later file that still fits are reviewed.
const planCoverage = (repo, target, changed) => {
  const reasons = new Map();
  const attrs = zList(git(repo, ["check-attr", `--source=${target.head}`, "-z", "--stdin", "linguist-generated", "diff"], changed.join("\0")));
  for (let index = 0; index < attrs.length; index += 3) {
    const [file, attr, value] = attrs.slice(index, index + 3);
    const reason = attr === "linguist-generated" && ["set", "true"].includes(value) ? "linguist-generated"
      : attr === "diff" && value === "unset" ? "-diff" : null;
    if (reason && !reasons.has(file)) reasons.set(file, reason);
  }
  for (const file of changed) {
    if (reasons.has(file)) continue;
    if (LOCKFILES.has(path.posix.basename(file))) reasons.set(file, "lockfile");
    else if (GENERATED_SNAPSHOT.test(file)) reasons.set(file, "generated-snapshot");
  }
  const candidates = changed.filter((file) => !reasons.has(file));
  if (candidates.length === 0) {
    throw new Blocker(`The target ${target.locator} changes only generated files (${changed.join(", ")}), so it has nothing to review`);
  }
  const sizeOf = diffSizer(repo, target);
  const ranked = candidates.map((file) => ({ file, tier: tierOf(file), bytes: sizeOf(file) }))
    .sort((left, right) => left.tier - right.tier || right.bytes - left.bytes);
  let room = REVIEW_BUDGET_BYTES;
  ranked.forEach(({ file, bytes }, index) => {
    if (index === 0 || bytes <= room) room -= bytes;
    else reasons.set(file, "over-budget");
  });
  const leftOut = changed.filter((file) => reasons.has(file)).map((file) => ({ path: file, reason: reasons.get(file) }));
  return {
    reviewed: changed.filter((file) => !reasons.has(file)),
    coverage: { scope: leftOut.some(({ reason }) => reason === "over-budget") ? "partial" : "full", left_out: leftOut },
  };
};

const prepare = (options) => {
  const repo = repoRoot();
  const mode = options.standalone ? "standalone" : "delivery";
  if (mode === "delivery" && (!options.goal || !options.base)) throw new Blocker("prepare needs --goal <delivery-dir> and --base <sha>, or --standalone <commit|range>");
  const goalRel = mode === "delivery" ? goalPath(repo, options.goal) : null;
  const target = resolveTarget(repo, { mode, base: options.base, standalone: options.standalone });
  const changed = zList(git(repo, ["diff", "--name-only", "--no-renames", "-z", target.base, target.head]))
    .filter((file) => !PASS_REPORT_PATH.test(file));
  if (changed.length === 0) throw new Blocker(`The target ${target.locator} has no reviewable Git change outside Pass Reports`);

  let ordinal = null;
  if (mode === "delivery") {
    const passCount = recoverPassCount(passEntries(repo, goalRel));
    const blocker = budgetBlocker({ passCount, acceptedRisk: options["accepted-risk"], humanDirection: options["human-direction"] });
    if (blocker) throw new Blocker(blocker);
    ordinal = passCount + 1;
  }
  const { reviewed, coverage } = planCoverage(repo, target, changed);

  const files = new Set(zList(git(repo, ["ls-tree", "-r", "--name-only", "-z", target.head])));
  let specFolder = options.spec ? path.relative(repo, path.resolve(options.spec)).split(path.sep).join("/") : null;
  if (!specFolder) {
    const folders = [...new Set(changed.map((file) => path.posix.dirname(file)).filter((dir) => files.has(`${dir}/SPEC.md`)))];
    if (folders.length > 1) throw new Blocker(`The change touches several spec folders (${folders.join(", ")}); name one with --spec`);
    specFolder = folders[0] ?? goalRel;
  }
  const specSources = specFolder ? SPEC_SOURCES.map((name) => `${specFolder}/${name}`).filter((file) => files.has(file)) : [];
  if (specSources.length === 0 && (mode === "delivery" || options.spec)) {
    throw new Blocker(`The review has no spec source because ${specFolder ?? "no spec folder"} holds no ${SPEC_SOURCES.join(", ")} at the reviewed head; name the spec folder with --spec`);
  }
  const agentsChain = reviewed.flatMap((file) => {
    const dirs = file.split("/").slice(0, -1);
    return ["AGENTS.md", ...dirs.map((_, index) => `${dirs.slice(0, index + 1).join("/")}/AGENTS.md`)];
  });
  const rules = matchRules(gitOk(repo, ["show", `${target.head}:.agents/rules/index.md`]), reviewed);
  const context = [...new Set([...agentsChain, ...rules, ...specSources])]
    .filter((file) => files.has(file) && !PASS_REPORT_PATH.test(file))
    .sort((left, right) => Buffer.compare(Buffer.from(left), Buffer.from(right)));

  const runId = `${new Date().toISOString().replace(/[-:]/gu, "").replace(/\.\d+Z$/u, "Z")}-${randomBytes(3).toString("hex")}`;
  if (fs.mkdirSync(runsRoot(), { recursive: true }) !== undefined) fs.chmodSync(runsRoot(), 0o1777);
  const runDir = path.join(runsRoot(), runId);
  fs.mkdirSync(runDir, { mode: 0o700 });
  const packet = {
    schema: PACKET_SCHEMA,
    run_id: runId,
    created_at: new Date().toISOString(),
    mode,
    repo_root: repo,
    goal: goalRel,
    base: target.base,
    head: target.head,
    prepared_head: commitOf(repo, "HEAD"),
    ordinal,
    report_path: null,
    changed_paths: reviewed,
    context,
    coverage,
  };
  packet.report_path = reportPathOf(packet);
  writeJson(path.join(runDir, "packet.json"), packet);
  // A new delivery pass supersedes older run directories of the same goal.
  if (mode === "delivery") {
    for (const other of goalRuns(repo, goalRel)) if (other.dir !== runDir) fs.rmSync(other.dir, { recursive: true, force: true });
  }
  return { run_id: runId, run_dir: runDir, ordinal, blocker: null };
};

// ---------- retain ----------

const STALE = "HEAD moved since prepare, so this run no longer matches the reviewed change; run prepare again";
const loadRun = (runDir) => {
  const stat = runDir ? fs.lstatSync(runDir, { throwIfNoEntry: false }) : undefined;
  if (stat && !isOwnRunDir(stat)) throw new Blocker(`${runDir} is not a private run directory of this user, so it is not trusted; run prepare`);
  const packet = runDir && readJson(path.join(runDir, "packet.json"));
  if (!packet) throw new Blocker(`Run directory ${runDir} holds no packet.json; run prepare`);
  const repo = repoRoot();
  if (packet.repo_root !== repo) throw new Blocker(`packet.json names repository ${packet.repo_root}, which does not match this repository ${repo}`);
  if (packet.schema !== PACKET_SCHEMA) throw new Blocker(`${runDir} comes from an older review-phase; run prepare`);
  return { packet, stale: commitOf(repo, "HEAD") !== packet.prepared_head };
};

// Recovery: (1) validate before any write; (2) publish the complete report with
// an exclusive link, so a second writer fails and a crash leaves no partial
// ordinal; (3) commit only that path, which a retry repeats safely; (4) remove
// the run directory last.
const retain = ({ "run-dir": runDir, "subagent-tokens": tokens }) => {
  if (!/^\d+$/u.test(tokens ?? "")) throw new Blocker("retain needs --subagent-tokens <n>, the reviewer's token total as a non-negative integer");
  const { packet, stale } = loadRun(runDir);
  const repo = packet.repo_root;
  if (packet.mode === "delivery") goalPath(repo, path.join(repo, packet.goal ?? ""));
  const derived = reportPathOf(packet);
  if (packet.report_path !== derived) {
    throw new Blocker(`packet.json names Pass Report ${packet.report_path}, which does not match the path ${derived} derived from its goal and ordinal`);
  }
  const reportFile = path.join(repo, packet.report_path);
  let existing = readJson(reportFile);
  if (existing === null) throw new Blocker(`${packet.report_path} exists but is not valid JSON, so this run cannot write pass ${packet.ordinal}`);
  if (!existing) {
    if (stale) throw new Blocker(STALE);
    const file = readJson(path.join(runDir, "findings.json"));
    if (file === undefined) throw new Blocker(`${runDir}/findings.json is missing; start the reviewer`);
    const check = validateFindings(file);
    if (!check.ok) throw new Blocker(`findings.json is invalid (${check.errors.join("; ")}); rewrite it and rerun retain`);
    const report = {
      schema: "pass-report-v2",
      run_id: packet.run_id,
      ordinal: packet.ordinal,
      mode: packet.mode,
      base: packet.base,
      head: packet.head,
      reviewer: { subagent_tokens: Number(tokens) },
      findings: file.findings,
      route: deriveReviewRouting(file.findings),
      coverage: packet.coverage,
    };
    const reportCheck = validatePassReport(report);
    if (!reportCheck.ok) throw new Blocker(`packet.json cannot form a valid Pass Report (${reportCheck.errors.join("; ")}); run prepare`);
    fs.mkdirSync(path.dirname(reportFile), { recursive: true });
    const staged = `${reportFile}.${packet.run_id}.tmp`;
    writeJson(staged, report);
    try {
      fs.linkSync(staged, reportFile);
      existing = report;
    } catch (error) {
      if (error.code !== "EEXIST") throw error;
      existing = readJson(reportFile);
    } finally {
      fs.rmSync(staged, { force: true });
    }
  }
  if (existing?.run_id !== packet.run_id) {
    throw new Blocker(`${packet.report_path} already exists from run ${existing?.run_id}, so this run cannot write pass ${packet.ordinal}; run status`);
  }
  const committed = gitOk(repo, ["diff", "--quiet", "HEAD", "--", packet.report_path]) !== null &&
    gitOk(repo, ["cat-file", "-e", `HEAD:${packet.report_path}`]) !== null;
  if (!committed) {
    const message = packet.mode === "delivery"
      ? `review(${path.posix.basename(packet.goal)}): Pass Report ${packet.ordinal}`
      : `review: standalone Pass Report ${short(packet.base)}..${short(packet.head)}`;
    try {
      git(repo, ["add", "--", packet.report_path]);
      git(repo, ["commit", "-q", "-m", message, "--", packet.report_path]);
    } catch (error) {
      process.stderr.write(String(error.stderr ?? error.message));
      throw new Blocker(`git commit of ${packet.report_path} failed, so fix the cause shown on stderr and rerun retain`);
    }
  }
  const commit = git(repo, ["log", "-1", "--format=%H", "--", packet.report_path]);
  fs.rmSync(runDir, { recursive: true, force: true });
  return {
    pass_report: packet.report_path,
    run_id: packet.run_id,
    commit,
    route: existing.route,
    findings: existing.findings.map(({ id, priority, kind, location, return_route }) => ({ id, priority, kind, location, return_route })),
    coverage: existing.coverage,
    blocker: null,
  };
};

// ---------- status ----------

const status = ({ goal }) => {
  if (!goal) throw new Blocker("status needs --goal <delivery-dir>");
  const repo = repoRoot();
  const goalRel = goalPath(repo, goal);
  const entries = passEntries(repo, goalRel);
  const passCount = recoverPassCount(entries);
  const latest = goalRuns(repo, goalRel).at(-1);
  if (!latest) {
    // Done when the latest Pass Report covers HEAD up to later Pass Report commits.
    const report = entries.find(({ name }) => name === `pass-${passCount}.json`)?.report;
    const since = report?.head ? gitOk(repo, ["diff", "--name-only", "-z", report.head, "HEAD"]) : null;
    const done = since !== null && zList(since).every((file) => PASS_REPORT_PATH.test(file));
    return { next: done ? "done" : "prepare", run_dir: null, pass_count: passCount, blocker: null };
  }
  const { packet, dir } = latest;
  const next = packet.schema !== PACKET_SCHEMA || commitOf(repo, "HEAD") !== packet.prepared_head ? "prepare"
    : fs.existsSync(path.join(dir, "findings.json")) ? "retain" : "review";
  return { next, run_dir: dir, pass_count: passCount, blocker: null };
};

// ---------- entry point ----------

const FAILURE_SHAPES = {
  prepare: { run_id: null, run_dir: null, ordinal: null },
  retain: { pass_report: null, run_id: null, commit: null, route: null, findings: null, coverage: null },
  status: { next: null, run_dir: null, pass_count: null },
};
const COMMANDS = { prepare, retain, status };

const [command, ...rest] = process.argv.slice(2);
if (!Object.hasOwn(COMMANDS, command)) {
  process.stdout.write(HELP);
  process.exitCode = command === "--help" || command === "-h" ? 0 : 2;
} else {
  let output;
  try {
    const { values } = parseArgs({
      args: rest,
      options: Object.fromEntries(["goal", "base", "standalone", "spec", "accepted-risk", "human-direction", "run-dir", "subagent-tokens"].map((name) => [name, { type: "string" }])),
    });
    output = COMMANDS[command](values);
  } catch (error) {
    if (!(error instanceof Blocker)) process.stderr.write(`${error.stack ?? error}\n`);
    output = { ...FAILURE_SHAPES[command], blocker: `${sentence(error.message)}.` };
  }
  process.stdout.write(`${JSON.stringify(output)}\n`);
  process.exitCode = output.blocker ? 1 : 0;
}
