import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

const root = "skills/languages/typescript/model-checking";
const architecture = "skills/agnostic/planning/create-architecture";

const section = (text, heading) => {
  const start = text.indexOf(`\n## ${heading}\n`);
  assert.notEqual(start, -1, `missing ## ${heading}`);
  const rest = text.slice(start + heading.length + 5);
  const end = rest.search(/^## /mu);
  return end === -1 ? rest : rest.slice(0, end);
};

// Top-level numbered steps of a list, each up to the next top-level step.
const steps = (text) => text.split(/^(?=\d+\. )/mu).filter((part) => /^\d+\. /u.test(part));

const line = (text, prefix) => text.split("\n").find((entry) => entry.startsWith(prefix));

test("model-checking is model-invoked and its description carries one trigger per branch", () => {
  const skill = read(`${root}/SKILL.md`);
  const metadata = read(`${root}/agents/openai.yaml`);
  const description = skill.match(/^---\nname: model-checking\ndescription: (.+)\n---\n/u)?.[1];

  assert.ok(description, "frontmatter has name model-checking and a one-line description");
  assert.doesNotMatch(skill, /disable-model-invocation/u);
  assert.match(description, /^Model /u, "description front-loads the leading word Model");
  for (const branch of [
    /two or more writers on shared state/u,
    /background job or retry touching client-written state/u,
    /recovery or resync/u,
    /delivery guarantee/u,
  ]) {
    assert.match(description, branch);
  }
  assert.match(metadata, /^interface:\n[\s\S]*display_name:[\s\S]*short_description:[\s\S]*default_prompt:[\s\S]*\$model-checking/u);
});

test("model-checking pins both tools exactly and owns the trigger and Model rules", () => {
  const skill = read(`${root}/SKILL.md`);

  assert.match(skill, /`tsprover@0\.0\.2`/u);
  assert.match(skill, /`tla-ts@0\.0\.3`/u);
  const trigger = section(skill, "Trigger");
  for (const branch of [/two or more writers on shared state/u, /background job or retry/u, /recovery or resync/u, /delivery guarantee/u]) {
    assert.match(trigger, branch);
  }
  const rules = section(skill, "Model Rules");
  assert.match(rules, /finite type/u);
  assert.match(rules, /`if \(<condition>\) return;`/u);
  assert.match(rules, /`@fair`/u);
  assert.match(rules, /`@leadsTo/u);
  assert.match(rules, /`@constraint`/u);
  assert.match(rules, /one service/u);
  assert.match(rules, /composition file[\s\S]{0,80}map/u);
});

test("model-checking steps end on checkable criteria and link tdd instead of restating it", () => {
  const skill = read(`${root}/SKILL.md`);
  const list = steps(section(skill, "Steps"));

  assert.ok(list.length >= 5, `expected at least five steps, found ${list.length}`);
  for (const entry of list) assert.match(entry, /Done when/u, entry.split("\n")[0]);
  assert.match(skill, /remove one guard[\s\S]{0,300}violation/iu);
  assert.match(skill, /\[Sensitivity Proof\]\(\.\.\/tdd\/sensitivity\.md\)/u);
  assert.match(skill, /\[Pinned Replay\]\(\.\.\/tdd\/properties\.md\)/u);
  assert.match(skill, /each (?:trace )?action[\s\S]{0,80}one command of the stateful property/iu);
  assert.doesNotMatch(skill, /git diff --quiet|git add --/u, "Sensitivity Proof procedure stays in tdd");
});

test("model-checking commits each Model beside its service with exact pins and a failing CI check", () => {
  const ci = section(read(`${root}/SKILL.md`), "Commit and CI");

  assert.match(ci, /one plan task/iu);
  assert.match(ci, /`<feature-or-service>\/<flow>\.proof\.ts`/u);
  assert.match(ci, /exact devDependenc/u);
  assert.match(ci, /"tsprover": "0\.0\.2"/u);
  assert.match(ci, /"tla-ts": "0\.0\.3"/u);
  assert.match(ci, /"check:models": "tsprover"/u);
  assert.match(ci, /CI runs `check:models`[\s\S]{0,120}fails the build/u);
  assert.match(ci, /pin bump[\s\S]{0,200}`check:models`[\s\S]{0,120}every Model Sensitivity Proof[\s\S]{0,40}same change/iu);
  assert.match(ci, /type check (?:stays|on)/u);
  assert.match(ci, /managed lint rule fires on a Model[\s\S]{0,160}`\*\*\/\*\.proof\.ts`/u);
});

test("every pin of tsprover and tla-ts is the accepted exact version", () => {
  for (const path of [`${root}/SKILL.md`, `${architecture}/SKILL.md`, `${architecture}/assets/ARCHITECTURE-TEMPLATE.md`]) {
    const text = read(path);
    assert.doesNotMatch(text, /tsprover@(?!0\.0\.2\b)/u, path);
    assert.doesNotMatch(text, /tla-ts@(?!0\.0\.3\b)/u, path);
  }
});

test("create-architecture checks triggered flows with a Model between flow-lenses and compile", () => {
  const list = steps(section(read(`${architecture}/SKILL.md`), "Steps"));

  assert.equal(list.length, 9);
  assert.match(list[2], /^3\. [\s\S]*`\$flow-lenses`/u);
  const model = list[3];
  assert.match(model, /^4\. /u);
  assert.match(model, /installed `\$model-checking` skill/u);
  assert.match(model, /trigger/u);
  assert.match(model, /`<spec-folder>\/models\/<flow>\.proof\.ts`/u);
  assert.match(model, /`npx --yes tsprover@0\.0\.2 <path>`/u);
  assert.match(model, /`architecture-not-ready`[\s\S]{0,120}trace[\s\S]{0,60}L2 compile gap/u);
  assert.match(model, /\*\*Models\*\*/u);
  assert.match(model, /Done when/u);
  assert.match(list[4], /^5\. Compile a complete candidate/u);

  const failure = section(read(`${architecture}/references/artifact-contract.md`), "Atomic failure");
  assert.match(failure, /Model violation[\s\S]{0,200}trace[\s\S]{0,120}L2 Shape/u);
});

test("the architecture template has an optional Models table removed when no flow matches the trigger", () => {
  const template = read(`${architecture}/assets/ARCHITECTURE-TEMPLATE.md`);
  const models = section(template, "Models");

  assert.match(models, /^\| Flow \| Model path \| Invariants \| State count \| Sensitivity Proof \|$/mu);
  assert.match(models, /Remove this section when no flow matches the `model-checking` trigger/u);
  assert.ok(template.indexOf("\n## Models\n") > template.indexOf("\n## Critical Flows and Boundaries\n"));
});

test("tdd, ask-hi and the typescript Pack point at model-checking", () => {
  const replay = section(read("skills/agnostic/quality/tdd/properties.md"), "Model Trace → Pinned Replay");
  assert.match(replay, /`\$model-checking`[^.]*when installed|when installed[^.]*`\$model-checking`/iu);

  const baseline = read("skills/agnostic/cli/ask-hi/references/baseline.md");
  assert.match(line(baseline, "| typescript |"), /\| quality-types, model-checking;/u);
  const discovery = read("skills/agnostic/cli/ask-hi/references/discovery-and-docs.md");
  assert.match(line(discovery, "- `$model-checking`"), /\(`typescript`\)/u);
});
