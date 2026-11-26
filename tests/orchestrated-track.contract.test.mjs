import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

const read = (path) =>
  readFileSync(new URL(`../skills/${path}`, import.meta.url), "utf8");
const section = (text, heading) =>
  text.match(new RegExp(`## ${heading}\\n([\\s\\S]*?)\\n## `, "u"))?.[1];

test("delivery-phase owns the Orchestrated Track rule: report up, ready not merge", () => {
  const delivery = read("phases/delivery-phase/SKILL.md");
  const rule = section(delivery, "Orchestrated Track");
  assert.ok(rule, "delivery-phase owns an Orchestrated Track section");
  assert.match(rule, /brief names an Orchestrator thread/u);
  assert.match(rule, /one line to the Orchestrator thread/u);
  assert.match(rule, /never acks/u);
  assert.match(rule, /`ready <PR URL> @ <head commit>`/u);
  assert.match(rule, /delivery still never merges/u);

  const closeout = read("phases/delivery-phase/phases/closeout.md");
  assert.match(closeout, /Delivery never merges; the human merges, or the Orchestrator of an\s+\[Orchestrated Track\]\(\.\.\/SKILL\.md#orchestrated-track\)/u);
  assert.match(closeout, /\[Orchestrated Track\]\(\.\.\/SKILL\.md#orchestrated-track\) skips this request/u);
});

test("requirements-phase reports grill closed to its Orchestrator", () => {
  const rule = section(read("phases/requirements-phase/SKILL.md"), "Orchestrated Track");
  assert.ok(rule, "requirements-phase owns an Orchestrated Track section");
  assert.match(rule, /brief names an Orchestrator thread/u);
  assert.match(rule, /`grill closed`/u);
  assert.match(rule, /starts `\$delivery-phase` in this same\s+thread/u);
  assert.match(rule, /never acks/u);
});

test("ask-hi routes to orchestrator-phase and lets an Orchestrator brief start Track phases", () => {
  const graph = read("agnostic/cli/ask-hi/references/phase-graph.md");
  assert.match(graph, /\| `\$orchestrator-phase` \| explicit-only \|/u);
  assert.match(graph, /goes solo/u);
  assert.match(graph, /one of four ways/u);
  assert.match(graph, /\*\*Orchestrator brief\.\*\*/u);
  assert.match(read("agnostic/cli/ask-hi/references/delivery.md"), /^## `\$orchestrator-phase`$/mu);
});
