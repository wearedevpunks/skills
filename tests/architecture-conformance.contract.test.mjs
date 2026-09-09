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
  assert.match(conformance, /at every due architecture boundary/i);
  assert.match(conformance, /Reconcile parent-owned shared summaries before running it/i);
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

  assert.match(skill, /Architecture Checkpoints gate only consumers of unproved responsibilities/i);
  assert.match(conformance, /Block each task that consumes an unproved or failed checkpoint responsibility/i);
  assert.match(conformance, /Independent safe\s+preparation remains eligible through its Task Gate/i);
  assert.match(lifecycle, /successful final\s+architecture\s+closure/i);
  assert.match(lifecycle, /preserve[\s\S]*blocked[\s\S]*incomplete/i);
  assert.match(parallel, /\[architecture-conformance\.md\]\(architecture-conformance\.md\)/);
  for (const field of ["architecture_wave", "responsibility_acceptance_criteria", "criterion_id", "due_wave"]) {
    assert.match(conformance, new RegExp(`\\b${field}\\b`));
  }
});

test("worker briefs and implementation notes carry architecture evidence", () => {
  const brief = read(
    "skills/agnostic/planning/implement-spec/references/parallel-worker-brief.md",
  );
  const notes = read(
    "skills/agnostic/planning/implement-spec/assets/IMPLEMENTATION-NOTES-TEMPLATE.md",
  );
  const conformance = read("skills/agnostic/planning/implement-spec/references/architecture-conformance.md");
  const skill = read("skills/agnostic/planning/implement-spec/SKILL.md");
  assert.match(brief, /Read the task's architecture contract when its\s+checkpoint or responsibility criteria apply/);
  assert.match(skill, /read and enforce `references\/architecture-conformance\.md`/);
  assert.match(conformance, /Map every task's[\s\S]*into its worker brief unchanged/);
  const combined = `${brief}\n${notes}\n${conformance}`;

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
    assert.match(conformance, new RegExp(`\\b${field}\\b`));
  }

  assert.match(combined, /Architecture Conformance Evidence/);
  assert.match(combined, /ownership topology/i);
  assert.match(combined, /dependency graph/i);
  assert.match(combined, /responsibility[-_ ]acceptance/i);
  assert.match(combined, /migration ledger/i);
});
