import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

const read = (path) =>
  readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

const skillPath = "skills/agnostic/planning/verify-behavior";

test("verify-behavior is a model-invoked planning skill with retained provenance", () => {
  const skill = read(`${skillPath}/SKILL.md`);
  const license = read(`${skillPath}/LICENSE`);
  const upstream = read(`${skillPath}/UPSTREAM.md`);

  assert.match(skill, /^---\nname: verify-behavior\ndescription:/);
  assert.doesNotMatch(skill, /disable-model-invocation/);
  assert.match(license, /Copyright \(c\) 2026 Warp/);
  assert.match(upstream, /ab21d0c5b70e38abe1a53ff6e2934d2637415c5b/);
  assert.match(upstream, /adjacent `LICENSE`/);
});

test("verify-behavior keeps the portable modes, coverage, evidence, and safety contract", () => {
  const skill = read(`${skillPath}/SKILL.md`);

  assert.match(skill, /`reproduce`/);
  assert.match(skill, /`verify`/);
  assert.match(skill, /browser \| computer-use/);
  assert.match(skill, /acceptance criteria/i);
  assert.match(skill, /end-to-end/i);
  assert.match(skill, /confirmed \| partially confirmed \| not reproduced \| blocked/);
  assert.match(skill, /verified \| partially verified \| not verified \| blocked/);
  assert.match(skill, /Do not claim.*without.*evidence/is);
  assert.match(skill, /Do not invent.*capture/is);
  assert.match(skill, /secrets.*screenshots.*reports/is);
  assert.match(skill, /capability.*unavailable.*blocked/is);
  assert.doesNotMatch(skill, /oz\.warp\.dev|request_computer_use|start_recording/);
});

test("implement-spec verifies visible behavior before acceptance classification", () => {
  const skill = read("skills/agnostic/planning/implement-spec/SKILL.md");
  const lifecycle = read(
    "skills/agnostic/planning/implement-spec/references/lifecycle.md",
  );
  const notes = read(
    "skills/agnostic/planning/implement-spec/assets/IMPLEMENTATION-NOTES-TEMPLATE.md",
  );

  assert.match(skill, /\$verify-behavior.*`verify`/is);
  assert.match(skill, /after.*runtime.*checks.*before.*acceptance.*classification/is);
  assert.match(skill, /mismatch.*runtime evidence.*debugging-phase/is);
  assert.match(skill, /capability.*unavailable.*acceptance.*blocked/is);
  assert.match(notes, /## Behavior Verification Evidence/);
  assert.match(
    notes,
    /Story and criterion.*Ref.*Channel.*Scenario.*Status.*Durable evidence or exact blocker/,
  );
  assert.match(
    lifecycle,
    /story and acceptance criterion.*branch or ref.*channel.*scenario.*status.*durable evidence or exact blocker/is,
  );
  assert.match(
    lifecycle,
    /same scenario.*Runtime Validation Evidence.*cross-reference.*duplicate/is,
  );
  assert.match(
    lifecycle,
    /visibly exercisable.*`met`.*cited interactive evidence/is,
  );
});

test("debugging-phase reproduces visible behavior before hypothesis and fix work", () => {
  const skill = read("skills/phases/debugging-phase/SKILL.md");

  assert.match(skill, /\$verify-behavior.*`reproduce`/is);
  assert.match(skill, /before.*hypotheses.*fix work/is);
  assert.match(skill, /reproduction status.*evidence matrix/is);
  assert.match(skill, /blocked reproduction.*evidence.*false confirmation/is);
});
