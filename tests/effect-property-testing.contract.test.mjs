import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const root = "skills/frameworks/effect/effect";
const read = (path) => readFileSync(path, "utf8");

test("PROPERTY_TESTING.md covers the accepted Effect property-testing API", () => {
  const reference = read(`${root}/references/PROPERTY_TESTING.md`);

  for (const name of ["Arbitrary.schema", "it.prop", "it.effect.prop", "Schema.Finite", "Arbitrary.configureGlobal"]) {
    assert.ok(reference.includes(name), `missing ${name}`);
  }
  assert.match(reference, /\{ arbitrary: \{ runs: 25 \} \}/u);
  assert.match(reference, /DB-backed/u);
  assert.match(reference, /vitest[\s\S]{0,40}setup/iu);
  assert.match(reference, /Schema\.Number[\s\S]{0,200}(NaN|Infinity)/u);
  assert.match(reference, /tagged commands?/iu);
  assert.match(reference, /fresh fixture/iu);
  assert.match(reference, /read-only|immutable/iu);
  assert.match(reference, /Replay Token[\s\S]{0,200}evidence only/u);
  assert.match(reference, /\]\(\.\.\/\.\.\/tdd\/properties\.md(#[^)]*)?\)/u);
});

test("PROPERTY_TESTING.md targets npm latest and sends other versions to opensrc", () => {
  const reference = read(`${root}/references/PROPERTY_TESTING.md`);

  assert.match(reference, /npm `latest`/u);
  assert.match(reference, /@effect\/vitest/u);
  assert.match(reference, /other[\s\S]{0,120}version[\s\S]{0,200}opensrc/iu);
  assert.doesNotMatch(reference, /beta/iu);
});

test("effect routes property tests through one Branch Chooser line and one TESTING.md pointer", () => {
  const skill = read(`${root}/SKILL.md`);
  const chooser = skill.slice(skill.indexOf("## Branch Chooser"), skill.indexOf("## Core Defaults"));
  const lines = chooser.split("\n").filter((line) => line.includes("references/PROPERTY_TESTING.md"));

  assert.equal(lines.length, 1);
  assert.match(lines[0], /^- Property tests/u);
  assert.match(lines[0], /`Arbitrary`/u);
  assert.match(lines[0], /`it\.effect\.prop`/u);
  assert.match(read(`${root}/references/TESTING.md`), /\]\(PROPERTY_TESTING\.md\)/u);
});
