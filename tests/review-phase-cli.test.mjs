import assert from "node:assert/strict";
import { execFileSync, spawnSync } from "node:child_process";
import { chmodSync, cpSync, existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, renameSync, rmSync, statSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { test } from "node:test";

const root = path.resolve(import.meta.dirname, "..");
const cliPath = path.join(root, "skills/phases/review-phase/scripts/review.mjs");
const GOAL = ".devpunks/delivery/goal-a";

const write = (file, content) => {
  mkdirSync(path.dirname(file), { recursive: true });
  writeFileSync(file, content);
};

// A temp repo with one base commit and one reviewed commit, plus a private TMPDIR
// that holds the hi-review run root, removed after the test.
const fixtureRepo = (t) => {
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
    "| id | scope | path trigger | task trigger | tags | file |",
    "| --- | --- | --- | --- | --- | --- |",
    "| `R-SRC-001` | src | `src/**` | source changes | src | `src/source-rule.md` |",
    "| `R-WEB-001` | web | `web/**`, `*.css` | web changes | web | `web/web-rule.md` |",
    "",
  ].join("\n"));
  write(path.join(repo, ".agents/rules/src/source-rule.md"), "# Source rule\n");
  write(path.join(repo, ".agents/rules/web/web-rule.md"), "# Web rule\n");
  write(path.join(repo, "specs/feature/SPEC.md"), "# Spec\n\n- AC-001: limit is two.\n");
  write(path.join(repo, "specs/feature/PLAN.md"), "# Plan\n");
  git("add", ".");
  git("commit", "-qm", "base");
  const base = git("rev-parse", "HEAD");
  write(path.join(repo, "src/app.mjs"), "export const limit = 2;\n");
  write(path.join(repo, "specs/feature/IMPLEMENTATION-NOTES.md"), "# Implementation Notes\n");
  git("add", ".");
  git("commit", "-qm", "raise limit");
  const commit = (file, content, message) => {
    write(path.join(repo, file), content);
    git("add", ".");
    git("commit", "-qm", message);
    return git("rev-parse", "HEAD");
  };
  return { repo, tmp, base, git, commit, goal: path.join(repo, GOAL) };
};

// Runs review.mjs and returns its single JSON line.
const cli = (fx, args) => {
  const result = spawnSync(process.execPath, [cliPath, ...args], { cwd: fx.repo, encoding: "utf8", env: { ...process.env, TMPDIR: fx.tmp } });
  const lines = result.stdout.split("\n").filter(Boolean);
  assert.equal(lines.length, 1, `exactly one stdout line expected:\n${result.stdout}\n--- stderr\n${result.stderr}`);
  return { code: result.status, out: JSON.parse(lines[0]), stderr: result.stderr };
};
const prepare = (fx, extraArgs = []) => cli(fx, ["prepare", "--goal", GOAL, "--base", fx.base, ...extraArgs]);
const status = (fx) => cli(fx, ["status", "--goal", GOAL]).out;
const retain = (fx, runDir, tokens = "1") => cli(fx, ["retain", "--run-dir", runDir, "--subagent-tokens", tokens]);
const prepared = (fx) => {
  const result = prepare(fx);
  assert.equal(result.out.blocker, null, result.stderr);
  return result.out.run_dir;
};
const review = (runDir, findings) => writeFileSync(path.join(runDir, "findings.json"), JSON.stringify({ findings }));
const readJson = (file) => JSON.parse(readFileSync(file, "utf8"));
const finding = (id, return_route, kind = "contract") => ({
  id, priority: "P1", kind, location: "src/app.mjs:1",
  failure_scenario: "a caller still passing limit 1 gets a second row it cannot render", action: "update the caller", return_route,
});

