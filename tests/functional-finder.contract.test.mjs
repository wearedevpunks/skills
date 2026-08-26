import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

const read = (path) =>
  readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

test("Functional Finder is a human-only cumulative adapter over Finder", () => {
  const skill = read("skills/phases/functional-finder/SKILL.md");
  const metadata = read("skills/phases/functional-finder/agents/openai.yaml");
  const normalized = skill.replace(/\s+/gu, " ");

  assert.match(skill, /disable-model-invocation:\s*true/u);
  assert.match(metadata, /allow_implicit_invocation:\s*false/u);
  assert.match(skill, /technical or proficient nontechnical user/iu);
  assert.match(skill, /target\s+depth:\s*`Functional`/iu);
  assert.match(skill, /Directly compose.{0,120}Finder engine/isu);
  assert.match(normalized, /cumulative Business and Functional depth/iu);
  assert.match(normalized, /atomic `\$grilling`/u);
  assert.doesNotMatch(skill, /(?:activate|invoke|run)\s+`\$requirements-grill`/iu);
});

test("Functional Finder reuses accepted Business scope and splits Story intent", () => {
  const skill = read("skills/phases/functional-finder/SKILL.md");
  const normalized = skill.replace(/\s+/gu, " ");

  assert.match(normalized, /reuse.{0,120}accepted Business child/iu);
  assert.match(
    normalized,
    /exact existing Product Area.{0,80}Initiative.{0,80}Epic path.{0,160}(?:fast path|without changing business scope)/iu,
  );
  assert.match(normalized, /otherwise.{0,160}complete Business grilling/iu);
  assert.match(
    normalized,
    /one Functional (?:grilling )?child per accepted Story intent/iu,
  );
  assert.match(skill, /actor/iu);
  assert.match(skill, /trigger/iu);
  assert.match(normalized, /observable workflow and result/iu);
  assert.match(skill, /alternate or failure paths/iu);
  assert.match(skill, /Story boundaries/iu);
  assert.match(normalized, /product dependencies/iu);
  assert.match(normalized, /existing.{0,80}`V\*` milestone.{0,120}before.{0,80}(?:proposing|creating) a new/iu);
  assert.match(skill, /exactly one contextual `V\*` milestone/iu);
  assert.doesNotMatch(skill, /implementation architecture/iu);
  assert.doesNotMatch(skill, /(?:create|decompose|emit|produce).{0,80}Tasks/iu);
});

test("Functional Finder explains decisions and returns exact Story readback", () => {
  const skill = read("skills/phases/functional-finder/SKILL.md");
  const normalized = skill.replace(/\s+/gu, " ");

  assert.match(skill, /`\$wait-what`/u);
  assert.match(skill, /repitch/iu);
  assert.match(skill, /accepted project terms/iu);
  for (const decision of [
    "before grilling",
    "workflow",
    "Story split",
    "alternate path",
    "dependency",
    "milestone",
    "final Story write",
  ]) {
    assert.ok(
      normalized.toLowerCase().includes(decision.toLowerCase()),
      `missing $show-me decision: ${decision}`,
    );
  }
  assert.match(skill, /`\$show-me`/u);
  assert.match(
    normalized,
    /`\$write-backlog`.{0,180}exactly one Story per accepted Functional child/iu,
  );
  assert.match(
    normalized,
    /Fog identity.{0,180}Business child.{0,180}Functional child.{0,180}Story provider identities.{0,120}(?:exact )?readback/iu,
  );
});
