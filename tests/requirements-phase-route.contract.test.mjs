import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

const read = (path) =>
  readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

test("requirements router selects requirements-grill for open human decisions", () => {
  const router = read("skills/phases/requirements-phase/phases/router.md");

  assert.match(router, /open human decisions[\s\S]{0,200}`requirements-grill\.md`/iu);
  assert.match(router, /missing shared-understanding confirmation[\s\S]{0,200}`requirements-grill\.md`/iu);
});

test("each requirements gate owns one bounded delegation and durable exit", () => {
  const delegates = new Map([
    ["requirements-grill", "requirements-grill"],
    ["create-spec", "create-spec"],
    ["write-backlog", "write-backlog"],
  ]);

  for (const [gate, delegate] of delegates) {
    const document = read(`skills/phases/requirements-phase/phases/${gate}.md`);
    assert.match(document, /## Entry Guard/u, gate);
    assert.match(document, /## Inputs/u, gate);
    assert.match(document, new RegExp("## Bounded Delegation[\\s\\S]*activate `" + delegate + "`", "iu"), gate);
    assert.match(document, /## Invariants/u, gate);
    assert.match(document, /## Completion Evidence/u, gate);
    assert.match(document, /## Declared Exits/u, gate);
    assert.match(document, /## Durable Handoff/u, gate);
    assert.match(document, /`REQUIREMENTS-HANDOFF\.md`/u, gate);
  }
});

test("runtime handoff preserves complete requirements resume evidence", () => {
  const contract = read("skills/phases/requirements-phase/references/runtime-handoff.md");

  for (const field of [
    "Current or last gate:",
    "Phase status:",
    "Grill pointers:",
    "Retained spec SHA:",
    "Verified spec URL:",
    "Projection evidence:",
    "Validation:",
    "Blockers:",
    "Next suggested route:",
  ]) {
    assert.match(contract, new RegExp(field, "u"), field);
  }
  assert.match(contract, /next suggested route[\s\S]{0,120}advisory/iu);
  assert.match(contract, /current direct evidence[\s\S]{0,160}workflow-native artifacts/iu);
  assert.match(contract, /Phase status:[^\n]*completed[^\n]*skipped/iu);
});

test("requirements router exposes every gate and terminal with deterministic precedence", () => {
  const router = read("skills/phases/requirements-phase/phases/router.md");
  const routes = [
    "finder-required",
    "requirements-grill.md",
    "create-spec.md",
    "write-backlog.md",
    "requirements-complete",
  ];
  const positions = routes.map((route) => router.indexOf(route));

  assert.ok(positions.every((position) => position >= 0), "all routes are declared");
  assert.deepEqual([...positions].sort((left, right) => left - right), positions);
  assert.match(router, /select exactly one route/iu);
  assert.match(router, /earliest unmet gate/iu);
});

test("cold resume and stale handoff suggestions defer to current evidence", () => {
  const root = read("skills/phases/requirements-phase/SKILL.md");
  const router = read("skills/phases/requirements-phase/phases/router.md");
  const all = `${root}\n${router}`;

  assert.match(all, /cold resume/iu);
  assert.match(router, /current direct evidence[\s\S]{0,180}workflow-native artifacts/iu);
  assert.match(router, /next suggested route[\s\S]{0,100}advisory/iu);
  assert.match(router, /discard stale, invalid, out-of-scope, or contradictory evidence/iu);
});

test("requirements router selects without performing child-owned mutation", () => {
  const router = read("skills/phases/requirements-phase/phases/router.md");

  assert.match(router, /router selects only/iu);
  assert.match(router, /selected gate owns delegation and mutation/iu);
  assert.doesNotMatch(router, /activate `(?:requirements-grill|create-spec|write-backlog)`/iu);
});

test("requirements completion requires a retained spec and its matching projection", () => {
  const router = read("skills/phases/requirements-phase/phases/router.md");
  const handoff = read("skills/phases/requirements-phase/references/runtime-handoff.md");

  assert.match(router, /valid retained spec and its verified matching projection both exist[\s\S]{0,100}`requirements-complete`/iu);
  assert.match(handoff, /`requirements-complete` requires current validation/iu);
  assert.match(handoff, /suggested terminal route is insufficient/iu);
});

test("requirements phase remains explicit-only", () => {
  const root = read("skills/phases/requirements-phase/SKILL.md");
  const metadata = read("skills/phases/requirements-phase/agents/openai.yaml");

  assert.match(root, /disable-model-invocation:\s*true/u);
  assert.match(metadata, /allow_implicit_invocation:\s*false/u);
});
