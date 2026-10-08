import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

const health = () =>
  readFileSync(
    new URL("../skills/phases/docs-ingest-phase/references/health.md", import.meta.url),
    "utf8",
  );

test("health outcome keeps structural and semantic records separate", () => {
  const text = health();

  assert.match(text, /^## Structural record$/mu);
  assert.match(text, /^## Semantic record$/mu);
  assert.match(text, /wiki contract's validation commands[\s\S]*\(wiki-contract\.md\)/u);
  assert.match(text, /frontmatter, links, navigation and source references/u);
  assert.match(text, /`command`[\s\S]*`result`[\s\S]*`unavailable`/u);
  assert.match(text, /_structural_ pass[^\n]*never claims semantic accuracy or deployed visibility/u);
  for (const kind of ["stale_claim", "contradiction", "missing_connection", "discovery_gap"]) {
    assert.match(text, new RegExp(`\`${kind}\``, "u"));
  }
  assert.match(text, /`resolved`[\s\S]*`unresolved`/u);
  assert.match(text, /^- `structural`: [\s\S]*^- `semantic`: /mu);
});

test("health maintenance justifies lifecycle changes and keeps history", () => {
  const text = health();

  assert.match(text, /justified refresh outcome[\s\S]*\(learning-artifacts\.md#refresh-outcomes\)/u);
  assert.doesNotMatch(text, /`mark_stale`:/u);
  assert.doesNotMatch(text, /repair every reference|canonical source owners?|never authorizes deleting/iu);
  assert.match(text, /\(wiki-ingest\.md#log\)/u);
  assert.doesNotMatch(text, /oldest-first|newest-first|50 entries/iu);
  assert.match(text, /archive[\s\S]*recent-entry limit never silently discards history/u);
});

test("health resumes from durable evidence and preserves concurrent work", () => {
  const text = health();

  assert.match(text, /^## Resume$/mu);
  assert.match(text, /interruption[\s\S]*lost acknowledgement/u);
  assert.match(text, /durable evidence[\s\S]*originals[\s\S]*Git[\s\S]*outputs/u);
  assert.match(text, /Continue only that missing work/u);
  assert.match(text, /no duplicate original and no second integration-complete claim/u);
  assert.match(text, /^## Overlapping writes$/mu);
  assert.match(text, /re-read the page's current state[\s\S]*preserve every concurrent change[\s\S]*explicit conflict/u);
  assert.match(text, /\(\.\.\/SKILL\.md#project-verifier-boundary\)/u);
  assert.match(text, /^- `resume`: [\s\S]*^- `conflicts`: /mu);
});
