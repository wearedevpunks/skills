import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

const read = (path) =>
  readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

const base = "skills/agnostic/planning/implement-spec";

test("implement-spec defines the required draft PR body sections", () => {
  const body = read(`${base}/references/pr-body.md`);
  const template = read(`${base}/assets/PR-BODY-TEMPLATE.md`);

  for (const heading of ["## Testing", "## Risk", "## How to revert"]) {
    assert.match(body, new RegExp(`^${heading}$`, "m"));
    assert.match(template, new RegExp(`^${heading}$`, "m"));
  }
  assert.match(body, /`### UI Evidence`\s+subsection under\s+`Testing`/);
  assert.match(template, /^### UI Evidence$/m);
  assert.match(body, /derived from the change's blast radius, not\n  from who or what wrote it/);
  assert.match(body, /does not set review-phase policy/);
  assert.match(body, /The human operator of the agent reviews them/);
  assert.match(body, /TBD/);
});

test("implement-spec cites the PR body sources", () => {
  const body = read(`${base}/references/pr-body.md`);

  assert.match(body, /https:\/\/x\.com\/addyosmani\/status\/2114604912520921136/);
  assert.match(body, /https:\/\/x\.com\/seth_codes_\/status\/2114810243444256964/);
});

test("implement-spec writes the PR body on draft PR create and update", () => {
  const skill = read(`${base}/SKILL.md`);
  const lifecycle = read(`${base}/references/lifecycle.md`);
  const uiEvidence = read(`${base}/references/ui-screenshot-evidence.md`);

  assert.match(skill, /references\/pr-body\.md/);
  assert.match(lifecycle, /Each draft PR create or update writes the body defined in\n\[pr-body\.md\]/);
  assert.match(lifecycle, /ensure the draft PR body matches \[pr-body\.md\]/);
  assert.match(uiEvidence, /### UI Evidence` subsection under `## Testing`/);
  assert.doesNotMatch(uiEvidence, /Include a `UI Evidence` section in the PR body/);
});
