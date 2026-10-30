import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";

const root = path.resolve(import.meta.dirname, "..");
const skillRoot = path.join(root, "skills/agnostic/requirements/write-backlog");
const read = (relativePath) =>
  readFileSync(path.join(skillRoot, relativePath), "utf-8");
const humanBacklog = () => read("references/human-backlog.md");
// Markdown wraps prose at any space; match sentences on collapsed whitespace.
const prose = () => humanBacklog().replace(/\s+/gu, " ");

const tableRow = (guidance, firstCell) =>
  guidance
    .split("\n")
    .find((line) => line.startsWith("|") && line.includes(`| ${firstCell} |`));

test("step 9 points to the human-backlog branch only when humanBacklog is configured", () => {
  const skill = read("SKILL.md");
  const step9 = skill.match(/^9\. [\s\S]*?(?=^10\. )/mu)?.[0] ?? "";

  assert.match(step9, /humanBacklog[\s\S]*\(references\/human-backlog\.md\)/u);
  assert.equal(skill.match(/references\/human-backlog\.md/gu)?.length, 1);
});

test("owed Human State is the highest state all Fog-scope evidence supports", () => {
  const guidance = humanBacklog();

  assert.match(tableRow(guidance, "In progress") ?? "", /first work-started fact[\s\S]*Fog scope/iu);
  assert.match(tableRow(guidance, "On staging") ?? "", /staging evidence[\s\S]*every Story and Task/iu);
  assert.match(tableRow(guidance, "Live") ?? "", /Fog completes[\s\S]*production evidence/iu);
  assert.match(tableRow(guidance, "Withdrawn") ?? "", /Cancelled[\s\S]*no production evidence/iu);
  assert.match(tableRow(guidance, "no write") ?? "", /Superseded[\s\S]*move[\s\S]*links/iu);
  const text = prose();
  assert.match(text, /highest state that all recorded evidence for the Fog scope supports/iu);
  assert.match(text, /later fact for an earlier state never lowers/iu);
  assert.match(text, /merge is never staging evidence/iu);
});

test("the branch writes nothing and reports no failure without config, link or Fog", () => {
  const guidance = prose();

  assert.match(guidance, /\.devpunks\/settings\.json[\s\S]*humanBacklog/u);
  assert.match(
    guidance,
    /no `humanBacklog`[\s\S]*no Business Request link[\s\S]*no Fog[\s\S]*zero Human Backlog writes[\s\S]*no failure/iu,
  );
});

test("a missing helper returns setup guidance while Core Backlog writes complete", () => {
  const guidance = prose();

  assert.match(guidance, /`\.agents\/skills\/human-backlog-ado\/scripts\/ado\.py`[\s\S]*absent/iu);
  assert.match(guidance, /setup guidance[\s\S]*`ci-solutions` Pack[\s\S]*`hi update`[\s\S]*`setup-human-backlog`/u);
  assert.match(guidance, /zero Human Backlog writes[\s\S]*Core Backlog writes complete/iu);
});

test("the Human State write uses the exact set-state call and retries through the residual delta", () => {
  const guidance = prose();

  assert.ok(
    guidance.includes(
      'python3 .agents/skills/human-backlog-ado/scripts/ado.py set-state <id> "<Human State>" --comment "<comment>"',
    ),
  );
  assert.match(guidance, /`written`[\s\S]*`unchanged`[\s\S]*success/iu);
  assert.match(guidance, /exit 1[\s\S]*refus[\s\S]*not retr/iu);
  assert.match(guidance, /next delivery event retries the residual delta/iu);
  assert.match(guidance, /Core Backlog writes[\s\S]*stay applied/iu);
  assert.match(guidance, /ado\.py get <id>/u);
});

test("each Human State change carries one plain-language comment", () => {
  const guidance = prose();

  assert.match(guidance, /one comment per (?:Human )?State change/iu);
  assert.match(guidance, /Business Request's language/iu);
  assert.match(guidance, /date[\s\S]*release name[\s\S]*when known/iu);
  assert.match(guidance, /pull request[\s\S]*commit[\s\S]*Linear[\s\S]*GitHub/iu);
});

test("a Fog and its Business Request link to each other one-to-one", () => {
  const guidance = prose();

  assert.match(guidance, /Linear[\s\S]*attachment link/iu);
  assert.ok(guidance.includes("Business Request: <url>"));
  assert.match(guidance, /Fog intake[\s\S]*request URL[\s\S]*explicit link instruction/iu);
  assert.match(guidance, /one Business Request per Fog/iu);
  assert.match(guidance, /Superseded[\s\S]*both links[\s\S]*successor Fog[\s\S]*same run/iu);
});

test("the Business Request back link is an idempotent Hyperlink read back through get", () => {
  const backLink = tableRow(humanBacklog(), "Business Request") ?? "";
  const guidance = prose();

  assert.match(backLink, /ado\.py hyperlink <id> <fog-url> --comment/u);
  assert.match(guidance, /ado\.py get <id>[\s\S]*`hyperlinks`[\s\S]*Fog URL/u);
  assert.match(guidance, /Hyperlink relation[\s\S]*repeated write is `unchanged`[\s\S]*retry is safe/iu);
  assert.match(
    guidance,
    /Superseded[\s\S]*superseded Fog with `ado\.py unhyperlink <id>[\s\S]*successor Fog with `hyperlink`[\s\S]*read back/iu,
  );
  assert.match(
    guidance,
    /Business Request side[\s\S]*Hyperlink to another open Fog[\s\S]*stop[\s\S]*zero link writes/iu,
  );
  assert.match(guidance, /return envelope[\s\S]*back-link readback[\s\S]*`hyperlinks` entry/iu);
  assert.doesNotMatch(guidance, /ado\.py comment|commentId/u);
});

test("the provider, Fog intake and delivery status references stay unchanged", () => {
  const sha256 = (relativePath) =>
    createHash("sha256").update(readFileSync(path.join(skillRoot, relativePath))).digest("hex");

  assert.deepEqual(readdirSync(path.join(skillRoot, "references/providers")).sort(), [
    "github.md",
    "linear.md",
  ]);
  assert.deepEqual(
    Object.fromEntries(
      [
        "references/fog-intake.md",
        "references/delivery-status.md",
        "references/providers/github.md",
        "references/providers/linear.md",
      ].map((relativePath) => [relativePath, sha256(relativePath)]),
    ),
    {
      "references/fog-intake.md": "c4e2c04dc5249d460af723c1843f368c15006098528002368ecca86b10b9a6d4",
      "references/delivery-status.md": "52b95c0d34389b55999772adb5eadfa37c2d85ef2c9809eb64dd23f0e193da5d",
      "references/providers/github.md": "c0688a8ed93fb2f40e654f9b00af72aea0fba3c1b4860569fc0e4371e8ae388a",
      "references/providers/linear.md": "3cf97d38323fa2855de5ce58f2ddc95a6b03d197a5fd6c0fa6644a4753818a27",
    },
  );
});
