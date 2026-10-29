import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import test from "node:test";

const root = "skills/agnostic/quality/tdd";
const read = (path) => readFileSync(path, "utf8");
const section = (text, heading) => {
  const start = text.indexOf(heading);
  assert.notEqual(start, -1, `missing section ${heading}`);
  const next = text.indexOf("\n## ", start + heading.length);
  return text.slice(start, next === -1 ? undefined : next);
};

const patterns = [
  "security gate",
  "equivalence",
  "round-trip",
  "idempotence",
  "membership/monotonic",
  "oracle",
  "preservation",
  "no defects",
  "stateful command sequence",
];

test("properties.md gives every Property Pattern a rule, a spec signal and a typical Mutant", () => {
  const properties = read(`${root}/properties.md`);
  const rows = properties
    .split("\n")
    .filter((line) => line.startsWith("| "))
    .map((line) => line.split("|").slice(1, -1).map((cell) => cell.trim()));

  for (const pattern of patterns) {
    const row = rows.find((cells) => cells[0] === pattern);
    assert.ok(row, `missing pattern row ${pattern}`);
    assert.equal(row.length, 4, `${pattern} row needs rule, spec signal and Mutant`);
    assert.ok(row.every((cell) => cell.length > 0), `${pattern} row has an empty cell`);
  }
  assert.match(properties, /regression[\s\S]{0,200}reapply the historical bug/iu);
});

test("properties.md fixes slice order, generator rules, Pinned Replay, run policy and stateful properties", () => {
  const properties = read(`${root}/properties.md`);

  assert.match(properties, /example[\s\S]{0,120}RED → GREEN[\s\S]{0,200}property[\s\S]{0,120}RED → GREEN/iu);
  assert.match(properties, /pure total function may start with the property/iu);
  assert.match(properties, /passes on its first run[\s\S]{0,200}\[Sensitivity Proof\]\(sensitivity\.md\)/u);
  assert.match(properties, /Generator Narrowing[\s\S]{0,300}recorded human approval/u);
  assert.match(properties, /small pools?/iu);
  const pinnedReplay = section(properties, "## Pinned Replay");
  assert.match(pinnedReplay, /explicit input literal/u);
  assert.match(pinnedReplay, /named after the rule/u);
  assert.match(pinnedReplay, /Replay Token[\s\S]{0,200}evidence only/u);
  assert.match(properties, /CI runs every property/u);
  assert.match(properties, /DB-backed[\s\S]{0,120}reduced/u);
  assert.match(properties, /fresh fixture/iu);
  assert.match(properties, /in-memory model/iu);
  assert.match(properties, /shortest failing sequence/iu);
  assert.match(properties, /Model Counterexample[\s\S]{0,300}Pinned Replay/u);
});

test("properties.md owns the Form vocabulary and stays language-neutral", () => {
  const properties = read(`${root}/properties.md`);

  assert.match(properties, /`example \| property \| stateful-property \| model \| type`/u);
  assert.doesNotMatch(properties, /Arbitrary|fast-check|fc\.|it\.effect\.prop|it\.prop|Hypothesis|@given/u);
  assert.doesNotMatch(properties, /\]\([^)]*model-checking/u);
});

test("sensitivity.md holds the five-step Sensitivity Proof and its scope rule", () => {
  const sensitivity = read(`${root}/sensitivity.md`);
  const steps = [...sensitivity.matchAll(/^(\d)\. \*\*(\w+)\*\*/gmu)].map(([, n, word]) => `${n} ${word}`);

  assert.deepEqual(steps, ["1 Name", "2 Apply", "3 Run", "4 Revert", "5 Record"]);
  assert.match(sensitivity, /passes on its first run/u);
  assert.match(sensitivity, /property that passes on its first run/u);
  assert.match(sensitivity, /committed Model invariant/u);
  assert.match(sensitivity, /`git diff`/u);
  assert.match(sensitivity, /`git diff --quiet -- <file>`/u);
  assert.match(sensitivity, /fails? for the expected reason/u);
  assert.match(sensitivity, /`sensitivity_evidence`[\s\S]{0,200}never in `red_evidence`/u);
  assert.match(sensitivity, /Active Write Scope[\s\S]{0,300}`sensitivity_evidence: parent_required`/u);
  assert.match(sensitivity, /parent Task Gate[\s\S]{0,300}blocks/u);
});

test("SKILL.md keeps a red-green loop and points at the two new references", () => {
  const skill = read(`${root}/SKILL.md`);
  const description = skill.match(/^description: (.+)$/mu)?.[1] ?? "";
  const hardLaw = section(skill, "## Hard Law");

  assert.match(description, /red-green/u);
  assert.doesNotMatch(description, /red-green-refactor/u);
  assert.doesNotMatch(skill, /disable-model-invocation/u);
  assert.doesNotMatch(skill, /^### \d+\. Refactor/mu);
  assert.match(hardLaw, /never failed is not evidence[\s\S]{0,200}\(sensitivity\.md\)/u);
  assert.match(skill, /\(properties\.md\)/u);
  assert.match(skill, /\$simplify/u);
});

test("refactoring.md is gone and nothing in tdd or ask-hi points at it", () => {
  const delivery = read("skills/agnostic/cli/ask-hi/references/delivery.md");
  const tddEntry = section(delivery, "## `$tdd`");

  assert.equal(existsSync(`${root}/refactoring.md`), false);
  for (const name of readdirSync(root)) {
    assert.doesNotMatch(read(`${root}/${name}`), /refactoring\.md/u, `${name} links refactoring.md`);
  }
  assert.doesNotMatch(tddEntry, /refactoring\.md|red-green-refactor|Refactor only/u);
  assert.match(tddEntry, /red-green/u);
  assert.match(tddEntry, /`properties\.md`/u);
  assert.match(tddEntry, /`sensitivity\.md`/u);
});

test("high-signal-tests.md names the Tautological anti-pattern and the copied-oracle warning", () => {
  const highSignal = read(`${root}/high-signal-tests.md`);

  assert.match(highSignal, /Tautological/u);
  assert.match(highSignal, /oracle[\s\S]{0,200}copies the code under test[\s\S]{0,80}tautological/iu);
});

test("UPSTREAM.md records the local adaptations", () => {
  const upstream = read(`${root}/UPSTREAM.md`);

  assert.match(upstream, /properties\.md/u);
  assert.match(upstream, /sensitivity\.md/u);
  assert.match(upstream, /Tautological[\s\S]{0,200}59db609/u);
  assert.match(upstream, /Refactoring is not part of the loop/u);
});
