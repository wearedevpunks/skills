import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";

const skillRoot = path.resolve(
  import.meta.dirname,
  "../skills/agnostic/requirements/write-backlog",
);
const contracts = JSON.parse(
  readFileSync(
    path.join(import.meta.dirname, "fixtures/write-backlog-provider-planning.json"),
    "utf-8",
  ),
);

test("canonical skill guidance separates capability grouping from execution chronology", () => {
  for (const relativePath of ["SKILL.md", "REFERENCE.md", "assets/concepts/backlog-model.md"]) {
    const document = readFileSync(path.join(skillRoot, relativePath), "utf-8");
    assert.ok(document.includes("capability module"), relativePath);
    assert.ok(document.includes("execution milestone"), relativePath);
    assert.doesNotMatch(document, /module\/milestone/u, relativePath);
  }
});

test("provider planning keeps capability grouping separate from execution milestones", () => {
  assert.deepEqual(
    contracts.map(({ provider }) => provider),
    ["github", "azure-devops", "monday"],
  );

  for (const contract of contracts) {
    assert.notEqual(contract.capabilityGrouping, contract.executionMilestone, contract.provider);
    const document = readFileSync(path.join(skillRoot, contract.document), "utf-8");
    assert.match(document, /^## Capability grouping$/mu, contract.provider);
    assert.match(document, /^## Chronological execution milestones$/mu, contract.provider);
    for (const evidence of contract.evidence) {
      assert.ok(document.includes(evidence), `${contract.provider}: ${evidence}`);
    }
  }
});

test("provider planning keeps milestones at overview level and story order in blockers", () => {
  for (const relativePath of [
    "SKILL.md",
    "REFERENCE.md",
    "assets/concepts/backlog-model.md",
    "assets/providers/linear-create-payload.md",
    "assets/providers/github-projects-create-payload.md",
    "assets/providers/azure-devops-create-payload.md",
    "assets/providers/monday-create-payload.md",
  ]) {
    const document = readFileSync(path.join(skillRoot, relativePath), "utf-8");
    for (const concept of ["fog", "grilling", "research", "prototype", "epic"]) {
      assert.match(document, new RegExp("`" + concept + "`"), `${relativePath}: ${concept}`);
    }
    assert.match(document, /(?:stories? (?:remain|are|stay|leave) unmilestoned|(?:keep|leave) stories unmilestoned|do not (?:create|assign) milestones? (?:to|for) stories)/iu, relativePath);
    assert.match(document, /story (?:relations?|ordering|dependency edges)|dependency column for story ordering|native blocker/iu, relativePath);
  }

  const examples = readFileSync(path.join(skillRoot, "EXAMPLES.md"), "utf-8");
  assert.match(examples, /Both stories remain unmilestoned/u);
  assert.match(examples, /native blocker relation carries their ordering/u);
  assert.doesNotMatch(examples, /`US-001`[^\n]+`M1`|`US-002`[^\n]+`M2`/u);
});
