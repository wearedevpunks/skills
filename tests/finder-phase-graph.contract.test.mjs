import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { deriveFinderRoute } from "../skills/phases/finder-phase/scripts/finder-contract.mjs";

const read = (path) =>
  readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

const acceptedBusinessChild = (projection = "read-back") => ({
  identity: "exact",
  status: "accepted",
  scope: "in-scope",
  resolution: "immutable",
  projection,
  ...(projection === "read-back"
    ? {
        projectedProductArea: "area-a",
        projectedInitiative: "initiative-a",
        projectedEpic: "epic-a",
        hierarchyReadback: "exact",
      }
    : {}),
});

const exactFunctionalProjection = {
  projectedStoryParentEpic: "epic-a",
  projectedStoryMilestone: "v1",
  projectedStoryMilestoneKind: "V*",
  projectedStoryFogLink: "exact",
  projectedStorySourceLink: "exact",
  projectedStoryMembershipReadback: "exact",
};

const withFixtureStoryMilestones = (state) => ({
  ...state,
  functionalChildren: Array.isArray(state.functionalChildren)
    ? state.functionalChildren.map((child) => {
        const technicalChild = state.technicalChildren?.find(
          (candidate) => candidate.story === child.projectedStory,
        );
        const taskMilestones = new Set(
          technicalChild?.projectedTasks?.map((task) => task.milestone) ?? [],
        );
        return child.status === "accepted" && child.projection === "read-back"
          ? {
              ...exactFunctionalProjection,
              ...child,
              projectedStoryMilestone:
                taskMilestones.size === 1
                  ? taskMilestones.values().next().value
                  : "v1",
            }
          : child;
      })
    : state.functionalChildren,
});

test("Business Finder is a human-only adapter over one human-only Finder engine", () => {
  const finder = read("skills/phases/finder-phase/SKILL.md");
  const finderMetadata = read("skills/phases/finder-phase/agents/openai.yaml");
  const business = read("skills/phases/business-finder/SKILL.md");
  const businessMetadata = read(
    "skills/phases/business-finder/agents/openai.yaml",
  );

  for (const skill of [finder, business]) {
    assert.match(skill, /disable-model-invocation:\s*true/u);
  }
  for (const metadata of [finderMetadata, businessMetadata]) {
    assert.match(metadata, /allow_implicit_invocation:\s*false/u);
  }
  assert.match(business, /target\s+depth:\s*`Business`/iu);
  assert.match(business, /direct(?:ly|-composition).{0,120}Finder engine/isu);
  assert.doesNotMatch(business, /lifecycle state machine/iu);
});

test("Finder derives one deterministic route from current evidence on every entry", () => {
  const scenarios = JSON.parse(
    read("tests/fixtures/finder-phase-routes.json"),
  );

  for (const scenario of scenarios) {
    const fixtureState = withFixtureStoryMilestones(scenario.state);
    const state =
      scenario.state.business === "accepted" &&
      !Array.isArray(scenario.state.businessChildren)
        ? {
            ...fixtureState,
            businessChildren: [
              acceptedBusinessChild(scenario.state.businessProjection),
            ],
          }
        : fixtureState;
    assert.equal(
      deriveFinderRoute(state),
      scenario.expectedRoute,
      scenario.name,
    );
  }
});

