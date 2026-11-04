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

test("debugging-phase Verify adds a property whose Sensitivity Proof reverts the fix", () => {
  const skill = read("skills/phases/debugging-phase/SKILL.md");
  const verify = between(skill, "7. **Verify.**", "8. **Exit.**").replace(/\s+/gu, " ");
  assert.match(verify, /breaks a rule that matches a \[Property Pattern\]\(\.\.\/tdd\/properties\.md#property-patterns\)/u);
  assert.match(verify, /adds a property whose \[Sensitivity Proof\]\(\.\.\/tdd\/sensitivity\.md\) reverts the fix as the Mutant/u);
  assert.match(verify, /In delivery-internal mode, the rule also gets a \[Spec Invariant\]\([^)]*SPEC-TEMPLATE\.md\) row in `SPEC\.md`; a standalone fix stops at the property\./u);
});
