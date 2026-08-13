import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

const read = (path) =>
  readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

test("implement-spec enforces cumulative architecture conformance", () => {
  const skill = read("skills/agnostic/planning/implement-spec/SKILL.md");
  const lifecycle = read(
    "skills/agnostic/planning/implement-spec/references/lifecycle.md",
  );
  const conformance = read(
    "skills/agnostic/planning/implement-spec/references/architecture-conformance.md",
  );
  const parallel = read(
    "skills/agnostic/planning/implement-spec/references/parallel-orchestration.md",
  );
  const combined = `${skill}\n${lifecycle}\n${conformance}\n${parallel}`;

  assert.match(combined, /Target Ownership Topology/);
  assert.match(combined, /Declared Dependency Graph/);
  assert.match(combined, /Responsibility Acceptance Criteria/);
  assert.match(combined, /Architecture Waves/);
  assert.match(combined, /cumulative conformance checkpoint/i);
  assert.match(combined, /after every architecture wave/i);
  assert.match(conformance, /invoke `?\$show-me`?.*persisted architecture evidence/is);
  assert.match(conformance, /backend-domain-structure/);
  assert.match(conformance, /frontend-domain-structure/);
  assert.match(conformance, /public seam/i);
  assert.match(conformance, /migration ledger/i);
  assert.match(conformance, /zero drift/i);
  assert.match(conformance, /entire migration ledger.*empty/is);
  assert.match(conformance, /due through the current\s+architecture wave/i);
  assert.match(conformance, /previously met.*regression/is);
  assert.match(conformance, /create-plan.*architecture convergence/is);
  assert.match(conformance, /re-ground.*backend-domain-structure.*frontend-domain-structure/is);
  assert.match(conformance, /rewrite[\s\S]*\$show-me[\s\S]*view/i);
  assert.match(conformance, /evidence-only clarification/i);

  assert.match(skill, /failed checkpoint blocks dependent waves/i);
  assert.match(lifecycle, /successful final\s+architecture\s+closure/i);
  assert.match(lifecycle, /preserve[\s\S]*blocked[\s\S]*incomplete/i);
  assert.match(parallel, /architecture_wave/);
  assert.match(parallel, /responsibility_acceptance_criteria/);
  assert.match(parallel, /criterion_id/);
  assert.match(parallel, /due_wave/);
});

test("worker briefs and implementation notes carry architecture evidence", () => {
  const brief = read(
    "skills/agnostic/planning/implement-spec/references/parallel-worker-brief.md",
  );
  const notes = read(
    "skills/agnostic/planning/implement-spec/assets/IMPLEMENTATION-NOTES-TEMPLATE.md",
  );
  const combined = `${brief}\n${notes}`;

  for (const field of [
    "behavior_owner",
    "integration_surface",
    "public_seam",
    "topology_delta",
    "forbidden_ownership",
    "temporary_seams",
    "architecture_wave",
    "responsibility_acceptance_criteria",
    "criterion_id",
    "due_wave",
  ]) {
    assert.match(brief, new RegExp(`\\b${field}\\b`));
  }

  assert.match(combined, /Architecture Conformance Evidence/);
  assert.match(combined, /ownership topology/i);
  assert.match(combined, /dependency graph/i);
  assert.match(combined, /responsibility[-_ ]acceptance/i);
  assert.match(combined, /migration ledger/i);
});
