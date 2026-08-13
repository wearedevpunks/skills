import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

const read = (path) =>
  readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

test("create-plan persists an enforceable architecture convergence contract", () => {
  const skill = read("skills/agnostic/planning/create-plan/SKILL.md");
  const schema = read(
    "skills/agnostic/planning/create-plan/references/plan-schema.md",
  );
  const convergence = read(
    "skills/agnostic/planning/create-plan/references/architecture-convergence.md",
  );
  const combined = `${skill}\n${schema}\n${convergence}`;

  assert.match(combined, /architecture applicability.*local.*architecture-bearing/is);
  assert.match(combined, /Target Ownership Topology/);
  assert.match(combined, /Declared Dependency Graph/);
  assert.match(combined, /Responsibility Acceptance Criteria/);
  assert.match(combined, /Architecture Waves/);
  assert.match(convergence, /invoke `?\$show-me`?.*each.*persisted view/is);
  assert.match(convergence, /backend-domain-structure/);
  assert.match(convergence, /frontend-domain-structure/);
  assert.match(convergence, /public seam contract/i);
  assert.match(convergence, /migration ledger/i);
  assert.match(convergence, /continuous convergence checkpoint/i);
  assert.match(convergence, /migration ledger.*empty/is);
  assert.ok(
    skill.indexOf("references/architecture-convergence.md") <
      skill.indexOf("references/planner-task-graph.md"),
    "architecture contract must shape task-graph construction",
  );
});

test("create-plan tasks carry cumulative architecture conformance fields", () => {
  const reference = read("skills/agnostic/planning/create-plan/REFERENCE.md");
  const schema = read(
    "skills/agnostic/planning/create-plan/references/plan-schema.md",
  );
  const convergence = read(
    "skills/agnostic/planning/create-plan/references/architecture-convergence.md",
  );
  const graph = read(
    "skills/agnostic/planning/create-plan/references/planner-task-graph.md",
  );

  for (const field of [
    "architecture_wave",
    "behavior_owner",
    "integration_surface",
    "public_seam",
    "topology_delta",
    "forbidden_ownership",
    "temporary_seams",
    "responsibility_acceptance_criteria",
  ]) {
    assert.match(schema, new RegExp(`\\b${field}\\b`));
    assert.match(graph, new RegExp(`\\b${field}\\b`));
  }

  assert.match(convergence, /criterion_id.*due_architecture_wave/is);
  assert.match(convergence, /due.*through.*current.*wave/is);
  assert.match(convergence, /regression.*previously met/is);
  assert.match(reference, /canonical.*SKILL\.md.*\$show-me/is);
  assert.doesNotMatch(reference, /MUST use `\$grilling`/);
});
