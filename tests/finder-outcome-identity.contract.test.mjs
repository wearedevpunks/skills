import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";

const root = path.resolve(import.meta.dirname, "..");
const read = (relativePath) =>
  readFileSync(path.join(root, relativePath), "utf-8");

const createSpecRoot = "skills/agnostic/planning/create-spec";
const surfaces = {
  skill: read(`${createSpecRoot}/SKILL.md`),
  template: read(`${createSpecRoot}/assets/SPEC-TEMPLATE.md`),
  readiness: read(`${createSpecRoot}/references/readiness.md`),
  quality: read(`${createSpecRoot}/references/spec-quality-bar.md`),
  projection: read(
    "skills/agnostic/requirements/write-backlog/references/technical-projection.md",
  ),
};

test("Create Spec publishes neutral outcomes with complete one-way acceptance coverage", () => {
  assert.match(surfaces.template, /## Requirements and Outcomes/iu);
  assert.match(surfaces.template, /OUT-001:/u);
  assert.match(surfaces.template, /Covers: OUT-001/u);

  assert.match(
    surfaces.readiness,
    /every unique `OUT-###`.{0,120}at least one `AC-###`/isu,
  );
  assert.match(
    surfaces.readiness,
    /every `Covers` reference.{0,120}existing `OUT-###`/isu,
  );
  assert.match(surfaces.readiness, /one-way.{0,120}acceptance criterion/isu);

  assert.match(surfaces.quality, /requirements and outcomes/iu);
  assert.match(surfaces.quality, /one-way `OUT-###`/iu);
});

test("Create Spec remains a provider-neutral immutable compiler", () => {
  assert.match(surfaces.skill, /provider-neutral/iu);
  assert.match(surfaces.skill, /verified stable blob URL/iu);
  assert.match(surfaces.skill, /confirmed decisions/iu);
  assert.doesNotMatch(
    surfaces.skill,
    /provider Story (?:identity|selection|count)/iu,
  );
});

test("Write Backlog derives delivery identities independently from outcome traceability", () => {
  assert.match(
    surfaces.projection,
    /derive or reuse.{0,180}Epic.{0,180}derive.{0,180}Stories.{0,180}Tasks/isu,
  );
  assert.match(
    surfaces.projection,
    /`OUT-###`.{0,160}traceability.{0,160}(?:does not|never|neither).{0,120}(?:identity|count)/isu,
  );
  assert.match(surfaces.projection, /verified stable blob URL/iu);

  const projection = {
    outcomes: ["OUT-001", "OUT-002", "OUT-003"],
    stories: [
      { id: "STORY-A", outcomes: ["OUT-001", "OUT-002"] },
      { id: "STORY-B", outcomes: ["OUT-003"] },
    ],
  };
  const tracedOutcomes = projection.stories.flatMap((story) => story.outcomes);

  assert.notEqual(projection.outcomes.length, projection.stories.length);
  assert.deepEqual(new Set(tracedOutcomes), new Set(projection.outcomes));
});

test("all compiler and projection surfaces reject staged Story identity bridges", () => {
  for (const [name, document] of Object.entries(surfaces)) {
    assert.doesNotMatch(document, /US-###|US-\d{3}/u, name);
    assert.doesNotMatch(document, /User Stories/iu, name);
    assert.doesNotMatch(document, /Technical Finder/iu, name);
    assert.doesNotMatch(document, /exact selected Story/iu, name);
    assert.doesNotMatch(
      document,
      /one (?:outcome|requirement).{0,80}one Story|one Story.{0,80}(?:outcome|requirement)/isu,
      name,
    );
  }
});
