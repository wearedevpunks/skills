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
  const adjudicator = read("skills/phases/review-phase/references/adjudicator.md");
  const routing = read("skills/phases/review-phase/references/routing.md");
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
  assert.match(adjudicator, /`human_steering_required`: the repair exceeds accepted bounds/iu);
  assert.match(routing, /`human_steering_required` \| either \| Stop\. Return the blocking findings, their evidence and the exact decision needed\. Delivery stays out of repair/iu);
  assert.match(delivery, /primary `human_steering_required`.*never opens a repair state/isu);
});

test("review-phase is the one review procedure and never waits on an engine", () => {
  for (const removed of [
    "skills/agnostic/quality/autoreview",
    "skills/agnostic/quality/review",
    "skills/phases/review-phase/phases",
    "skills/phases/review-phase/AUTHORING-HANDOFF.md",
  ]) assert.equal(existsSync(new URL(`../${removed}`, import.meta.url)), false, removed);
  const skill = read("skills/phases/review-phase/SKILL.md");
  assert.match(skill, /disable-model-invocation: true/u);
  assert.match(skill, /review\.mjs run --run-dir <run_dir>` as\s+a background command and end the turn/u);
  assert.doesNotMatch(skill, /sleep|poll|monitor|watch/iu);
  assert.match(skill, /exactly one readonly Adjudicator/u);
  assert.match(skill, /retain --run-dir <run_dir>\s+--subagent-tokens <n>`/u);
  assert.match(read("skills/phases/review-phase/references/adjudicator.md"), /Run a command only to test one specific candidate/u);
  const standards = read("skills/phases/review-phase/references/axis-standards.md");
  assert.match(standards, /documented standard from the source context is a hard rule/u);
  assert.match(standards, /report it at P3, as\s+information/u);
  assert.doesNotMatch(standards, /simplif/iu);
});

test("delivery handoff points at the Pass Report and derives the pass count", () => {
  const handoff = read("skills/phases/delivery-phase/references/phase-handoff.md");
  const fields = [...handoff.matchAll(/```text\n([\s\S]*?)```/gu)]
    .flatMap(([, block]) => [...block.matchAll(/^([a-z_]+):/gmu)].map(([, name]) => name));
  assert.ok(fields.includes("pass_report"), "pass_report field");
  assert.ok(fields.includes("review_run_id"), "review_run_id field");
  for (const removed of [/verified_retained_ref/u, /report_(path|commit|sha)/u, /sha256/u, /review_count/u]) {
    assert.equal(fields.some((name) => removed.test(name)), false, String(removed));
  }
  assert.doesNotMatch(handoff, /verified_retained_ref|SHA-256/u);
  assert.match(handoff, /review\.mjs status/u);
  for (const path of [
    "SKILL.md",
    "references/artifact-state.md",
    "references/context-continuity.md",
    ...["review", "router", "closeout", "implement", "debug"].map((name) => `phases/${name}.md`),
  ]) {
    const text = read(`skills/phases/delivery-phase/${path}`);
    assert.doesNotMatch(text, /review_count|repair_count|verified_retained_ref|autoreview|retained (report|review)/u, path);
  }
});

test("delivery always passes through review-phase before closeout", () => {
  const router = read("skills/phases/delivery-phase/phases/router.md");
  const closeout = read("skills/phases/delivery-phase/phases/closeout.md");
  const implement = read("skills/phases/delivery-phase/phases/implement.md");
  assert.match(router, /Every completed implementation selects \[review\.md\]\(review\.md\)/u);
  assert.match(router, /No delivery\s+reaches docs ingest or closeout without one/u);
  assert.match(router, /`review-phase` starts every\s+review engine/u);
  assert.match(closeout, /Require a valid Pass Report for this delivery/u);
  assert.match(implement, /Code Review happens once in `review-phase`/u);
});
