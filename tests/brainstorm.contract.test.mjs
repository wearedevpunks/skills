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
  assert.match(brainstorm, /description:\s*Brainstorm a bounded system/iu);
  assert.match(brainstorm, /another skill invokes `\$brainstorm`/iu);
});

test("requirements-grill composition names all required requirement skills", () => {
  const composition = grill.slice(0, grill.indexOf("## Quick Routing"));
  assert.match(composition, /\$domain-modeling[\s\S]*\$brainstorm[\s\S]*\$grilling/iu);
});

const originalPrompt =
  "think deeply about how to make this entire system as agent-intuitive, agent-ergonomic, and agent-accretive as you can possibly imagine. Put yourself in the driver's seat and imagine that YOU are the one using this system and driving it. What would most enable you to do an awesome job understanding the situation accurately and optimally controlling everything to drive the best and most accurate results possible, with the least expenditure of resources? Don't just think of the project as an assemblage of various parts or components: really try to profoundly and deeply conceptualize it as a synthetic SYSTEM that is maximally coherent, cohesive, modular, and interconnected, forming a tower of linked abstractions that are maximally legible to you as an agent. Really ruminate and meditate on all of this incredibly deeply before responding or taking any actions.";

test("brainstorm preserves the supplied system-coherence prompt verbatim", () => {
  assert.ok(brainstorm.includes(`:\n\n${originalPrompt}`));
});

test("requirements-grill gates its first frontier on mandatory brainstorm after grounding", () => {
  const grounding = grill.indexOf("complete the technical grounding");
  const brainstormGate = grill.indexOf(
    "After technical grounding, complete `$brainstorm` before the first frontier.",
  );
  const unresolvedGate = grill.indexOf(
    "Add its unresolved decisions to the design tree",
    brainstormGate,
  );
  const rerunGate = grill.indexOf(
    "Rerun only when accepted decisions change the active system boundary.",
    brainstormGate,
  );

  assert.notEqual(grounding, -1);
  assert.notEqual(brainstormGate, -1);
  assert.notEqual(unresolvedGate, -1);
  assert.notEqual(rerunGate, -1);
  assert.ok(brainstormGate > grounding);
  assert.ok(brainstormGate < unresolvedGate);
  assert.ok(unresolvedGate < rerunGate);
});

test("brainstorm output remains candidate material rather than authority", () => {
  assert.match(brainstorm, /evidence-grounded observations.*unresolved decisions/isu);
  assert.match(brainstorm, /remain candidates.*caller accepts/isu);
  assert.match(grill, /unresolved decisions.*design tree.*candidate material until accepted/isu);
});
