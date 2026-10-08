import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import {
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { after, test } from "node:test";

const phase = "skills/phases/docs-ingest-phase";
const script = fileURLToPath(
  new URL(`../${phase}/scripts/verify-captured-source.mjs`, import.meta.url),
);
const read = (path) =>
  readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

const scratch = [];
after(() => {
  for (const dir of scratch) rmSync(dir, { recursive: true, force: true });
});

const env = {
  ...process.env,
  GIT_CONFIG_GLOBAL: "/dev/null",
  GIT_CONFIG_NOSYSTEM: "1",
  GIT_AUTHOR_NAME: "capture-test",
  GIT_AUTHOR_EMAIL: "capture-test@example.invalid",
  GIT_COMMITTER_NAME: "capture-test",
  GIT_COMMITTER_EMAIL: "capture-test@example.invalid",
};

const run = (cwd, command, args) => {
  const result = spawnSync(command, args, { cwd, env, encoding: "utf8" });
  assert.ok(!result.error, String(result.error));
  return result;
};

const git = (cwd, ...args) => {
  const result = run(cwd, "git", args);
  assert.equal(result.status, 0, result.stderr);
  return result.stdout;
};

const verify = (cwd, ...args) => run(cwd, process.execPath, [script, ...args]);

const sha256 = (bytes) => createHash("sha256").update(bytes).digest("hex");

const dir = "raw/external/demo-paper/0123456789ab";
// CRLF and a trailing space: bytes any normalization would change.
const original = Buffer.from("# Demo paper\r\n\r\nExact bytes. \r\n");
const derived = Buffer.from("Demo paper\nExact bytes.\n");

const repo = () => {
  const root = mkdtempSync(join(tmpdir(), "wiki-source-capture-"));
  scratch.push(root);
  git(root, "init", "-q");
  git(root, "commit", "-q", "--allow-empty", "-m", "init");
  return root;
};

const preserve = (root, { withDerived = false, fromSha = null } = {}) => {
  mkdirSync(join(root, dir), { recursive: true });
  writeFileSync(join(root, dir, "paper.md"), original);
  const record = {
    title: "Demo paper",
    author: "Example Author",
    kind: "external-markdown",
    original_url: "https://example.invalid/paper",
    revision: "0123456789abcdef0123456789abcdef01234567",
    retrieved_url: "https://example.invalid/raw/paper.md",
    captured_on: "2026-10-08",
    supplied_via: "Contract test",
    file: "paper.md",
    media_type: "text/markdown",
    bytes: original.length,
    sha256: sha256(original),
    preservation: "Exact downloaded bytes",
  };
  if (withDerived) {
    writeFileSync(join(root, dir, "paper.derived.txt"), derived);
    record.derived = [
      {
        file: "paper.derived.txt",
        sha256: sha256(derived),
        from_sha256: fromSha ?? sha256(original),
        method: "strip markdown",
      },
    ];
  }
  writeFileSync(join(root, dir, "source.json"), JSON.stringify(record));
};

// The path-limited commit recipe source-capture.md prescribes.
const commitCapture = (root, message = "capture demo paper") => {
  git(root, "add", "--", dir);
  git(root, "commit", "-q", "--only", "-m", message, "--", dir);
};

const lines = (text) => text.split("\n").filter(Boolean);

test("readback passes when the committed original matches source.json", () => {
  const root = repo();
  preserve(root, { withDerived: true });
  commitCapture(root);

  const result = verify(root, `${dir}/source.json`);

  assert.equal(result.status, 0, result.stderr);
  assert.equal(lines(result.stdout).length, 1);
  assert.match(result.stdout, /^OK .*paper\.md.*sha256=[0-9a-f]{64}/);
});

test("readback fails when the committed original blob differs", () => {
  const root = repo();
  preserve(root);
  commitCapture(root);
  writeFileSync(join(root, dir, "paper.md"), "# Demo paper\n\nExact bytes.\n");
  git(root, "commit", "-q", "-am", "normalize original");

  const result = verify(root, `${dir}/source.json`);

  assert.equal(result.status, 1);
  assert.match(result.stderr, /sha256 mismatch|size mismatch/);
  assert.equal(verify(root, `${dir}/source.json`, "--ref", "HEAD~1").status, 0);
});

test("readback reports a saved but uncommitted original as not committed", () => {
  const root = repo();
  preserve(root);

  const result = verify(root, `${dir}/source.json`);

  assert.equal(result.status, 1);
  assert.match(result.stderr, /not committed/);
});

test("readback rejects derived text attributed to another revision", () => {
  const root = repo();
  preserve(root, { withDerived: true, fromSha: "f".repeat(64) });
  commitCapture(root);

  const result = verify(root, `${dir}/source.json`);

  assert.equal(result.status, 1);
  assert.match(result.stderr, /paper\.derived\.txt/);
  assert.match(result.stderr, /from_sha256/);
});

// Commit a matching blob at `escaped`, then point the record's field at it.
const escapeRevisionDir = (root, { field, escaped, bytes, edit }) => {
  const target = join(root, dir, escaped);
  mkdirSync(join(target, ".."), { recursive: true });
  writeFileSync(target, bytes);
  const recordPath = join(root, dir, "source.json");
  const record = JSON.parse(readFileSync(recordPath, "utf8"));
  edit(record, escaped);
  writeFileSync(recordPath, JSON.stringify(record));
  git(root, "add", "--", "raw");
  git(root, "commit", "-q", "-m", `escape via ${field}`);
};

test("readback rejects an original file outside the revision directory", () => {
  const root = repo();
  preserve(root);
  escapeRevisionDir(root, {
    field: "file",
    escaped: "../outside.md",
    bytes: original,
    edit: (record, escaped) => {
      record.file = escaped;
    },
  });

  const result = verify(root, `${dir}/source.json`);

  assert.equal(result.status, 1);
  assert.match(result.stderr, /invalid source\.json: .* file /);
});

test("readback rejects a derived file outside the revision directory", () => {
  const root = repo();
  preserve(root, { withDerived: true });
  escapeRevisionDir(root, {
    field: "derived[].file",
    escaped: "sub/x.txt",
    bytes: derived,
    edit: (record, escaped) => {
      record.derived[0].file = escaped;
    },
  });

  const result = verify(root, `${dir}/source.json`);

  assert.equal(result.status, 1);
  assert.match(result.stderr, /invalid source\.json: .* derived\[0\]\.file /);
});

test("path-limited capture commit keeps unrelated staged and working changes", () => {
  const root = repo();
  writeFileSync(join(root, "notes.md"), "draft\n");
  git(root, "add", "notes.md");
  writeFileSync(join(root, "scratch.md"), "untracked\n");
  preserve(root);

  commitCapture(root);

  assert.deepEqual(
    lines(git(root, "show", "--name-only", "--format=", "HEAD")).sort(),
    [`${dir}/paper.md`, `${dir}/source.json`],
  );
  assert.deepEqual(lines(git(root, "status", "--short")).sort(), [
    "?? scratch.md",
    "A  notes.md",
  ]);
  assert.equal(verify(root, `${dir}/source.json`).status, 0);
});

test("source-capture reference preserves originals before any knowledge work", () => {
  const ref = read(`${phase}/references/source-capture.md`);

  assert.match(ref, /_original_/);
  assert.match(ref, /_derived_/);
  assert.match(ref, /raw\/<origin>\/<slug>\/<revision12>\//);
  for (const field of [
    "title",
    "author",
    "kind",
    "original_url",
    "revision",
    "retrieved_url",
    "captured_on",
    "supplied_via",
    "file",
    "media_type",
    "bytes",
    "sha256",
    "preservation",
    "derived",
    "from_sha256",
    "method",
  ]) {
    assert.match(ref, new RegExp("`" + field + "`"), field);
  }
  assert.match(ref, /URL.*summary.*exit.*never.*proof/is);
  assert.match(ref, /frontmatter.*normali[sz]ation.*original/is);
  assert.match(ref, /identical.*reuse|reuse.*identical/is);
  assert.match(ref, /new revision.*overwrit|overwrit.*new revision/is);
  assert.match(ref, /PDF.*derived/is);
  assert.match(ref, /transcript.*notes/is);
  assert.match(ref, /speaker.*timestamp/is);
  assert.match(ref, /URL.only.*not.*original|URL.only.*not captured/is);
  assert.match(ref, /knowledge no-op/i);
});

test("source-capture reference commits, reads back, and reports one outcome", () => {
  const ref = read(`${phase}/references/source-capture.md`);

  assert.match(ref, /git add -- /);
  assert.match(ref, /git commit --only .*-- /);
  assert.match(ref, /unrelated.*staged/is);
  assert.match(ref, /\.\.\/scripts\/verify-captured-source\.mjs/);
  assert.doesNotMatch(ref, /git add (-A|--all|\.)(\s|`|$)/);

  const outcomes = ref.match(/^## Outcomes\n([\s\S]*?)(?=^## |(?![\s\S]))/m);
  assert.ok(outcomes, "one Outcomes section");
  for (const label of ["not captured", "saved-uncommitted", "unverified", "committed"]) {
    assert.match(outcomes[1], new RegExp("\\*\\*" + label + "\\*\\*"), label);
  }
  assert.match(ref, /extraction.*fail.*committed.*retriable|retriable.*extraction/is);
  assert.match(ref, /commit.*fail.*unfinished capture|unfinished capture/is);
  assert.match(ref, /remote/i);
  assert.match(ref, /push/i);
  assert.equal((ref.match(/^## Outcomes$/gm) ?? []).length, 1);
});
