// Side-effect shell of review-phase: Git, files, run directory and the vendored
// autoreview helper. Every policy decision comes from review-contract.mjs.
// Each subcommand prints exactly one JSON line on stdout; diagnostics go to stderr.
import { execFileSync, spawn } from "node:child_process";
import { createHash, randomBytes } from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { parseArgs } from "node:util";
import {
  deriveReviewRouting,
  planDeliveryReviewGate,
  planEngineOrder,
  recoverPassCount,
  reviewPacketIdentity,
  selectSourceContext,
  validatePassReport,
} from "./review-contract.mjs";

const HELPER = path.join(import.meta.dirname, "vendor/autoreview");
const AXES = ["standards", "spec"];
// Same Pass Report location rule as review-contract.mjs, whose export set is fixed.
const PASS_REPORT_PATH = /^\.devpunks\/delivery\/(?:[^/]+\/)*reviews\//u;
// Upstream statuses that end an Axis Run; every other result falls to the next engine.
const COMPLETED = new Set(["findings", "scoped-clean", "filtered", "incorrect"]);
const DEFAULT_ENGINE_TIMEOUT_SECONDS = 900;
const DEFAULT_MAX_ENGINE_PASSES = 3;

const HELP = `review.mjs — one Full Code Review Pass; each subcommand prints one JSON line.

  status  --goal <delivery-dir>                        next step, run dir and pass count
  prepare --goal <delivery-dir> --base <sha> [--spec <folder>]
          [--accepted-risk <kind>:<evidence>] [--human-direction <evidence>]
  prepare --standalone <commit|base..head> [--spec <folder>]
                                                       freeze the target, size both axes
  run     --run-dir <dir>                              both Axis Runs with Engine Fallback
  retain  --run-dir <dir>                              write and commit the Pass Report

Env: HI_REVIEW_ENGINES, HI_REVIEW_ENGINE_TIMEOUT_SECONDS (default ${DEFAULT_ENGINE_TIMEOUT_SECONDS}),
HI_REVIEW_MAX_ENGINE_PASSES (default ${DEFAULT_MAX_ENGINE_PASSES}), HI_REVIEW_PROMPT_DIR, CODEX_BIN, CLAUDE_BIN.
`;

class Blocker extends Error {}

const sha256 = (text) => createHash("sha256").update(text).digest("hex");
const short = (sha) => sha.slice(0, 12);
const runsRoot = () => path.join(os.tmpdir(), "hi-review");
const sentence = (text) => String(text).replace(/\s+/gu, " ").trim().split(/(?<=\.)\s/u)[0].replace(/\.$/u, "");

const git = (repo, args, env) =>
  execFileSync("git", args, { cwd: repo, encoding: "utf8", env, stdio: ["ignore", "pipe", "pipe"] }).trimEnd();
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

// ---------- Pass Reports of a goal ----------

const passEntries = (repo, goalRel) => {
  const dir = path.join(repo, goalRel, "reviews");
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).map((name) => ({ name, report: readJson(path.join(dir, name)) }));
};

// ---------- target and source context ----------

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

// The upstream helper reviews one commit against its parent. The review commit
// is the head tree with Pass Report paths reset to the base, parented on the
// base, so every target excludes `.devpunks/delivery/**/reviews/` (AC-019).
const reviewCommit = (repo, runDir, { base, head }, excluded) => {
  let tree = git(repo, ["rev-parse", `${head}^{tree}`]);
  if (excluded.length > 0) {
    const env = { ...process.env, GIT_INDEX_FILE: path.join(runDir, "review.index") };
    git(repo, ["read-tree", head], env);
    for (const file of excluded) {
      const entry = git(repo, ["ls-tree", base, "--", file]);
      const [mode, , oid] = entry.split("\t")[0].split(" ");
      git(repo, entry ? ["update-index", "--add", "--cacheinfo", `${mode},${oid},${file}`] : ["update-index", "--force-remove", "--", file], env);
    }
    tree = git(repo, ["write-tree"], env);
    fs.rmSync(env.GIT_INDEX_FILE, { force: true });
  }
  const date = git(repo, ["log", "-1", "--format=%cI", head]);
  const env = { ...process.env, GIT_AUTHOR_DATE: date, GIT_COMMITTER_DATE: date };
  for (const role of ["AUTHOR", "COMMITTER"]) Object.assign(env, { [`GIT_${role}_NAME`]: "hi-review", [`GIT_${role}_EMAIL`]: "hi-review@localhost" });
  const log = git(repo, ["log", "--format=%h %s", `${base}..${head}`]);
  return { tree, commit: git(repo, ["commit-tree", tree, "-p", base, "-m", `Review target ${base}..${head}\n\n${log}`], env) };
};

