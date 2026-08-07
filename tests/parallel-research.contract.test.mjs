import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

const read = (path) =>
  readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

test("parallel research always produces a wiki-backed durable report", () => {
  const skill = read("skills/agnostic/research/parallel-research/SKILL.md");
  const contract = read(
    "skills/agnostic/research/parallel-research/DURABLE-REPORT.md",
  );
  const all = `${skill}\n${contract}`;

  assert.match(all, /durable-report mode is mandatory/i);
  assert.match(all, /Every run writes one consolidated report/i);
  assert.match(
    contract,
    /<wiki-root>\/content\/docs\/project\/research\/<slug>-research-report\.md/,
  );
  assert.match(contract, /sibling to `project\/grilling`/i);
  assert.match(contract, /2-4 readonly lanes/i);
  assert.match(contract, /lanes never write the report/i);
  assert.match(contract, /one writer and\s+one consolidated report/i);
  assert.match(contract, /push\s+or explicitly retain `research\/<slug>`/i);
  assert.match(contract, /verify the retained ref contains the report commit/i);
  assert.match(contract, /before returning the\s+immutable commit SHA and path/i);
  assert.match(contract, /docs-ingest-phase.*optional curation/is);
  assert.doesNotMatch(skill, /Standalone audits remain response-only/i);
});

test("parallel research applies wait-what to one bounded synthesis", () => {
  const skill = read("skills/agnostic/research/parallel-research/SKILL.md");
  const contract = read(
    "skills/agnostic/research/parallel-research/DURABLE-REPORT.md",
  );
  const all = `${skill}\n${contract}`;

  assert.match(
    skill,
    /after (?:evidence )?synthesis.{0,200}(?:invoke|apply) `?\$wait-what`?.{0,200}before (?:writing|returning|final)/is,
  );
  assert.match(contract, /short context/is);
  assert.match(contract, /trusted claims.{0,120}(?:primary )?source/is);
  assert.match(contract, /uncertainty.{0,120}conflicts|conflicts.{0,120}uncertainty/is);
  assert.match(contract, /selected next route/is);
  assert.match(all, /one (?:bounded )?synthesis/is);
  assert.match(all, /response.{0,200}(?:links to|points to).{0,160}report/is);
  assert.doesNotMatch(all, /accepted direction/iu);
});
