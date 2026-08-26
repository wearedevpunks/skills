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
  assert.match(skill, /preserves the user's ticket wording/iu);
  assert.match(skill, /structuring the ticket correctly/iu);
  assert.match(skill, /Finder and delivery callers never perform provider writes/iu);
});

test("Fog intake preserves child evidence without authorizing projection", () => {
  const fog = read(`${writerRoot}/references/fog-intake.md`);
  assert.match(fog, /kind: `grilling`[\s\S]*Stage: Business, Functional, or Technical/iu);
  assert.match(fog, /Research or Prototype[\s\S]*exact grilling child/iu);
  assert.match(fog, /answer or verdict[\s\S]*immutable resolution pointer/iu);
  assert.match(fog, /cannot authorize[\s\S]*projection/iu);
  assert.match(fog, /lateral provenance/iu);
});

test("Functional Stories preserve product traceability and one shippable outcome", () => {
  const functional = read(`${writerRoot}/references/functional-projection.md`);
  const shape = read(`${writerRoot}/assets/concepts/story-shape.md`);
  assert.match(functional, /one Story per Functional child/iu);
  assert.match(functional, /user wording/iu);
  assert.match(functional, /`US-###`\/`AC-###` traceability/iu);
  assert.match(shape, /Story body[\s\S]*Outcome[\s\S]*Source stories[\s\S]*Acceptance criteria[\s\S]*Demonstration/iu);
  assert.match(shape, /Story body[\s\S]*Non-goals[\s\S]*Dependencies[\s\S]*Durable accepted-artifact links/iu);
});

test("Technical projection requires immutable spec authority before Tasks", () => {
  const technical = read(`${writerRoot}/references/technical-projection.md`);
  assert.match(technical, /verified stable blob URL/iu);
  assert.match(technical, /authoritative agent-ready `SPEC\.md`/iu);
  assert.match(technical, /stable user stories[\s\S]*acceptance criteria/iu);
  assert.match(technical, /enrich(?:es)? the existing Epic and Story[\s\S]*verified immutable spec authority/iu);
  assert.match(technical, /one or more mandatory[\s\S]*Tasks/iu);
  assert.match(technical, /write\s+nothing/iu);
  assert.ok(
    technical.indexOf("## Authority Enrichment") < technical.indexOf("## Task Split"),
    "authority enrichment precedes Task split",
  );
});

test("Task bodies are owner-ready and preserve planning identity", () => {
  const technical = read(`${writerRoot}/references/technical-projection.md`);
  const shape = read(`${writerRoot}/assets/concepts/story-shape.md`);
  assert.match(technical, /provider execution graph that downstream planning preserves/iu);
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
  assert.match(model, /Every Task belongs to the same iteration/iu);
  assert.match(initialization, /Version name[\s\S]*One-sentence product goal[\s\S]*Included product outcomes or capability changes/iu);
  assert.match(initialization, /unsupported[\s\S]*name only/iu);
  assert.doesNotMatch(`${initialization}\n${model}`, /\bM\d+\b|execution milestone/iu);
});

test("topology previews explain authority without granting approval", () => {
  const skill = read(`${writerRoot}/SKILL.md`);
  assert.match(skill, /`\$show-me`[\s\S]*authority-derived topology/iu);
  assert.match(skill, /visual[\s\S]*not approval/iu);
  assert.match(skill, /require explicit approval/iu);
  assert.match(skill, /`\$wait-what`[\s\S]*project terms/iu);
});

test("examples demonstrate reuse, staged projection, and exact readback", () => {
  const examples = read(`${writerRoot}/EXAMPLES.md`);
  assert.match(examples, /Existing structure is reused/iu);
  assert.match(examples, /Business[\s\S]*Functional[\s\S]*Technical/u);
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
