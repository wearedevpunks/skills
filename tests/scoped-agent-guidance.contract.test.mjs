import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

test("hi post-command flow preserves the complete structure-first authoring contract", () => {
  const flow = read("skills/agnostic/cli/hi-cli/references/post-command-flow.md");

  assert.match(flow, /\.devpunks\/specs\/prompts\/\*\*/u);
  assert.match(flow, /structure, placement, dependencies, and boundaries first/u);
  assert.match(flow, /exact-trigger pointers/u);
  assert.match(flow, /Skill \| What \/ when/u);
  assert.match(flow, /derived from its complete `SKILL\.md`/u);
  assert.match(flow, /always link `opensrc\/README\.md`/u);
});

test("create-plan combines exact scoped triggers with implementation evidence guidance", () => {
  const skill = read("skills/agnostic/planning/create-plan/SKILL.md");
  const reference = read("skills/agnostic/planning/create-plan/REFERENCE.md");
  const graph = read(
    "skills/agnostic/planning/create-plan/references/planner-task-graph.md",
  );

  for (const source of [skill, reference, graph]) {
    assert.match(source, /Skill \| What \/ when/u);
    assert.match(source, /complete `SKILL\.md`/u);
    assert.doesNotMatch(source, /Primary skills here/u);
  }

  assert.match(skill, /exact `What \/ when`\s+triggers/u);
  assert.match(reference, /select exact trigger matches/u);
  assert.match(graph, /exact `What \/ when` trigger/u);

  assert.match(skill, /implementation_skill_guidance/u);
  assert.match(graph, /implementation-applicable item[\s\S]{0,160}exactly one/u);
  assert.match(graph, /`assigned_skills` remains planning provenance/u);
  assert.match(graph, /`implementation_skill_guidance` is the executor handoff/u);
  assert.match(graph, /missing or duplicate implementation guidance/u);
});
