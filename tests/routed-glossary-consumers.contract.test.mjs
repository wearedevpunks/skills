import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

const read = (path) =>
  readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

const consumers = [
  "skills/agnostic/planning/create-spec/SKILL.md",
  "skills/agnostic/planning/create-plan/SKILL.md",
  "skills/agnostic/planning/implement-spec/SKILL.md",
  "skills/agnostic/requirements/write-backlog/SKILL.md",
  "skills/agnostic/backend/backend-domain-structure/SKILL.md",
  "skills/agnostic/frontend/frontend-domain-structure/SKILL.md",
  "skills/agnostic/research/improve-codebase-architecture/SKILL.md",
  "skills/misc/wait-what/SKILL.md",
];

test("downstream consumers preserve the routed canonical glossary", () => {
  for (const path of consumers) {
    const skill = read(path);
    assert.match(skill, /read the canonical glossary in the\s+routed `requirements-grill` status artifact/iu, path);
    assert.match(skill, /route proposed terminology changes through `requirements-grill` instead of\s+silently renaming them/iu, path);
  }
});
