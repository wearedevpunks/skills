import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";

import { validateTaskBlockerGraph } from "../skills/agnostic/requirements/write-backlog/scripts/validate-task-blocker-graph.mjs";

const root = path.resolve(import.meta.dirname, "..");
const read = (relativePath) => readFileSync(path.join(root, relativePath), "utf-8");

const writerRoot = "skills/agnostic/requirements/write-backlog";

test("write-backlog owns one fail-closed mutation pipeline", () => {
  const skill = read(`${writerRoot}/SKILL.md`);
  const envelope = read(`${writerRoot}/REFERENCE.md`);

  assert.match(skill, /sole physical provider mutation authority/iu);
  assert.match(skill, /read project context, repository identity, and fresh provider state/iu);
  assert.match(skill, /complete provider search[\s\S]*zero stable matches[\s\S]*same durable wiki identity/iu);
  assert.match(skill, /preview.*explicit approval/isu);
  assert.match(skill, /write.*exact readback/isu);
  assert.match(skill, /zero provider mutations/iu);
  assert.match(
    envelope,
    /operation:[\s\S]*initialize\/reconstruct[\s\S]*pre-resolution grilling-child[\s\S]*Business projection[\s\S]*Functional projection[\s\S]*Technical projection[\s\S]*Normalization[\s\S]*delivery status[\s\S]*issue reconciliation/iu,
  );
});

test("write-backlog discloses each semantic branch once", () => {
  const skill = read(`${writerRoot}/SKILL.md`);
  const references = [
    "project-context.md",
    "backlog-initialization.md",
    "fog-intake.md",
    "business-projection.md",
    "functional-projection.md",
    "technical-projection.md",
    "normalization.md",
    "delivery-status.md",
    "issue-reconciliation.md",
  ];

  for (const name of references) {
    assert.equal(
      skill.match(new RegExp(`references/${name.replace(".", "\\.")}`, "gu"))?.length,
      1,
      name,
    );
    assert.ok(read(`${writerRoot}/references/${name}`).trim(), name);
  }
  assert.doesNotMatch(skill, /Azure DevOps|monday\.com|M1|M2|M3/iu);
});

test("writer envelope preserves the complete hierarchy and lateral Fog provenance", () => {
  const reference = read(`${writerRoot}/REFERENCE.md`);
  const model = read(`${writerRoot}/assets/concepts/backlog-model.md`);

  for (const document of [reference, model]) {
    assert.match(
      document,
      /Product\/Backlog Root[\s\S]*Product Area[\s\S]*Initiative[\s\S]*Epic[\s\S]*Story[\s\S]*Task/u,
    );
    assert.match(document, /Fog[\s\S]*(?:lateral|provenance)/iu);
    assert.match(document, /Business[\s\S]*Functional[\s\S]*Technical/u);
    assert.match(document, /Story.*exactly one.*`V\*`[\s\S]*Task.*same/isu);
  }
  assert.doesNotMatch(`${reference}\n${model}`, /capability module|execution milestone|\bM\d+\b/iu);
});

test("initialization reconciles complete product context, roadmap, and four views", () => {
  const context = read(`${writerRoot}/references/project-context.md`);
  const initialization = read(`${writerRoot}/references/backlog-initialization.md`);
  const all = `${context}\n${initialization}`;

  for (const field of [
    "Product brief",
    "business objectives",
    "target users",
    "product boundaries",
    "Product Map",
    "constraints and non-goals",
    "operating rules",
    "owner",
    "repository link",
    "wiki link",
    "current and future `V*`",
  ]) {
    assert.ok(all.includes(field), field);
  }

  assert.match(initialization, /greenfield[\s\S]*inherited[\s\S]*existing/iu);
  assert.match(initialization, /Product Map[\s\S]*Roadmap[\s\S]*Fogs[\s\S]*Current Delivery/u);
  assert.match(initialization, /reuse[\s\S]*fitting existing milestone[\s\S]*propose[\s\S]*none fits/iu);
  assert.match(
    initialization,
    /Version name[\s\S]*One-sentence product goal[\s\S]*Included product outcomes or capability changes/iu,
  );
  assert.match(initialization, /unsupported[\s\S]*name only/iu);
  assert.doesNotMatch(all, /sprint|Cycle|M1|M2|M3/iu);
});

