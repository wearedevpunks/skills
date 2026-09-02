import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";

const root = path.resolve(import.meta.dirname, "..");
const github = readFileSync(
  path.join(root, "skills/agnostic/requirements/write-backlog/references/providers/github.md"),
  "utf-8",
);

test("GitHub maps semantic hierarchy into one Projects V2 recursive Issue tree", () => {
  assert.match(github, /one Projects V2/iu);
  assert.match(github, /Product Area[\s\S]*configured Product Area field option/iu);
  assert.match(github, /Initiative[\s\S]*configured Initiative field option/iu);
  assert.match(github, /Epic[\s\S]*Issue/iu);
  assert.match(github, /Story[\s\S]*sub-issue/iu);
  assert.match(github, /Task[\s\S]*nested sub-issue/iu);
  assert.match(github, /same repository milestone named `V\*`/iu);
  assert.match(github, /native `addBlockedBy` relation/iu);
  assert.doesNotMatch(github, /Grilling Stage|flat Issues fallback.*accepted/iu);
});

test("GitHub initialization preserves stable semantic identity and exact views", () => {
  for (const field of ["**Product Area**", "**Initiative**", "**Kind**"]) {
    assert.ok(github.includes(field), field);
  }
  for (const view of ["Product Map", "Roadmap", "Fogs", "Current Delivery"]) {
    assert.match(github, new RegExp(`\\*\\*${view}\\*\\*`, "u"));
  }
  assert.match(github, /stable node ID[\s\S]*durable wiki identity/iu);
  assert.match(github, /createProjectV2Field[\s\S]*structural preview[\s\S]*explicit approval/iu);
  assert.match(github, /createProjectV2View[\s\S]*updateProjectV2View/iu);
  assert.match(github, /grouping[\s\S]*unavailable[\s\S]*manual setup guidance[\s\S]*exact view readback/iu);
});

test("GitHub writes a small approved delta and proves or reports residual state", () => {
  assert.match(github, /complete mutation envelope/iu);
  assert.match(github, /stable IDs,[\s\S]*preconditions[\s\S]*expected\s+readback/iu);
  assert.match(github, /preview[\s\S]*explicit approval[\s\S]*write/iu);
  assert.match(github, /createIssue[\s\S]*projectV2Ids[\s\S]*parentIssueId[\s\S]*milestoneId/iu);
  assert.match(github, /updateProjectV2ItemFieldValue/iu);
  assert.match(github, /exact readback[\s\S]*parent chain[\s\S]*milestone[\s\S]*blocker[\s\S]*source links/iu);
  assert.match(github, /partial provider failure[\s\S]*stop further writes[\s\S]*observed writes[\s\S]*residual\s+delta/iu);
  assert.match(github, /schema introspection[\s\S]*not[\s\S]*runtime proof/iu);
});
