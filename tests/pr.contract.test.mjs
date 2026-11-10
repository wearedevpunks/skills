import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

const read = (path) =>
  readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

const skill = read("skills/misc/pr/SKILL.md");

test("pr is model-invoked and pins Matt's upstream pr skill", () => {
  assert.match(skill, /^---\nname: pr\ndescription: .*pull request/);
  assert.doesNotMatch(skill, /disable-model-invocation/);
  assert.match(
    read("skills/misc/pr/UPSTREAM.md"),
    /e484a8095543718ced436b9b49a8160ed4554000/,
  );
});

test("pr template is one Managed Region with sections in order", () => {
  const template = skill.match(/```markdown\n([\s\S]*?)\n```/)[1];
  const order = [
    "<!-- hi:pr-body:start -->",
    "## Summary",
    "## Evidence",
    "## Merge Danger",
    "**Door:**",
    "**Blast Radius:**",
    "**How to revert:**",
    "**Risk:**",
    "## Authority",
    "## Review",
    "<attribution line>",
    "<!-- hi:pr-body:end -->",
  ];
  const positions = order.map((token) => template.indexOf(token));
  assert.ok(positions.every((position) => position >= 0), positions.join());
  assert.deepEqual([...positions].sort((a, b) => a - b), positions);
});

test("pr rules carry evidence, door, risk and rewrite contracts", () => {
  assert.match(skill, /Resolve `\$show-me`/);
  assert.match(skill, /"Tests are green" alone is a claim/);
  assert.match(skill, /`Pending:`/);
  assert.match(skill, /One-Way Door Rule/);
  assert.match(skill, /`High` for every one-way door/);
  assert.match(skill, /pull_request_template\.md` is not read/);
  assert.match(skill, /keep\s+every byte outside them/);
  assert.match(skill, /No markers yet: put the Managed Region first/);
});

test("delivery writes the PR body through pr", () => {
  const lifecycle = read(
    "skills/agnostic/planning/implement-spec/references/lifecycle.md",
  );
  const closeout = read("skills/phases/delivery-phase/phases/closeout.md");
  assert.match(lifecycle, /provisional body with `\$pr`/);
  assert.match(lifecycle, /gh pr create --draft --body-file/);
  assert.match(closeout, /Resolve `\$pr` and regenerate its Managed Region/);
  assert.match(closeout, /`gh pr ready`/);
  assert.match(closeout, /differs from the PR author/);
  assert.match(closeout, /Merge stays with the human/);
});

test("delivery watches an open PR at its current head until it reports", () => {
  const closeout = read("skills/phases/delivery-phase/phases/closeout.md");
  const router = read("skills/phases/delivery-phase/phases/router.md");
  const watch = closeout.match(/## PR Watch\n([\s\S]*?)\n## /)?.[1];
  assert.ok(watch, "closeout owns a PR Watch section");
  assert.match(watch, /current head/);
  assert.match(watch, /new head resets/i);
  assert.match(watch, /draft/i);
  assert.match(watch, /required checks/);
  assert.match(watch, /external reviewer/);
  assert.match(watch, /mergeab/);
  assert.match(watch, /reason/);
  assert.match(watch, /backoff/);
  assert.match(watch, /`mergeable`, `not mergeable` or\s+`pending`/);
  assert.match(watch, /never merges/);
  assert.match(router, /closeout\.md#pr-watch/);
});
