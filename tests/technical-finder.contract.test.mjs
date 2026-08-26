import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { deriveFinderRoute } from "../skills/phases/finder-phase/scripts/finder-contract.mjs";
import { validateTaskBlockerGraph } from "../skills/agnostic/requirements/write-backlog/scripts/validate-task-blocker-graph.mjs";

const read = (path) =>
  readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

test("Technical Finder is a human-only cumulative adapter over Finder", () => {
  const skill = read("skills/phases/technical-finder/SKILL.md");
  const metadata = read("skills/phases/technical-finder/agents/openai.yaml");
  const normalized = skill.replace(/\s+/gu, " ");

  assert.match(skill, /disable-model-invocation:\s*true/u);
  assert.match(metadata, /allow_implicit_invocation:\s*false/u);
  assert.match(skill, /technical user/iu);
  assert.match(skill, /target\s+depth:\s*`Technical`/iu);
  assert.match(skill, /Directly compose.{0,120}Finder engine/isu);
  assert.match(
    normalized,
    /cumulative Business, Functional, and Technical depth/iu,
  );
});

test("Technical Finder reuses lower stages and resumes one Story-scoped child", () => {
  const skill = read("skills/phases/technical-finder/SKILL.md");
  const normalized = skill.replace(/\s+/gu, " ");

  assert.match(
    normalized,
    /reuse.{0,100}accepted Business and Functional (?:children|stages)/iu,
  );
  assert.match(normalized, /first missing or invalid(?:ated)? stage/iu);
  assert.match(normalized, /(?:one selected Story|selects one Story) at a time/iu);
  assert.match(
    normalized,
    /Technical child identity.{0,180}exact Fog.{0,120}Stage `Technical`.{0,120}(?:stable|exact) Story identity/iu,
  );
  assert.match(normalized, /before.{0,100}`\$requirements-grill`/iu);
  assert.match(normalized, /duplicate or ambiguous.{0,100}zero writes/iu);
  assert.match(normalized, /re-enter.{0,100}Finder router/iu);
});

const technicalState = (technicalChildren) => ({
  targetDepth: "Technical",
  fogIdentity: "exact",
  business: "accepted",
  businessIdentity: "exact",
  businessResolution: "immutable",
  businessProjection: "read-back",
  selectedStoryIntents: ["intent-a", "intent-b"],
  functionalChildren: [
    {
      storyIntent: "intent-a",
      identity: "exact",
      status: "accepted",
      scope: "in-scope",
      resolution: "immutable",
      projection: "read-back",
    },
    {
      storyIntent: "intent-b",
      identity: "exact",
      status: "accepted",
      scope: "in-scope",
      resolution: "immutable",
      projection: "read-back",
    },
  ],
  selectedStories: ["story-a", "story-b"],
  technicalChildren,
});

const acceptedTechnicalChild = (story, projection = "read-back") => ({
  story,
  identity: "exact",
  status: "accepted",
  scope: "in-scope",
  resolution: "immutable",
  specReadiness: "agent-ready",
  stableBlob: "verified",
  taskIntentCount: 1,
  projection,
});

test("Finder reconciles one accepted Technical Story before selecting the next", () => {
  assert.equal(
    deriveFinderRoute(
      technicalState([acceptedTechnicalChild("story-a", "pending")]),
    ),
    "reconcile",
  );
  assert.equal(
    deriveFinderRoute(technicalState([acceptedTechnicalChild("story-a")])),
    "technical-grilling",
  );
  assert.equal(
    deriveFinderRoute(
      technicalState([
        acceptedTechnicalChild("story-a"),
        acceptedTechnicalChild("story-b"),
      ]),
    ),
    "return-target",
  );
});

test("Technical Finder returns required same-version Tasks and a validated blocker graph", () => {
  const skill = read("skills/phases/technical-finder/SKILL.md");
  const normalized = skill.replace(/\s+/gu, " ");

  assert.match(normalized, /nonempty.{0,80}Task set/iu);
  assert.match(
    normalized,
    /Fog identity.{0,140}all (?:stage )?children.{0,140}specification URLs.{0,140}Task IDs and URLs.{0,140}blocker edges.{0,140}exact readback/iu,
  );
  assert.match(normalized, /does not complete the Fog/iu);
  assert.match(normalized, /production-evidence obligations/iu);

  assert.deepEqual(
    validateTaskBlockerGraph({
      milestoneOrder: ["v1", "v2"],
      stories: [
        { id: "epic-a/story-a", milestoneIds: ["v1"] },
        { id: "epic-b/story-b", milestoneIds: ["v2"] },
        { id: "epic-c/story-c", milestoneIds: ["v2"] },
      ],
      tasks: [
        {
          id: "epic-a/story-a/task-a",
          storyId: "epic-a/story-a",
          milestoneIds: ["v1"],
          blockedBy: [],
        },
        {
          id: "epic-b/story-b/task-b",
          storyId: "epic-b/story-b",
          milestoneIds: ["v2"],
          blockedBy: ["epic-a/story-a/task-a"],
        },
        {
          id: "epic-c/story-c/task-c",
          storyId: "epic-c/story-c",
          milestoneIds: ["v2"],
          blockedBy: ["epic-b/story-b/task-b"],
        },
      ],
    }),
    {
      ok: true,
      taskIds: [
        "epic-a/story-a/task-a",
        "epic-b/story-b/task-b",
        "epic-c/story-c/task-c",
      ],
      edges: [
        {
          blockedTaskId: "epic-b/story-b/task-b",
          blockingTaskId: "epic-a/story-a/task-a",
        },
        {
          blockedTaskId: "epic-c/story-c/task-c",
          blockingTaskId: "epic-b/story-b/task-b",
        },
      ],
    },
  );

  const rejected = [
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
    {
      stories: [{ id: "story", milestoneIds: ["v1"] }],
      tasks: [
        { id: "task", storyId: "missing-story", milestoneIds: ["v1"], blockedBy: [] },
      ],
      code: "PARENT_STORY_MISSING",
    },
    {
      stories: [{ id: "story", milestoneIds: ["v1"] }],
      tasks: [{ id: "task", storyId: "story", milestoneIds: ["v2"], blockedBy: [] }],
      code: "TASK_STORY_MILESTONE_MISMATCH",
    },
  ];

  for (const { stories, tasks, code } of rejected) {
    assert.equal(
      validateTaskBlockerGraph({ milestoneOrder: ["v1", "v2"], stories, tasks }).code,
      code,
    );
  }
});
