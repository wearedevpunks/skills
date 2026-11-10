import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

const read = (path) =>
  readFileSync(new URL(`../skills/${path}`, import.meta.url), "utf8");

test("wait-what owns the names-not-codes rule for human-read messages", () => {
  const skill = read("misc/wait-what/SKILL.md");

  assert.match(skill, /^---\nname: wait-what\ndescription:.*artifact codes.*before any message a human reads/m);
  assert.match(skill, /## Names, not codes/);
  assert.match(skill, /code in brackets after the name only when the reader must find or\s+act on that exact item/);
  assert.match(skill, /Rewrite a\s+subagent report in names before you relay it/);
  assert.match(skill, /Done when every code left in the message sits in brackets after its name or\s+inside a link/);
});

test("every phase that writes to the user points at wait-what", () => {
  for (const path of [
    "agnostic/requirements/requirements-grill/SKILL.md",
    "phases/requirements-phase/SKILL.md",
    "phases/delivery-phase/SKILL.md",
    "agnostic/planning/implement-spec/SKILL.md",
    "phases/review-phase/SKILL.md",
    "agnostic/requirements/write-backlog/SKILL.md",
    "misc/pr/SKILL.md",
  ]) {
    assert.match(read(path), /\$wait-what/, path);
  }
});

test("coded artifact items carry short names", () => {
  const template = read("agnostic/planning/create-spec/assets/SPEC-TEMPLATE.md");
  const grill = read("agnostic/requirements/requirements-grill/references/artifact-output.md");
  const architecture = read("agnostic/planning/create-architecture/references/artifact-contract.md");

  assert.match(template, /### OUT-001: \[Short name\]/);
  assert.match(template, /- AC-001 \*\*\[Short name\]\*\*:/);
  assert.match(template, /\| INV-001 \| \*\*\[Short name\]\*\*:/);
  assert.match(grill, /### Q<N>: <short name>/);
  assert.match(grill, /\| Question id \| Name \|/);
  assert.match(architecture, /code beside a short name/);
});
