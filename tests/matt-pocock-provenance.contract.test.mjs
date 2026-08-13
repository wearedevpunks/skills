import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { test } from "node:test";

const read = (path) =>
  readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

const upstreamLicenseSha256 =
  "0e7ac423bf2c6e223b7c5b156f8cf72da49d748e56a1641402c31f22ad07dbb5";

const directMattSkills = [
  "skills/agnostic/docs/writing-beats",
  "skills/agnostic/docs/writing-fragments",
  "skills/agnostic/docs/writing-shape",
  "skills/agnostic/docs/writing-for-agents",
  "skills/agnostic/generic/handoff",
  "skills/agnostic/quality/codebase-design",
  "skills/agnostic/quality/review",
  "skills/agnostic/quality/tdd",
  "skills/agnostic/requirements/domain-modeling",
  "skills/agnostic/requirements/grilling",
  "skills/agnostic/research/improve-codebase-architecture",
  "skills/agnostic/research/prototype",
  "skills/misc/wait-what",
];

test("every direct Matt-derived skill keeps the upstream license and provenance", () => {
  for (const directory of directMattSkills) {
    const license = read(`${directory}/LICENSE`);
    const provenance = read(`${directory}/UPSTREAM.md`);

    assert.equal(
      createHash("sha256").update(license).digest("hex"),
      upstreamLicenseSha256,
      `${directory}/LICENSE must remain byte-identical to Matt's upstream license`,
    );
    assert.match(license, /Copyright \(c\) 2026 Matt Pocock/);
    assert.match(provenance, /github\.com\/mattpocock\/skills/);
    assert.match(provenance, /adjacent `LICENSE`/);
  }
});

test("the indirect Effect derivative records both sides of its attribution chain", () => {
  const directory = "skills/frameworks/effect/effect-service-design";
  const license = read(`${directory}/LICENSE`);
  const provenance = read(`${directory}/UPSTREAM.md`);

  assert.equal(
    createHash("sha256").update(license).digest("hex"),
    upstreamLicenseSha256,
  );
  assert.match(license, /Copyright \(c\) 2026 Matt Pocock/);
  assert.match(provenance, /github\.com\/dmmulroy\/skills/);
  assert.match(provenance, /Matt Pocock's MIT license/);
  assert.match(provenance, /not a skill published in Matt's current curated/);
});

test("the coverage audit includes every current AI Hero catalog skill", () => {
  const audit = read("skills/agnostic/docs/upstream/mattpocock-writing-skills.md");
  for (const name of [
    "setup-matt-pocock-skills",
    "ask-matt",
    "grill-with-docs",
    "to-spec",
    "to-tickets",
    "implement",
    "code-review",
    "wayfinder",
    "prototype",
    "research",
    "improve-codebase-architecture",
    "diagnosing-bugs",
    "resolving-merge-conflicts",
    "triage",
    "wizard",
    "grill-me",
    "handoff",
    "to-questionnaire",
    "teach",
    "wait-what",
    "writing-for-agents",
    "codebase-design",
    "domain-modeling",
    "grilling",
    "tdd",
  ]) {
    assert.ok(audit.includes("`" + name + "`"));
  }
});