test("staged projections enrich exact structures and create only their authorized level", () => {
  const fog = read(`${writerRoot}/references/fog-intake.md`);
  const business = read(`${writerRoot}/references/business-projection.md`);
  const functional = read(`${writerRoot}/references/functional-projection.md`);
  const technical = read(`${writerRoot}/references/technical-projection.md`);

  assert.match(fog, /create or resume exactly one Fog/iu);
  assert.match(fog, /kind.*`grilling`[\s\S]*Stage.*Business.*Functional.*Technical/isu);
  assert.match(fog, /lateral provenance[\s\S]*enriched or produced/iu);
  assert.match(fog, /may target[\s\S]*fitting existing `V\*`/iu);

  assert.match(business, /immutable accepted Business/iu);
  assert.match(business, /reuse[\s\S]*enrich[\s\S]*create/iu);
  assert.match(business, /Product Area[\s\S]*Initiative[\s\S]*Epic/u);
  assert.match(business, /scope expansion[\s\S]*explicit approval/iu);

  assert.match(functional, /immutable accepted Functional/iu);
  assert.match(functional, /exactly one Story per Functional child/iu);
  assert.match(functional, /exactly one contextual `V\*`/iu);
  assert.doesNotMatch(functional, /Task|implementation architecture|API|data model/iu);

  assert.match(technical, /authoritative agent-ready `SPEC\.md`/iu);
  assert.match(technical, /one or more mandatory[\s\S]*atomic[\s\S]*owner-ready Tasks/iu);
  assert.match(technical, /full reachable Task graph/iu);
  assert.match(technical, /missing targets[\s\S]*future-iteration[\s\S]*self-edges[\s\S]*cycles/iu);
  assert.match(technical, /same `V\*`/iu);
  assert.match(technical, /validate-task-blocker-graph\.mjs/iu);
  assert.match(technical, /Story's stable identity[\s\S]*parent Story identity/iu);
  assert.match(technical, /failed result[\s\S]*zero provider mutations/iu);
});

test("issue reconciliation reads first and recovers partial writes", () => {
  const reconciliation = read(`${writerRoot}/references/issue-reconciliation.md`);

  assert.match(reconciliation, /read before write/iu);
  assert.match(reconciliation, /durable wiki identity[\s\S]*known stable provider identity/iu);
  assert.match(reconciliation, /Title-only matching is discovery evidence/iu);
  assert.match(reconciliation, /Stop[\s\S]*zero provider mutations/iu);
  assert.match(
    reconciliation,
    /boundary[\s\S]*goal[\s\S]*parent[\s\S]*roadmap[\s\S]*duplicate[\s\S]*merge[\s\S]*split[\s\S]*reparent/iu,
  );
  assert.match(reconciliation, /partial[\s\S]*read back[\s\S]*resume/iu);
  assert.match(reconciliation, /exact readback/iu);
});

test("identity reconciliation distinguishes exact create, enrich, and ambiguity", () => {
  const context = read(`${writerRoot}/references/project-context.md`);
  const reconciliation = read(`${writerRoot}/references/issue-reconciliation.md`);
  const all = `${context}\n${reconciliation}`;

  assert.match(
    all,
    /zero stable matches[\s\S]*durable wiki identity[\s\S]*complete provider search[\s\S]*exact\s+create/iu,
  );
  assert.match(
    all,
    /exactly one stable provider match[\s\S]*same durable wiki\s+identity[\s\S]*enrich/iu,
  );
  assert.match(
    all,
    /ambiguous[\s\S]*conflicting[\s\S]*incomplete provider search[\s\S]*zero provider mutations/iu,
  );
});

test("router selects one sharp provider branch", () => {
  const skill = read(`${writerRoot}/SKILL.md`);

  assert.match(skill, /backlogProvider[\s\S]*Linear[\s\S]*references\/providers\/linear\.md/iu);
  assert.match(skill, /backlogProvider[\s\S]*GitHub[\s\S]*references\/providers\/github\.md/iu);
  assert.equal(skill.match(/references\/providers\/linear\.md/gu)?.length, 1);
  assert.equal(skill.match(/references\/providers\/github\.md/gu)?.length, 1);
});

test("Fog intake ensures one unresolved grilling child by stage cardinality", () => {
  const skill = read(`${writerRoot}/SKILL.md`);
  const fog = read(`${writerRoot}/references/fog-intake.md`);
  const projections = [
    read(`${writerRoot}/references/business-projection.md`),
    read(`${writerRoot}/references/functional-projection.md`),
    read(`${writerRoot}/references/technical-projection.md`),
  ];

  assert.match(skill, /ensure Fog or pre-resolution grilling child shell[\s\S]*references\/fog-intake\.md/iu);
  assert.match(
    fog,
    /exact Fog identity[\s\S]*Stage[\s\S]*durable child wiki identity[\s\S]*cardinality key[\s\S]*before accepted evidence exists/iu,
  );
  assert.match(fog, /read all existing direct children before[\s\S]*(?:create|write)/iu);
  assert.match(fog, /Business[\s\S]*singleton/iu);
  assert.match(fog, /Functional[\s\S]*Story-intent key/iu);
  assert.match(fog, /Technical[\s\S]*Story key/iu);
  assert.match(fog, /reuse[\s\S]*exact match/iu);
  assert.match(fog, /duplicate[\s\S]*ambiguous[\s\S]*conflict[\s\S]*zero writes/iu);
  assert.match(fog, /child shell[\s\S]*cannot authorize[\s\S]*projection/iu);
  for (const projection of projections) {
    assert.match(projection, /immutable accepted .*grilling/iu);
  }
});

test("inherited provider objects require explicit identity adoption", () => {
  const initialization = read(`${writerRoot}/references/backlog-initialization.md`);
  const reconciliation = read(`${writerRoot}/references/issue-reconciliation.md`);
  const all = `${initialization}\n${reconciliation}`;

  assert.match(all, /inherited-object adoption/iu);
  assert.match(
    all,
    /full provider candidate[\s\S]*stable provider ID[\s\S]*exact topology[\s\S]*provenance comparison/iu,
  );
  assert.match(all, /`\$show-me`[\s\S]*explicit human approval[\s\S]*bind the durable wiki identity/iu);
  assert.match(all, /bind[\s\S]*existing provider object[\s\S]*exact readback/iu);
  assert.match(all, /ambiguous[\s\S]*conflicting candidates[\s\S]*zero writes/iu);
  assert.match(all, /never[\s\S]*title-only[\s\S]*automatic adoption/iu);
});

test("Task blocker graph validation accepts same and earlier V* blockers across product parents", () => {
  assert.deepEqual(
    validateTaskBlockerGraph({
      milestoneOrder: ["v1", "v2"],
      stories: [
        { id: "story-area-a", milestoneIds: ["v1"] },
        { id: "story-area-b", milestoneIds: ["v2"] },
        { id: "story-epic-c", milestoneIds: ["v2"] },
      ],
      tasks: [
        {
          id: "task-area-a",
          storyId: "story-area-a",
          milestoneIds: ["v1"],
          blockedBy: [],
        },
        {
          id: "task-area-b",
          storyId: "story-area-b",
          milestoneIds: ["v2"],
          blockedBy: ["task-area-a"],
        },
        {
          id: "task-epic-c",
          storyId: "story-epic-c",
          milestoneIds: ["v2"],
          blockedBy: ["task-area-b"],
        },
      ],
    }),
    {
      ok: true,
      taskIds: ["task-area-a", "task-area-b", "task-epic-c"],
      edges: [
        { blockedTaskId: "task-area-b", blockingTaskId: "task-area-a" },
        { blockedTaskId: "task-epic-c", blockingTaskId: "task-area-b" },
      ],
    },
  );
});

test("Task blocker graph validation fails closed on malformed identities and milestones", () => {
  const stories = [{ id: "story", milestoneIds: ["v1"] }];
  const cases = [
    {
      input: {
        milestoneOrder: ["v1"],
        stories,
        tasks: [{ id: "", storyId: "story", milestoneIds: ["v1"], blockedBy: [] }],
      },
      code: "TASK_ID_REQUIRED",
    },
    {
      input: {
        milestoneOrder: ["v1"],
        stories,
        tasks: [
          { id: "same", storyId: "story", milestoneIds: ["v1"], blockedBy: [] },
          { id: "same", storyId: "story", milestoneIds: ["v1"], blockedBy: [] },
        ],
      },
      code: "TASK_ID_DUPLICATE",
    },
    {
      input: {
        milestoneOrder: ["v1"],
        stories,
        tasks: [{ id: "task", storyId: "story", milestoneIds: [], blockedBy: [] }],
      },
      code: "MILESTONE_CARDINALITY",
    },
    {
      input: {
        milestoneOrder: ["v1", "v2"],
        stories,
        tasks: [
          { id: "task", storyId: "story", milestoneIds: ["v1", "v2"], blockedBy: [] },
        ],
      },
      code: "MILESTONE_CARDINALITY",
    },
    {
      input: {
        milestoneOrder: ["v1"],
        stories,
        tasks: [{ id: "task", storyId: "story", milestoneIds: ["other"], blockedBy: [] }],
      },
      code: "MILESTONE_UNKNOWN",
    },
  ];

  for (const { input, code } of cases) {
    assert.equal(validateTaskBlockerGraph(input).code, code);
  }
});

test("Task blocker graph validation requires an existing same-V* parent Story", () => {
  assert.equal(
    validateTaskBlockerGraph({
      milestoneOrder: ["v1"],
      stories: [{ id: "story", milestoneIds: ["v1"] }],
      tasks: [
        { id: "task", storyId: "missing-story", milestoneIds: ["v1"], blockedBy: [] },
      ],
    }).code,
    "PARENT_STORY_MISSING",
  );

  assert.equal(
    validateTaskBlockerGraph({
      milestoneOrder: ["v1", "v2"],
      stories: [{ id: "story", milestoneIds: ["v1"] }],
      tasks: [{ id: "task", storyId: "story", milestoneIds: ["v2"], blockedBy: [] }],
    }).code,
    "TASK_STORY_MILESTONE_MISMATCH",
  );
});

test("Task blocker graph validation requires at least one Task for every Story", () => {
  assert.deepEqual(
    validateTaskBlockerGraph({
      milestoneOrder: ["v1"],
      stories: [
        { id: "story-covered", milestoneIds: ["v1"] },
        { id: "story-uncovered", milestoneIds: ["v1"] },
      ],
      tasks: [
        {
          id: "task-covered",
          storyId: "story-covered",
          milestoneIds: ["v1"],
          blockedBy: [],
        },
      ],
    }),
    { ok: false, code: "STORY_TASK_REQUIRED", storyId: "story-uncovered" },
  );
});

test("Task blocker graph validation rejects missing, self, future, and cyclic edges", () => {
  const cases = [
    {
      stories: [{ id: "story", milestoneIds: ["v1"] }],
      tasks: [
        { id: "task", storyId: "story", milestoneIds: ["v1"], blockedBy: ["missing"] },
      ],
      code: "BLOCKER_TARGET_MISSING",
    },
    {
      stories: [{ id: "story", milestoneIds: ["v1"] }],
      tasks: [
        { id: "task", storyId: "story", milestoneIds: ["v1"], blockedBy: ["task"] },
      ],
      code: "SELF_EDGE",
    },
    {
      stories: [
        { id: "story-earlier", milestoneIds: ["v1"] },
        { id: "story-future", milestoneIds: ["v2"] },
      ],
      tasks: [
        {
          id: "earlier",
          storyId: "story-earlier",
          milestoneIds: ["v1"],
          blockedBy: ["future"],
        },
        { id: "future", storyId: "story-future", milestoneIds: ["v2"], blockedBy: [] },
      ],
      code: "FUTURE_BLOCKER",
    },
    {
      stories: [{ id: "story", milestoneIds: ["v1"] }],
      tasks: [
        { id: "a", storyId: "story", milestoneIds: ["v1"], blockedBy: ["b"] },
        { id: "b", storyId: "story", milestoneIds: ["v1"], blockedBy: ["a"] },
      ],
      code: "CYCLE",
    },
  ];

  for (const { stories, tasks, code } of cases) {
    assert.equal(
      validateTaskBlockerGraph({ milestoneOrder: ["v1", "v2"], stories, tasks }).code,
      code,
    );
  }
});
