import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { test } from "node:test";

const source = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const skill = readFileSync(resolve(source, "skills/agnostic/planning/verify-behavior/SKILL.md"), "utf8");
const project = resolve(source, "tests/fixtures/v43/IP-450/project");
const references = resolve(project, ".agents/skills/verify-behavior/references");
const read = (path) => readFileSync(resolve(references, path), "utf8");

// Supplemental structure checks. Native Codex scenario traces are acceptance proof.
test("portable contract exposes selection, coverage outcomes and observable proof", () => {
  assert.match(skill, /^---\nname: verify-behavior\ndescription:/);
  for (const contract of ["Uncovered Surface", "Uncovered Behavior", "Scenario Falsifier", "Relevant Negative Condition", "selection trace", "downstream", "run-owned", "Cleanup", "personal data", "sensitive state", "restore known run-owned state", "before another Drive"])
    assert.ok(skill.replace(/\s+/g, " ").includes(contract), `missing portable contract: ${contract}`);
  assert.doesNotMatch(skill, /git init|sha256sum|delivery-proof|UNSELECTED_/);
  assert.doesNotMatch(skill, /disable-model-invocation/);
});

test("fixture pointers resolve and project owns all app-specific mechanics", () => {
  const visit = (directory) => {
    for (const entry of readdirSync(directory, { withFileTypes: true })) {
      const path = resolve(directory, entry.name);
      if (entry.isDirectory()) visit(path);
      else if (entry.name.endsWith(".md")) {
        for (const [, target] of readFileSync(path, "utf8").matchAll(/\]\(([^)]+)\)/g)) {
          assert.ok(readFileSync(resolve(dirname(path), target)).length > 0, `${path} → ${target}`);
        }
      }
    }
  };
  visit(references);
  for (const app of ["repository", "digest"]) {
    const reference = read(`${app}/README.md`);
    for (const section of ["Launch", "Doctor", "Drive", "Evidence", "Cleanup", "Feature Map"])
      assert.ok(reference.includes(`## ${section}`), `${app}: ${section}`);
  }
});

test("index and journey compose references without copying app command recipes", () => {
  const index = read("README.md");
  const journey = read("journeys/integrity.md");
  assert.match(index, /repository\/README.md/);
  assert.match(index, /digest\/README.md/);
  assert.match(journey, /repository\/features\/commit.md/);
  assert.match(journey, /digest\/features\/integrity.md/);
  assert.doesNotMatch(index + journey, /git init|sha256sum -c|git commit -m|mktemp -d/);
  assert.match(read("repository/features/history.md"), /UNSELECTED_HISTORY_CANARY/);
  assert.match(read("web/README.md"), /UNSELECTED_WEB_CANARY/);
});