test("Finder persists one resumable graph with explicit gates and exact exits", () => {
  const finder = read("skills/phases/finder-phase/SKILL.md");
  const router = read("skills/phases/finder-phase/phases/router.md");
  const gateNames = [
    "ensure-fog",
    "adopt-business-path",
    "business-grilling",
    "functional-grilling",
    "technical-grilling",
    "research",
    "prototype",
    "reconcile",
    "return-target",
    "handback",
  ];
  const gates = gateNames.map((name) =>
    read(`skills/phases/finder-phase/phases/${name}.md`),
  );
  const normalizedFinder = finder.replace(/\s+/gu, " ");

  assert.match(finder, /read \[the Finder router\]\(phases\/router\.md\)/iu);
  assert.ok(
    normalizedFinder.includes(
      "Read [the state and route model](references/state-graph.md) before deriving any state",
    ),
  );
  assert.ok(
    normalizedFinder.includes(
      "Read [the runtime handoff schema](references/runtime-handoff.md) before discovering or updating",
    ),
  );
  assert.match(finder, /load exactly one gate/iu);
  assert.match(finder, /cold resume/iu);
  assert.match(router, /current provider\s+Fog, direct children, relations/iu);
  const normalizedRouter = router.replace(/\s+/gu, " ");
  const authority = [
    "current direct evidence",
    "fresh workflow-native artifacts",
    "committed handoff",
    "suggested route",
  ].map((signal) => normalizedRouter.indexOf(signal));
  assert.deepEqual(authority, [...authority].sort((a, b) => a - b));
  assert.ok(authority.every((index) => index >= 0));
  assert.match(router, /exactly one/iu);
  assert.match(router, /scope-expansion-checkpoint/iu);
  assert.match(router, /human_steering_required/iu);
  assert.ok(
    normalizedRouter.indexOf(
      "Accepted Functional evidence lacks exact projection readback",
    ) <
      normalizedRouter.indexOf(
        "Required Functional evidence is missing or invalid",
      ),
  );
  assert.ok(
    normalizedRouter.indexOf(
      "Accepted Technical evidence lacks exact projection readback",
    ) <
      normalizedRouter.indexOf(
        "Any selected Story lacks valid Technical evidence",
      ),
  );
  for (const gate of gates) {
    assert.match(gate, /Entry guard/iu);
    assert.match(gate, /Bounded action/iu);
    assert.match(gate, /Completion evidence/iu);
    assert.match(gate, /Declared exits/iu);
    assert.match(gate, /Durable handoff/iu);
  }
});

test("Functional Finder adopts an exact unchanged Business path without a Business grill", () => {
  assert.equal(
    deriveFinderRoute({
      targetDepth: "Functional",
      fogIdentity: "exact",
      business: "missing",
      businessPathIdentity: "exact",
      businessPathDecision: "reuse-unchanged",
    }),
    "adopt-business-path",
  );

  const gate = read(
    "skills/phases/finder-phase/phases/adopt-business-path.md",
  ).replace(/\s+/gu, " ");
  assert.match(gate, /exact Business child identity/iu);
  assert.match(gate, /immutable accepted Business resolution/iu);
  assert.match(gate, /runs no Business grill/iu);
});

test("Finder rejects accepted Business and Functional stages without exact immutable authority", () => {
  const acceptedBusiness = {
    targetDepth: "Business",
    fogIdentity: "exact",
    business: "accepted",
    businessIdentity: "exact",
    businessResolution: "immutable",
    businessProjection: "read-back",
    businessChildren: [acceptedBusinessChild()],
  };

  assert.equal(
    deriveFinderRoute({
      ...acceptedBusiness,
      businessChildren: [
        { ...acceptedBusinessChild(), identity: "missing" },
      ],
    }),
    "human-steering",
  );
  assert.equal(
    deriveFinderRoute({
      ...acceptedBusiness,
      businessChildren: [
        { ...acceptedBusinessChild(), resolution: "missing" },
      ],
    }),
    "human-steering",
  );
  assert.equal(
    deriveFinderRoute({
      ...acceptedBusiness,
      targetDepth: "Functional",
      selectedStoryIntents: ["intent-a"],
      functionalChildren: [
        {
          storyIntent: "intent-a",
          projectedStory: "story-a",
          ...exactFunctionalProjection,
          identity: "exact",
          status: "accepted",
          scope: "in-scope",
          resolution: "missing",
          projection: "read-back",
        },
      ],
    }),
    "human-steering",
  );
});

