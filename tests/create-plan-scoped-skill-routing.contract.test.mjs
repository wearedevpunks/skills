import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

const read = (path) =>
  readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

const createPlanDocuments = [
  "skills/agnostic/planning/create-plan/SKILL.md",
  "skills/agnostic/planning/create-plan/REFERENCE.md",
  "skills/agnostic/planning/create-plan/references/planner-task-graph.md",
].map(read);

const contract = createPlanDocuments.join("\n");

test("create-plan routes scoped skills through exact trigger tables", () => {
  assert.doesNotMatch(contract, /Primary skills here/);
  assert.match(contract, /Skill \| What \/ when/);
  assert.match(
    contract,
    /select only rows whose exact `What \/ when` trigger matches the task/i,
  );
  assert.match(contract, /open each selected skill's complete `SKILL\.md`/i);
  assert.match(
    contract,
    /merged, deduplicated union from every touched scope/i,
  );
});
