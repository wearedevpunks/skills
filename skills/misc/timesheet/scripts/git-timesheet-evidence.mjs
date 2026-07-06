#!/usr/bin/env node
import { execFileSync } from "node:child_process";
import { existsSync, readdirSync, statSync } from "node:fs";
import { homedir } from "node:os";
import { join, resolve } from "node:path";

const args = parseArgs(process.argv.slice(2));
const month = requireArg(args.month, "--month YYYY-MM is required");
const reposRoot = expandHome(args["repos-root"] ?? "~/Desktop/repos");
const authorTerms = splitList(args.authors ?? "");
const mapSpec = args.map ?? "";

if (!/^\d{4}-\d{2}$/.test(month)) {
  fail("--month must be YYYY-MM");
}
if (!authorTerms.length) {
  fail("--authors is required, for example \"Stefan Garofalo,simosabba\"");
}

const projectMap = parseMap(mapSpec);
if (!Object.keys(projectMap).length) {
  fail("--map is required, for example \"CODE=repo-a,repo-b;CODE2=repo-c\"");
}

const start = `${month}-01T00:00:00`;
const before = nextMonthStart(month);
const startDay = start.slice(0, 10);
const beforeDay = before.slice(0, 10);
const commitWindowDays = Number(args["commit-window-days"] ?? 45);
const commitBefore = addDays(beforeDay, commitWindowDays);
const authorPattern = new RegExp(authorTerms.map(escapeRegExp).join("|"), "i");
const rows = [];
const seen = new Set();
const repoReports = [];

for (const [code, slugs] of Object.entries(projectMap)) {
  for (const slug of slugs) {
    const repo = resolveRepo(reposRoot, slug);
    if (!repo) {
      repoReports.push({ code, slug, status: "missing" });
      continue;
    }
    tryFetch(repo);
    const commits = gitLog(repo, startDay, commitBefore).filter((commit) => (
      commit.authorDate >= startDay && commit.authorDate < beforeDay
    ));
    let matched = 0;
    for (const commit of commits) {
      const haystack = `${commit.authorName} ${commit.authorEmail}`;
      if (!authorPattern.test(haystack)) continue;
      const key = `${code}:${commit.hash}`;
      if (seen.has(key)) continue;
      seen.add(key);
      matched += 1;
      rows.push({ code, slug, repo, ...commit });
    }
    repoReports.push({ code, slug, repo, status: "ok", matched });
  }
}

rows.sort((a, b) => {
  const byDate = a.authorDate.localeCompare(b.authorDate);
  if (byDate) return byDate;
  const byCode = a.code.localeCompare(b.code);
  if (byCode) return byCode;
  return a.subject.localeCompare(b.subject);
});

const byDay = new Map();
for (const row of rows) {
  const day = row.authorDate.slice(0, 10);
  const dayRows = byDay.get(day) ?? [];
  dayRows.push(row);
  byDay.set(day, dayRows);
}

console.log(`# Timesheet git evidence for ${month}`);
console.log("");
console.log(`Authors: ${authorTerms.join(", ")}`);
console.log(`Repos root: ${reposRoot}`);
console.log(`Commit scan window: ${startDay} to ${commitBefore}`);
console.log("");
console.log("## Repo coverage");
for (const report of repoReports) {
  if (report.status === "missing") {
    console.log(`- ${report.code} ${report.slug}: missing`);
  } else {
    console.log(`- ${report.code} ${report.slug}: ${report.matched} matching commits`);
  }
}
console.log("");
console.log("## Day evidence");
for (const [day, dayRows] of byDay.entries()) {
  const counts = countBy(dayRows, "code");
  console.log(`- ${day}: ${Object.entries(counts).map(([code, count]) => `${code} ${count}`).join(", ")}`);
  for (const row of dayRows.slice(0, 8)) {
    const committed = row.commitDate === row.authorDate ? "" : `, committed ${row.commitDate}`;
    console.log(`  - ${row.code} ${row.hash.slice(0, 8)} ${row.slug}: ${row.subject}${committed}`);
  }
  if (dayRows.length > 8) console.log(`  - ... ${dayRows.length - 8} more`);
}
console.log("");
console.log("## JSON");
console.log(JSON.stringify({ month, reposRoot, authors: authorTerms, repoReports, rows }, null, 2));

function parseArgs(argv) {
  const out = {};
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (!arg.startsWith("--")) continue;
    const key = arg.slice(2);
    const next = argv[i + 1];
    if (!next || next.startsWith("--")) out[key] = "true";
    else {
      out[key] = next;
      i += 1;
    }
  }
  return out;
}

function requireArg(value, message) {
  if (!value) fail(message);
  return value;
}

function splitList(value) {
  return value.split(",").map((item) => item.trim()).filter(Boolean);
}

function parseMap(value) {
  const out = {};
  for (const part of value.split(";").map((item) => item.trim()).filter(Boolean)) {
    const [code, slugsText] = part.split("=");
    if (!code || !slugsText) fail(`Invalid --map part: ${part}`);
    out[code.trim()] = splitList(slugsText);
  }
  return out;
}

function expandHome(path) {
  if (path === "~") return homedir();
  if (path.startsWith("~/")) return join(homedir(), path.slice(2));
  return resolve(path);
}

function resolveRepo(root, slug) {
  const direct = expandHome(slug);
  if (existsSync(join(direct, ".git"))) return direct;
  const underRoot = join(root, slug);
  if (existsSync(join(underRoot, ".git"))) return underRoot;
  if (!existsSync(root)) return null;
  const matches = readdirSync(root)
    .map((name) => join(root, name))
    .filter((path) => statSync(path).isDirectory())
    .filter((path) => existsSync(join(path, ".git")))
    .filter((path) => path.toLowerCase().includes(slug.toLowerCase()));
  return matches.length === 1 ? matches[0] : null;
}

function tryFetch(repo) {
  try {
    execFileSync("git", ["-C", repo, "fetch", "--all", "--prune"], { stdio: "ignore" });
  } catch {
    // Local refs are still useful when network or credentials are unavailable.
  }
}

function gitLog(repo, since, before) {
  const format = "%H%x1f%ad%x1f%cd%x1f%an%x1f%ae%x1f%s";
  const output = execFileSync("git", [
    "-C",
    repo,
    "log",
    "--all",
    `--since=${since}T00:00:00`,
    `--before=${before}T00:00:00`,
    "--date=format:%Y-%m-%d",
    `--format=${format}`,
  ], { encoding: "utf8", maxBuffer: 64 * 1024 * 1024 });
  return output.split("\n").filter(Boolean).map((line) => {
    const [hash, authorDate, commitDate, authorName, authorEmail, subject] = line.split("\x1f");
    return { hash, authorDate, commitDate, authorName, authorEmail, subject };
  });
}

function nextMonthStart(value) {
  const [yearText, monthText] = value.split("-");
  const year = Number(yearText);
  const zeroMonth = Number(monthText) - 1;
  const next = new Date(Date.UTC(year, zeroMonth + 1, 1));
  return `${next.getUTCFullYear()}-${String(next.getUTCMonth() + 1).padStart(2, "0")}-01T00:00:00`;
}

function addDays(value, days) {
  const date = new Date(`${value}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

function countBy(items, key) {
  const out = {};
  for (const item of items) out[item[key]] = (out[item[key]] ?? 0) + 1;
  return out;
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function fail(message) {
  console.error(message);
  process.exit(1);
}