test("Finder rejects duplicate stage children outside the selected subset", () => {
  const acceptedBusiness = {
    targetDepth: "Functional",
    fogIdentity: "exact",
    business: "accepted",
    businessIdentity: "exact",
    businessResolution: "immutable",
    businessProjection: "read-back",
    businessChildren: [acceptedBusinessChild()],
    selectedStoryIntents: ["intent-a"],
    functionalChildren: [
      {
        storyIntent: "intent-a",
        projectedStory: "story-a",
        ...exactFunctionalProjection,
        identity: "exact",
        status: "accepted",
        scope: "in-scope",
        resolution: "immutable",
        projection: "read-back",
      },
    ],
  };
  const duplicateFunctional = {
    storyIntent: "intent-unselected",
    identity: "exact",
    status: "active",
    scope: "in-scope",
  };

  assert.equal(
    deriveFinderRoute({
      ...acceptedBusiness,
      functionalChildren: [
        ...acceptedBusiness.functionalChildren,
        duplicateFunctional,
        { ...duplicateFunctional },
      ],
    }),
    "human-steering",
  );

  const duplicateTechnical = {
    story: "story-unselected",
    identity: "exact",
    status: "active",
    scope: "in-scope",
  };
  assert.equal(
    deriveFinderRoute({
      ...acceptedBusiness,
      technicalChildren: [duplicateTechnical, { ...duplicateTechnical }],
    }),
    "human-steering",
  );
});

test("Finder rejects duplicate Business children and missing stage cardinality keys", () => {
  const base = {
    targetDepth: "Business",
    fogIdentity: "exact",
    business: "accepted",
    businessIdentity: "exact",
    businessResolution: "immutable",
    businessProjection: "read-back",
    businessChildren: [acceptedBusinessChild()],
  };

  assert.equal(
    deriveFinderRoute({
      ...base,
      businessChildren: [{ identity: "exact" }, { identity: "exact" }],
    }),
    "human-steering",
  );
  assert.equal(
    deriveFinderRoute({
      ...base,
      targetDepth: "Functional",
      selectedStoryIntents: ["intent-a"],
      functionalChildren: [{ identity: "exact", status: "active" }],
    }),
    "human-steering",
  );
  assert.equal(
    deriveFinderRoute({
      ...base,
      technicalChildren: [{ identity: "exact", status: "active" }],
    }),
    "human-steering",
  );
});

test("Finder completes Business only from one valid fresh Business child", () => {
  const staleAcceptedSummary = {
    targetDepth: "Business",
    fogIdentity: "exact",
    business: "accepted",
    businessIdentity: "exact",
    businessResolution: "immutable",
    businessProjection: "read-back",
  };

  assert.equal(deriveFinderRoute(staleAcceptedSummary), "human-steering");
  assert.equal(
    deriveFinderRoute({
      ...staleAcceptedSummary,
      businessChildren: [],
    }),
    "human-steering",
  );
  assert.equal(
    deriveFinderRoute({
      ...staleAcceptedSummary,
      businessChildren: [
        {
          identity: "missing",
          status: "accepted",
          scope: "in-scope",
          resolution: "immutable",
          projection: "read-back",
        },
      ],
    }),
    "human-steering",
  );
  assert.equal(
    deriveFinderRoute({
      ...staleAcceptedSummary,
      businessChildren: [
        {
          identity: "exact",
          status: "accepted",
          scope: "in-scope",
          resolution: "immutable",
          projection: "pending",
        },
      ],
    }),
    "reconcile",
  );
  assert.equal(
    deriveFinderRoute({
      ...staleAcceptedSummary,
      businessChildren: [acceptedBusinessChild()],
    }),
    "return-target",
  );

  for (const invalidProjection of [
    { projectedProductArea: "" },
    { projectedInitiative: "" },
    { projectedEpic: "" },
    { hierarchyReadback: "partial" },
  ]) {
    assert.equal(
      deriveFinderRoute({
        ...staleAcceptedSummary,
        businessChildren: [
          { ...acceptedBusinessChild(), ...invalidProjection },
        ],
      }),
      "human-steering",
    );
  }
});

