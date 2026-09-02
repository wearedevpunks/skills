import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { test } from "node:test";
import { deriveFinderRoute } from "../skills/phases/finder-phase/scripts/finder-contract.mjs";

const read = (path) =>
  readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

const normalize = (value) => value.replace(/\s+/gu, " ");

test("public Finder intake consists of exactly two explicit-only wrappers", () => {
  const wrappers = ["business-finder", "functional-finder"];

  for (const wrapper of wrappers) {
    const skill = read(`skills/phases/${wrapper}/SKILL.md`);
    const metadata = read(`skills/phases/${wrapper}/agents/openai.yaml`);

    assert.match(skill, /disable-model-invocation:\s*true/u);
    assert.match(metadata, /allow_implicit_invocation:\s*false/u);
    assert.match(skill, /Finder engine/iu);
  }

  assert.equal(
    existsSync(
      new URL("../skills/phases/technical-finder/SKILL.md", import.meta.url),
    ),
    false,
    "Technical Finder must not remain a public route",
  );
});

test("wrappers own their nontechnical intake profiles and projection ceilings", () => {
  const business = normalize(read("skills/phases/business-finder/SKILL.md"));
  const functional = normalize(read("skills/phases/functional-finder/SKILL.md"));

  for (const field of [
    "actor or affected party",
    "problem or opportunity",
    "desired outcome",
    "value",
    "evidence",
    "constraints",
    "non-goals",
    "urgency",
    "open questions",
  ]) {
    assert.match(business, new RegExp(field, "iu"));
  }
  assert.match(business, /unknown values remain explicit/iu);
  assert.match(business, /optional.{0,80}Product Areas and Initiatives/iu);
  assert.match(business, /ceiling.{0,40}Initiative/iu);
  assert.match(business, /never.{0,40}(?:Epic|Stories|Tasks)/iu);

  for (const field of [
    "actor",
    "trigger",
    "workflow",
    "observable result",
    "domain rules",
    "alternate and failure paths",
    "acceptance signals",
    "boundaries",
    "product dependencies",
    "technical handoff questions",
  ]) {
    assert.match(functional, new RegExp(field.replace("*", "\\*"), "iu"));
  }
  assert.match(functional, /`V\*` milestone context/iu);
  assert.match(functional, /includes every Business Finder capability/iu);
  assert.match(functional, /optional.{0,100}Product Areas, Initiatives, and Epics/iu);
  assert.match(functional, /ceiling.{0,40}Epic/iu);
  assert.match(functional, /never projects Stories or Tasks/iu);
});

test("Finder creates or resumes one Fog with an immutable intake lens", () => {
  assert.equal(
    deriveFinderRoute({ targetLens: "Business", fogIdentity: "missing" }),
    "ensure-fog",
  );
  assert.equal(
    deriveFinderRoute({
      targetLens: "Functional",
      fogIdentity: "exact",
      intakeLens: "Business",
      grillingChildren: [],
    }),
    "grilling",
    "the immutable original lens is provenance, not a maturity gate",
  );
  assert.equal(
    deriveFinderRoute({
      targetLens: "Functional",
      fogIdentity: "exact",
      intakeLens: "Functional",
      grillingChildren: [],
    }),
    "grilling",
  );
});

test("Finder routes generic support work by evidence without a child cardinality", () => {
  const base = {
    targetLens: "Business",
    fogIdentity: "exact",
    intakeLens: "Business",
    grillingChildren: [
      { id: "grill-a", identity: "exact" },
      { id: "grill-b", identity: "exact" },
    ],
  };

  assert.equal(
    deriveFinderRoute({
      ...base,
      selection: { decision: "reuse", childId: "grill-a" },
    }),
    "grilling",
  );
  assert.equal(
    deriveFinderRoute({ ...base, selection: { decision: "create" } }),
    "grilling",
  );
  assert.equal(
    deriveFinderRoute({ ...base, selection: { decision: "ambiguous" } }),
    "human-steering",
  );
  assert.equal(
    deriveFinderRoute({
      ...base,
      selection: { decision: "reuse", childId: "grill-b" },
      support: {
        kind: "Research",
        decision: "reuse",
        supports: "grill-b",
        status: "unresolved",
      },
    }),
    "research",
  );
  assert.equal(
    deriveFinderRoute({
      ...base,
      selection: { decision: "reuse", childId: "grill-a" },
      support: {
        kind: "Prototype",
        decision: "create",
        supports: "grill-a",
        status: "unresolved",
      },
    }),
    "prototype",
  );
});

test("Finder returns a bounded result without completing the Fog or exceeding its ceiling", () => {
  const functional = {
    targetLens: "Functional",
    fogIdentity: "exact",
    intakeLens: "Functional",
    grillingChildren: [{ id: "grill-a", identity: "exact" }],
    boundedResult: "ready",
  };

  assert.equal(
    deriveFinderRoute({
      ...functional,
      grillingChildren: undefined,
      projection: { status: "skipped" },
    }),
    "human-steering",
    "bounded return requires durable Grilling-child readback",
  );
  assert.equal(
    deriveFinderRoute({
      ...functional,
      grillingChildren: { id: "grill-a", identity: "exact" },
      projection: { status: "skipped" },
    }),
    "human-steering",
    "malformed Grilling-child readback fails closed",
  );

  assert.equal(
    deriveFinderRoute({
      ...functional,
      support: {
        kind: "Research",
        decision: "reuse",
        supports: "grill-a",
        status: "pending",
      },
      projection: { status: "skipped" },
    }),
    "human-steering",
    "pending support cannot be omitted from a bounded return",
  );
  assert.equal(
    deriveFinderRoute({
      ...functional,
      support: {
        kind: "Prototype",
        decision: "create",
        supports: "grill-a",
        status: "requested",
      },
      projection: { status: "skipped" },
    }),
    "human-steering",
    "requested support cannot be omitted from a bounded return",
  );

  assert.equal(
    deriveFinderRoute({ ...functional, projection: { status: "skipped" } }),
    "return-target",
  );
  assert.equal(
    deriveFinderRoute({ ...functional, projection: { status: "unresolved" } }),
    "return-target",
  );
  assert.equal(
    deriveFinderRoute({
      ...functional,
      projection: { status: "pending", kinds: ["Epic"] },
    }),
    "reconcile",
  );
  assert.equal(
    deriveFinderRoute({
      ...functional,
      targetLens: "Business",
      intakeLens: "Business",
      projection: { status: "pending", kinds: ["Epic"] },
    }),
    "human-steering",
  );
  assert.equal(
    deriveFinderRoute({
      ...functional,
      projection: { status: "read-back", kinds: ["ProductArea", "Initiative", "Epic"] },
    }),
    "return-target",
  );
  assert.equal(
    deriveFinderRoute({
      ...functional,
      projection: { status: "read-back", kinds: ["Epic", "Story"] },
    }),
    "human-steering",
  );
  assert.equal(
    deriveFinderRoute({
      ...functional,
      targetLens: "Business",
      intakeLens: "Business",
      projection: { status: "read-back", kinds: ["ProductArea", "Initiative", "Epic"] },
    }),
    "human-steering",
  );
  assert.equal(
    deriveFinderRoute({
      ...functional,
      projection: { status: "skipped" },
      historicalStage: "Technical",
    }),
    "return-target",
    "historical Stage data is compatibility evidence, not a current gate",
  );
});
