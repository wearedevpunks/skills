import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

const ruleLink = /phase-graph\.md#confirm-to-continue/u;
const explicitOnly = ["review-phase", "requirements-phase", "delivery-phase"];

test("phase-graph holds the one confirm-to-continue rule for explicit-only phases", () => {
  const graph = read("skills/agnostic/cli/ask-hi/references/phase-graph.md");

  assert.match(graph, /^## Confirm to continue$/mu);
  assert.match(graph, /names that phase and its scope/u);
  assert.match(graph, /bare yes[^.]*vague or unnamed proposal[^.]*starts nothing/iu);
  assert.match(graph, /A Full Delivery the human started already approves its own inner steps/u);
  assert.match(graph, /`\$review-phase` at `review_due`/u);
  assert.match(graph, /`\$requirements-phase`/u);
  assert.match(graph, /reads `\.agents\/skills\/<phase>\/SKILL\.md`/u);
  assert.match(graph, /`allow_implicit_invocation: false`/u);
  assert.doesNotMatch(graph, /names the command and stops/u);
});

test("every other phase transition source points to the rule instead of restating it", () => {
  const sources = {
    "ask-hi/SKILL.md": read("skills/agnostic/cli/ask-hi/SKILL.md"),
    "known-gaps.md": read("skills/agnostic/cli/ask-hi/references/known-gaps.md"),
    "review.md": read("skills/phases/delivery-phase/phases/review.md"),
    "spec.md": read("skills/phases/delivery-phase/phases/spec.md"),
  };
  for (const [name, text] of Object.entries(sources)) assert.match(text, ruleLink, name);

  assert.doesNotMatch(sources["known-gaps.md"], /never starts the phase/u);
  assert.doesNotMatch(sources["ask-hi/SKILL.md"], /Only a human can start it; tell the asker to type/u);
});

test("explicit-only phases keep their invocation flags on Claude and Codex", () => {
  for (const skill of explicitOnly) {
    assert.match(read(`skills/phases/${skill}/SKILL.md`), /^disable-model-invocation: true$/mu, skill);
    assert.match(read(`skills/phases/${skill}/agents/openai.yaml`), /allow_implicit_invocation: false/u, skill);
  }
});
