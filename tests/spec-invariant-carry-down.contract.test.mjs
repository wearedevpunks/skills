import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const read = (path) => readFileSync(path, "utf8");
const section = (text, heading, level = "## ") => {
  const start = text.indexOf(`\n${heading}\n`);
  assert.notEqual(start, -1, `missing section ${heading}`);
  const next = text.indexOf(`\n${level}`, start + heading.length + 1);
  return text.slice(start, next === -1 ? undefined : next);
};

const fields = ["test_form", "invariant_refs", "sensitivity_evidence"];
const checkableAs = "Checkable as: <Property Pattern> | model | type | not-checkable";

test("grill axioms carry a Checkable as hint in the log entry and the status list", () => {
  const lines = read("skills/agnostic/requirements/requirements-grill/references/artifact-output.md").split("\n");
  const hints = lines.flatMap((line, index) => (line.trim() === checkableAs ? [index] : []));
  assert.equal(hints.length, 2, "one Checkable as line in the Glossary entry and one in ### Axioms");
  for (const index of hints) {
    assert.match(lines[index], /^ {2}\S/u, "Checkable as is indented under its axiom");
    assert.match(lines[index - 1], /^- (Axiom: )?<Domain invariant/iu, "Checkable as follows an axiom line");
  }
});

test("SPEC template places Spec Invariants directly after Acceptance Criteria", () => {
  const template = read("skills/agnostic/planning/create-spec/assets/SPEC-TEMPLATE.md");
  const headings = template.split("\n").filter((line) => line.startsWith("## "));
  assert.equal(headings[headings.indexOf("## Acceptance Criteria") + 1], "## Spec Invariants");
  const invariants = section(template, "## Spec Invariants");
  assert.ok(invariants.includes("\n| INV | Rule | Source (Q anchor) | Form | Pattern | Seam | Model |\n"));
  assert.match(invariants, /\]\(\.\.\/\.\.\/tdd\/properties\.md#form\)/u, "Form values link their tdd owner");
  assert.ok(invariants.includes("`example | property | stateful-property | model | type`"));
  assert.ok(invariants.includes("Write `none` when the spec has no Spec Invariant."));
});

test("create-spec assigns INV-nnn ids that cite their source grill question", () => {
  const readiness = read("skills/agnostic/planning/create-spec/references/readiness.md");
  assert.match(readiness, /assigns? `INV-nnn`/u);
  assert.match(readiness, /source grill question/u);
  assert.match(readiness, /`Checkable as`[\s\S]{0,200}`not-checkable`/u);
});

test("plan-schema owns test_form, invariant_refs and sensitivity_evidence", () => {
  const schema = read("skills/agnostic/planning/create-plan/references/plan-schema.md");
  const taskList = schema.slice(schema.indexOf("Every task must include:"), schema.indexOf("Every architecture-bearing task"));
  const example = schema.slice(schema.lastIndexOf("```md"));
  for (const field of fields) {
    assert.ok(taskList.includes(`\n- \`${field}\``), `task list names ${field}`);
    assert.ok(example.includes(`\n- **${field}**:`), `example task shows ${field}`);
  }
  assert.match(schema, /`test_form`[^\n]*`not_applicable`/u);
  assert.match(schema, /`invariant_refs`[^\n]*`\[INV-nnn\]`[^\n]*`none`/u);
  assert.match(schema, /`sensitivity_evidence`[^\n]*blank[^\n]*\]\(\.\.\/\.\.\/tdd\/sensitivity\.md\)/u);
});

test("create-plan sets the fields from Spec Invariants and normalizes them", () => {
  const shaping = read("skills/agnostic/planning/create-plan/references/tdd-shaping.md");
  const start = shaping.indexOf("`## Spec Invariants`");
  assert.notEqual(start, -1, "tdd-shaping reads the spec's Spec Invariants");
  const carry = shaping.slice(start);
  for (const field of ["test_form", "invariant_refs"]) assert.ok(carry.includes(`- \`${field}\`:`), `tdd-shaping sets ${field}`);
  const skill = read("skills/agnostic/planning/create-plan/SKILL.md");
  const from = skill.indexOf("Normalize every task");
  const normalize = skill.slice(from, skill.indexOf("\n11. ", from));
  for (const field of fields) assert.ok(normalize.includes(`\`${field}\``), `normalize step names ${field}`);
});

test("worker Task Result and lifecycle carry the fields and the parent Mutant gate", () => {
  const brief = read("skills/agnostic/planning/implement-spec/references/parallel-worker-brief.md");
  const result = section(brief, "## Task Result");
  for (const field of fields) assert.ok(result.includes(`\`${field}\``), `Task Result carries ${field}`);

  const lifecycle = read("skills/agnostic/planning/implement-spec/references/lifecycle.md");
  const contract = lifecycle.split("\n").find((line) => line.includes("as the task completion contract") && line.includes("red_evidence"));
  for (const field of fields) assert.ok(contract.includes(`\`${field}\``), `completion contract carries ${field}`);
  assert.match(lifecycle, /Task Gate[^\n]*`git diff --quiet`[^\n]*every file named by a recorded Mutant[^\n]*blocks? the task while a Mutant remains/u);
  assert.match(lifecycle, /`sensitivity_evidence: parent_required`[^\n]*parent runs the Sensitivity Proof itself[^\n]*\]\(\.\.\/\.\.\/tdd\/sensitivity\.md\)/u);
});
