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
