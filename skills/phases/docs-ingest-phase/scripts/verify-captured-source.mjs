#!/usr/bin/env node
// Read back a captured original from a Git commit and verify it against its
// source.json provenance record.
//
// Usage: node verify-captured-source.mjs <path/to/source.json> [--ref <rev>]
// Run inside the repository. Default ref: HEAD.
// Exit 0 with one "OK ..." line on stdout; exit 1 with one reason on stderr.

import { spawn, spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { realpathSync } from "node:fs";
import { dirname, posix, relative, resolve, sep } from "node:path";

class Failure extends Error {}
const fail = (reason) => {
  throw new Failure(reason);
};

const parseArgs = (argv) => {
  const usage = "usage: verify-captured-source.mjs <path/to/source.json> [--ref <rev>]";
  let ref = "HEAD";
  const paths = [];
  for (let i = 0; i < argv.length; i += 1) {
    if (argv[i] === "--ref") {
      ref = argv[i + 1] ?? fail(usage);
      i += 1;
    } else {
      paths.push(argv[i]);
    }
  }
  if (paths.length !== 1) fail(usage);
  return { recordPath: paths[0], ref };
};

const git = (args) => spawnSync("git", args, { encoding: "utf8" });

const repoPath = (path) => {
  const top = git(["rev-parse", "--show-toplevel"]);
  if (top.status !== 0) fail(`not in a Git repository: ${process.cwd()}`);
  const target = resolve(path);
  let parent = dirname(target);
  try {
    parent = realpathSync(parent);
  } catch {
    // Absent from the working tree; the ref may still hold it.
  }
  const rel = relative(realpathSync(top.stdout.trim()), parent);
  if (rel.startsWith("..")) fail(`outside repository: ${path}`);
  return posix.join(rel.split(sep).join("/"), posix.basename(target));
};

const commitOf = (ref) => {
  const result = git(["rev-parse", "--verify", "--quiet", `${ref}^{commit}`]);
  if (result.status !== 0) fail(`not committed: ${ref} does not resolve to a commit`);
  return result.stdout.trim();
};

const present = (commit, path) =>
  git(["cat-file", "-e", `${commit}:${path}`]).status === 0;

// Hash the exact blob bytes; cat-file applies no filters or text conversion.
const blobIdentity = (commit, path) =>
  new Promise((done, reject) => {
    const hash = createHash("sha256");
    let bytes = 0;
    const child = spawn("git", ["cat-file", "blob", `${commit}:${path}`]);
    child.stdout.on("data", (chunk) => {
      bytes += chunk.length;
      hash.update(chunk);
    });
    child.on("error", reject);
    child.on("close", (code) =>
      code === 0
        ? done({ bytes, sha256: hash.digest("hex") })
        : reject(new Failure(`not committed: ${path}`)),
    );
  });

const checkBlob = async (commit, ref, path, expected) => {
  if (!present(commit, path)) fail(`not committed: ${path} absent at ${ref}`);
  const actual = await blobIdentity(commit, path);
  if (expected.bytes !== undefined && actual.bytes !== expected.bytes) {
    fail(`size mismatch: ${path} has ${actual.bytes} bytes at ${ref}; source.json records ${expected.bytes}`);
  }
  if (actual.sha256 !== expected.sha256) {
    fail(`sha256 mismatch: ${path} is ${actual.sha256} at ${ref}; source.json records ${expected.sha256}`);
  }
  return actual;
};

const readRecord = (commit, ref, path) => {
  if (!present(commit, path)) fail(`not committed: ${path} absent at ${ref}`);
  const shown = git(["cat-file", "blob", `${commit}:${path}`]);
  try {
    return JSON.parse(shown.stdout);
  } catch {
    return fail(`invalid source.json: ${path} at ${ref} is not JSON`);
  }
};

const requireFields = (path, entry, fields) => {
  for (const field of fields) {
    if (entry?.[field] === undefined || entry[field] === null) {
      fail(`invalid source.json: ${path} lacks ${field}`);
    }
  }
};

const main = async () => {
  const { recordPath, ref } = parseArgs(process.argv.slice(2));
  const recordInRepo = repoPath(recordPath);
  const commit = commitOf(ref);
  const record = readRecord(commit, ref, recordInRepo);
  requireFields(recordInRepo, record, ["file", "bytes", "sha256"]);

  const base = posix.dirname(recordInRepo);
  const originalPath = posix.join(base, record.file);
  const original = await checkBlob(commit, ref, originalPath, record);

  const derived = record.derived ?? [];
  if (!Array.isArray(derived)) fail(`invalid source.json: ${recordInRepo} derived is not a list`);
  for (const entry of derived) {
    requireFields(recordInRepo, entry, ["file", "sha256", "from_sha256"]);
    const derivedPath = posix.join(base, entry.file);
    if (entry.from_sha256 !== record.sha256) {
      fail(`derived from another revision: ${derivedPath} from_sha256 ${entry.from_sha256} is not original sha256 ${record.sha256}`);
    }
    await checkBlob(commit, ref, derivedPath, { sha256: entry.sha256 });
  }

  process.stdout.write(
    `OK ${originalPath} sha256=${original.sha256} bytes=${original.bytes} derived=${derived.length} at ${ref} (${commit.slice(0, 12)})\n`,
  );
};

main().catch((error) => {
  process.stderr.write(`${error instanceof Failure ? error.message : `error: ${error.message}`}\n`);
  process.exitCode = 1;
});
