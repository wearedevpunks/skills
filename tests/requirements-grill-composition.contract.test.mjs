import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

const skill = readFileSync(
  new URL(
    "../skills/agnostic/requirements/requirements-grill/SKILL.md",
    import.meta.url,
  ),
  "utf8",
);

const flow = readFileSync(
  new URL(
    "../skills/agnostic/requirements/requirements-grill/references/grilling-flow.md",
    import.meta.url,
  ),
  "utf8",
);

test("requirements-grill delegates live completion semantics to grilling", () => {
  assert.match(skill, /When `\$grilling` reports completion/);
  assert.doesNotMatch(skill, /After the frontier is empty/);
});

test("requirements-grill uses show-me throughout live branch traversal", () => {
  assert.match(
    skill,
    /\$show-me.*throughout the active grill.*difficult questions.*comparisons.*interacting parts.*key turning points/is,
  );
  assert.match(skill, /smallest applicable view.*full view catalog/is);
  assert.match(
    flow,
    /inside any grilling branch.*difficult question.*comparison.*interacting parts.*key turning point/is,
  );
  assert.match(
    flow,
    /each persisted round boundary.*next frontier.*glossary.*parked branches.*flow.*\$show-me/is,
  );
  assert.match(flow, /persisted artifacts remain authoritative/is);
});

test("requirements-grill interleaves code-grounded questions in any branch", () => {
  for (const document of [skill, flow]) {
    assert.match(
      document,
      /Interleave (?:code-grounded|technical) questions.*within any (?:grilling|active) branch/is,
    );
    assert.match(
      document,
      /topology.*dependency direction.*injection.*seams.*boundaries.*persistence.*module shape/is,
    );
  }
});
