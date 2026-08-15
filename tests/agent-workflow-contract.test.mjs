import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

test("technical grilling closes accepted architecture outside GLOSSARY.md", () => {
  const grill = read("skills/agnostic/requirements/requirements-grill/SKILL.md");
  const modeling = read("skills/agnostic/requirements/domain-modeling/SKILL.md");
  const plan = read("skills/agnostic/planning/create-plan/SKILL.md");

  assert.match(grill, /code- or architecture-bearing/u);
  assert.match(modeling, /Pressure-test implementation and architecture consequences/u);
  assert.match(modeling, /Keep `GLOSSARY\.md` glossary-only/u);
  assert.match(plan, /derive and validate the architecture contract accepted in `SPEC\.md`/u);
});

test("rule authoring is concise and limited to scaffold or update handoffs", () => {
  const skill = read("skills/agnostic/docs/rule-authoring/SKILL.md");
  const migration = read("skills/agnostic/docs/rule-authoring/references/migration.md");
  const handoff = read("skills/agnostic/cli/hi-cli/references/post-command-flow.md");

  assert.ok(skill.split("\n").length <= 30);
  assert.match(skill, /Use only from those post-command handoffs/u);
  assert.match(skill, /`pass`, `fail`, or `not-applicable`/u);
  assert.match(migration, /one exhaustive `.agents\/rules\/index\.md` pointer/u);
  assert.match(handoff, /activate `\$writing-for-agents`, then `\$rule-authoring`/u);
});

test("full delivery continues through review with explicit-only HITL", () => {
  const skill = read("skills/phases/delivery-phase/SKILL.md");
  const router = read("skills/phases/delivery-phase/phases/router.md");
  const review = read("skills/phases/delivery-phase/phases/review.md");

  assert.match(skill, /Full delivery re-enters routing immediately/u);
  assert.match(router, /HITL checkpoint exists only when the user explicitly requests it/u);
  assert.match(review, /Full delivery invokes `\$review-phase`/u);
  assert.match(skill, /After the third repair, run focused validation/u);
});
