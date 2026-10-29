import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const read = (path) => readFileSync(path, "utf8");
const between = (text, start, end) => {
  const from = text.indexOf(start);
  assert.notEqual(from, -1, `missing ${start}`);
  const to = end === undefined ? -1 : text.indexOf(end, from + start.length);
  if (end !== undefined) assert.notEqual(to, -1, `missing ${end}`);
  return text.slice(from, to === -1 ? undefined : to);
};

test("Spec Axis reports unsupported test evidence as one test_gap bullet that links its tdd owners", () => {
  const axis = read("skills/phases/review-phase/references/axis-spec.md");
  const unsupported = between(axis, "- **Unsupported evidence:**");
  assert.match(unsupported, /`sensitivity_evidence`/u, "Unsupported evidence names sensitivity_evidence");
  const bullets = unsupported.split("\n").filter((line) => /^\s+- /u.test(line));
  assert.equal(bullets.length, 1, "exactly one bullet nested under Unsupported evidence");

  const bullet = unsupported.slice(unsupported.indexOf(bullets[0])).replace(/\s+/gu, " ");
  assert.match(bullet, /`test_gap`/u);
  assert.match(bullet, /Spec Invariant \(`INV-nnn`\) with no test of its declared \[Form\]\(\.\.\/\.\.\/tdd\/properties\.md#form\)/u);
  assert.match(bullet, /passed on its first run with no `sensitivity_evidence`/u);
  assert.match(bullet, /\[Sensitivity Proof\]\(\.\.\/\.\.\/tdd\/sensitivity\.md\)/u);
  assert.match(bullet, /\[Generator Narrowing\]\(\.\.\/\.\.\/tdd\/properties\.md#generator-rules\) or a loosened rule with no recorded human approval/u);
  assert.match(bullet, /Model that diverges from its `ARCHITECTURE\.md` `## Models` row/u);
  assert.match(bullet, /`\$model-checking` when installed/u);
});

test("debugging-phase Verify adds a property whose Sensitivity Proof reverts the fix", () => {
  const skill = read("skills/phases/debugging-phase/SKILL.md");
  const verify = between(skill, "7. **Verify.**", "8. **Exit.**").replace(/\s+/gu, " ");
  assert.match(verify, /breaks a rule that matches a \[Property Pattern\]\(\.\.\/tdd\/properties\.md#property-patterns\)/u);
  assert.match(verify, /adds a property whose \[Sensitivity Proof\]\(\.\.\/tdd\/sensitivity\.md\) reverts the fix as the Mutant/u);
  assert.match(verify, /In delivery-internal mode, the rule also gets a \[Spec Invariant\]\([^)]*SPEC-TEMPLATE\.md\) row in `SPEC\.md`; a standalone fix stops at the property\./u);
});
