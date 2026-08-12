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