test("prepare writes a private Review Packet with the changed paths and context", (t) => {
  const fx = fixtureRepo(t);
  const result = prepare(fx);
  assert.deepEqual(Object.keys(result.out), ["run_id", "run_dir", "ordinal", "blocker"]);
  assert.equal(result.out.ordinal, 1);
  const runDir = result.out.run_dir;
  assert.equal(path.dirname(runDir), path.join(fx.tmp, "hi-review"));
  assert.equal(statSync(path.dirname(runDir)).mode & 0o7777, 0o1777, "the shared root is sticky");
  assert.equal(statSync(runDir).mode & 0o777, 0o700, "the run directory is private");
  const packet = readJson(path.join(runDir, "packet.json"));
  const head = fx.git("rev-parse", "HEAD");
  assert.deepEqual(packet, {
    schema: "review-packet-v3",
    run_id: result.out.run_id,
    created_at: packet.created_at,
    mode: "delivery",
    repo_root: fx.repo,
    goal: GOAL,
    base: fx.base,
    head,
    prepared_head: head,
    ordinal: 1,
    report_path: `${GOAL}/reviews/pass-1.json`,
    changed_paths: ["specs/feature/IMPLEMENTATION-NOTES.md", "src/app.mjs"],
    context: [".agents/rules/src/source-rule.md", "AGENTS.md", "specs/feature/PLAN.md", "specs/feature/SPEC.md", "src/AGENTS.md"],
    coverage: { scope: "full", left_out: [] },
  });
  assert.deepEqual(status(fx), { next: "review", run_dir: runDir, pass_count: 0, blocker: null });
});

test("delivery prepare blocks without a spec source and on several spec folders", (t) => {
  const fx = fixtureRepo(t);
  const base = fx.git("rev-parse", "HEAD");
  fx.commit("src/app.mjs", "export const limit = 3;\n", "src only");
  assert.match(prepare({ ...fx, base }).out.blocker, /no spec source because \.devpunks\/delivery\/goal-a holds no SPEC\.md/u);
  assert.equal(prepare({ ...fx, base }, ["--spec", "specs/feature"]).out.blocker, null);
  assert.match(prepare(fx, ["--spec", "docs"]).out.blocker, /no spec source because docs/u);
  fx.commit("specs/other/SPEC.md", "# Other\n", "second spec");
  assert.match(prepare(fx).out.blocker, /several spec folders \(specs\/feature, specs\/other\)/u);
});

