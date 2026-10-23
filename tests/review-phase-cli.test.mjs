import assert from "node:assert/strict";
import { execFileSync, spawnSync } from "node:child_process";
import { chmodSync, existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, statSync, symlinkSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { test } from "node:test";

const root = path.resolve(import.meta.dirname, "..");
const cliPath = path.join(root, "skills/phases/review-phase/scripts/review.mjs");
const fixtures = path.join(root, "tests/fixtures/review-phase-cli");
const engine = (name) => path.join(fixtures, "engines", name);
const GOAL = ".devpunks/delivery/goal-a";

const write = (file, content) => {
  mkdirSync(path.dirname(file), { recursive: true });
  writeFileSync(file, content);
};

// A temp repo with one base commit and one reviewed commit, plus a private TMPDIR.
const fixtureRepo = (t, { extraChange } = {}) => {
  const scratch = mkdtempSync(path.join(tmpdir(), "review-cli-"));
  t.after(() => rmSync(scratch, { recursive: true, force: true }));
  const repo = path.join(scratch, "repo");
  const tmp = path.join(scratch, "tmp");
  mkdirSync(tmp);
  const git = (...args) => execFileSync("git", args, { cwd: repo, encoding: "utf8" }).trim();
  mkdirSync(repo);
  git("init", "-q", "-b", "main");
  git("config", "user.email", "review@example.com");
  git("config", "user.name", "Review Fixture");
  write(path.join(repo, "AGENTS.md"), "# Root guidance\n");
  write(path.join(repo, "src/AGENTS.md"), "# Source guidance\n");
  write(path.join(repo, "docs/AGENTS.md"), "# Docs guidance\n");
  write(path.join(repo, "src/app.mjs"), "export const limit = 1;\n");
  write(path.join(repo, ".agents/rules/index.md"), [
    "# Codebase Rule Registry",
    "",
    "| id | scope | path trigger | task trigger | tags | file |",
    "| --- | --- | --- | --- | --- | --- |",
    "| `R-SRC-001` | src | `src/**` | source changes | src | `src/source-rule.md` |",
    "| `R-WEB-001` | web | `web/**`, `*.css` | web changes | web | `web/web-rule.md` |",
    "",
  ].join("\n"));
  write(path.join(repo, ".agents/rules/src/source-rule.md"), "# Source rule\n");
  write(path.join(repo, ".agents/rules/web/web-rule.md"), "# Web rule\n");
  write(path.join(repo, ".agents/skills/tdd/SKILL.md"), "# tdd\n");
  write(path.join(repo, "specs/feature/SPEC.md"), "# Spec\n\n- AC-001: limit is two.\n- AC-002: limit is documented.\n");
  write(path.join(repo, "specs/feature/PLAN.md"), [
    "# Plan",
    "",
    "### T1: Raise the limit",
    "",
    "- **assigned_skills**: [`tdd`]",
    "- **implementation_skill_guidance**:",
    "  - **skill**: `tdd`",
    "    **applicable_behavior**: RED first.",
    "",
  ].join("\n"));
  git("add", ".");
  git("commit", "-qm", "base");
  const base = git("rev-parse", "HEAD");
  write(path.join(repo, "src/app.mjs"), "export const limit = 2;\n");
  write(path.join(repo, "specs/feature/IMPLEMENTATION-NOTES.md"), [
    "# Implementation Notes",
    "",
    "## Acceptance Criteria Status",
    "",
    "| Criterion | Status | Notes |",
    "|---|---|---|",
    "| AC-001 | met | tests |",
    "",
  ].join("\n"));
  extraChange?.(repo);
  git("add", ".");
  git("commit", "-qm", "raise limit");
  return { repo, tmp, base, git, goal: path.join(repo, GOAL) };
};

const baseEnv = () => {
  const env = { ...process.env };
  for (const key of Object.keys(env)) {
    if (key === "CLAUDECODE" || key === "CODEX_THREAD_ID" || key.startsWith("HI_REVIEW_") ||
        key === "CODEX_BIN" || key === "CLAUDE_BIN") delete env[key];
  }
  return env;
};

// Runs review.mjs and returns its single JSON line.
const cli = (fx, args, env = {}) => {
  const result = spawnSync(process.execPath, [cliPath, ...args], {
    cwd: fx.repo,
    encoding: "utf8",
    env: { ...baseEnv(), TMPDIR: fx.tmp, HI_REVIEW_PROMPT_DIR: path.join(fixtures, "prompts"), ...env },
  });
  const lines = result.stdout.split("\n").filter(Boolean);
  assert.equal(lines.length, 1, `exactly one stdout line expected:\n${result.stdout}\n--- stderr\n${result.stderr}`);
  return { code: result.status, out: JSON.parse(lines[0]), stderr: result.stderr };
};

const engines = (claude, codex, extra = {}) => ({ CLAUDE_BIN: engine(claude), CODEX_BIN: engine(codex), ...extra });

const prepare = (fx, extraArgs = [], env = {}) => cli(fx, ["prepare", "--goal", GOAL, "--base", fx.base, ...extraArgs], env);

test("Engine Fallback: a failing Claude engine falls to Codex for each axis", (t) => {
  const fx = fixtureRepo(t);
  const prepared = prepare(fx);
  assert.equal(prepared.out.blocker, null, prepared.stderr);
  const run = cli(fx, ["run", "--run-dir", prepared.out.run_dir], engines("claude-fail", "codex-clean", { CLAUDECODE: "1" }));
  assert.deepEqual(run.out, {
    standards: { outcome: "clean", engine: "codex", attempts: 2 },
    spec: { outcome: "clean", engine: "codex", attempts: 2 },
    blocker: null,
  });
  assert.equal(run.code, 0);
});

// Prepares and runs a pass with one engine, returning the run directory.
const reviewedRun = (fx, codex = "codex-clean") => {
  const prepared = prepare(fx);
  assert.equal(prepared.out.blocker, null, prepared.stderr);
  const run = cli(fx, ["run", "--run-dir", prepared.out.run_dir], engines("claude-fail", codex, { HI_REVIEW_ENGINES: "codex" }));
  assert.equal(run.out.blocker, null, run.stderr);
  return prepared.out.run_dir;
};
const adjudicate = (runDir, adjudication) =>
  writeFileSync(path.join(runDir, "adjudication.json"), JSON.stringify(adjudication));
const readReport = (fx, rel) => JSON.parse(readFileSync(path.join(fx.repo, rel), "utf8"));

test("an engine timeout falls to the next engine", (t) => {
  const fx = fixtureRepo(t);
  const prepared = prepare(fx);
  const run = cli(fx, ["run", "--run-dir", prepared.out.run_dir], engines("claude-clean", "codex-sleep", {
    HI_REVIEW_ENGINES: "codex,claude",
    HI_REVIEW_ENGINE_TIMEOUT_SECONDS: "1",
  }));
  assert.deepEqual(run.out.standards, { outcome: "clean", engine: "claude", attempts: 2 });
  const lens = JSON.parse(readFileSync(path.join(prepared.out.run_dir, "standards.json"), "utf8"));
  assert.deepEqual(lens.attempts.map(({ engine, outcome }) => [engine, outcome]), [["codex", "timed_out"], ["claude", "scoped-clean"]]);
  assert.equal(lens.attempts[1].usage, null, "Claude reports no usage");
});

test("an incomplete upstream review falls to the next engine", (t) => {
  const fx = fixtureRepo(t);
  const prepared = prepare(fx);
  const run = cli(fx, ["run", "--run-dir", prepared.out.run_dir], engines("claude-clean", "codex-partial", { HI_REVIEW_ENGINES: "codex,claude" }));
  assert.deepEqual(run.out.spec, { outcome: "clean", engine: "claude", attempts: 2 });
  const lens = JSON.parse(readFileSync(path.join(prepared.out.run_dir, "spec.json"), "utf8"));
  assert.deepEqual(lens.attempts.map(({ outcome }) => outcome), ["incomplete", "scoped-clean"]);
});

test("when every engine fails each axis is incomplete with every cause and run prints a blocker", (t) => {
  const fx = fixtureRepo(t);
  const prepared = prepare(fx);
  const run = cli(fx, ["run", "--run-dir", prepared.out.run_dir], engines("claude-fail", "codex-fail"));
  assert.equal(run.code, 1);
  assert.deepEqual(run.out.standards, { outcome: "incomplete", engine: null, attempts: 2 });
  assert.match(run.out.blocker, /^Every engine failed for the standards Axis Run \(codex: .*claude: .*\) and the spec Axis Run/u);
  assert.equal(run.out.blocker.split(". ").length, 1, "the blocker is one sentence");
  const lens = JSON.parse(readFileSync(path.join(prepared.out.run_dir, "spec.json"), "utf8"));
  assert.ok(lens.attempts.every(({ cause }) => cause.includes("reviewer_unavailable")), JSON.stringify(lens.attempts));
  const status = cli(fx, ["status", "--goal", GOAL]);
  assert.deepEqual(status.out, { next: "run", run_dir: prepared.out.run_dir, pass_count: 0, blocker: null });
});

test("resume keeps a completed Review Lens Result and reruns only the failed axis", (t) => {
  const fx = fixtureRepo(t);
  const prepared = prepare(fx);
  const runDir = prepared.out.run_dir;
  const first = cli(fx, ["run", "--run-dir", runDir], engines("claude-fail", "codex-fail-spec", { HI_REVIEW_ENGINES: "codex" }));
  assert.equal(first.out.standards.outcome, "clean");
  assert.equal(first.out.spec.outcome, "incomplete");
  const kept = readFileSync(path.join(runDir, "standards.json"), "utf8");
  // This engine now fails the standards axis, so a rerun of that axis would be visible.
  const second = cli(fx, ["run", "--run-dir", runDir], engines("claude-fail", "codex-fail-standards", { HI_REVIEW_ENGINES: "codex" }));
  assert.deepEqual(second.out, {
    standards: { outcome: "clean", engine: "codex", attempts: 1 },
    spec: { outcome: "clean", engine: "codex", attempts: 1 },
    blocker: null,
  });
  assert.equal(readFileSync(path.join(runDir, "standards.json"), "utf8"), kept);
  assert.equal(cli(fx, ["status", "--goal", GOAL]).out.next, "adjudicate");
});

test("prepare freezes the packet, source context and mechanical-check candidates", (t) => {
  const fx = fixtureRepo(t);
  const prepared = prepare(fx);
  assert.equal(prepared.out.ordinal, 1);
  for (const axis of ["standards", "spec"]) {
    assert.ok(prepared.out.axes[axis].bytes > 0 && prepared.out.axes[axis].passes === 1, JSON.stringify(prepared.out.axes));
  }
  assert.ok(prepared.out.run_dir.startsWith(path.join(fx.tmp, "hi-review")));
  const packet = JSON.parse(readFileSync(path.join(prepared.out.run_dir, "packet.json"), "utf8"));
  assert.deepEqual(packet.source_context, {
    standards: [".agents/rules/src/source-rule.md", ".agents/skills/tdd/SKILL.md", "AGENTS.md", "src/AGENTS.md"],
    spec: ["specs/feature/IMPLEMENTATION-NOTES.md", "specs/feature/PLAN.md", "specs/feature/SPEC.md"],
  });
  assert.match(packet.packet_identity, /^[0-9a-f]{64}$/u);
  assert.deepEqual(packet.candidates.map(({ check, claim }) => `${check}: ${claim}`), [
    "skill_evidence: T1 tdd has no Skill Application Evidence row",
    "acceptance_record: AC-002 has no Verification or acceptance record in specs/feature/IMPLEMENTATION-NOTES.md",
  ]);
});

test("a symlinked AGENTS.md enters the source context as its in-repo target, once", (t) => {
  const fx = fixtureRepo(t, {
    extraChange: (repo) => {
      write(path.join(repo, "lib/util.mjs"), "export const util = 1;\n");
      symlinkSync("../AGENTS.md", path.join(repo, "lib/AGENTS.md"));
      write(path.join(repo, "tools/run.mjs"), "export const run = 1;\n");
      symlinkSync("../../outside/AGENTS.md", path.join(repo, "tools/AGENTS.md"));
    },
  });
  const prepared = prepare(fx);
  assert.equal(prepared.out.blocker, null, prepared.stderr);
  const packet = JSON.parse(readFileSync(path.join(prepared.out.run_dir, "packet.json"), "utf8"));
  assert.deepEqual(packet.source_context.standards, [".agents/rules/src/source-rule.md", ".agents/skills/tdd/SKILL.md", "AGENTS.md", "src/AGENTS.md"]);
});

test("retain writes and commits the Pass Report, routes it and status reports done", (t) => {
  const fx = fixtureRepo(t);
  const runDir = reviewedRun(fx, "codex-findings");
  assert.equal(cli(fx, ["status", "--goal", GOAL]).out.next, "adjudicate");
  const finding = (id, return_route) => ({
    id, axis: "standards", severity: "high", location: "src/app.mjs:1",
    evidence: "limit is unchecked (standards.findings[0])", action: "check the limit", return_route,
  });
  const verdict = {
    findings: [finding("f001", "implementation"), finding("f002", "debt_follow_up")],
    rejected: [{ candidate_ref: "spec.findings[0]", reason: "same claim as f001" }],
  };

  adjudicate(runDir, verdict);
  assert.equal(cli(fx, ["status", "--goal", GOAL]).out.next, "retain", "the Adjudicator wrote its verdict");
  const refused = cli(fx, ["retain", "--run-dir", runDir]);
  assert.equal(refused.code, 1);
  assert.match(refused.out.blocker, /--subagent-tokens/u);
  for (const invalid of ["-1", "12.5", "many", ""]) {
    assert.match(cli(fx, ["retain", "--run-dir", runDir, `--subagent-tokens=${invalid}`]).out.blocker, /--subagent-tokens must be a non-negative integer/u, invalid);
  }
  adjudicate(runDir, { ...verdict, findings: [finding("f001", "closeout")] });
  assert.match(cli(fx, ["retain", "--run-dir", runDir, "--subagent-tokens", "1234"]).out.blocker, /return_route/u);
  assert.equal(existsSync(path.join(fx.goal, "reviews")), false, "a refused retain writes nothing");

  adjudicate(runDir, verdict);
  const retained = cli(fx, ["retain", "--run-dir", runDir, "--subagent-tokens", "1234"]);
  assert.deepEqual(retained.out, {
    pass_report: `${GOAL}/reviews/pass-1.json`,
    run_id: path.basename(runDir),
    commit: fx.git("rev-parse", "HEAD"),
    route: { primary: "implementation", secondary_debt: true },
    findings: [
      { id: "f001", axis: "standards", severity: "high", location: "src/app.mjs:1", return_route: "implementation" },
      { id: "f002", axis: "standards", severity: "high", location: "src/app.mjs:1", return_route: "debt_follow_up" },
    ],
    rejected_count: 1,
    blocker: null,
  });
  assert.equal(fx.git("show", "--name-only", "--format=", "HEAD"), `${GOAL}/reviews/pass-1.json`);
  assert.equal(existsSync(runDir), false, "retain removes the run directory");
  const report = readReport(fx, retained.out.pass_report);
  assert.equal(report.adjudication.subagent_tokens, 1234);
  assert.deepEqual(Object.keys(report.axes.spec.attempts[0]), ["engine", "model", "seconds", "outcome", "usage"]);
  assert.equal(report.axes.spec.attempts[0].usage.tokens.input_tokens, 1200);
  assert.deepEqual(cli(fx, ["status", "--goal", GOAL]).out, { next: "done", run_dir: null, pass_count: 1, blocker: null });

  // A second pass needs an accepted-risk trigger, and its target excludes the Pass Report.
  write(path.join(fx.repo, "src/app.mjs"), "export const limit = 3;\n");
  fx.git("commit", "-qam", "repair");
  assert.equal(cli(fx, ["status", "--goal", GOAL]).out.next, "prepare");
  assert.match(prepare(fx).out.blocker, /accepted-risk/u);
  const second = prepare(fx, ["--accepted-risk", "security:repair touched the limit guard"]);
  assert.equal(second.out.ordinal, 2, second.out.blocker);
  const packet = JSON.parse(readFileSync(path.join(second.out.run_dir, "packet.json"), "utf8"));
  assert.ok(!packet.changed_paths.some((file) => file.includes("/reviews/")), packet.changed_paths.join(", "));
  assert.ok(!fx.git("show", "--name-only", "--format=", packet.review_commit).includes("reviews/"));
});

test("large engine usage never fails a pass and stays in the Pass Report", (t) => {
  const fx = fixtureRepo(t);
  const runDir = reviewedRun(fx, "codex-heavy");
  adjudicate(runDir, { findings: [], rejected: [], subagent_tokens: 9_000_000 });
  const retained = cli(fx, ["retain", "--run-dir", runDir]);
  assert.deepEqual(retained.out.route, { primary: "closeout", secondary_debt: false });
  const report = readReport(fx, retained.out.pass_report);
  assert.equal(report.axes.standards.attempts[0].usage.tokens.input_tokens, 40_000_000);
});

test("the Pass Report ordinal is created exclusively and a retry reports the existing report", (t) => {
  const fx = fixtureRepo(t);
  const runDir = reviewedRun(fx);
  adjudicate(runDir, { findings: [], rejected: [], subagent_tokens: 1 });
  const target = path.join(fx.goal, "reviews/pass-1.json");
  const foreign = JSON.stringify({ run_id: "another-run" });
  write(target, foreign);
  const refused = cli(fx, ["retain", "--run-dir", runDir]);
  assert.match(refused.out.blocker, /already exists from run another-run/u);
  assert.equal(readFileSync(target, "utf8"), foreign, "the second writer does not overwrite");

  rmSync(target);
  const backup = `${runDir}.bak`;
  execFileSync("cp", ["-r", runDir, backup]);
  // A failing hook stops the commit after the create; retain repairs it on retry.
  write(path.join(fx.repo, ".git/hooks/pre-commit"), "#!/bin/sh\nexit 1\n");
  execFileSync("chmod", ["+x", path.join(fx.repo, ".git/hooks/pre-commit")]);
  assert.match(cli(fx, ["retain", "--run-dir", runDir]).out.blocker, /git commit .* failed/u);
  assert.ok(existsSync(target));
  rmSync(path.join(fx.repo, ".git/hooks/pre-commit"));
  const first = cli(fx, ["retain", "--run-dir", runDir]);
  assert.equal(first.out.pass_report, `${GOAL}/reviews/pass-1.json`, first.out.blocker);
  // Simulate a crash before the run directory removal: a retry reports the same report.
  execFileSync("mv", [backup, runDir]);
  const retry = cli(fx, ["retain", "--run-dir", runDir]);
  assert.deepEqual(retry.out, first.out);
  assert.equal(fx.git("rev-list", "--count", "HEAD"), "3");
  assert.deepEqual(readdirSync(path.join(fx.goal, "reviews")), ["pass-1.json"]);
});

test("run directories are private and the shared root is sticky", (t) => {
  const fx = fixtureRepo(t);
  const runDir = prepare(fx).out.run_dir;
  assert.equal(statSync(path.dirname(runDir)).mode & 0o7777, 0o1777);
  assert.equal(statSync(runDir).mode & 0o777, 0o700);
});

test("a run directory that others can write is refused by run and retain and ignored by status", (t) => {
  const fx = fixtureRepo(t);
  const runDir = reviewedRun(fx);
  adjudicate(runDir, { findings: [], rejected: [] });
  chmodSync(runDir, 0o770);
  const trust = /is not a private run directory of this user/u;
  assert.match(cli(fx, ["run", "--run-dir", runDir]).out.blocker, trust);
  assert.match(cli(fx, ["retain", "--run-dir", runDir, "--subagent-tokens", "1"]).out.blocker, trust);
  assert.equal(cli(fx, ["status", "--goal", GOAL]).out.run_dir, null);
  assert.equal(existsSync(path.join(fx.goal, "reviews")), false);
});

test("status skips stray entries in the shared run root", (t) => {
  const fx = fixtureRepo(t);
  write(path.join(fx.tmp, "hi-review/stray"), "not a run\n");
  mkdirSync(path.join(fx.tmp, "hi-review/empty"));
  assert.deepEqual(cli(fx, ["status", "--goal", GOAL]).out, { next: "prepare", run_dir: null, pass_count: 0, blocker: null });
});

test("retain refuses a packet whose Pass Report path or repository differs from the derived one", (t) => {
  const fx = fixtureRepo(t);
  const runDir = reviewedRun(fx);
  adjudicate(runDir, { findings: [], rejected: [] });
  const packetFile = path.join(runDir, "packet.json");
  const packet = JSON.parse(readFileSync(packetFile, "utf8"));
  for (const tampered of [{ report_path: "src/app.mjs" }, { report_path: `${GOAL}/reviews/pass-9.json` }, { repo_root: fx.tmp }]) {
    writeFileSync(packetFile, JSON.stringify({ ...packet, ...tampered }));
    assert.match(cli(fx, ["retain", "--run-dir", runDir, "--subagent-tokens", "1"]).out.blocker, /does not match/u, JSON.stringify(tampered));
  }
  assert.equal(readFileSync(path.join(fx.repo, "src/app.mjs"), "utf8"), "export const limit = 2;\n");
  assert.equal(fx.git("rev-list", "--count", "HEAD"), "2");
});

test("an oversized review plan blocks prepare before any engine starts", (t) => {
  const fx = fixtureRepo(t, {
    extraChange: (repo) => write(path.join(repo, "src/table.mjs"), `export const rows = [\n${"  \"row of reviewed data\",\n".repeat(30_000)}];\n`),
  });
  const prepared = prepare(fx, [], { HI_REVIEW_MAX_ENGINE_PASSES: "1" });
  assert.equal(prepared.code, 1);
  assert.match(prepared.out.blocker, /^The (standards|spec) Axis Run cannot start: planned review has \d+ passes; --max-review-passes allows 1\.$/u);
  assert.equal(prepared.out.run_dir, null);
  assert.deepEqual(readdirSync(path.join(fx.tmp, "hi-review")), [], "a blocked prepare leaves no run directory");
});

test("standalone review takes a commit or range, refuses other targets and keeps no counter", (t) => {
  const fx = fixtureRepo(t);
  const standalone = (locator) => cli(fx, ["prepare", "--standalone", locator]);
  for (const target of ["specs/feature/SPEC.md", `${fx.base}..${fx.base}`, "no-such-ref"]) {
    assert.match(standalone(target).out.blocker, /is not a Git commit or commit range|no reviewable Git change/u, target);
  }
  const prepared = standalone("HEAD");
  assert.equal(prepared.out.blocker, null, prepared.stderr);
  assert.equal(prepared.out.ordinal, null);
  cli(fx, ["run", "--run-dir", prepared.out.run_dir], engines("claude-clean", "codex-clean", { HI_REVIEW_ENGINES: "claude" }));
  adjudicate(prepared.out.run_dir, { findings: [], rejected: [], subagent_tokens: 10 });
  const retained = cli(fx, ["retain", "--run-dir", prepared.out.run_dir]);
  assert.match(retained.out.pass_report, /^\.devpunks\/delivery\/standalone\/reviews\/[0-9a-f]{12}-[0-9a-f]{12}-.+\.json$/u);
  assert.equal(readReport(fx, retained.out.pass_report).ordinal, null);
  assert.equal(cli(fx, ["status", "--goal", GOAL]).out.pass_count, 0);
});

test("status ignores legacy Markdown review reports for the pass count", (t) => {
  const fx = fixtureRepo(t);
  write(path.join(fx.goal, "reviews/review-0a1b2c-20261001T101500Z-0123456789ab-review-report.md"), "---\ntitle: review\n---\n");
  write(path.join(fx.repo, "apps/wiki/content/docs/project/reviews/review-0a1b-review-report.md"), "# old report\n");
  assert.deepEqual(cli(fx, ["status", "--goal", GOAL]).out, { next: "prepare", run_dir: null, pass_count: 0, blocker: null });
});

test("every subcommand prints one JSON line with a blocker on bad input", (t) => {
  const fx = fixtureRepo(t);
  assert.match(cli(fx, ["prepare", "--goal", "docs", "--base", fx.base]).out.blocker, /under \.devpunks\/delivery/u);
  assert.match(cli(fx, ["run", "--run-dir", path.join(fx.tmp, "missing")]).out.blocker, /no packet\.json/u);
  assert.match(cli(fx, ["status"]).out.blocker, /--goal/u);
  const help = spawnSync(process.execPath, [cliPath, "--help"], { encoding: "utf8" });
  for (const command of ["status", "prepare", "run", "retain"]) assert.match(help.stdout, new RegExp(`^  ${command} `, "mu"));
});
