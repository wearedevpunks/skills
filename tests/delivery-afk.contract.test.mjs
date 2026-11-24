import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

const read = (path) =>
  readFileSync(new URL(`../skills/${path}`, import.meta.url), "utf8");

test("delivery-phase defines AFK, the Autonomous Decision and the loud reports", () => {
  const delivery = read("phases/delivery-phase/SKILL.md");
  const afk = delivery.match(/## AFK\n([\s\S]*?)\n## /)?.[1];
  assert.ok(afk, "delivery-phase owns an AFK section");
  assert.match(afk, /\*\*Autonomous Decision\*\*/u);
  assert.match(afk, /\*\*out-of-bounds\*\*/u);
  assert.match(afk, /⚠️ AUTONOMOUS DECISION OUTSIDE ACCEPTED BOUNDS/u);
  assert.match(afk, /`AskUserQuestion`, `request_user_input`/u);
  assert.match(afk, /missing access/u);
  assert.match(read("phases/delivery-phase/phases/closeout.md"), /⚠️ AUTONOMOUS DECISIONS/u);
  assert.match(read("phases/delivery-phase/phases/human-steering.md"), /exact access needed/u);
  const block = read("phases/delivery-phase/phases/closeout.md").match(
    /## Autonomous Decisions Block\n([\s\S]*?)\n## PR Watch/,
  )?.[1];
  assert.ok(block, "closeout owns the PR Autonomous Decisions Block");
  assert.match(block, /hi:autonomous-decisions:start[\s\S]*## ⚠️ Autonomous Decisions[\s\S]*\[!CAUTION\]/u);
});

test("every owned skill delivery reaches carries the AFK carve-out", () => {
  for (const path of [
    "phases/requirements-phase/SKILL.md",
    "agnostic/requirements/requirements-grill/SKILL.md",
    "agnostic/requirements/write-backlog/SKILL.md",
    "agnostic/planning/create-plan/SKILL.md",
    "agnostic/planning/implement-spec/SKILL.md",
    "phases/debugging-phase/SKILL.md",
    "phases/docs-ingest-phase/SKILL.md",
  ]) {
    assert.match(read(path), /Inside AFK `?delivery-phase`?|## Inside AFK Delivery/u, path);
  }
});

test("callers map the vendored inner skills, which stay unedited", () => {
  const vendored = [
    "agnostic/requirements/grilling/SKILL.md",
    "agnostic/requirements/domain-modeling/SKILL.md",
    "agnostic/subagents/swarm-planner/SKILL.md",
    "agnostic/quality/tdd/SKILL.md",
    "agnostic/debug/debug-agent/SKILL.md",
    "misc/pr/SKILL.md",
  ];
  for (const path of vendored) assert.doesNotMatch(read(path), /Autonomous Decision/u, path);
  assert.match(read("phases/delivery-phase/SKILL.md"), /outranks any vendored inner skill/u);
  assert.match(read("agnostic/planning/implement-spec/SKILL.md"), /`\$tdd` planning[\s\S]*`\$agent-browser` 2FA[\s\S]*`\$react-doctor`/u);
  assert.match(read("phases/debugging-phase/SKILL.md"), /`\$debug-agent` \(vendored/u);
  assert.match(read("agnostic/planning/create-plan/SKILL.md"), /`\$swarm-planner` or `\$tdd`/u);
  assert.match(read("agnostic/requirements/requirements-grill/SKILL.md"), /Vendored\s+`\$domain-modeling` and `\$grilling`/u);
});
