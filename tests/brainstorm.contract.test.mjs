import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

const read = (path) =>
  readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

const brainstorm = read("skills/agnostic/requirements/brainstorm/SKILL.md");
const grill = read(
  "skills/agnostic/requirements/requirements-grill/SKILL.md",
);

test("brainstorm is a standalone model-invoked atomic skill", () => {
  assert.match(brainstorm, /^---\nname: brainstorm\ndescription:/u);
  assert.doesNotMatch(brainstorm, /disable-model-invocation/u);
  assert.match(brainstorm, /atomic.*model-invoked/isu);
  assert.match(brainstorm, /explicit(?:ly)? asked.*brainstorm.*system/isu);
  assert.match(brainstorm, /another skill.*mandate.*bounded.*coherence/isu);
  assert.doesNotMatch(brainstorm, /\$(?:grilling|requirements-grill|domain-modeling)/u);
});

test("brainstorm declares completion coverage for agent operation and durable system coherence", () => {
  const completion = brainstorm.slice(
    brainstorm.indexOf("## Completion criterion"),
  );
  assert.equal((completion.match(/^- \[ \]/gmu) ?? []).length, 5);
  for (const criterion of [
    /operating agent.*state.*legibility.*control/isu,
    /linked abstraction boundaries.*interfaces.*coherence/isu,
    /durable accretion.*future runs/isu,
    /accuracy.*resource-efficiency tradeoffs/isu,
    /observed constraints.*hypotheses.*unresolved choices/isu,
  ]) {
    assert.match(completion, criterion);
  }
});

test("requirements-grill composition names all required requirement skills", () => {
  const composition = grill.slice(0, grill.indexOf("## Quick Routing"));
  assert.match(composition, /\$domain-modeling[\s\S]*\$brainstorm[\s\S]*\$grilling/iu);
});

test("brainstorm preserves the core system-coherence prompt and its operating lenses", () => {
  for (const phrase of [
    "agent-intuitive",
    "agent-ergonomic",
    "agent-accretive",
    "active system boundary",
    "current evidence",
    "coherent, cohesive, modular, interconnected",
    "tower of linked abstractions",
    "legibility",
    "resource efficiency",
    "Put yourself in the driver's seat",
    "synthetic SYSTEM",
  ]) {
    assert.match(brainstorm, new RegExp(phrase.replace(/[.*+?^${}()|[\]\\]/gu, "\\$&"), "u"));
  }
});

test("requirements-grill gates its first frontier on mandatory brainstorm after grounding", () => {
  const grounding = grill.indexOf("complete the technical grounding");
  const brainstormGate = grill.indexOf("invoke `$brainstorm` as a mandatory");
  const firstFrontier = grill.indexOf(
    "constructs or presents the first frontier",
    brainstormGate,
  );
  const blockGate = grill.indexOf(
    "Block the first frontier until it completes",
    brainstormGate,
  );

  assert.notEqual(grounding, -1);
  assert.notEqual(brainstormGate, -1);
  assert.notEqual(firstFrontier, -1);
  assert.notEqual(blockGate, -1);
  assert.ok(brainstormGate > grounding);
  assert.ok(brainstormGate < firstFrontier);
  assert.ok(firstFrontier < blockGate);
  assert.match(
    grill.slice(
      brainstormGate,
      blockGate + "Block the first frontier until it completes".length,
    ),
    /Block the first frontier until it completes/u,
  );
  assert.match(grill, /ordinary dependency-ordered design tree and durable grill artifacts/u);
  assert.match(grill, /Rerun only when accepted decisions materially reshape the active system boundary/u);
});

test("brainstorm output remains candidate material rather than authority", () => {
  assert.match(brainstorm, /candidate observations, candidate decisions, unresolved choices/u);
  assert.match(brainstorm, /not requirements, authorization, approval/u);
  assert.match(brainstorm, /Do not mutate artifacts or take external\s+actions/u);
  assert.match(grill, /candidates are not requirements, authorization, or approval/u);
});
