import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

const read = (path) =>
  readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

const planning = [
  "skills/agnostic/planning/create-plan/SKILL.md",
  "skills/agnostic/planning/create-plan/references/backlog-sync.md",
  "skills/agnostic/planning/create-plan/references/plan-schema.md",
].map(read).join("\n");

test("planning preserves the provider Task graph as the execution graph", () => {
  assert.match(
    planning,
    /provider Tasks? (?:are|is)[\s\S]*one execution graph/iu,
  );
  assert.match(
    planning,
    /stable provider Task (?:ID|identity)[\s\S]*(?:URL|provider URL)[\s\S]*same `V\*`[\s\S]*(?:native )?blocker/iu,
  );
  assert.match(
    planning,
    /worker waves?[\s\S]*(?:derive|built|build)[\s\S]*(?:provider )?Tasks?[\s\S]*(?:native )?blocker/iu,
  );
  assert.doesNotMatch(
    planning,
    /task\s*=\s*internal|internal[- ]only Task|private Task graph|plan-task level|owning product-facing story/iu,
  );
});

test("Tn is a plan alias for one retained provider Task identity", () => {
  const sync = read(
    "skills/agnostic/planning/create-plan/references/backlog-sync.md",
  );
  const schema = read(
    "skills/agnostic/planning/create-plan/references/plan-schema.md",
  );

  assert.match(sync, /`Tn`[\s\S]*(?:alias|label)[\s\S]*provider Task/iu);
  assert.match(
    schema,
    /`backlog_item_id`[\s\S]*stable provider Task[\s\S]*`backlog_item_url`/iu,
  );
  assert.match(
    schema,
    /`depends_on`[\s\S]*(?:preserves|mirrors)[\s\S]*(?:native )?blocker/iu,
  );
  assert.match(schema, /same `V\*`[\s\S]*(?:Story|parent Story)/iu);
  assert.match(
    sync,
    /cannot create[\s\S]*(?:second|another)[\s\S]*Task identity/iu,
  );
});

test("planning resolves its technical-projection authority pointer", () => {
  const repositoryRoot = fileURLToPath(new URL("../", import.meta.url));
  const backlogSyncPath = resolve(
    repositoryRoot,
    "skills/agnostic/planning/create-plan/references/backlog-sync.md",
  );
  const sync = readFileSync(backlogSyncPath, "utf8");
  const pointer = sync.match(
    /\[technical projection\s+branch\]\(([^)]+)\)/iu,
  );

  assert.ok(pointer, "technical-projection pointer is present");
  assert.ok(
    existsSync(resolve(dirname(backlogSyncPath), pointer[1])),
    `technical-projection pointer resolves: ${pointer[1]}`,
  );
});
