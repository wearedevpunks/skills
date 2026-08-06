import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

const read = (path) =>
  readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

const finderPackage = () =>
  [
    "skills/phases/finder-phase/SKILL.md",
    "skills/phases/finder-phase/references/convergence.md",
    "skills/phases/finder-phase/references/frontier-lifecycle.md",
    "skills/phases/finder-phase/references/root-routing.md",
  ]
    .map(read)
    .join("\n");

test("Finder delegates only to top-level lifecycle phases", () => {
  const finder = finderPackage();

  assert.doesNotMatch(
    finder,
    /`requirements-grill`|`create-spec`|`write-backlog`/u,
  );
});

test("Finder exposes one top-level lifecycle frontier", () => {
  const finder = finderPackage();

  assert.match(
    finder,
    /fog\/charting -> research \| prototype \| requirements-phase -> delivery-phase -> complete/u,
  );
  assert.match(finder, /bounded `parallel-research` during charting/iu);
  assert.match(finder, /explicit `prototype-phase` handoff/iu);
  assert.match(finder, /explicit\s+`requirements-phase` handoff/iu);
  assert.match(finder, /explicit `delivery-phase`\s+handoff/iu);
});

test("Finder gates delivery on requirements completion", () => {
  const convergence = read(
    "skills/phases/finder-phase/references/convergence.md",
  );

  assert.match(
    convergence,
    /verified `requirements-complete` result.{0,120}explicit `delivery-phase`\s+handoff/isu,
  );
});

test("Finder reconciles requirements discovery returns before rerouting", () => {
  const convergence = read(
    "skills/phases/finder-phase/references/convergence.md",
  );

  assert.match(
    convergence,
    /`finder-required`.{0,160}reconcile.{0,160}`wayfinder`.{0,80}recompute/isu,
  );
});

test("Finder leaves lifecycle phase activation to the operator", () => {
  const skill = read("skills/phases/finder-phase/SKILL.md");

  assert.match(
    skill,
    /operator activates.{0,160}`prototype-phase`.{0,80}`requirements-phase`.{0,80}`delivery-phase`/isu,
  );
});

test("Finder completes only after delivery completes", () => {
  const convergence = read(
    "skills/phases/finder-phase/references/convergence.md",
  );

  assert.match(
    convergence,
    /verified delivery closeout with exit `done`.{0,120}return `complete`/isu,
  );
});
