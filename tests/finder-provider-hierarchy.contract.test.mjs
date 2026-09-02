import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";

import { validateTaskBlockerGraph } from "../skills/agnostic/requirements/write-backlog/scripts/validate-task-blocker-graph.mjs";

const root = path.resolve(import.meta.dirname, "..");
const read = (relativePath) => readFileSync(path.join(root, relativePath), "utf-8");
const writer = "skills/agnostic/requirements/write-backlog";

test("linear-free-v1 uses one native Root and Product Area Project with Kind-labeled issue descendants", () => {
  const linear = read(`${writer}/references/providers/linear.md`);

  assert.match(linear, /`linear-free-v1`[\s\S]*sole default/iu);
  assert.match(
    linear,
    /Product\/Backlog Root[\s\S]*top-level Linear Initiative[\s\S]*Product Area[\s\S]*Linear Project[\s\S]*Initiative[\s\S]*Issue[\s\S]*`Kind\/initiative`[\s\S]*Epic[\s\S]*child Issue[\s\S]*`Kind\/epic`[\s\S]*Story[\s\S]*child Issue[\s\S]*`Kind\/story`[\s\S]*Task[\s\S]*child Issue[\s\S]*`Kind\/task`/iu,
  );
  assert.doesNotMatch(linear, /nested Linear Initiative|Epic \| Linear Project/iu);
});

test("Finder projections stop above delivery depth and immutable outcomes authorize derivation", () => {
  const skill = read(`${writer}/SKILL.md`);
  const business = read(`${writer}/references/business-projection.md`);
  const functional = read(`${writer}/references/functional-projection.md`);
  const model = read(`${writer}/assets/concepts/backlog-model.md`);

  assert.match(business, /ceiling[\s\S]*Product Area[\s\S]*Initiative/iu);
  assert.match(business, /creates[\s\S]*neither Epic, Story, nor Task/iu);
  assert.doesNotMatch(business, /Exact-create[\s\S]{0,80}(?:Epic|Story|Task)/iu);
  assert.match(functional, /ceiling[\s\S]*Epic/iu);
  assert.match(functional, /creates neither Story nor[\s\S]*Task/iu);
  assert.match(
    `${skill}\n${model}`,
    /immutable[\s\S]*`OUT-###`[\s\S]*deriv(?:e|es) or reus(?:e|es)[\s\S]*Product Area[\s\S]*Initiative[\s\S]*Epic[\s\S]*Story[\s\S]*Task/iu,
  );
  assert.doesNotMatch(`${skill}\n${model}`, /`US-###`|Technical projection|Technical grilling/iu);
});

test("Linear rejects the wrong workspace and legacy destinations before a small validated mutation", () => {
  const context = read(`${writer}/references/project-context.md`);
  const linear = read(`${writer}/references/providers/linear.md`);
  const all = `${context}\n${linear}`;

  assert.match(all, /backlogProjectUrl[\s\S]*Product\/Backlog Root/iu);
  assert.match(linear, /workspace ID[\s\S]*workspace URL[\s\S]*wrong workspace[\s\S]*zero (?:writes|provider mutations)/iu);
  assert.match(linear, /legacy[\s\S]*destination[\s\S]*`hi ensure`[\s\S]*zero (?:writes|provider mutations)/iu);
  assert.match(linear, /complete intended mutation envelope[\s\S]*stable IDs[\s\S]*preconditions[\s\S]*expected readback/iu);
  assert.match(linear, /preview[\s\S]*explicit approval[\s\S]*write only/iu);
  assert.match(linear, /partial[\s\S]*stop[\s\S]*observed writes[\s\S]*residual delta/iu);
});

test("GitHub Projects V2 preserves recursive issue ownership and fails closed on missing representation", () => {
  const github = read(`${writer}/references/providers/github.md`);

  assert.match(github, /one Projects V2[\s\S]*Product Area[\s\S]*Initiative[\s\S]*Epic[\s\S]*Story[\s\S]*Task/iu);
  assert.match(github, /Epic[\s\S]*Issue[\s\S]*Story[\s\S]*sub-issue[\s\S]*Task[\s\S]*nested sub-issue/iu);
  assert.match(github, /repository milestone[\s\S]*same[\s\S]*Story[\s\S]*Task/iu);
  assert.match(github, /native[\s\S]*blocker/iu);
  assert.match(github, /missing[\s\S]*representation[\s\S]*setup\s+guidance[\s\S]*zero provider mutations/iu);
  assert.match(github, /exact readback[\s\S]*parent[\s\S]*milestone[\s\S]*blocker[\s\S]*source/iu);
  assert.match(github, /partial[\s\S]*observed writes[\s\S]*residual\s+delta/iu);
  assert.doesNotMatch(github, /Grilling Stage|Business, Functional, Technical/iu);
});

test("provider-neutral blocker validation permits derived cardinality and rejects duplicate edges", () => {
  assert.deepEqual(
    validateTaskBlockerGraph({
      milestoneOrder: ["v1"],
      stories: [{ id: "story-without-derived-task", milestoneIds: ["v1"] }],
      tasks: [],
    }),
    { ok: true, taskIds: [], edges: [] },
  );

  assert.equal(
    validateTaskBlockerGraph({
      milestoneOrder: ["v1"],
      stories: [{ id: "story", milestoneIds: ["v1"] }],
      tasks: [
        { id: "blocking", storyId: "story", milestoneIds: ["v1"], blockedBy: [] },
        {
          id: "blocked",
          storyId: "story",
          milestoneIds: ["v1"],
          blockedBy: ["blocking", "blocking"],
        },
      ],
    }).code,
    "BLOCKER_EDGE_DUPLICATE",
  );
});
