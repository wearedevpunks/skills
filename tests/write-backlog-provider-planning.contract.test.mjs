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
const read = (relativePath) => readFileSync(path.join(skillRoot, relativePath), "utf-8");

test("provider planning exposes only Linear and GitHub representation adapters", () => {
  assert.deepEqual(
    contracts.map(({ provider }) => provider),
    ["linear", "github"],
  );
  for (const { provider, document } of contracts) {
    assert.equal(document, `references/providers/${provider}.md`);
    assert.ok(read(document).trim(), provider);
  }
  assert.doesNotMatch(JSON.stringify(contracts), /azure|monday|assets\/providers/iu);
});

test("both adapters consume one semantic policy and return exact residual state", () => {
  const envelope = read("REFERENCE.md");
  const linear = read("references/providers/linear.md");
  const github = read("references/providers/github.md");

  assert.match(envelope, /Semantic Topology[\s\S]*Product\/Backlog Root[\s\S]*Task/iu);
  assert.match(envelope, /Provider-Neutral|provider write/iu);
  for (const adapter of [linear, github]) {
    assert.match(adapter, /stable provider identity[\s\S]*durable wiki identity/iu);
    assert.match(adapter, /preview[\s\S]*explicit approval/iu);
    assert.match(adapter, /exact readback/iu);
    assert.match(adapter, /partial provider failure[\s\S]*observed writes[\s\S]*residual\s+delta/iu);
  }
});

test("adapter mappings preserve accepted provider-specific hierarchy", () => {
  const linear = read("references/providers/linear.md");
  const github = read("references/providers/github.md");

  assert.match(linear, /linear-free-v1[\s\S]*Product Area[\s\S]*Linear Project[\s\S]*Kind\/initiative/iu);
  assert.match(github, /one Projects V2[\s\S]*Product Area[\s\S]*Initiative[\s\S]*Epic[\s\S]*sub-issue/iu);
  assert.match(linear, /`blockedBy`/u);
  assert.match(github, /`addBlockedBy`/u);
});
