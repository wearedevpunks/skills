import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";

const root = path.resolve(import.meta.dirname, "..");
const read = (relativePath) => readFileSync(path.join(root, relativePath), "utf-8");
const writerRoot = "skills/agnostic/requirements/write-backlog";

test("write-backlog remains the ticket-structuring entrypoint and sole writer", () => {
  const skill = read(`${writerRoot}/SKILL.md`);
  assert.match(skill, /sole physical provider mutation authority/iu);
  assert.match(skill, /Preserve[\s\S]*accepted wording/iu);
  assert.match(skill, /Every written ticket remains understandable/iu);
  assert.match(skill, /Finder[\s\S]*delivery callers never perform provider writes/iu);
});

test("Fog intake preserves child evidence without authorizing projection", () => {
  const fog = read(`${writerRoot}/references/fog-intake.md`);
  assert.match(fog, /kind: `grilling`[\s\S]*bounded unknown/iu);
  assert.match(fog, /Research or Prototype[\s\S]*exact unknown or Grilling work/iu);
  assert.doesNotMatch(fog, /Stage: Business, Functional, or Technical/iu);
  assert.match(fog, /answer or verdict[\s\S]*immutable resolution pointer/iu);
  assert.match(fog, /cannot authorize[\s\S]*projection/iu);
  assert.match(fog, /lateral provenance/iu);
});

test("Functional projection preserves product traceability at its Epic ceiling", () => {
  const functional = read(`${writerRoot}/references/functional-projection.md`);
  const shape = read(`${writerRoot}/assets/concepts/story-shape.md`);
  assert.match(functional, /Epic ceiling/iu);
  assert.match(functional, /creates neither Story nor[\s\S]*Task/iu);
  assert.match(functional, /user\s+wording/iu);
  assert.match(functional, /accepted evidence traceability/iu);
  assert.match(shape, /Story body[\s\S]*Outcome[\s\S]*Source outcomes[\s\S]*Acceptance criteria[\s\S]*Demonstration/iu);
  assert.match(shape, /Story body[\s\S]*Non-goals[\s\S]*Dependencies[\s\S]*Durable accepted-artifact links/iu);
});

test("delivery projection derives provider identities from immutable spec authority", () => {
  const technical = read(`${writerRoot}/references/technical-projection.md`);
  assert.match(technical, /verified stable blob URL/iu);
  assert.match(technical, /authoritative agent-ready `SPEC\.md`/iu);
  assert.match(technical, /`OUT-###` outcomes[\s\S]*acceptance criteria/iu);
  assert.match(technical, /accepted Epic/iu);
  assert.match(technical, /shippable Stories/iu);
  assert.match(technical, /one or more[\s\S]*mandatory Tasks/iu);
  assert.match(technical, /write\s+nothing/iu);
  assert.ok(
    technical.indexOf("## Authority Enrichment") < technical.indexOf("## Story and Task Split"),
    "authority enrichment precedes Task split",
  );
});

test("Task bodies are owner-ready and preserve planning identity", () => {
  const technical = read(`${writerRoot}/references/technical-projection.md`);
  const shape = read(`${writerRoot}/assets/concepts/story-shape.md`);
  assert.match(technical, /provider Tasks form the execution graph that downstream planning preserves/iu);
  assert.match(shape, /Task body[\s\S]*Responsibility[\s\S]*Owner[\s\S]*Acceptance[\s\S]*Verification[\s\S]*Blockers/iu);
  assert.match(shape, /Immutable spec/iu);
});

test("writer validates the complete reachable blocker graph before mutation", () => {
  const technical = read(`${writerRoot}/references/technical-projection.md`);
  assert.match(technical, /full reachable Task graph/iu);
  assert.match(technical, /missing targets/iu);
  assert.match(technical, /future-iteration dependencies/iu);
  assert.match(technical, /self-edges/iu);
  assert.match(technical, /cycles/iu);
  assert.match(technical, /before[\s\S]*provider write|write nothing/iu);
});

test("milestone iteration membership and metadata fallback stay coherent", () => {
  const initialization = read(`${writerRoot}/references/backlog-initialization.md`);
  const model = read(`${writerRoot}/assets/concepts/backlog-model.md`);
  assert.match(model, /Every Story belongs to exactly one contextual `V\*`/iu);
  assert.match(model, /Every derived[\s\S]*Task belongs to its Story's milestone/iu);
  assert.match(initialization, /Version name[\s\S]*One-sentence product goal[\s\S]*Included product outcomes or capability changes/iu);
  assert.match(initialization, /unsupported[\s\S]*name only/iu);
  assert.doesNotMatch(`${initialization}\n${model}`, /\bM\d+\b|execution milestone/iu);
});

test("topology previews explain authority without granting approval", () => {
  const skill = read(`${writerRoot}/SKILL.md`);
  assert.match(skill, /`\$show-me`[\s\S]*authority-derived topology/iu);
  assert.match(skill, /visual[\s\S]*not approval/iu);
  assert.match(skill, /require explicit\s+approval/iu);
  assert.match(skill, /canonical glossary[\s\S]*accepted wording/iu);
});

test("examples demonstrate Finder ceilings, delivery derivation, and exact readback", () => {
  const examples = read(`${writerRoot}/EXAMPLES.md`);
  assert.match(examples, /Existing structure is reused/iu);
  assert.match(examples, /Business[\s\S]*Functional[\s\S]*Requirements delivery projection/u);
  assert.doesNotMatch(examples, /\*\*Technical\*\*/u);
  assert.match(examples, /Story[\s\S]*Task/u);
  assert.match(examples, /exact readback/iu);
  assert.match(examples, /zero writes/iu);
});

test("active writer guidance excludes the retired monolith", () => {
  const active = [
    "SKILL.md",
    "REFERENCE.md",
    "EXAMPLES.md",
    "assets/concepts/backlog-model.md",
    "assets/concepts/story-shape.md",
    "references/project-context.md",
    "references/backlog-initialization.md",
    "references/fog-intake.md",
    "references/business-projection.md",
    "references/functional-projection.md",
    "references/technical-projection.md",
    "references/issue-reconciliation.md",
  ].map((file) => read(`${writerRoot}/${file}`)).join("\n");

  assert.doesNotMatch(active, /capability module|fog graduates|M1 -> M2|Azure DevOps|monday\.com/iu);
});
