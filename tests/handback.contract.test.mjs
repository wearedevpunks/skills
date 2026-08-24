import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

const handbackPath = "skills/agnostic/generic/handback/SKILL.md";
const graphRoot = "skills/agnostic/docs/write-graph-based-skills";

test("handback is concise, model-invoked, and owns the semantic boundary", () => {
  const skill = read(handbackPath);
  assert.ok(skill.split("\n").length <= 30);
  assert.doesNotMatch(skill, /disable-model-invocation/u);
  assert.match(skill, /description:.*blocker.*crosses accepted goal bounds.*changes accepted requirements.*weakens a gate.*substantially redesigns implementation/iu);
  assert.match(skill, /Autonomy applies only while the next action remains inside the accepted goal/iu);
  for (const field of [
    "initial goal and accepted bounds",
    "current phase and last known-good state",
    "attempts and evidence",
    "blocker and what it prevents",
    "proposed next action",
    "why it changes scope or authority",
    "exact human decision required",
  ]) {
    assert.ok(skill.includes(field), `missing handback field: ${field}`);
  }
  assert.match(skill, /A proposal is not\s+authority/iu);
  assert.match(skill, /authority guard passes only\s+on explicit human authorization for the proposed next action/iu);
  assert.match(skill, /persistence language apply only within\s+accepted bounds/iu);
  assert.match(skill, /terminal, non-success outcome/iu);
  assert.match(skill, /Expanded design,\s+implementation, delegation, and recursive review begin only after authority/iu);
});

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
  assert.match(contract, /gate that selects it invokes `\$handback`.*writes.*durable\s+outcome.*stops/isu);
  assert.match(contract, /router keeps returning the terminal until the\s+`\$handback` authority guard passes/iu);
  assert.match(model, /reachable from every applicable gate/iu);
  assert.match(router, /`\$handback` authority guard passes/iu);
  assert.match(phases, /Every applicable gate invokes `\$handback`/iu);
  assert.match(routes, /all ten scenarios/iu);
  assert.match(routes, /authoring-contract\.md#route-matrix-ten-scenarios/iu);
  assert.doesNotMatch(routes, /route-matrix-nine-scenarios/iu);
  assert.match(routes, /planned checkpoint distinct from the\s+\[human steering terminal\]/iu);
  assert.match(contract, /\| Human checkpoint \|/u);
  assert.match(contract, /\| Failure handback terminal \|/u);
});

test("delivery and debugging route scope boundaries to handback", () => {
  const delivery = read("skills/phases/delivery-phase/SKILL.md");
  const router = read("skills/phases/delivery-phase/phases/router.md");
  const gate = read("skills/phases/delivery-phase/phases/handback.md");
  const handoff = read("skills/phases/delivery-phase/references/phase-handoff.md");
  const debug = read("skills/phases/debugging-phase/SKILL.md");
  assert.match(delivery, /Boundary evidence selects \[handback\.md\]/iu);
  assert.match(router, /durable `human_steering_required`.*`\$handback` authority/isu);
  assert.match(delivery, /Within accepted bounds, full delivery grants/iu);
  assert.match(router, /current evidence triggers `\$handback`.*\[handback\.md\]/isu);
  assert.match(gate, /Invoke `\$handback`/iu);
  assert.match(gate, /Persist its complete outcome as `human_steering_required`/iu);
  assert.match(handoff, /human_steering_required/iu);
  assert.match(debug, /next action triggers `\$handback`/iu);
  assert.match(debug, /invoke it and stop/iu);
});

test("review routes redesign findings to handback before repair", async () => {
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
  assert.match(run, /Use\s+`human_steering_required` when the repair triggers `\$handback`/iu);
  assert.match(returned, /primary route is `human_steering_required`.*invoke `\$handback`/isu);
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