test("Finder requires one distinct projected Story identity per accepted Functional child", () => {
  const state = {
    targetDepth: "Functional",
    fogIdentity: "exact",
    business: "accepted",
    businessIdentity: "exact",
    businessResolution: "immutable",
    businessProjection: "read-back",
    businessChildren: [acceptedBusinessChild()],
    selectedStoryIntents: ["intent-a", "intent-b"],
    functionalChildren: [
      {
        storyIntent: "intent-a",
        ...exactFunctionalProjection,
        identity: "exact",
        status: "accepted",
        scope: "in-scope",
        resolution: "immutable",
        projection: "read-back",
      },
      {
        storyIntent: "intent-b",
        projectedStory: "story-a",
        ...exactFunctionalProjection,
        identity: "exact",
        status: "accepted",
        scope: "in-scope",
        resolution: "immutable",
        projection: "read-back",
      },
    ],
  };

  assert.equal(deriveFinderRoute(state), "human-steering");
  assert.equal(
    deriveFinderRoute({
      ...state,
      functionalChildren: state.functionalChildren.map((child) => ({
        ...child,
        projectedStory: "story-a",
      })),
    }),
    "human-steering",
  );
});

test("Finder validates Functional Story placement and provenance before completion", () => {
  const state = {
    targetDepth: "Functional",
    fogIdentity: "exact",
    business: "accepted",
    businessIdentity: "exact",
    businessResolution: "immutable",
    businessProjection: "read-back",
    businessChildren: [acceptedBusinessChild()],
    selectedStoryIntents: ["intent-a"],
    functionalChildren: [
      {
        storyIntent: "intent-a",
        projectedStory: "story-a",
        ...exactFunctionalProjection,
        identity: "exact",
        status: "accepted",
        scope: "in-scope",
        resolution: "immutable",
        projection: "read-back",
      },
    ],
  };

  assert.equal(deriveFinderRoute(state), "return-target");
  for (const invalidProjection of [
    { projectedStoryParentEpic: "epic-b" },
    { projectedStoryMilestone: "" },
    { projectedStoryMilestoneKind: "iteration" },
    { projectedStoryFogLink: "missing" },
    { projectedStorySourceLink: "missing" },
    { projectedStoryMembershipReadback: "partial" },
  ]) {
    assert.equal(
      deriveFinderRoute({
        ...state,
        functionalChildren: [
          { ...state.functionalChildren[0], ...invalidProjection },
        ],
      }),
      "human-steering",
    );
  }
});

test("Finder requires exact Technical Task and relation readback", () => {
  const state = {
    targetDepth: "Technical",
    fogIdentity: "exact",
    business: "accepted",
    businessIdentity: "exact",
    businessResolution: "immutable",
    businessProjection: "read-back",
    businessChildren: [acceptedBusinessChild()],
    selectedStoryIntents: ["intent-a"],
    functionalChildren: [
      {
        storyIntent: "intent-a",
        projectedStory: "story-a",
        ...exactFunctionalProjection,
        identity: "exact",
        status: "accepted",
        scope: "in-scope",
        resolution: "immutable",
        projection: "read-back",
      },
    ],
    selectedStories: ["story-a"],
    technicalChildren: [
      {
        story: "story-a",
        identity: "exact",
        status: "accepted",
        scope: "in-scope",
        resolution: "immutable",
        specReadiness: "agent-ready",
        stableBlob: "verified",
        taskIntentCount: 1,
        projection: "read-back",
      },
    ],
  };

  assert.equal(deriveFinderRoute(state), "human-steering");
  assert.equal(
    deriveFinderRoute({
      ...state,
      technicalChildren: [
        {
          ...state.technicalChildren[0],
          taskGraphReadback: "exact",
          projectedTasks: [
            {
              id: "task-a",
              story: "wrong-story",
              milestone: "v1",
              blockedBy: [],
              readback: "exact",
            },
          ],
        },
      ],
    }),
    "human-steering",
  );
});

