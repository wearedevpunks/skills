import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { deriveFinderRoute } from "../skills/phases/finder-phase/scripts/finder-contract.mjs";

const read = (path) =>
  readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
const normalize = (value) => value.replace(/\s+/gu, " ");

test("Finder derives exactly one route from fresh evidence on cold resume", () => {
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

test("Finder exposes one durable generic-child graph behind both wrappers", () => {
  const skill = read("skills/phases/finder-phase/SKILL.md");
  const router = read("skills/phases/finder-phase/phases/router.md");
  const handoff = read("skills/phases/finder-phase/references/runtime-handoff.md");
  const entrypoint = read("skills/phases/finder-phase/references/entrypoint-contract.md");
  const gates = [
    "ensure-fog",
    "grilling",
    "research",
    "prototype",
    "reconcile",
    "return-target",
    "handback",
  ];

  assert.match(skill, /disable-model-invocation:\s*true/u);
  assert.match(skill, /cold resume/iu);
  assert.match(skill, /load exactly one selected gate/iu);
  assert.match(router, /exactly one route/iu);
  assert.match(router, /current direct evidence/iu);
  assert.match(router, /workflow-native artifacts/iu);
  assert.match(router, /committed runtime handoff/iu);
  assert.match(router, /suggested route/iu);
  assert.match(entrypoint, /exactly `Business` or `Functional`/iu);
  assert.match(entrypoint, /immutable original intake lens/iu);
  assert.match(entrypoint, /several generic `Kind\/grilling` children/iu);
  assert.match(entrypoint, /Research and Prototype/iu);
  assert.match(handoff, /Generic Grilling child identities/iu);
  assert.match(handoff, /immutable original intake lens/iu);

  for (const gate of gates) {
    const content = read(`skills/phases/finder-phase/phases/${gate}.md`);
    for (const heading of [
      "Entry guard",
      "Bounded action",
      "Completion evidence",
      "Declared exits",
      "Durable handoff",
    ]) {
      assert.match(content, new RegExp(heading, "iu"), `${gate}: ${heading}`);
    }
  }
});

test("Finder owns no delivery-depth route and bounded return never completes a Fog", () => {
  const active = normalize(
    [
      read("skills/phases/finder-phase/SKILL.md"),
      read("skills/phases/finder-phase/phases/router.md"),
      read("skills/phases/finder-phase/phases/grilling.md"),
      read("skills/phases/finder-phase/phases/reconcile.md"),
      read("skills/phases/finder-phase/phases/return-target.md"),
      read("skills/phases/finder-phase/references/entrypoint-contract.md"),
      read("skills/phases/finder-phase/references/state-graph.md"),
    ].join("\n"),
  );

  assert.doesNotMatch(active, /Technical Finder|technical-grilling/iu);
  assert.doesNotMatch(active, /`\$requirements-grill`|`\$create-spec`/iu);
  assert.doesNotMatch(active, /project(?:s|ion)? (?:a )?(?:Story|Task)/iu);
  assert.match(active, /projection ceiling/iu);
  assert.match(active, /without asserting.{0,80}Fog.{0,40}(?:resolved|complete)/iu);
  assert.match(active, /historical.{0,80}compatibility evidence.{0,80}not.{0,40}gate/iu);
});

test("Finder graph authoring audit records the repaired terminal contract", () => {
  const handoff = normalize(
    read("skills/phases/finder-phase/AUTHORING-HANDOFF.md"),
  );

  assert.match(handoff, /Phase: audit/iu);
  assert.match(handoff, /Status: complete/iu);
  assert.match(handoff, /two explicit-only wrappers/iu);
  assert.match(handoff, /generic Grilling, Research, and Prototype/iu);
  assert.match(handoff, /human_steering_required/iu);
  assert.match(handoff, /audit-complete terminal/iu);
});
