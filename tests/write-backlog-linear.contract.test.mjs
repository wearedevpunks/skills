import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";

const root = path.resolve(import.meta.dirname, "..");
const linear = readFileSync(
  path.join(root, "skills/agnostic/requirements/write-backlog/references/providers/linear.md"),
  "utf-8",
);

test("Linear uses only the linear-free-v1 native Root, Project, and Issue mapping", () => {
  assert.match(linear, /`linear-free-v1`[\s\S]*sole default Linear Free/iu);
  assert.match(linear, /Product\/Backlog Root[\s\S]*top-level Linear Initiative/iu);
  assert.match(linear, /Product Area[\s\S]*Linear Project[\s\S]*Root Initiative/iu);
  for (const kind of ["initiative", "epic", "story", "task"]) {
    assert.ok(linear.includes(`Kind/${kind}`), kind);
  }
  assert.match(linear, /recursive[\s\S]*`parentId`/iu);
  assert.match(linear, /Root is the only native Initiative/iu);
  assert.doesNotMatch(linear, /Epic \| Linear Project|Product Area \| Linear Initiative/iu);
});

test("Linear proves workspace and destination before reading mutation candidates", () => {
  assert.match(linear, /backlogProjectUrl[\s\S]*Product\/Backlog Root Initiative/iu);
  assert.match(linear, /workspace ID[\s\S]*workspace URL[\s\S]*wrong workspace[\s\S]*zero provider mutations/iu);
  assert.match(linear, /legacy project destination[\s\S]*`hi ensure`[\s\S]*zero writes/iu);
  assert.match(linear, /stable provider identity plus durable wiki identity/iu);
  assert.match(linear, /title\s+match[\s\S]*incomplete search[\s\S]*ambiguous[\s\S]*zero writes/iu);
});

test("Linear preserves milestones, native relations, views, and exact residual readback", () => {
  assert.match(linear, /Product Area Project[\s\S]*exactly one milestone[\s\S]*same Project[\s\S]*milestone as its Story/iu);
  assert.match(linear, /missing[\s\S]*future-iteration[\s\S]*duplicate edges[\s\S]*self-edges[\s\S]*cycles/iu);
  assert.match(linear, /`blockedBy`[\s\S]*`blocks`/iu);
  for (const view of ["Product Map", "Roadmap", "Fogs", "Current Delivery"]) {
    assert.match(linear, new RegExp(`\\*\\*${view}\\*\\*`, "u"));
  }
  assert.match(linear, /complete intended mutation envelope[\s\S]*preconditions[\s\S]*expected readback/iu);
  assert.match(linear, /exact readback[\s\S]*workspace[\s\S]*recursive[\s\S]*milestone[\s\S]*relatedTo[\s\S]*blockedBy/iu);
  assert.match(linear, /partial provider failure[\s\S]*stop further writes[\s\S]*observed writes[\s\S]*residual delta/iu);
  assert.match(linear, /Historical staged tickets[\s\S]*excluded from automatic Normalization/iu);
});
