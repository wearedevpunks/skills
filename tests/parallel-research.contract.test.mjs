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
  assert.match(contract, /record the current checkout and branch/i);
  assert.match(
    contract,
    /write and commit.*current checkout.*current branch/is,
  );
  assert.match(
    contract,
    /never create, switch, checkout,\s+or use another branch or worktree/is,
  );
  assert.match(
    contract,
    /verify.*same branch\s+contains the report commit/is,
  );
  assert.doesNotMatch(
    all,
    /(?:create|switch|checkout|retain|push)[^\n]*`research\/<slug>`/i,
  );
  assert.match(
    contract,
    /before returning the\s+immutable commit SHA\s+and path/i,
  );
  assert.match(contract, /docs-ingest-phase.*optional curation/is);
  assert.doesNotMatch(skill, /Standalone audits remain response-only/i);
});