test("Finder rejects invalid Technical blocker targets, self-edges, and cycles", () => {
  const state = {
    targetDepth: "Technical",
    fogIdentity: "exact",
    business: "accepted",
    businessIdentity: "exact",
    businessResolution: "immutable",
    businessProjection: "read-back",
    businessChildren: [acceptedBusinessChild()],
    selectedStoryIntents: ["intent-a"],
    functionalChildren: [
      {
        storyIntent: "intent-a",
        projectedStory: "story-a",
        ...exactFunctionalProjection,
        identity: "exact",
        status: "accepted",
        scope: "in-scope",
        resolution: "immutable",
        projection: "read-back",
      },
    ],
    selectedStories: ["story-a"],
    technicalChildren: [
      {
        story: "story-a",
        identity: "exact",
        status: "accepted",
        scope: "in-scope",
        resolution: "immutable",
        specReadiness: "agent-ready",
        stableBlob: "verified",
        taskIntentCount: 2,
        projection: "read-back",
        taskGraphReadback: "exact",
        projectedTasks: [
          {
            id: "task-a",
            story: "story-a",
            milestone: "v1",
            blockedBy: [],
            readback: "exact",
          },
          {
            id: "task-b",
            story: "story-a",
            milestone: "v1",
            blockedBy: ["task-a"],
            readback: "exact",
          },
        ],
      },
    ],
  };

  assert.equal(deriveFinderRoute(state), "return-target");
  for (const blockedBy of [["missing"], ["task-b"]]) {
    assert.equal(
      deriveFinderRoute({
        ...state,
        technicalChildren: [
          {
            ...state.technicalChildren[0],
            projectedTasks: state.technicalChildren[0].projectedTasks.map(
              (task) =>
                task.id === "task-b" ? { ...task, blockedBy } : task,
            ),
          },
        ],
      }),
      "human-steering",
    );
  }
  assert.equal(
    deriveFinderRoute({
      ...state,
      technicalChildren: [
        {
          ...state.technicalChildren[0],
          projectedTasks: state.technicalChildren[0].projectedTasks.map(
            (task) =>
              task.id === "task-a"
                ? { ...task, blockedBy: ["task-b"] }
                : task,
          ),
        },
      ],
    }),
    "human-steering",
  );
});

test("Finder requires every projected Task to share its parent Story milestone", () => {
  const state = {
    targetDepth: "Technical",
    fogIdentity: "exact",
    business: "accepted",
    businessIdentity: "exact",
    businessResolution: "immutable",
    businessProjection: "read-back",
    businessChildren: [acceptedBusinessChild()],
    selectedStoryIntents: ["intent-a"],
    functionalChildren: [
      {
        storyIntent: "intent-a",
        projectedStory: "story-a",
        projectedStoryMilestone: "v1",
        ...exactFunctionalProjection,
        identity: "exact",
        status: "accepted",
        scope: "in-scope",
        resolution: "immutable",
        projection: "read-back",
      },
    ],
    selectedStories: ["story-a"],
    technicalChildren: [
      {
        story: "story-a",
        identity: "exact",
        status: "accepted",
        scope: "in-scope",
        resolution: "immutable",
        specReadiness: "agent-ready",
        stableBlob: "verified",
        taskIntentCount: 1,
        projection: "read-back",
        taskGraphReadback: "exact",
        projectedTasks: [
          {
            id: "task-a",
            story: "story-a",
            milestone: "v2",
            blockedBy: [],
            readback: "exact",
          },
        ],
      },
    ],
  };

  assert.equal(deriveFinderRoute(state), "human-steering");
  assert.equal(
    deriveFinderRoute({
      ...state,
      functionalChildren: state.functionalChildren.map(
        ({ projectedStoryMilestone: _, ...child }) => child,
      ),
      technicalChildren: state.technicalChildren.map((child) => ({
        ...child,
        projectedTasks: child.projectedTasks.map((task) => ({
          ...task,
          milestone: "v1",
        })),
      })),
    }),
    "human-steering",
  );
  assert.equal(
    deriveFinderRoute({
      ...state,
      technicalChildren: state.technicalChildren.map((child) => ({
        ...child,
        projectedTasks: child.projectedTasks.map((task) => ({
          ...task,
          milestone: "v1",
        })),
      })),
    }),
    "return-target",
  );
});

