import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";

const root = path.resolve(import.meta.dirname, "..");
const read = (relativePath) => readFileSync(path.join(root, relativePath), "utf-8");
const githubPath =
  "skills/agnostic/requirements/write-backlog/references/providers/github.md";

test("GitHub preserves the provider-neutral hierarchy behind one Projects V2 adapter", () => {
  const github = read(githubPath);

  assert.match(github, /one Projects V2/iu);
  assert.match(
    github,
    /Product Area[\s\S]*Initiative[\s\S]*Epic[\s\S]*Story[\s\S]*Task/u,
  );
  assert.match(github, /Epic[\s\S]*Issue/iu);
  assert.match(github, /Story[\s\S]*(?:sub-issue|parentIssueId)/iu);
  assert.match(github, /Task[\s\S]*(?:nested sub-issue|parentIssueId)/iu);
  assert.match(github, /Story and (?:every )?Task[\s\S]*same[\s\S]*`V\*`/iu);
  assert.match(github, /repository milestone/iu);
  assert.match(github, /addBlockedBy/iu);
  assert.match(github, /Fog[\s\S]*(?:lateral provenance|source provenance)/iu);
  assert.match(github, /zero provider mutations/iu);
  assert.match(github, /actionable setup guidance/iu);
  assert.doesNotMatch(github, /Iteration field/iu);
  assert.doesNotMatch(github, /flat Issues-only fallback/iu);
});

test("GitHub initialization reconciles complete metadata, semantic fields, views, and V milestones", () => {
  const github = read(githubPath);

  for (const metadata of [
    "Product brief",
    "business objectives",
    "target users",
    "product boundaries",
    "Product Map",
    "constraints and non-goals",
    "operating rules",
    "owner",
    "repository link",
    "wiki link",
    "current and future `V*`",
  ]) {
    assert.ok(github.includes(metadata), metadata);
  }

  for (const field of ["Product Area", "Initiative", "Kind", "Grilling Stage"]) {
    assert.match(github, new RegExp(`configured.*${field}|${field}.*configured`, "isu"), field);
  }

  for (const view of ["Product Map", "Roadmap", "Fogs", "Current Delivery"]) {
    assert.match(github, new RegExp(`\\*\\*${view}\\*\\*`, "u"), view);
  }

  assert.match(github, /updateProjectV2[\s\S]*linkProjectV2ToRepository/iu);
  assert.match(github, /createProjectV2Field[\s\S]*createProjectV2View/iu);
  assert.match(
    github,
    /createProjectV2View[\s\S]*name[\s\S]*layout[\s\S]*visibleFieldIds/iu,
  );
  assert.match(github, /updateProjectV2View[\s\S]*filter/iu);
  assert.match(
    github,
    /grouping and sorting[\s\S]*unavailable[\s\S]*manual setup guidance[\s\S]*read back/iu,
  );
  assert.match(github, /automatic view mutation[\s\S]*limited/iu);
  assert.match(github, /structural preview[\s\S]*explicit approval/iu);
  assert.match(github, /ordinary writes[\s\S]*never provision/iu);
  assert.match(github, /reuse[\s\S]*fitting existing `V\*`/iu);
  assert.match(
    github,
    /Version name[\s\S]*One-sentence product goal[\s\S]*Included product outcomes or capability changes/iu,
  );
  assert.match(github, /unsupported[\s\S]*name only/iu);
  assert.doesNotMatch(github, /CI\/CD|Releases view/iu);
});

test("GitHub writes only a fully preflighted delta and proves it by exact readback", () => {
  const github = read(githubPath);

  assert.match(github, /stable provider identity plus durable wiki identity/iu);
  assert.match(github, /title-only or\s+ambiguous[\s\S]*zero provider mutations/iu);
  assert.match(github, /read-before-write/iu);
  assert.match(github, /createIssue[\s\S]*projectV2Ids[\s\S]*parentIssueId[\s\S]*milestoneId/iu);
  assert.match(github, /Epic[\s\S]*Story[\s\S]*Task[\s\S]*addBlockedBy/iu);
  assert.match(github, /updateProjectV2ItemFieldValue/iu);
  assert.match(
    github,
    /Product Area[\s\S]*option ID[\s\S]*durable wiki identity[\s\S]*Initiative/iu,
  );
  assert.match(
    github,
    /option descriptions[\s\S]*API-supported[\s\S]*Project README[\s\S]*canonical identity map/iu,
  );
  assert.match(github, /standalone URL[\s\S]*provenance[\s\S]*not an identity/iu);
  assert.match(github, /Fog body[\s\S]*durable wiki identity[\s\S]*immutable/iu);
  assert.match(
    github,
    /read back[\s\S]*Project membership[\s\S]*parent[\s\S]*`V\*`[\s\S]*field[\s\S]*blockedBy[\s\S]*source/iu,
  );
  assert.match(github, /partial[\s\S]*stop[\s\S]*read back[\s\S]*unresolved/iu);
  assert.match(github, /workflow-created nested Task/iu);
  assert.match(
    github,
    /Product Area[\s\S]*Initiative[\s\S]*Kind[\s\S]*Fog backlink[\s\S]*immutable source/iu,
  );
  assert.match(github, /schema introspection[\s\S]*not runtime proof/iu);
  assert.match(github, /capability or\s+authentication blocks[\s\S]*exact blocker/iu);
});
