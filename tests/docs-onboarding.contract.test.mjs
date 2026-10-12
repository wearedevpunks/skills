import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

test("docs onboarding names the supported initialization command", () => {
  const skill = readFileSync(
    new URL("../skills/agnostic/docs/docs-onboarding/SKILL.md", import.meta.url),
    "utf8",
  );

  assert.match(skill, /\bhi init\b/u);
  assert.doesNotMatch(skill, /\bhi scaffold init\b/u);
});

test("docs onboarding hands every accepted reconstructed flow to Requirements Phase without invoking Finder", () => {
  const skill = readFileSync(
    new URL("../skills/agnostic/docs/docs-onboarding/SKILL.md", import.meta.url),
    "utf8",
  );

  assert.match(
    skill,
    /every candidate existing flow accepted[\s\S]*`\$requirements-phase` as an explicit human handoff, then stop/iu,
  );
  assert.match(skill, /`create-architecture` before `create-spec`/u);
  assert.doesNotMatch(skill, /\binvoke\s+`\$?requirements-phase`/iu);
  assert.match(skill, /agent-ready spec[\s\S]*`write-backlog`[\s\S]*exact existing Epic\/Story/iu);
  assert.match(skill, /otherwise record[\s\S]*exact human Finder\s+invocation/iu);
  assert.match(skill, /never invokes a Finder\s+implicitly/iu);
});
