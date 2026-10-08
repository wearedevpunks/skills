import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

const read = (path) =>
  readFileSync(
    new URL(`../skills/phases/docs-ingest-phase/${path}`, import.meta.url),
    "utf8",
  );

const section = (text, heading) => {
  const [, body] =
    text.match(new RegExp(`^## ${heading}\\s*$([\\s\\S]*?)(?=^## |(?![\\s\\S]))`, "mu")) ?? [];
  assert.ok(body, `has a "## ${heading}" section`);
  return body;
};

test("ingest decides freshness from recorded source identity, not an ingest flag", () => {
  const ingest = read("references/wiki-ingest.md");

  assert.doesNotMatch(ingest, /`ingested: true`[^\n]*no-op/iu);
  assert.doesNotMatch(ingest, /^ingested: (true|false)$/mu);
  assert.match(ingest, /`ingested_revision`[^\n]*Git blob ID/u);
  assert.match(ingest, /`sources`[^\n]*`path`[^\n]*`sha256`/u);
  assert.match(ingest, /legacy `ingested: true` without `ingested_revision`[^\n]*_freshness unknown_/iu);
  assert.match(ingest, /_fresh_/u);
  assert.match(ingest, /_stale_/u);
  assert.match(ingest, /path[^\n]*date[^\n]*never prove freshness/iu);
});

test("ingest keeps one append-only log rule with no entry cap", () => {
  const ingest = read("references/wiki-ingest.md");
  const log = section(ingest, "Log");

  assert.equal(ingest.match(/^## Log$/gmu)?.length, 1);
  assert.doesNotMatch(ingest, /\b50 entries\b|cap the log/iu);
  assert.match(log, /append-only/u);
  assert.match(log, /oldest-first/u);
  assert.match(log, /no (entry )?cap/iu);
  assert.match(log, /archive[^\n]*only when the root log links/iu);
  assert.match(log, /existing order[^\n]*history/iu);
});

test("ingest reports partial integration until required work is finished", () => {
  const outcome = section(read("references/wiki-ingest.md"), "Outcome");

  assert.match(outcome, /\*\*complete\*\*/u);
  assert.match(outcome, /\*\*partial\*\*[^\n]*route, output or validation work[\s\S]*unfinished work/iu);
  assert.match(outcome, /bookkeeping[^\n]*for \*\*complete\*\*[^\n]*knowledge no-op/iu);
  assert.match(outcome, /\*\*partial\*\* run keeps the earlier `ingested_revision`/u);
  assert.match(outcome, /knowledge no-op/u);
});

test("implemented status comes only from implementation evidence", () => {
  const status = section(read("references/wiki-ingest.md"), "Status");

  assert.match(status, /`implemented`: implementation evidence/u);
  assert.match(status, /`IMPLEMENTATION-NOTES\.md` file[^\n]*on its own it establishes nothing/u);
  for (const page of ["references/concept-pages.md", "references/flow-pages.md"]) {
    const text = read(page);
    assert.doesNotMatch(text, /`implemented` when `IMPLEMENTATION-NOTES\.md` is present/u, page);
    assert.match(text, /\(wiki-ingest\.md#status\)/u, page);
  }
});

test("concepts reconcile verified sources into the owning article", () => {
  const concepts = read("references/concept-pages.md");

  assert.doesNotMatch(concepts, /ingested: false|`ingested` is absent|mark raw files/iu);
  assert.match(concepts, /verified `source\.json`[\s\S]*\(source-capture\.md/u);
  assert.match(concepts, /owning article[^\n]*overlapping/iu);
  assert.match(concepts, /contradictions? and unaccepted product choices[^\n]*attributed[^\n]*visibly unresolved/iu);
  assert.match(concepts, /_knowledge no-op_/u);
});

test("required flows finish before dependent concepts", () => {
  const completion = section(read("references/flow-pages.md"), "Completion");

  assert.match(completion, /every required flow page/iu);
  assert.match(completion, /one per extracted flow/u);
  assert.match(completion, /flow[^\n]*fail[\s\S]*\*\*partial\*\*[\s\S]*stop before concept writing/iu);
});

test("routing owns the discovery rules every changed article must meet", () => {
  const discovery = section(read("references/fumadocs-routing.md"), "Discovery");

  assert.match(discovery, /owning `meta\.json`/u);
  assert.match(discovery, /discovery[- ]map entry[\s\S]*one-line scope summary[\s\S]*"Applies when" cue/iu);
  assert.match(discovery, /links resolve[\s\S]*before[^\n]*complete/iu);
  for (const page of [
    "phases/private-internal.md",
    "references/wiki-ingest.md",
    "references/concept-pages.md",
    "references/flow-pages.md",
    "references/learning-artifacts.md",
  ]) {
    const text = read(page);
    assert.doesNotMatch(text, /nearest `meta\.json`|"Applies when"|must list every page/u, page);
  }
});

test("machine views serve the routed corpus and never claim raw sources", () => {
  const views = section(read("references/fumadocs-routing.md"), "Machine views");

  assert.match(views, /`llms\.txt`[\s\S]*`llms-full\.txt`[\s\S]*per-page Markdown[\s\S]*search/u);
  assert.match(views, /same routed corpus/u);
  assert.match(views, /raw home[\s\S]*outside the collection[\s\S]*HTTP exports?/iu);
});

test("private ingest resolves the wiki contract and orders flows before concepts", () => {
  const path = read("phases/private-internal.md");
  const workflow = section(path, "Workflow");

  assert.match(workflow, /\(\.\.\/references\/wiki-contract\.md/u);
  assert.doesNotMatch(path, /`apps\/wiki`|single-repo: `wiki`/u);
  const order = ["**Learning**", "**Flows**", "**Concepts**", "**Discovery**", "**Root docs**", "**Outcome**"].map(
    (step) => workflow.indexOf(step),
  );
  assert.ok(order.every((index) => index >= 0), `every step is present: ${order}`);
  assert.deepEqual(order, [...order].sort((a, b) => a - b));
  assert.match(workflow, /required flow[^\n]*fail[\s\S]*stop[\s\S]*concept/iu);
});

test("learning refresh repairs references and keeps durable knowledge", () => {
  const learning = read("references/learning-artifacts.md");
  const outcomes = section(learning, "Refresh Outcomes");

  assert.equal(learning.match(/^## Refresh Outcomes$/gmu)?.length, 1);
  assert.match(outcomes, /`consolidate`, `replace` or `delete`[\s\S]*repair every reference[\s\S]*links[\s\S]*`meta\.json`[\s\S]*discovery-map/u);
  assert.match(outcomes, /projections?[^\n]*canonical source owners?/iu);
  assert.match(outcomes, /source[^\n]*disappear[^\n]*alone never authorizes deleting durable routed knowledge/iu);
});

test("agent interface names every docs-ingest branch", () => {
  const agent = read("agents/openai.yaml");

  for (const field of ["short_description", "default_prompt"]) {
    const [, value] = agent.match(new RegExp(`^\\s*${field}: "(.*)"$`, "mu")) ?? [];
    assert.ok(value, `${field} is set`);
    for (const branch of [/setup\/adoption/u, /captur/u, /health/u, /private/u, /public/u]) {
      assert.match(value, branch, `${field} names ${branch}`);
    }
  }
});