test("Finder joins every selected Technical Story to a selected Functional projection", () => {
  const state = {
    targetDepth: "Technical",
    fogIdentity: "exact",
    business: "accepted",
    businessIdentity: "exact",
    businessResolution: "immutable",
    businessProjection: "read-back",
    businessChildren: [acceptedBusinessChild()],
    selectedStoryIntents: ["intent-a"],
    functionalChildren: [
      {
        storyIntent: "intent-a",
        projectedStory: "story-a",
        ...exactFunctionalProjection,
        identity: "exact",
        status: "accepted",
        scope: "in-scope",
        resolution: "immutable",
        projection: "read-back",
      },
      {
        storyIntent: "intent-b",
        projectedStory: "story-b",
        ...exactFunctionalProjection,
        identity: "exact",
        status: "accepted",
        scope: "in-scope",
        resolution: "immutable",
        projection: "read-back",
      },
    ],
    technicalChildren: [],
  };

  assert.equal(
    deriveFinderRoute({ ...state, selectedStories: ["story-stale"] }),
    "human-steering",
  );
  assert.equal(
    deriveFinderRoute({ ...state, selectedStories: ["story-b"] }),
    "human-steering",
  );
  assert.equal(
    deriveFinderRoute({ ...state, selectedStories: ["story-a"] }),
    "technical-grilling",
  );
});

test("Business depth grills one child against existing product structure", () => {
  const business = read("skills/phases/business-finder/SKILL.md");
  const gate = read(
    "skills/phases/finder-phase/phases/business-grilling.md",
  );
  const contract = read(
    "skills/phases/finder-phase/references/entrypoint-contract.md",
  );
  const all = `${business}\n${gate}\n${contract}`;
  const normalizedGate = gate.replace(/\s+/gu, " ");

  assert.match(business, /nontechnical product owner/iu);
  assert.match(business, /plain business language/iu);
  assert.match(business, /Business grilling gate/iu);
  assert.match(gate, /Stage\s+`Business`, and singleton cardinality key/iu);
  assert.match(gate, /atomic `\$grilling`/iu);
  assert.doesNotMatch(gate, /(?:activate|invoke|run)\s+`\$requirements-grill`/iu);
  assert.match(gate, /existing Product Areas, Initiatives, Epics, milestones/iu);
  assert.ok(
    normalizedGate.includes(
      "`$show-me` to visualize all relevant existing Product Areas, Initiatives, Epics, and milestones together with the proposed impact",
    ),
  );
  assert.match(gate, /`\$wait-what`/u);
  assert.match(gate, /pause, repitch plainly in project language, and ask\s+again/iu);
  assert.match(gate, /reuse and enrichment/iu);
  assert.match(gate, /Never duplicate an Initiative/iu);
  assert.match(gate, /Existing\s+Product Areas and Initiatives may be changed/iu);
  assert.match(gate, /scope-expansion-checkpoint/iu);
  assert.match(all, /Fog (?:stays|is) lateral/iu);
});

test("Finder return shape preserves stage cardinality at every target depth", () => {
  const contract = read(
    "skills/phases/finder-phase/references/entrypoint-contract.md",
  );
  const target = read("skills/phases/finder-phase/phases/return-target.md");
  const all = `${contract}\n${target}`;
  const normalizedContract = contract.replace(/\s+/gu, " ");
  const normalizedAll = all.replace(/\s+/gu, " ");

  assert.ok(
    normalizedContract.includes(
      "stage child identities and immutable resolution pointers",
    ),
  );
  assert.match(
    normalizedAll,
    /Business returns (?:exactly )?(?:after )?one Business child.{0,180}Functional returns (?:one or more|after all selected) Functional children.{0,180}Technical returns (?:exactly )?one Technical child per selected Story/isu,
  );
});

