import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

const skill = readFileSync(
  new URL(
    "../skills/agnostic/requirements/requirements-grill/SKILL.md",
    import.meta.url,
  ),
  "utf8",
);

test("requirements-grill delegates live completion semantics to grilling", () => {
  assert.match(skill, /When `\$grilling` reports completion/);
  assert.doesNotMatch(skill, /After the frontier is empty/);
});
