import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { test } from "node:test";

const read = (path) =>
  readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

test("logic prototype is a portable self-contained browser demo", () => {
  const skill = read("skills/agnostic/research/prototype/SKILL.md");
  const logic = read("skills/agnostic/research/prototype/LOGIC.md");
  const all = `${skill}\n${logic}`;

  assert.match(all, /single, self-contained HTML file/i);
  assert.match(logic, /visible intro/i);
  assert.match(logic, /readable panel \(labelled fields, not a raw JSON dump\)/i);
  assert.match(logic, /free-play buttons.{0,80}always available/is);
  assert.match(logic, /scenarios.{0,40}one per tab/is);
  assert.match(logic, /Starting a walkthrough resets to a known initial state/i);
  assert.match(logic, /domain language/i);
  assert.match(logic, /no DOM, no `document`/i);
});

test("prototype keeps Devpunks durable evidence and verdict lifecycle", () => {
  const skill = read("skills/agnostic/research/prototype/SKILL.md");

  assert.match(skill, /prototype\/<slug>/);
  assert.match(skill, /remote retention/i);
  assert.match(skill, /verify the remote ref contains the evidence commit/i);
  assert.match(skill, /immutable commit SHA/i);
  assert.match(skill, /accept, iterate, or reject/i);
  assert.match(skill, /PROTOTYPE-VERDICT\.md/);
});

test("writing-for-agents remains canonical with a disabled legacy compatibility skill", () => {
  const skill = read("skills/agnostic/docs/writing-for-agents/SKILL.md");
  const mechanics = read(
    "skills/agnostic/docs/writing-for-agents/SKILL-MECHANICS.md",
  );
  const compatibility = read(
    "skills/agnostic/docs/writing-great-skills/SKILL.md",
  );

  assert.match(skill, /name: writing-for-agents/);
  assert.match(skill, /creating or editing skills.{0,80}AGENTS\.md.{0,20}CLAUDE\.md/i);
  assert.match(skill, /environment.{0,120}source of truth/is);
  assert.match(skill, /cache what the agent cannot find by looking/i);
  assert.match(mechanics, /model-invoked/i);
  assert.match(mechanics, /user-invoked/i);
  assert.match(mechanics, /router skill/i);
  assert.equal(
    existsSync(
      new URL(
        "../skills/agnostic/docs/writing-great-skills/SKILL.md",
        import.meta.url,
      ),
    ),
    true,
  );
  assert.match(compatibility, /disable-model-invocation:\s*true/u);
  assert.match(compatibility, /Deprecated compatibility/u);
  assert.match(compatibility, /(?:Prefer|use) writing-for-agents/iu);
});

test("wait-what is the upstream user-invoked anti-jargon corrective", () => {
  const skill = read("skills/misc/wait-what/SKILL.md");

  assert.match(skill, /name: wait-what/);
  assert.match(skill, /disable-model-invocation: true/);
  assert.match(skill, /ASD-STE100 Simplified Technical English/);
  assert.match(skill, /ubiquitous language from `GLOSSARY\.md`/);
});

test("v1.2 imports retain immutable provenance and the upstream license", () => {
  for (const directory of [
    "skills/agnostic/docs/writing-for-agents",
    "skills/agnostic/research/prototype",
    "skills/misc/wait-what",
  ]) {
    assert.match(
      read(`${directory}/UPSTREAM.md`),
      /2ffb184ffbb752faa664c0b204f3c9241b1428e9/,
    );
    assert.match(read(`${directory}/LICENSE`), /Copyright \(c\) 2026 Matt Pocock/);
  }
});