test("Finder proves exact Fog and Business-child cardinality before projection", () => {
  const ensure = read("skills/phases/finder-phase/phases/ensure-fog.md");
  const business = read(
    "skills/phases/finder-phase/phases/business-grilling.md",
  );
  const handback = read("skills/phases/finder-phase/phases/handback.md");

  assert.match(ensure, /allocate one durable wiki Fog identity, persist it once/iu);
  assert.match(ensure, /search\s+by that identity before proposing a create/iu);
  assert.match(ensure, /exactly one provider Fog read back/iu);
  assert.match(business, /Exactly one Business child/iu);
  assert.match(business, /Resume reuses\s+the exact child/iu);
  assert.match(business, /Ambiguity or duplicate.{0,100}zero writes/isu);
  assert.match(handback, /zero-write proof/iu);
});

test("Finder ensures a durable grilling child shell before resolving its grill", () => {
  const business = read(
    "skills/phases/finder-phase/phases/business-grilling.md",
  ).replace(/\s+/gu, " ");
  const functional = read(
    "skills/phases/finder-phase/phases/functional-grilling.md",
  ).replace(/\s+/gu, " ");

  assert.match(
    business,
    /allocate and persist one durable Business grilling-child wiki identity.{0,180}exact Fog identity, Stage `Business`, and singleton cardinality key/iu,
  );
  assert.match(
    functional,
    /allocate and persist one durable Functional grilling-child wiki identity.{0,180}exact Fog identity, Stage `Functional`, and stable Story-intent key/iu,
  );

  for (const gate of [business, functional]) {
    const ensure = gate.indexOf("child-shell ensure intent to `$write-backlog`");
    const grill = gate.indexOf("Activate atomic `$grilling`");
    const resolution = gate.indexOf("immutable accepted resolution");
    const projection = gate.indexOf("projection intent");
    assert.ok(ensure >= 0 && ensure < grill);
    assert.ok(grill < resolution && resolution < projection);
    assert.match(gate, /does not require accepted grilling evidence/iu);
    assert.match(gate, /ambiguity or duplicate.{0,100}zero writes.{0,100}human steering/iu);
    assert.match(gate, /resume reuses the exact child/iu);
  }
});

test("Technical gate resolves one Story through spec and nonempty Task intent before projection", () => {
  const gate = read(
    "skills/phases/finder-phase/phases/technical-grilling.md",
  ).replace(/\s+/gu, " ");

  assert.match(
    gate,
    /allocate and persist one durable Technical grilling-child wiki identity.{0,180}exact Fog identity, Stage `Technical`, and stable Story identity/iu,
  );
  const ensure = gate.indexOf("child-shell ensure intent to `$write-backlog`");
  const grill = gate.indexOf("Activate one full `$requirements-grill`");
  const resolution = gate.indexOf("immutable accepted resolution");
  const createSpec = gate.indexOf("Invoke `$create-spec`");
  const readiness = gate.indexOf("`readiness: agent-ready`");
  const blob = gate.indexOf("verified stable blob URL");
  const tasks = gate.indexOf("nonempty Task intent");
  const projection = gate.indexOf("technical projection intent");
  assert.ok(ensure >= 0 && ensure < grill);
  assert.ok(grill < resolution && resolution < createSpec);
  assert.ok(createSpec < readiness && readiness < blob);
  assert.ok(blob < tasks && tasks < projection);
  assert.match(
    gate,
    /`spec-not-ready` or missing verified stable blob.{0,160}zero projection.{0,120}human steering/iu,
  );
  assert.match(
    gate,
    /ambiguity or duplicate.{0,100}zero writes.{0,100}human steering/iu,
  );
});
