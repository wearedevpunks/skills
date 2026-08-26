import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

const read = (path) =>
  readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

const implementation = [
  "skills/agnostic/planning/implement-spec/SKILL.md",
  "skills/agnostic/planning/implement-spec/references/lifecycle.md",
  "skills/phases/delivery-phase/phases/implement.md",
].map(read).join("\n");

const delivery = [
  "skills/phases/delivery-phase/phases/backlog.md",
  "skills/phases/delivery-phase/phases/implement.md",
  "skills/phases/delivery-phase/phases/closeout.md",
  "skills/phases/delivery-phase/phases/router.md",
  "skills/phases/delivery-phase/references/artifact-state.md",
].map(read).join("\n");

test("implementation immediately routes directly observed Task facts through write-backlog", () => {
  assert.match(
    implementation,
    /work start[\s\S]*block(?:ed|er)[\s\S]*pull request/iu,
  );
  assert.match(
    implementation,
    /immediately[\s\S]*`write-backlog`[\s\S]*delivery-status\.md[\s\S]*readback/iu,
  );
  assert.match(
    implementation,
    /stable provider Task (?:ID|identity)[\s\S]*(?:preserve|unchanged)/iu,
  );
  assert.doesNotMatch(
    implementation,
    /optional state update|post-wave state update|defer(?:red)?[\s\S]*(?:start|blocker|pull request)/iu,
  );
});

test("Delivery keeps merge, staging, production, and Fog completion distinct", () => {
  assert.match(
    delivery,
    /directly observed[\s\S]*merge[\s\S]*staging[\s\S]*production/iu,
  );
  assert.match(delivery, /merge (?:is|does)[\s\S]*never[\s\S]*deployment/iu);
  assert.match(
    delivery,
    /Fog[\s\S]*complete[\s\S]*production evidence[\s\S]*(?:every|all)[\s\S]*(?:Story|Task)/iu,
  );
  assert.match(
    delivery,
    /write-backlog[\s\S]*delivery-status\.md/iu,
  );
  assert.doesNotMatch(
    delivery,
    /map (?:Linear|GitHub)|provider field|status id|mutation payload/iu,
  );
});

test("closeout proves the final reviewed and documented tree before provider closure", () => {
  const closeout = read("skills/phases/delivery-phase/phases/closeout.md");

  assert.match(
    closeout,
    /after[\s\S]*review[\s\S]*docs ingest[\s\S]*final path-limited commit/iu,
  );
  assert.match(closeout, /preserv(?:e|ing)[\s\S]*dirty[\s\S]*(?:user|unrelated)/iu);
  assert.match(
    closeout,
    /differs[\s\S]*pre-review candidate[\s\S]*release classification[\s\S]*exact-tree provider proof/iu,
  );
  assert.match(
    closeout,
    /after[\s\S]*exact-tree[\s\S]*(?:close|complete|update)[\s\S]*provider work[\s\S]*goal/iu,
  );
});
