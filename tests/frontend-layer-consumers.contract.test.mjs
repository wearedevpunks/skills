import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

const read = (path) =>
  readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

const line = (text, prefix) =>
  text.split("\n").find((entry) => entry.startsWith(prefix));

const consumers = [
  "skills/agnostic/planning/create-plan/references/architecture-convergence.md",
  "skills/agnostic/planning/implement-spec/references/architecture-conformance.md",
  "skills/agnostic/cli/ask-hi/references/discovery-and-docs.md",
  "skills/agnostic/cli/ask-hi/references/baseline.md",
  "skills/agnostic/cli/hi-cli/references/managed-lint.md",
];

test("ask-hi places the frontend-layers asset on the react Pack and the skill on the frontend Pack", () => {
  const baseline = read("skills/agnostic/cli/ask-hi/references/baseline.md");

  assert.match(line(baseline, "| react |"), /lint [^|]*react-frontend-layers/);
  assert.doesNotMatch(line(baseline, "| frontend |"), /react-frontend-layers/);
  assert.match(line(baseline, "| frontend |"), /frontend-domain-structure/);
});

test("ask-hi describes frontend-domain-structure by its entities layer model", () => {
  const discovery = read("skills/agnostic/cli/ask-hi/references/discovery-and-docs.md");

  assert.match(line(discovery, "- `$frontend-domain-structure`"), /entities layer model/);
});

test("planning and conformance restate the entities layer order", () => {
  const order =
    /`app\/` or `routes\/`[\s\S]{0,20}`composition\/`[\s\S]{0,20}`features\/`[\s\S]{0,20}`entities\/`[\s\S]{0,20}`modules\/`[\s\S]{0,20}`integrations\/`[\s\S]{0,20}`ui\/`/;
  for (const path of [
    "skills/agnostic/planning/create-plan/references/architecture-convergence.md",
    "skills/agnostic/planning/implement-spec/references/architecture-conformance.md",
  ]) {
    assert.match(read(path), order, path);
  }
});

test("hi-cli managed lint documents the react-frontend-layers asset and its nested override key", () => {
  const managedLint = read("skills/agnostic/cli/hi-cli/references/managed-lint.md");

  assert.match(managedLint, /`react-frontend-layers`/);
  assert.match(managedLint, /`<scope>\/tools\/oxlint\/frontend-layers\/index\.mjs`/);
  assert.match(managedLint, /`frontend-layers-<scope>\/<rule>`/);
  assert.match(managedLint, /\$frontend-domain-structure/);
  assert.match(managedLint, /`\*\*\/tools\/oxlint\/\*\*`[\s\S]{0,200}`\.oxfmtrc\.json`/);
  assert.match(managedLint, /without[^.]*`\.oxfmtrc\.json`[^.]*report/i);
});

test("frontend-layers consumers point to the skill instead of restating its Lint Rules", () => {
  const structure = read(
    "skills/agnostic/frontend/frontend-domain-structure/references/structure.md",
  );
  const ruleIds = [...structure.matchAll(/^\| `([a-z-]+)` \|/gm)].map(([, id]) => id);

  assert.ok(ruleIds.length >= 7, "structure.md Lint Rules table must list rule ids");
  for (const path of consumers) {
    const text = read(path);
    for (const id of ruleIds) {
      assert.doesNotMatch(text, new RegExp(`\`${id}\``), `${path} restates ${id}`);
    }
  }
});
