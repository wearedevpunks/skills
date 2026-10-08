import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

const read = (path) =>
  readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

const skill = read("skills/agnostic/planning/create-plan/SKILL.md");
const schema = read(
  "skills/agnostic/planning/create-plan/references/plan-schema.md",
);

const numberedStep = (text, pattern) =>
  text
    .split(/\n(?=\d+\. )/u)
    .find((step) => /^\d+\. /u.test(step) && pattern.test(step));

const section = (text, heading) => {
  const start = text.indexOf(`\n${heading}\n`);
  if (start === -1) return undefined;
  const rest = text.slice(start + heading.length + 2);
  const end = rest.search(/\n## /u);
  return end === -1 ? rest : rest.slice(0, end);
};

test("create-plan builds Wiki Context as one required step with a checkable criterion", () => {
  const step = numberedStep(skill, /Wiki Context/u);
  assert.ok(step, "create-plan/SKILL.md has a numbered Wiki Context step");

  // Resolve the project's wiki contract through docs-ingest-phase.
  assert.match(step, /`docs-ingest-phase`[\s\S]*`references\/wiki-contract\.md`/u);
  // Select through the discovery map and search, not the whole wiki.
  assert.match(step, /discovery[\s\S]*"Applies when"/u);
  assert.match(step, /search/iu);
  // Read selected articles with their sources and check claims against evidence.
  assert.match(step, /supporting sources/iu);
  assert.match(step, /material claim[\s\S]*primary evidence/iu);
  // Return novel findings to ingest, or record a knowledge no-op.
  assert.match(step, /novel[\s\S]*evidence-backed[\s\S]*`docs-ingest-phase`[\s\S]*knowledge no-op/iu);
  // Checkable completion criterion: cited routed pages or explicit absence.
  assert.match(step, /Done when[\s\S]*`## Wiki Context`[\s\S]*routed page[\s\S]*no applicable context/iu);
  // Section format lives in plan-schema.md, not in SKILL.md.
  assert.match(step, /`references\/plan-schema\.md`/u);
});

test("create-plan replaces the optional learning-artifact scan", () => {
  assert.doesNotMatch(skill, /learning artifacts?[^\n]*when relevant/iu);
  assert.doesNotMatch(skill, /Scan relevant routed learning/iu);
});

test("plan-schema requires a Wiki Context section that allows explicit absence", () => {
  const include = section(schema, "## Plan contract");
  assert.ok(include, "plan-schema.md has a Plan contract section");
  assert.match(include, /^- `## Wiki Context`/mu);

  const wiki = section(schema, "## Wiki Context");
  assert.ok(wiki, "plan-schema.md defines the Wiki Context section");
  // Knowledge used: cited routed page, selection reason, freshness, status.
  assert.match(wiki, /routed page/iu);
  assert.match(wiki, /"Applies when"[\s\S]*search/iu);
  assert.match(wiki, /fresh[\s\S]*stale/iu);
  assert.match(wiki, /proposal[\s\S]*verified implementation/iu);
  // Stale or contradictory claims and their resolution.
  assert.match(wiki, /stale or contradictory[\s\S]*resolution/iu);
  // Returned findings or knowledge no-op.
  assert.match(wiki, /`docs-ingest-phase`[\s\S]*knowledge no-op/iu);
  // Explicit absence.
  assert.match(wiki, /No applicable context/u);
});
