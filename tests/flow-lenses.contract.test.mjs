import assert from "node:assert/strict";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { posix } from "node:path";
import { test } from "node:test";

const skillRoot = "skills/agnostic/requirements/flow-lenses";
const read = (path) =>
  readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
const exists = (path) => existsSync(new URL(`../${path}`, import.meta.url));
const walk = (dir) =>
  readdirSync(new URL(`../${dir}`, import.meta.url), { withFileTypes: true })
    .flatMap((entry) => {
      const path = `${dir}/${entry.name}`;
      return entry.isDirectory() ? walk(path) : [path];
    });

const skill = read(`${skillRoot}/SKILL.md`);
const frontmatter = skill.slice(0, skill.indexOf("\n---", 4) + 4);
const description = frontmatter.match(/^description:\s*(.+)$/mu)?.[1] ?? "";
const body = skill.slice(frontmatter.length);
const section = (heading) => {
  const start = skill.indexOf(`## ${heading}\n`);
  assert.notEqual(start, -1, `missing section ${heading}`);
  const rest = skill.slice(start + heading.length + 4);
  const end = rest.search(/^## /mu);
  return end === -1 ? rest : rest.slice(0, end);
};

// Copied from the Flow failure lenses of SKILLS_BASE (c86912b) brainstorm.
const lensLabels = [
  "Entry points and path convergence",
  "Critical execution paths",
  "State ownership and authority",
  "Transaction and side-effect boundaries",
  "Concurrency and stale state",
  "Idempotency and retries",
  "Partial failure and recovery",
  "Execution lifetime and durability",
  "Lifecycle and dependency transitions",
  "Completion and observability",
];

test("flow-lenses is an internal model-invoked skill with name and description only", () => {
  assert.ok(exists(`${skillRoot}/SKILL.md`));
  assert.match(skill, /^---\nname: flow-lenses\ndescription: .+\n---\n/u);
  assert.doesNotMatch(frontmatter, /disable-model-invocation|user-invocable/u);
});

test("flow-lenses description names what it returns and all three callers", () => {
  assert.match(description, /ten Flow Lenses/u);
  assert.match(description, /return candidate gaps/iu);
  assert.match(description, /`requirements-grill` checkpoint/u);
  assert.match(description, /`create-architecture` step 3/u);
  assert.match(description, /`brainstorm`/u);
});

test("flow-lenses lists the ten base lens labels in order", () => {
  const items = section("Lenses").match(/^\d+\. .+$/gmu) ?? [];
  assert.equal(items.length, lensLabels.length);
  lensLabels.forEach((label, index) => {
    assert.ok(
      items[index].startsWith(`${index + 1}. ${label}: `),
      `lens ${index + 1} is not ${label}`,
    );
    assert.match(items[index], /\?$/u);
  });
});

test("flow-lenses returns lens coverage and four-field candidate gaps", () => {
  const output = section("Output");
  assert.match(
    output,
    /\*\*Lens coverage\*\*:[^\n]*covered with evidence, covered with an explicit unknown, or not applicable with the reason/u,
  );
  assert.match(output, /\*\*Lens\*\*: the lens number and label/u);
  assert.match(output, /\*\*Evidence\*\*: the file, line, artifact, or recorded decision[^\n]*`Unknown:`/u);
  assert.match(output, /\*\*Guarantee at stake\*\*:/u);
  assert.match(output, /\*\*Altitude\*\*:[^\n]*L1 Outcome, L2 Shape, or L3 Modules/u);
  assert.match(output, /Gaps stay candidates\./u);
});

test("flow-lenses Altitude reference resolves to the grill Altitude Ladder", () => {
  const link = section("Output").match(
    /\[Altitude Ladder\]\(([^)#]+)#altitude-ladder\)/u,
  );
  assert.ok(link, "missing Altitude Ladder link");
  const target = posix.normalize(`${skillRoot}/${link[1]}`);
  assert.ok(exists(target), `missing ${target}`);
  assert.match(read(target), /^#+ Altitude Ladder$/mu);
});

test("flow-lenses asks no questions and writes nothing", () => {
  assert.match(
    body,
    /The caller owns every question to the user and every durable write; this skill only examines and reports\./u,
  );
  assert.doesNotMatch(body, /AskUserQuestion|ask the user|\$grilling|`\$show-me`/iu);
  const prose = body.replace(/^## Lenses\n[\s\S]*?(?=^## )/mu, "");
  for (const sentence of prose.split(/(?<=[.;])\s+/u).filter((s) =>
    /\b(writes?|records?|asks?|saves?|appends?)\b/iu.test(s),
  )) {
    assert.match(sentence, /\bcaller\b/iu, `write or question step: ${sentence}`);
  }
});

test("flow-lenses completion covers every lens and every gap field", () => {
  assert.match(
    body,
    /Completion: each applicable lens is covered by evidence or an explicit unknown; each non-applicable lens has a reason; each material gap is a candidate gap with all four fields\./u,
  );
});

test("the Flow Lens list lives in exactly one skill file", () => {
  const owners = walk("skills")
    .filter((path) => path.endsWith(".md"))
    .filter((path) => !path.endsWith("/AUTHORING-HANDOFF.md"))
    .filter((path) => {
      const text = read(path);
      return lensLabels.some((label) => text.includes(label));
    });
  assert.deepEqual(owners, [`${skillRoot}/SKILL.md`]);
});
