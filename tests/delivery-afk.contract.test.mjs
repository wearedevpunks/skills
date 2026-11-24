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
  assert.match(read("misc/pr/SKILL.md"), /## ⚠️ Autonomous Decisions[\s\S]*\[!CAUTION\]/u);
});

test("every skill delivery reaches carries the AFK carve-out", () => {
  for (const path of [
    "phases/requirements-phase/SKILL.md",
    "agnostic/requirements/requirements-grill/SKILL.md",
    "agnostic/requirements/grilling/SKILL.md",
    "agnostic/requirements/domain-modeling/SKILL.md",
    "agnostic/requirements/write-backlog/SKILL.md",
    "agnostic/planning/create-plan/SKILL.md",
    "agnostic/subagents/swarm-planner/SKILL.md",
    "agnostic/planning/implement-spec/SKILL.md",
    "agnostic/quality/tdd/SKILL.md",
    "phases/debugging-phase/SKILL.md",
    "agnostic/debug/debug-agent/SKILL.md",
    "phases/docs-ingest-phase/SKILL.md",
  ]) {
    assert.match(read(path), /Inside AFK `?delivery-phase`?|## Inside AFK Delivery/u, path);
  }
  assert.equal(
    read("agnostic/subagents/swarm-planner/SKILL.md"),
    read("agnostic/planning/swarm-planner/SKILL.md"),
  );
});
