import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { deriveFinderRoute } from "../skills/phases/finder-phase/scripts/finder-contract.mjs";

const skill = readFileSync(
  new URL(
    "../skills/agnostic/requirements/requirements-grill/SKILL.md",
    import.meta.url,
  ),
  "utf8",
);

const flow = readFileSync(
  new URL(
    "../skills/agnostic/requirements/requirements-grill/references/grilling-flow.md",
    import.meta.url,
  ),
  "utf8",
);

const artifact = readFileSync(
  new URL(
    "../skills/agnostic/requirements/requirements-grill/references/artifact-output.md",
    import.meta.url,
  ),
  "utf8",
);

test("requirements-grill delegates live completion semantics to grilling", () => {
  assert.match(skill, /When `\$grilling` reports completion/);
  assert.doesNotMatch(skill, /After the frontier is empty/);
});

test("requirements-grill uses show-me throughout live branch traversal", () => {
  assert.match(
    skill,
    /\$show-me.*throughout the active grill.*difficult questions.*comparisons.*interacting parts.*key turning points/is,
  );
  assert.match(skill, /smallest applicable view.*full view catalog/is);
  assert.match(
    flow,
    /inside any grilling branch.*difficult question.*comparison.*interacting parts.*key turning point/is,
  );
  assert.match(
    flow,
    /each persisted round boundary.*next frontier.*glossary.*parked branches.*flow.*\$show-me/is,
  );
  assert.match(flow, /persisted artifacts remain authoritative/is);
});

test("requirements-grill grounds technical branches before the first frontier", () => {
  assert.match(skill, /Before `\$grilling` constructs the first frontier/is);
  assert.doesNotMatch(skill, /when they clarify the current decision/is);

  const grounding = flow.indexOf("## Technical Grounding");
  const firstFrontier = flow.indexOf(
    "Before `$grilling` constructs the first frontier",
  );
  const roundIntegration = flow.indexOf("## Round Artifact Integration");

  assert.notEqual(grounding, -1);
  assert.ok(firstFrontier > grounding);
  assert.ok(firstFrontier < roundIntegration);
  assert.match(
    flow,
    /concrete evidence anchors.*`path:symbol`.*schema.*contract operation.*configuration key.*runtime flow/is,
  );
  assert.match(
    flow,
    /Open the first frontier only when no active technical branch remains `unknown`/is,
  );
});

test("technical questions carry evidence and code consequences", () => {
  assert.match(
    flow,
    /State the evidence anchor and observed code constraint.*unresolved requirements decision.*code consequence/is,
  );
  assert.match(
    artifact,
    /Evidence anchor:.*Observed constraint:.*Question:.*Code consequence:/is,
  );
  assert.match(
    flow,
    /requirements evidence, not an implementation plan.*ownership.*contract.*invariant.*lifecycle.*boundary/is,
  );
});

test("technical grounding blocks premature branch closure", () => {
  assert.match(
    artifact,
    /Technical Grounding.*Evidence anchors.*Applicable dimensions.*Open technical decisions.*Grounding/is,
  );
  assert.match(
    artifact,
    /`grounded` means evidence anchors exist and every applicable technical dimension is answered, parked, deferred, or marked not applicable with supporting evidence/is,
  );
  assert.match(
    artifact,
    /Keep a branch below `100%`.*technical grounding is `unknown` or has open decisions/is,
  );
  assert.match(
    artifact,
    /no unanswered item.*unknown technical grounding.*open technical decision.*`100%`/is,
  );
});

test("Technical Finder preserves full requirements authority before projection", () => {
  const technicalFinder = readFileSync(
    new URL("../skills/phases/technical-finder/SKILL.md", import.meta.url),
    "utf8",
  ).replace(/\s+/gu, " ");
  const technicalGate = readFileSync(
    new URL(
      "../skills/phases/finder-phase/phases/technical-grilling.md",
      import.meta.url,
    ),
    "utf8",
  ).replace(/\s+/gu, " ");

  assert.match(technicalFinder, /full `\$requirements-grill`/u);
  assert.match(technicalFinder, /once per Story/iu);
  assert.match(technicalFinder, /open or resume exactly one durable/iu);
  assert.match(technicalGate, /full `\$requirements-grill`/u);
  assert.match(technicalGate, /`\$create-spec`/u);

  assert.equal(
    deriveFinderRoute({
      targetDepth: "Technical",
      fogIdentity: "exact",
      business: "accepted",
      businessProjection: "read-back",
      selectedStoryIntents: ["intent-a"],
      functionalChildren: [
        {
          storyIntent: "intent-a",
          identity: "exact",
          status: "accepted",
          scope: "in-scope",
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
          specReadiness: "spec-not-ready",
          stableBlob: "missing",
          taskIntentCount: 0,
          projection: "not-emitted",
        },
      ],
    }),
    "human-steering",
  );
});
