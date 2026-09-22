import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

const graphRoot = "skills/agnostic/docs/write-graph-based-skills";

test("graph authoring imports the complete package and requires durable human steering", () => {
  for (const path of [
    "SKILL.md",
    "AUTHORING-HANDOFF.md",
    "agents/openai.yaml",
    "phases/router.md",
    "phases/qualify.md",
    "phases/model-state.md",
    "phases/define-authority.md",
    "phases/write-router.md",
    "phases/write-phases.md",
    "phases/define-handoffs.md",
    "phases/verify-disclosure.md",
    "phases/test-routes.md",
    "phases/audit.md",
    "references/authoring-contract.md",
  ]) {
    assert.ok(existsSync(new URL(`../${graphRoot}/${path}`, import.meta.url)), path);
  }

  const root = read(`${graphRoot}/SKILL.md`);
  const contract = read(`${graphRoot}/references/authoring-contract.md`);
  const model = read(`${graphRoot}/phases/model-state.md`);
  const router = read(`${graphRoot}/phases/write-router.md`);
  const phases = read(`${graphRoot}/phases/write-phases.md`);
  const routes = read(`${graphRoot}/phases/test-routes.md`);
  assert.match(root, /Human steering.*authoring contract/iu);
  assert.match(contract, /Every graph includes `human_steering_required` as a terminal, non-success\s+state/iu);
  assert.match(contract, /gate\s+records the blocker, evidence, proposed action, and required decision, then stops/iu);
  assert.match(contract, /router keeps returning the terminal until the user authorizes continuation/iu);
  assert.match(model, /reachable from every applicable gate/iu);
  assert.match(router, /with its defined resumption conditions/iu);
  assert.match(phases, /Every applicable gate records the terminal outcome and stops/iu);
  assert.match(routes, /all ten scenarios/iu);
  assert.match(routes, /authoring-contract\.md#route-matrix-ten-scenarios/iu);
  assert.doesNotMatch(routes, /route-matrix-nine-scenarios/iu);
  assert.match(routes, /planned checkpoint distinct from the\s+\[human steering terminal\]/iu);
  assert.match(contract, /\| Human checkpoint \|/u);
  assert.match(contract, /\| Human steering terminal \|/u);
});

test("delivery and debugging preserve scope decisions before proceeding", () => {
  const delivery = read("skills/phases/delivery-phase/SKILL.md");
  const router = read("skills/phases/delivery-phase/phases/router.md");
  const gate = read("skills/phases/delivery-phase/phases/human-steering.md");
  const handoff = read("skills/phases/delivery-phase/references/phase-handoff.md");
  const debug = read("skills/phases/debugging-phase/SKILL.md");
  assert.match(delivery, /references\/failure-continuity\.md/iu);
  assert.match(router, /Preserve terminal `human_steering_required` until current user direction\s+resolves the required decision/iu);
  assert.match(delivery, /Within accepted bounds, full delivery grants/iu);
  assert.match(router, /New boundary evidence selects\s+\[human-steering\.md\]/iu);
  assert.match(gate, /Record the blocked action, supporting evidence, and exact decision needed/iu);
  assert.match(gate, /in\s+a durable state artifact/iu);
  assert.match(gate, /Pointer and exact blocker in the compact Delivery Handoff/iu);
  assert.match(gate, /In every mode, resume routing when current\s+user direction resolves the required decision/iu);
  assert.match(handoff, /human_steering_required/iu);
  assert.match(debug, /next action exceeds these bounds, retain the evidence and required\s+decision/iu);
  assert.match(debug, /return `human_steering_required` and stop/iu);
});

test("review routes scope decisions before repair", async () => {
  const { deriveReviewRouting } = await import("../skills/phases/review-phase/scripts/review-contract.mjs");
  const run = read("skills/phases/review-phase/phases/run-review.md");
  const returned = read("skills/phases/review-phase/phases/return-route.md");
  const delivery = read("skills/phases/delivery-phase/phases/review.md");
  assert.deepEqual(
    deriveReviewRouting([
      { return_route: "implementation" },
      { return_route: "human_steering_required" },
    ]),
    {
      primary: "human_steering_required",
      secondary_architecture_follow_up: false,
    },
  );
  assert.match(run, /Use\s+`human_steering_required` when the repair exceeds accepted bounds/iu);
  assert.match(returned, /primary route is `human_steering_required`.*retain the blocking\s+finding, supporting evidence, and exact decision needed; return that outcome\s+and stop/isu);
  assert.match(delivery, /primary `human_steering_required`.*never opens a repair state/isu);
});

test("direct autoreview cannot recurse", () => {
  const skill = read("skills/agnostic/quality/autoreview/SKILL.md");
  assert.match(skill, /Outside `review-phase`.*helper exactly once/isu);
  assert.match(skill, /End this invocation without rerunning the\s+helper/iu);
  assert.match(skill, /formal `\$review-phase` or a new\s+explicit user instruction after this result/iu);
  assert.doesNotMatch(skill, /Outside `review-phase`.{0,160}keep going until/isu);
  assert.doesNotMatch(skill, /rerun review until/iu);
});
