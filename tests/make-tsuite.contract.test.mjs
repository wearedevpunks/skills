import assert from "node:assert/strict";
import {
  existsSync,
  readFileSync,
  readdirSync,
  statSync,
} from "node:fs";
import { dirname, resolve } from "node:path";
import test from "node:test";

const root = "skills/agnostic/quality/make-tsuite";
const read = (path) => readFileSync(path, "utf8");

const files = readdirSync(root, { recursive: true })
  .map((path) => `${root}/${path}`)
  .filter((path) => statSync(path).isFile());

const markdownFiles = files.filter((path) => path.endsWith(".md"));
const allSources = files.map(read).join("\n");

test("make-tsuite package is model-invoked and structurally complete", () => {
  assert.ok(files.includes(`${root}/SKILL.md`));
  assert.ok(files.includes(`${root}/agents/openai.yaml`));
  assert.ok(files.includes(`${root}/references/audit-portfolio.md`));
  assert.ok(files.includes(`${root}/references/implement-suite.md`));

  const skill = read(`${root}/SKILL.md`);
  const metadata = read(`${root}/agents/openai.yaml`);

  assert.match(skill, /^---\nname: make-tsuite\ndescription:/u);
  assert.doesNotMatch(skill, /disable-model-invocation/u);
  assert.match(skill, /automated software test portfolio/iu);
  assert.match(metadata, /^interface:\n[\s\S]*display_name:[\s\S]*short_description:[\s\S]*default_prompt:/u);
});

test("every local reference link resolves and conditional guidance stays disclosed", () => {
  const linkedTargets = [];

  for (const path of markdownFiles) {
    const links = read(path).matchAll(/\[[^\]]+\]\(([^)]+)\)/gu);
    for (const [, target] of links) {
      if (/^[a-z]+:/iu.test(target) || target.startsWith("#")) continue;
      const resolved = resolve(dirname(path), target);
      linkedTargets.push(resolved);
      assert.ok(existsSync(resolved), `missing reference from ${path}: ${target}`);
    }
  }

  assert.ok(linkedTargets.some((path) => path.endsWith("/references/route-api-design.md")));
  assert.ok(linkedTargets.some((path) => path.endsWith("/references/user-journey-design.md")));
  assert.ok(linkedTargets.some((path) => path.endsWith("/quality/tdd/SKILL.md")));

  const skill = read(`${root}/SKILL.md`);
  assert.match(skill, /routes, APIs, messages, commands, or protocol scenarios/iu);
});

test("production immutability applies to changed content, including mixed files", () => {
  const skill = read(`${root}/SKILL.md`);
  const implementation = read(`${root}/references/implement-suite.md`);

  assert.match(skill, /Production-reachable content is immutable/u);
  assert.match(skill, /Inline tests or shared manifests/iu);
  assert.match(skill, /changed regions are mechanically isolated to test compilation or execution/iu);
  assert.match(skill, /Ambiguous isolation is a blocker/iu);
  assert.match(implementation, /every changed region and dependency/iu);
  assert.match(implementation, /no production-reachable changes/iu);
});

test("audit and implementation preserve honest evidence contracts", () => {
  const audit = read(`${root}/references/audit-portfolio.md`);
  const implementation = read(`${root}/references/implement-suite.md`);

  for (const criterion of ["Sensitivity", "Observability", "Uniqueness", "Fidelity", "Durability", "Cost"]) {
    assert.match(audit, new RegExp(`\\*\\*${criterion}:\\*\\*`, "u"));
  }

  assert.match(audit, /mutation in a disposable copy/iu);
  assert.match(audit, /static sensitivity reasoning `unverified`/iu);
  assert.match(audit, /purpose or technique[\s\S]*property\/fuzz[\s\S]*hardware-in-loop/iu);
  assert.match(implementation, /newly captured RED selected by a required delivery gate remains blocked/iu);
  assert.match(implementation, /explicit authorization[\s\S]*quarantine or disabled-test convention/iu);
});

test("known source-project and toolchain assumptions do not regress", () => {
  const projectSpecificTerms = [
    "collective-intelligence",
    "apps/backend",
    "packages/private/testing",
    ".agents/rules",
    "testing/e2e",
    ".e2e.spec.ts",
    "vitest",
    "playwright",
    "jest",
    "bun test",
    "effect-ts",
  ];

  for (const term of projectSpecificTerms) {
    assert.ok(!allSources.toLowerCase().includes(term), `project-specific term found: ${term}`);
  }

  const route = read(`${root}/references/route-api-design.md`);
  assert.match(route, /routes, APIs, messages, commands, protocols/iu);
});
