import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { deriveFinderRoute } from "../skills/phases/finder-phase/scripts/finder-contract.mjs";

const read = (path) =>
  readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

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
    assert.equal(
      deriveFinderRoute(scenario.state),
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