const tableRows = (markdown) =>
  markdown.split("\n")
    .filter((line) => line.trim().startsWith("|"))
    .map((line) => line.trim().replace(/^\||\|$/gu, "").split("|").map((cell) => cell.trim()))
    .filter((cells) => !cells.every((cell) => /^:?-+:?$/u.test(cell)));
const ticked = (cell) => [...cell.matchAll(/`([^`]+)`/gu)].map((match) => match[1]);
const section = (markdown, heading) => {
  const start = markdown.indexOf(`\n## ${heading}`);
  if (start < 0) return "";
  const end = markdown.indexOf("\n## ", start + 4);
  return markdown.slice(start, end < 0 ? undefined : end);
};

// Rules whose `path trigger` globs match a changed path, from `.agents/rules/index.md`.
const matchRules = (index, changed) => {
  if (!index) return [];
  const [header = [], ...rows] = tableRows(index);
  const columns = header.map((cell) => cell.toLowerCase());
  const trigger = columns.indexOf("path trigger");
  const file = columns.indexOf("file");
  if (trigger < 0 || file < 0) return [];
  return rows
    .filter((row) => ticked(row[trigger] ?? "").some((glob) => changed.some((p) => path.posix.matchesGlob(p, glob))))
    .map((row) => `.agents/rules/${row[file].replaceAll("`", "")}`);
};

const assignedSkillFiles = (plan, files) => {
  const names = new Set((plan ?? "").split("\n").filter((line) => line.includes("**assigned_skills**")).flatMap(ticked));
  return [...names].flatMap((name) => {
    const installed = `.agents/skills/${name}/SKILL.md`;
    const match = files.includes(installed) ? installed : files.find((file) => file.endsWith(`/${name}/SKILL.md`));
    return match ? [match] : [];
  });
};

// Pre-adjudication candidates from the two mechanical checks (AC-005).
const mechanicalCandidates = (folder, { spec, plan, notes }) => {
  if (!notes) return [];
  const notesPath = `${folder}/IMPLEMENTATION-NOTES.md`;
  const candidates = [];
  if (plan) {
    const planned = [];
    let task = null;
    for (const line of plan.split("\n")) {
      task = /^###\s+(T\d+)\b/u.exec(line)?.[1] ?? task;
      const skill = /^\s*-\s+\*\*skill\*\*:\s*`([^`]+)`/u.exec(line)?.[1];
      if (skill) planned.push(`${task} ${skill}`);
    }
    const recorded = tableRows(section(notes, "Skill Application Evidence"))
      .slice(1)
      .map((cells) => `${cells[0]} ${cells[1]?.replaceAll("`", "")}`);
    const count = (key) => recorded.filter((entry) => entry === key).length;
    for (const key of new Set([...planned, ...recorded])) {
      const problem = !planned.includes(key) ? "has a Skill Application Evidence row without a PLAN implementation_skill_guidance entry"
        : count(key) === 0 ? "has no Skill Application Evidence row"
          : count(key) > 1 ? `has ${count(key)} Skill Application Evidence rows instead of one` : null;
      if (problem) candidates.push({ check: "skill_evidence", location: notesPath, claim: `${key} ${problem}` });
    }
  }
  const tableLines = notes.split("\n").filter((line) => line.trim().startsWith("|"));
  for (const id of new Set([...(spec ?? "").matchAll(/^\s*-\s+(AC-\d+):/gmu)].map((match) => match[1]))) {
    if (!tableLines.some((line) => new RegExp(`\\b${id}\\b`, "u").test(line))) {
      candidates.push({ check: "acceptance_record", location: `${folder}/SPEC.md`, claim: `${id} has no Verification or acceptance record in ${notesPath}` });
    }
  }
  return candidates;
};

// ---------- vendored helper ----------

const runHelper = (cwd, args) =>
  new Promise((resolve, reject) => {
    const child = spawn(HELPER, args, { cwd, env: process.env, stdio: ["ignore", "pipe", "pipe"] });
    let stdout = "";
    let stderr = "";
    child.stdout.on("data", (chunk) => { stdout += chunk; });
    child.stderr.on("data", (chunk) => { stderr += chunk; });
    child.on("error", reject);
    child.on("close", (code) => resolve({ code, stdout, stderr }));
  });

const helperArgs = (packet, runDir, axis, engine) => [
  "--mode", "commit", "--commit", packet.review_commit,
  "--engine", engine,
  "--max-priority", "P2",
  "--max-review-passes", String(packet.max_engine_passes),
  // Upstream accepts --prompt-file only inside the reviewed repo; the text is identical.
  "--prompt", fs.readFileSync(path.join(runDir, `axis-${axis}.md`), "utf8"),
  ...packet.source_context[axis].flatMap((file) => ["--source-context", file]),
];

const sizeAxis = async (packet, runDir, axis, engine) => {
  const { stdout } = await runHelper(packet.repo_root, [...helperArgs(packet, runDir, axis, engine), "--dry-run"]);
  const failure = /^(?:inputs|bundle|prompt): FAILED \((.*)\)$/mu.exec(stdout);
  const plan = /^review plan: (\d+) passes; (\d+) total prompt bytes$/mu.exec(stdout);
  if (failure || !plan) {
    throw new Blocker(`The ${axis} Axis Run cannot start: ${sentence(failure?.[1] ?? "the helper dry run printed no review plan")}`);
  }
  return { bytes: Number(plan[2]), passes: Number(plan[1]) };
};

// ---------- prepare ----------

const prepare = async (options) => {
  const repo = repoRoot();
  const mode = options.standalone ? "standalone" : "delivery";
  if (mode === "delivery" && (!options.goal || !options.base)) throw new Blocker("prepare needs --goal <delivery-dir> and --base <sha>, or --standalone <commit|range>");
  const goalRel = mode === "delivery" ? goalPath(repo, options.goal) : null;
  const target = resolveTarget(repo, { mode, base: options.base, standalone: options.standalone });
  const changed = zList(git(repo, ["diff", "--name-only", "--no-renames", "-z", target.base, target.head]));
  const reviewable = changed.filter((file) => !PASS_REPORT_PATH.test(file));
  if (reviewable.length === 0) {
    throw new Blocker(`The target ${target.locator} has no reviewable Git change outside Pass Reports`);
  }

  let ordinal = null;
  if (mode === "delivery") {
    const count = recoverPassCount(passEntries(repo, goalRel));
    const [kind, ...evidence] = (options["accepted-risk"] ?? "").split(":");
    const gate = planDeliveryReviewGate({
      currentState: "review_requested",
      acceptedBoundsValid: true,
      targetSupported: true,
      recoveredReviewCount: count,
      acceptedRiskTrigger: options["accepted-risk"] ? { kind, evidence: evidence.join(":").trim() } : null,
      humanReviewDirection: options["human-direction"] ? { evidence: options["human-direction"], authorized_ordinal: count + 1 } : null,
    });
    if (gate.state === "focused_validation") {
      throw new Blocker(`Pass ${count} is already retained for this goal and a second pass needs an accepted-risk trigger (--accepted-risk <kind>:<evidence>)`);
    }
    if (gate.state === "review_budget_exhausted") {
      throw new Blocker(`The review budget is spent after ${count} passes and a further pass needs explicit human direction (--human-direction <evidence>)`);
    }
    if (gate.state !== "review_due") throw new Blocker(`The pass budget cannot be planned from ${count} recovered Pass Reports`);
    ordinal = count + 1;
  }

  const runId = `${new Date().toISOString().replace(/[-:]/gu, "").replace(/\.\d+Z$/u, "Z")}-${randomBytes(3).toString("hex")}`;
  const runDir = path.join(runsRoot(), runId);
  fs.mkdirSync(runDir, { recursive: true });
  try {
    const promptDir = process.env.HI_REVIEW_PROMPT_DIR ?? path.join(import.meta.dirname, "../references");
    const prompts = Object.fromEntries(AXES.map((axis) => {
      const file = path.join(promptDir, `axis-${axis}.md`);
      if (!fs.existsSync(file)) throw new Blocker(`Axis guidance ${file} is missing`);
      const text = fs.readFileSync(file, "utf8");
      fs.writeFileSync(path.join(runDir, `axis-${axis}.md`), text);
      return [axis, text];
    }));

    const review = reviewCommit(repo, runDir, target, changed.filter((file) => PASS_REPORT_PATH.test(file)));
    const blobs = new Map(zList(git(repo, ["ls-tree", "-r", "-z", review.tree])).map((entry) => {
      const [meta, file] = entry.split("\t");
      return [file, meta.split(" ")[2]];
    }));
    const files = [...blobs.keys()];
    const readAt = (file) => (blobs.has(file) ? git(repo, ["cat-file", "blob", blobs.get(file)]) : null);

    let specFolder = options.spec ? path.relative(repo, path.resolve(options.spec)).split(path.sep).join("/") : null;
    if (!specFolder) {
      const folders = [...new Set(reviewable.map((file) => path.posix.dirname(file)).filter((dir) => blobs.has(`${dir}/SPEC.md`)))];
      if (folders.length > 1) throw new Blocker(`The change touches several spec folders (${folders.join(", ")}); name one with --spec`);
      specFolder = folders[0] ?? goalRel;
    }
    const specFolderFiles = specFolder ? files.filter((file) => path.posix.dirname(file) === specFolder) : [];
    const sources = {
      changedPaths: reviewable,
      agentsFiles: files.filter((file) => path.posix.basename(file) === "AGENTS.md"),
      matchedRules: matchRules(readAt(".agents/rules/index.md"), reviewable).filter((file) => blobs.has(file)),
      assignedSkillFiles: assignedSkillFiles(specFolder && readAt(`${specFolder}/PLAN.md`), files),
      specFolderFiles,
    };
    const sourceContext = Object.fromEntries(AXES.map((axis) => [axis, selectSourceContext({ axis, ...sources })]));
    if (sourceContext.spec.length === 0 && (mode === "delivery" || options.spec)) {
      throw new Blocker(`The Spec axis has no source because ${specFolder ?? "no spec folder"} holds no SPEC.md, ARCHITECTURE.md, PLAN.md or IMPLEMENTATION-NOTES.md at the reviewed head; name the spec folder with --spec`);
    }

    const packet = {
      schema: "review-packet-v1",
      run_id: runId,
      created_at: new Date().toISOString(),
      mode,
      repo_root: repo,
      goal: goalRel,
      locator: target.locator,
      base: target.base,
      head: target.head,
      prepared_head: commitOf(repo, "HEAD"),
      review_commit: review.commit,
      ordinal,
      report_path: mode === "delivery"
        ? `${goalRel}/reviews/pass-${ordinal}.json`
        : `.devpunks/delivery/standalone/reviews/${short(target.base)}-${short(target.head)}-${runId}.json`,
      packet_identity: reviewPacketIdentity({
        review_run_id: runId,
        accepted_bounds_hash: sha256(JSON.stringify({ mode, goal: goalRel, locator: target.locator, base: target.base, head: target.head })),
        snapshot_hash: sha256(`${target.base}\n${review.tree}`),
        source_set_hash: sha256(JSON.stringify({
          context: Object.fromEntries(AXES.map((axis) => [axis, sourceContext[axis].map((file) => `${file} ${blobs.get(file)}`)])),
          prompts: Object.fromEntries(AXES.map((axis) => [axis, sha256(prompts[axis])])),
        })),
      }),
      changed_paths: reviewable,
      spec_folder: specFolder,
      source_context: sourceContext,
      max_engine_passes: Number(process.env.HI_REVIEW_MAX_ENGINE_PASSES ?? DEFAULT_MAX_ENGINE_PASSES),
      candidates: specFolder
        ? mechanicalCandidates(specFolder, {
          spec: readAt(`${specFolder}/SPEC.md`),
          plan: readAt(`${specFolder}/PLAN.md`),
          notes: readAt(`${specFolder}/IMPLEMENTATION-NOTES.md`),
        })
        : [],
    };
    const [engine] = engineOrder();
    const sizes = await Promise.all(AXES.map((axis) => sizeAxis(packet, runDir, axis, engine)));
    packet.axes = Object.fromEntries(AXES.map((axis, index) => [axis, sizes[index]]));
    writeJson(path.join(runDir, "packet.json"), packet);
    // A new delivery pass supersedes older run directories of the same goal.
    if (mode === "delivery") {
      for (const other of goalRuns(repo, goalRel)) if (other.dir !== runDir) fs.rmSync(other.dir, { recursive: true, force: true });
    }
    return { run_id: runId, run_dir: runDir, ordinal, axes: packet.axes, blocker: null };
  } catch (error) {
    fs.rmSync(runDir, { recursive: true, force: true });
    throw error;
  }
};

// ---------- run ----------

const STALE = "HEAD moved since prepare, so this run no longer matches the reviewed change; run prepare again";
const loadRun = (runDir) => {
  const packet = runDir && readJson(path.join(runDir, "packet.json"));
  if (!packet) throw new Blocker(`Run directory ${runDir} holds no packet.json; run prepare`);
  return { packet, stale: commitOf(packet.repo_root, "HEAD") !== packet.prepared_head };
};
const engineOrder = () => {
  try {
    return planEngineOrder(process.env);
  } catch (error) {
    throw new Blocker(error.message);
  }
};
const lensOf = (runDir, packet, axis) => {
  const lens = readJson(path.join(runDir, `${axis}.json`));
  return lens?.packet_identity === packet.packet_identity ? lens : undefined;
};

const runAxis = async (packet, runDir, axis, order, timeout) => {
  const kept = lensOf(runDir, packet, axis);
  if (kept && kept.outcome !== "incomplete") return kept;
  fs.mkdirSync(path.join(runDir, "attempts"), { recursive: true });
  const attempts = [];
  const findings = [];
  let final = null;
  for (const [index, engine] of order.entries()) {
    const stem = path.join(runDir, "attempts", `${axis}-${index + 1}-${engine}`);
    for (const suffix of [".report.json", ".status.json"]) fs.rmSync(stem + suffix, { force: true });
    const started = performance.now();
    const result = await runHelper(packet.repo_root, [
      ...helperArgs(packet, runDir, axis, engine),
      "--engine-timeout-seconds", String(timeout),
      "--json-output", `${stem}.report.json`,
      "--status-output", `${stem}.status.json`,
    ]);
    fs.writeFileSync(`${stem}.log`, `${result.stdout}\n--- stderr\n${result.stderr}`);
    const status = readJson(`${stem}.status.json`);
    const report = readJson(`${stem}.report.json`);
    const outcome = !status ? "refused" : status.timed_out ? "timed_out" : status.status;
    const stderrTail = result.stderr.trim().split("\n").at(-1) ?? "";
    attempts.push({
      engine,
      model: /^model: (.+)$/mu.exec(result.stdout)?.[1] ?? "upstream-default",
      seconds: Math.round((performance.now() - started) / 100) / 10,
      outcome,
      usage: status?.usage ?? null,
      cause: COMPLETED.has(outcome) ? null : sentence(status?.reason ? `${outcome} (${status.reason}, exit ${status.reviewer_exit_code})` : `exit ${result.code}: ${stderrTail}`),
    });
    // An incomplete report keeps its candidates for the Adjudicator.
    if (report) findings.push(...report.findings);
    if (COMPLETED.has(outcome)) {
      final = report;
      break;
    }
    process.stderr.write(`review.mjs: ${axis} on ${engine} ended ${outcome}; trying the next engine\n`);
  }
  const lens = {
    axis,
    packet_identity: packet.packet_identity,
    outcome: !final ? "incomplete" : findings.length > 0 || final.review_status === "incorrect" ? "findings" : "clean",
    engine: final ? attempts.at(-1).engine : null,
    attempts,
    findings,
    priority_filtered_findings: final?.priority_filtered_findings ?? [],
    overall_explanation: final?.overall_explanation ?? null,
  };
  writeJson(path.join(runDir, `${axis}.json`), lens);
  return lens;
};

const run = async ({ "run-dir": runDir }) => {
  const { packet, stale } = loadRun(runDir);
  if (stale) throw new Blocker(STALE);
  const order = engineOrder();
  const timeout = Number(process.env.HI_REVIEW_ENGINE_TIMEOUT_SECONDS ?? DEFAULT_ENGINE_TIMEOUT_SECONDS);
  const lenses = await Promise.all(AXES.map((axis) => runAxis(packet, runDir, axis, order, timeout)));
  const failed = lenses.filter((lens) => lens.outcome === "incomplete");
  const result = Object.fromEntries(lenses.map((lens) => [lens.axis, { outcome: lens.outcome, engine: lens.engine, attempts: lens.attempts.length }]));
  result.blocker = failed.length === 0 ? null
    : `Every engine failed for the ${failed.map((lens) => `${lens.axis} Axis Run (${lens.attempts.map((a) => `${a.engine}: ${a.cause}`).join("; ")})`).join(" and the ")}, so see ${runDir}/attempts and rerun run once an engine is available.`;
  return result;
};

// ---------- retain ----------

const routeOf = (findings) => {
  try {
    const route = deriveReviewRouting(findings);
    return { primary: route.primary, secondary_debt: route.secondary_architecture_follow_up };
  } catch {
    return null; // validatePassReport then names the invalid findings.
  }
};

// Recovery: (1) validate before any write; (2) publish the complete report with
// an exclusive link, so a second writer fails and a crash leaves no partial
// ordinal; (3) commit only that path, which a retry repeats safely; (4) remove
// the run directory last.
const retain = ({ "run-dir": runDir }) => {
  const { packet, stale } = loadRun(runDir);
  const repo = packet.repo_root;
  const reportFile = path.join(repo, packet.report_path);
  let existing = readJson(reportFile);
  if (existing === null) throw new Blocker(`${packet.report_path} exists but is not valid JSON, so this run cannot write pass ${packet.ordinal}`);
  if (!existing) {
    if (stale) throw new Blocker(STALE);
    const lenses = AXES.map((axis) => lensOf(runDir, packet, axis));
    const missing = AXES.filter((axis, index) => !lenses[index] || lenses[index].outcome === "incomplete");
    if (missing.length > 0) throw new Blocker(`The ${missing.join(" and ")} Review Lens Result is missing or incomplete; run run first`);
    const adjudication = readJson(path.join(runDir, "adjudication.json"));
    if (adjudication === undefined) throw new Blocker(`${runDir}/adjudication.json is missing; start the Adjudicator`);
    const report = {
      schema: "pass-report-v1",
      run_id: packet.run_id,
      ordinal: packet.ordinal,
      mode: packet.mode,
      base: packet.base,
      head: packet.head,
      packet_identity: packet.packet_identity,
      axes: Object.fromEntries(lenses.map((lens) => [lens.axis, {
        lens_result: lens.outcome,
        attempts: lens.attempts.map(({ cause, ...attempt }) => attempt),
      }])),
      adjudication,
      route: routeOf(adjudication?.findings),
    };
    const check = validatePassReport(report);
    if (!check.ok) throw new Blocker(`adjudication.json is invalid (${check.errors.join("; ")}); rewrite it and rerun retain`);
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
  return { pass_report: packet.report_path, commit, route: existing.route, blocker: null };
};

// ---------- status ----------

const goalRuns = (repo, goalRel) => {
  if (!fs.existsSync(runsRoot())) return [];
  return fs.readdirSync(runsRoot())
    .map((name) => ({ dir: path.join(runsRoot(), name), packet: readJson(path.join(runsRoot(), name, "packet.json")) }))
    .filter(({ packet }) => packet?.repo_root === repo && packet.goal === goalRel)
    .sort((left, right) => left.packet.created_at.localeCompare(right.packet.created_at));
};

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
  const adjudication = readJson(path.join(dir, "adjudication.json"));
  const next = commitOf(repo, "HEAD") !== packet.prepared_head ? "prepare"
    : AXES.some((axis) => (lensOf(dir, packet, axis)?.outcome ?? "incomplete") === "incomplete") ? "run"
      : Number.isSafeInteger(adjudication?.subagent_tokens) ? "retain" : "adjudicate";
  return { next, run_dir: dir, pass_count: passCount, blocker: null };
};

// ---------- entry point ----------

const FAILURE_SHAPES = {
  prepare: { run_id: null, run_dir: null, ordinal: null, axes: null },
  run: { standards: null, spec: null },
  retain: { pass_report: null, commit: null, route: null },
  status: { next: null, run_dir: null, pass_count: null },
};
const COMMANDS = { prepare, run, retain, status };

const main = async () => {
  const [command, ...rest] = process.argv.slice(2);
  if (!Object.hasOwn(COMMANDS, command)) {
    process.stdout.write(HELP);
    process.exitCode = command === "--help" || command === "-h" ? 0 : 2;
    return;
  }
  let result;
  try {
    const { values } = parseArgs({
      args: rest,
      options: Object.fromEntries(["goal", "base", "standalone", "spec", "accepted-risk", "human-direction", "run-dir"].map((name) => [name, { type: "string" }])),
    });
    result = await COMMANDS[command](values);
  } catch (error) {
    if (!(error instanceof Blocker)) process.stderr.write(`${error.stack ?? error}\n`);
    result = { ...FAILURE_SHAPES[command], blocker: `${sentence(error.message)}.` };
  }
  process.stdout.write(`${JSON.stringify(result)}\n`);
  process.exitCode = result.blocker ? 1 : 0;
};

await main();
