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

test("provider planning routes only Linear and GitHub through disclosed adapters", () => {
  assert.deepEqual(
    contracts.map(({ provider }) => provider),
    ["linear", "github"],
  );

  for (const contract of contracts) {
    assert.equal(contract.document, `references/providers/${contract.provider}.md`);
    assert.ok(readFileSync(path.join(skillRoot, contract.document), "utf-8").trim());
  }

  const fixture = JSON.stringify(contracts);
  assert.doesNotMatch(fixture, /azure|monday|assets\/providers/iu);
});

test("GitHub planning preserves semantic hierarchy, V membership, and exact readback", () => {
  const contract = contracts.find(({ provider }) => provider === "github");
  assert.ok(contract);
  assert.deepEqual(contract.hierarchy, {
    root: "one Projects V2",
    areasAndInitiatives: "configured semantic fields",
    epic: "Issue",
    story: "sub-issue",
    task: "nested sub-issue",
  });
  assert.equal(contract.milestone, "one repository V* per Story and Task graph");
  assert.equal(contract.precedence, "native blockers");
  assert.deepEqual(contract.viewCapability, {
    automatic: ["name", "layout", "visibleFieldIds", "filter"],
    manual: ["grouping", "sorting"],
  });
  assert.equal(contract.semanticIdentity, "stable option ID + durable wiki identity");
  assert.deepEqual(contract.runtimeProof, [
    "Product Area",
    "Initiative",
    "Kind",
    "Fog backlink",
    "immutable source",
  ]);

  const document = readFileSync(path.join(skillRoot, contract.document), "utf-8");
  for (const evidence of contract.evidence) {
    assert.ok(document.includes(evidence), evidence);
  }
});