test("retain validates findings.json, commits only the Pass Report and routes it", (t) => {
  const fx = fixtureRepo(t);
  const runDir = prepared(fx);
  const reviewsDir = path.join(fx.goal, "reviews");

  assert.match(retain(fx, runDir).out.blocker, /findings\.json is missing/u);
  review(runDir, [finding("f001", "implementation"), finding("f002", "debt_follow_up", "smell")]);
  assert.deepEqual(status(fx), { next: "retain", run_dir: runDir, pass_count: 0, blocker: null });
  assert.match(cli(fx, ["retain", "--run-dir", runDir]).out.blocker, /--subagent-tokens/u);
  for (const invalid of ["-1", "12.5", "many", ""]) {
    assert.match(retain(fx, runDir, invalid).out.blocker, /--subagent-tokens/u, invalid);
  }
  const six = ["f001", "f002", "f003", "f004", "f005", "f006"].map((id) => finding(id, "implementation"));
  review(runDir, six);
  assert.match(retain(fx, runDir).out.blocker, /at most 5/u);
  review(runDir, [{ ...finding("f001", "implementation"), priority: "P3" }]);
  assert.match(retain(fx, runDir).out.blocker, /^findings\.json is invalid \(findings\[0\]\.priority/u);
  writeFileSync(path.join(runDir, "findings.json"), "{ not json");
  assert.match(retain(fx, runDir).out.blocker, /findings\.json is invalid/u);
  assert.equal(existsSync(reviewsDir), false, "a refused retain writes nothing");

  review(runDir, [finding("f001", "implementation"), finding("f002", "debt_follow_up", "smell")]);
  const retained = retain(fx, runDir, "1234");
  assert.deepEqual(retained.out, {
    pass_report: `${GOAL}/reviews/pass-1.json`,
    run_id: path.basename(runDir),
    commit: fx.git("rev-parse", "HEAD"),
    route: { primary: "implementation", secondary_debt: true },
    findings: [
      { id: "f001", priority: "P1", kind: "contract", location: "src/app.mjs:1", return_route: "implementation" },
      { id: "f002", priority: "P1", kind: "smell", location: "src/app.mjs:1", return_route: "debt_follow_up" },
    ],
    coverage: { scope: "full", left_out: [] },
    blocker: null,
  });
  assert.equal(fx.git("show", "--name-only", "--format=", "HEAD"), `${GOAL}/reviews/pass-1.json`);
  assert.equal(existsSync(runDir), false, "retain removes the run directory");
  const report = readJson(path.join(fx.repo, retained.out.pass_report));
  assert.equal(report.schema, "pass-report-v2");
  assert.deepEqual(report.reviewer, { subagent_tokens: 1234 });
  assert.equal(report.findings[0].failure_scenario, finding("f001").failure_scenario);
  assert.deepEqual(status(fx), { next: "done", run_dir: null, pass_count: 1, blocker: null });

  // A second pass needs an accepted-risk trigger, and its target excludes the Pass Report.
  fx.commit("src/app.mjs", "export const limit = 3;\n", "repair");
  assert.equal(status(fx).next, "prepare");
  assert.match(prepare(fx).out.blocker, /accepted-risk/u);
  const second = prepare(fx, ["--accepted-risk", "security:repair touched the limit guard"]);
  assert.equal(second.out.ordinal, 2, second.out.blocker);
  const packet = readJson(path.join(second.out.run_dir, "packet.json"));
  assert.ok(!packet.changed_paths.some((file) => file.includes("/reviews/")), packet.changed_paths.join(", "));
});

test("a clean pass routes to closeout and further passes need human direction", (t) => {
  const fx = fixtureRepo(t);
  for (const options of [[], ["--accepted-risk", "public_contract:repair changed the export schema"]]) {
    const result = prepare(fx, options);
    assert.equal(result.out.blocker, null, result.stderr);
    review(result.out.run_dir, []);
    assert.deepEqual(retain(fx, result.out.run_dir).out.route, { primary: "closeout", secondary_debt: false });
  }
  assert.match(prepare(fx, ["--accepted-risk", "security:again"]).out.blocker, /review budget is spent after 2 passes/u);
  assert.equal(prepare(fx, ["--human-direction", "user message 2026-11-04"]).out.ordinal, 3);
});

test("HEAD moving after prepare makes the run stale", (t) => {
  const fx = fixtureRepo(t);
  const runDir = prepared(fx);
  review(runDir, []);
  fx.commit("src/app.mjs", "export const limit = 4;\n", "moved");
  assert.equal(status(fx).next, "prepare");
  assert.match(retain(fx, runDir).out.blocker, /HEAD moved since prepare/u);
  assert.equal(existsSync(path.join(fx.goal, "reviews")), false);
  const fresh = prepared(fx);
  assert.equal(existsSync(runDir), false, "a new delivery pass removes the older run directory");
  assert.equal(status(fx).run_dir, fresh);
});

test("a run directory from the older review-phase sends the pass back to prepare", (t) => {
  const fx = fixtureRepo(t);
  const runDir = prepared(fx);
  const packetFile = path.join(runDir, "packet.json");
  writeFileSync(packetFile, JSON.stringify({ ...readJson(packetFile), schema: "review-packet-v1" }));
  assert.equal(status(fx).next, "prepare");
  assert.match(retain(fx, runDir).out.blocker, /older review-phase; run prepare/u);
  prepared(fx);
  assert.equal(existsSync(runDir), false, "prepare removes the older run directory");
});

test("the Pass Report ordinal is created exclusively and a retry reports the existing report", (t) => {
  const fx = fixtureRepo(t);
  const runDir = prepared(fx);
  review(runDir, []);
  const target = path.join(fx.goal, "reviews/pass-1.json");
  const foreign = JSON.stringify({ run_id: "another-run" });
  write(target, foreign);
  assert.match(retain(fx, runDir).out.blocker, /already exists from run another-run/u);
  assert.equal(readFileSync(target, "utf8"), foreign, "the second writer does not overwrite");

  rmSync(target);
  const backup = `${runDir}.bak`;
  cpSync(runDir, backup, { recursive: true });
  chmodSync(backup, 0o700);
  // A failing hook stops the commit after the create; retain repairs it on retry.
  const hook = path.join(fx.repo, ".git/hooks/pre-commit");
  write(hook, "#!/bin/sh\nexit 1\n");
  chmodSync(hook, 0o755);
  assert.match(retain(fx, runDir).out.blocker, /git commit .* failed/u);
  assert.ok(existsSync(target));
  rmSync(hook);
  const first = retain(fx, runDir);
  assert.equal(first.out.pass_report, `${GOAL}/reviews/pass-1.json`, first.out.blocker);
  // Simulate a crash before the run directory removal: a retry reports the same report.
  renameSync(backup, runDir);
  assert.deepEqual(retain(fx, runDir).out, first.out);
  assert.equal(fx.git("rev-list", "--count", "HEAD"), "3");
  assert.deepEqual(readdirSync(path.join(fx.goal, "reviews")), ["pass-1.json"]);
});

test("a run directory others can write is refused by retain and ignored by status", (t) => {
  const fx = fixtureRepo(t);
  const runDir = prepared(fx);
  review(runDir, []);
  chmodSync(runDir, 0o770);
  assert.match(retain(fx, runDir).out.blocker, /is not a private run directory of this user/u);
  assert.equal(status(fx).run_dir, null);
  assert.equal(existsSync(path.join(fx.goal, "reviews")), false);
});

test("status skips stray entries in the shared run root", (t) => {
  const fx = fixtureRepo(t);
  write(path.join(fx.tmp, "hi-review/stray"), "not a run\n");
  mkdirSync(path.join(fx.tmp, "hi-review/empty"));
  assert.deepEqual(status(fx), { next: "prepare", run_dir: null, pass_count: 0, blocker: null });
});

test("retain refuses a packet whose Pass Report path or repository differs from the derived one", (t) => {
  const fx = fixtureRepo(t);
  const runDir = prepared(fx);
  review(runDir, []);
  const packetFile = path.join(runDir, "packet.json");
  const packet = readJson(packetFile);
  for (const tampered of [{ report_path: "src/app.mjs" }, { report_path: `${GOAL}/reviews/pass-9.json` }, { repo_root: fx.tmp }]) {
    writeFileSync(packetFile, JSON.stringify({ ...packet, ...tampered }));
    assert.match(retain(fx, runDir).out.blocker, /does not match/u, JSON.stringify(tampered));
  }
  assert.equal(readFileSync(path.join(fx.repo, "src/app.mjs"), "utf8"), "export const limit = 2;\n");
  assert.equal(fx.git("rev-list", "--count", "HEAD"), "2");
});

test("standalone review takes a commit or range, refuses other targets and keeps no counter", (t) => {
  const fx = fixtureRepo(t);
  const standalone = (locator) => cli(fx, ["prepare", "--standalone", locator]);
  for (const target of ["specs/feature/SPEC.md", `${fx.base}..${fx.base}`, "no-such-ref", `${fx.base}...HEAD`]) {
    assert.match(standalone(target).out.blocker, /is not a Git commit or commit range|no reviewable Git change/u, target);
  }
  assert.equal(standalone(`${fx.base}..HEAD`).out.blocker, null);
  const result = standalone("HEAD");
  assert.equal(result.out.blocker, null, result.stderr);
  assert.equal(result.out.ordinal, null);
  review(result.out.run_dir, []);
  const retained = retain(fx, result.out.run_dir, "10");
  assert.match(retained.out.pass_report, /^\.devpunks\/delivery\/standalone\/reviews\/[0-9a-f]{12}-[0-9a-f]{12}-.+\.json$/u);
  assert.equal(readJson(path.join(fx.repo, retained.out.pass_report)).ordinal, null);
  assert.equal(status(fx).pass_count, 0);
});

test("a legacy v1 Pass Report keeps its count and Markdown reports count no pass", (t) => {
  const fx = fixtureRepo(t);
  write(path.join(fx.goal, "reviews/review-0a1b2c-20261001T101500Z-review-report.md"), "---\ntitle: review\n---\n");
  assert.equal(status(fx).pass_count, 0);
  write(path.join(fx.goal, "reviews/pass-1.json"), JSON.stringify({ schema: "pass-report-v1", ordinal: 1, head: fx.git("rev-parse", "HEAD") }));
  fx.git("add", ".");
  fx.git("commit", "-qm", "legacy pass");
  assert.deepEqual(status(fx), { next: "done", run_dir: null, pass_count: 1, blocker: null });
  assert.match(prepare(fx).out.blocker, /accepted-risk/u);
});

test("prepare reads Git output larger than the default 1 MiB child-process buffer", (t) => {
  const fx = fixtureRepo(t);
  const index = path.join(fx.repo, ".agents/rules/index.md");
  const base = fx.commit(".agents/rules/index.md", `${readFileSync(index, "utf8")}\n${"<!-- padding of a large rule registry -->\n".repeat(50_000)}`, "large rule registry");
  fx.commit("src/app.mjs", "export const limit = 3;\n", "raise limit again");
  const result = prepare({ ...fx, base }, ["--spec", "specs/feature"]);
  assert.equal(result.out.blocker, null, result.stderr);
  assert.ok(readJson(path.join(result.out.run_dir, "packet.json")).context.includes(".agents/rules/src/source-rule.md"));
});

test("every subcommand prints one JSON line with a blocker on bad input", (t) => {
  const fx = fixtureRepo(t);
  assert.match(cli(fx, ["prepare", "--goal", "docs", "--base", fx.base]).out.blocker, /under \.devpunks\/delivery/u);
  assert.match(retain(fx, path.join(fx.tmp, "missing")).out.blocker, /no packet\.json/u);
  assert.match(cli(fx, ["status"]).out.blocker, /--goal/u);
  const help = spawnSync(process.execPath, [cliPath, "--help"], { encoding: "utf8" });
  for (const command of ["status", "prepare", "retain"]) assert.match(help.stdout, new RegExp(`^  ${command} `, "mu"));
});

// About 56 bytes per line; each line costs one more byte in the diff.
const filler = (lines) => "export const pad = 'x'; // filler line of a large change\n".repeat(lines);
const preparedAt = (fx, base) => {
  const result = prepare({ ...fx, base }, ["--spec", "specs/feature"]);
  assert.equal(result.out.blocker, null, result.stderr);
  return { runDir: result.out.run_dir, packet: readJson(path.join(result.out.run_dir, "packet.json")) };
};
const retainedReport = (fx, runDir) => {
  review(runDir, []);
  const retained = retain(fx, runDir);
  assert.equal(retained.out.blocker, null, retained.stderr);
  return { line: retained.out, report: readJson(path.join(fx.repo, retained.out.pass_report)) };
};

test("a change larger than 3 x 64 KB is reviewed in full in one pass", (t) => {
  const fx = fixtureRepo(t);
  const base = fx.git("rev-parse", "HEAD");
  fx.commit("src/big.mjs", filler(3_600), "large change");
  const { runDir, packet } = preparedAt(fx, base);
  assert.deepEqual(packet.changed_paths, ["src/big.mjs"]);
  assert.deepEqual(packet.coverage, { scope: "full", left_out: [] });
  const { line, report } = retainedReport(fx, runDir);
  assert.deepEqual(line.coverage, { scope: "full", left_out: [] });
  assert.deepEqual(report.coverage, { scope: "full", left_out: [] });
});

test("lockfiles, generated snapshots and files that .gitattributes marks generated are left out and listed", (t) => {
  const fx = fixtureRepo(t);
  const base = fx.git("rev-parse", "HEAD");
  write(path.join(fx.repo, ".gitattributes"), "src/gen/** linguist-generated\nassets/*.dat -diff\n");
  write(path.join(fx.repo, "bun.lock"), "{ \"lockfileVersion\": 1 }\n");
  write(path.join(fx.repo, "src/gen/client.ts"), "export const generated = true;\n");
  write(path.join(fx.repo, "db/meta/0001_snapshot.json"), "{ \"version\": \"7\" }\n");
  write(path.join(fx.repo, "assets/blob.dat"), "opaque\n");
  fx.commit("src/app.mjs", "export const limit = 5;\n", "change with generated files");
  const leftOut = [
    { path: "assets/blob.dat", reason: "-diff" },
    { path: "bun.lock", reason: "lockfile" },
    { path: "db/meta/0001_snapshot.json", reason: "generated-snapshot" },
    { path: "src/gen/client.ts", reason: "linguist-generated" },
  ];
  const { runDir, packet } = preparedAt(fx, base);
  assert.deepEqual(packet.changed_paths, [".gitattributes", "src/app.mjs"]);
  assert.deepEqual(packet.coverage, { scope: "full", left_out: leftOut });
  assert.deepEqual(retainedReport(fx, runDir).report.coverage, { scope: "full", left_out: leftOut });

  fx.commit("bun.lock", "{ \"lockfileVersion\": 2 }\n", "lockfile only");
  assert.match(cli(fx, ["prepare", "--standalone", "HEAD"]).out.blocker, /only generated files \(bun\.lock\)/u);
});

test("a change over the review budget gets a partial review of the most important files", (t) => {
  const fx = fixtureRepo(t);
  const base = fx.git("rev-parse", "HEAD");
  write(path.join(fx.repo, "src/core.mjs"), filler(2_700));
  write(path.join(fx.repo, "src/extra.mjs"), filler(2_150));
  write(path.join(fx.repo, "src/small.mjs"), "export const small = 1;\n");
  write(path.join(fx.repo, 'tests/core "quoted".test.mjs'), filler(1_070));
  fx.commit("docs/guide.md", filler(900), "change over the budget");
  // Source before tests before docs, larger first; each file that still fits is reviewed.
  // Git quotes the test file's patch header, so its size comes from its own diff.
  const leftOut = [{ path: "docs/guide.md", reason: "over-budget" }, { path: "src/extra.mjs", reason: "over-budget" }];
  const { runDir, packet } = preparedAt(fx, base);
  assert.deepEqual(packet.changed_paths, ["src/core.mjs", "src/small.mjs", 'tests/core "quoted".test.mjs']);
  assert.deepEqual(packet.coverage, { scope: "partial", left_out: leftOut });
  assert.ok(!packet.context.includes("docs/AGENTS.md"), "context follows only the reviewed files");
  const { line, report } = retainedReport(fx, runDir);
  assert.deepEqual(line.coverage, { scope: "partial", left_out: leftOut });
  assert.deepEqual(report.coverage, { scope: "partial", left_out: leftOut });

  // One file over the whole budget is still reviewed, alone.
  fx.commit("src/huge.mjs", filler(5_000), "one file over the budget");
  const standalone = cli(fx, ["prepare", "--standalone", "HEAD"]);
  assert.equal(standalone.out.blocker, null, standalone.stderr);
  const huge = readJson(path.join(standalone.out.run_dir, "packet.json"));
  assert.deepEqual([huge.changed_paths, huge.coverage], [["src/huge.mjs"], { scope: "full", left_out: [] }]);
});
