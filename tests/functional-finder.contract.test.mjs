import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

const read = (path) =>
  readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
const normalize = (value) => value.replace(/\s+/gu, " ");

test("Functional Finder is an explicit-only profile over the shared engine", () => {
  const skill = normalize(read("skills/phases/functional-finder/SKILL.md"));
  const metadata = read("skills/phases/functional-finder/agents/openai.yaml");

  assert.match(skill, /disable-model-invocation:\s*true/u);
  assert.match(metadata, /allow_implicit_invocation:\s*false/u);
  assert.match(skill, /functional colleague/iu);
  assert.match(skill, /shared Finder engine/iu);
  assert.match(skill, /immutable intake lens `Functional`/iu);
  assert.match(skill, /does not require Business Finder.{0,40}run first/iu);
});

test("Functional Finder captures behavior nontechnically through an Epic ceiling", () => {
  const skill = normalize(read("skills/phases/functional-finder/SKILL.md"));

  assert.match(skill, /includes every Business Finder capability/iu);
  assert.match(skill, /actor, trigger, workflow, observable result/iu);
  assert.match(skill, /domain rules/iu);
  assert.match(skill, /alternate and failure paths/iu);
  assert.match(skill, /acceptance signals/iu);
  assert.match(skill, /product dependencies/iu);
  assert.match(skill, /technical handoff questions/iu);
  assert.match(skill, /target `V\*` milestone context/iu);
  assert.match(skill, /projection ceiling `Epic`/iu);
  assert.match(skill, /Product Areas, Initiatives, and Epics/iu);
  assert.match(skill, /never projects Stories or Tasks/iu);
  assert.match(skill, /does not require architecture, APIs, data models/iu);
});

test("Functional Finder returns optional structure without completing the Fog", () => {
  const skill = normalize(read("skills/phases/functional-finder/SKILL.md"));

  assert.match(skill, /Skipping projection.{0,120}never blocks a valid Fog result/iu);
  assert.match(skill, /generic support work and evidence/iu);
  assert.match(skill, /optional exact Product Area, Initiative, and Epic readback/iu);
  assert.match(skill, /Return control without asserting.{0,80}Fog is resolved or complete/iu);
});
