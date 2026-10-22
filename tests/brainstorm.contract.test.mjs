import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { posix } from "node:path";
import { test } from "node:test";

const skillRoot = "skills/agnostic/requirements/brainstorm";
const read = (path) =>
  readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
const exists = (path) => existsSync(new URL(`../${path}`, import.meta.url));

const brainstorm = read(`${skillRoot}/SKILL.md`);
const frontmatter = brainstorm.slice(0, brainstorm.indexOf("\n---", 4) + 4);
const description = frontmatter.match(/^description:\s*(.+)$/mu)?.[1] ?? "";
const section = (heading) => {
  const start = brainstorm.indexOf(`## ${heading}\n`);
  assert.notEqual(start, -1, `missing section ${heading}`);
  const rest = brainstorm.slice(start + heading.length + 4);
  const end = rest.search(/^## /mu);
  return end === -1 ? rest : rest.slice(0, end);
};
const numberedItems = (text) =>
  text.match(/^\d+\. .+$/gmu)?.map((line) => line.replace(/^\d+\. /u, "")) ??
  [];
const bullets = (text) => text.match(/^- .+$/gmu) ?? [];

// Copied from the Flow failure lenses of SKILLS_BASE (c86912b); flow-lenses owns them now.
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

test("brainstorm is a user-asked, model-invoked atomic skill", () => {
  assert.match(brainstorm, /^---\nname: brainstorm\ndescription:/u);
  assert.doesNotMatch(frontmatter, /disable-model-invocation|user-invocable/u);
  assert.match(description, /^Brainstorm a bounded system/iu);
  assert.match(description, /Use when the user asks to brainstorm/iu);
  assert.doesNotMatch(brainstorm, /another skill invokes/iu);
  assert.doesNotMatch(description, /operating agent/iu);
});

const originalPrompt =
  "think deeply about how to make this entire system as agent-intuitive, agent-ergonomic, and agent-accretive as you can possibly imagine.";

test("brainstorm frames real operators and agent legibility without the supplied prompt", () => {
  const frame = section("Frame");
  assert.ok(!brainstorm.includes(originalPrompt));
  assert.match(frame, /Bound the system/iu);
  assert.match(frame, /real operators:[^.]*end users[^.]*agents[^.]*human operators/iu);
  assert.match(frame, /Agent legibility\*\*, when agents operate the system/iu);
  for (const quality of ["agent-intuitive", "agent-ergonomic", "agent-accretive"]) {
    assert.match(frame, new RegExp(quality, "u"));
  }
});

test("brainstorm uses flow-lenses optionally and shows findings as tradeoffs", () => {
  const frame = section("Frame");
  assert.match(frame, /`\$flow-lenses`\*\*, optional/iu);
  assert.match(frame, /each finding as a\s+tradeoff/iu);
});

test("brainstorm no longer carries the Flow Lens list", () => {
  assert.doesNotMatch(brainstorm, /Flow failure lenses/iu);
  for (const label of lensLabels) {
    assert.ok(!brainstorm.includes(label), `brainstorm still lists ${label}`);
  }
});

test("every brainstorm turn carries the six proposal items in order", () => {
  const turn = section("Turn");
  assert.match(turn, /^Every turn carries, in order:/mu);
  const items = numberedItems(turn);
  assert.equal(items.length, 6);
  const expected = [
    /^\*\*Current shape\*\*/u,
    /^\*\*Alternatives\*\*: two or three other shapes, each with its tradeoff/u,
    /^\*\*Evidence\*\*: an anchor .* for each claim/u,
    /^\*\*Forks\*\*: each open decision as a proposal with a default/u,
    /^\*\*View\*\*: one `\$show-me` view of the current shape/u,
    /^\*\*Close\*\*: end on the proposal and an invitation to react/u,
  ];
  expected.forEach((pattern, index) => assert.match(items[index], pattern));
  assert.match(turn, /for each claim, or\s+an explicit unknown/u);
});

test("brainstorm turns ask no question rounds", () => {
  const turn = section("Turn");
  assert.match(
    turn,
    /no question round,\s+no numbered question list, and no `AskUserQuestion` call/u,
  );
  assert.match(brainstorm, /Question rounds belong to `\$requirements-grill`/u);
  const sentences = brainstorm.split(/(?<=[.:])\s+/u);
  for (const sentence of sentences.filter((s) =>
    /question round|numbered question|AskUserQuestion/iu.test(s),
  )) {
    assert.match(
      sentence,
      /\bno\b|\bnever\b|\bnot\b|belong to `\$requirements-grill`/iu,
      `question behavior allowed: ${sentence}`,
    );
  }
});

test("brainstorm turn completion requires all items and a current Brief", () => {
  assert.match(
    section("Turn"),
    /Completion: all six items are present, every claim has an anchor or an\s+explicit unknown, and the Brief reflects every acceptance, rejection, and\s+preference/u,
  );
});

test("brainstorm has exactly two exits and starts no build work", () => {
  const exits = section("Exits");
  assert.match(exits, /^Exactly two:/mu);
  const options = bullets(exits);
  assert.equal(options.length, 2);
  assert.match(options[0], /\*\*Another turn\*\*, when the user steers/u);
  assert.match(
    options[1],
    /\*\*`\$requirements-grill` with the Brainstorm Brief\*\*/u,
  );
  assert.match(
    exits,
    /edits no code, writes no plan, creates no branch, commit or\s+worktree, and starts no implementation agent; implementation starts only on the\s+user's explicit go\./u,
  );
});

test("the Brainstorm Brief is the only durable write at the routed grilling path", () => {
  const brief = section("Brainstorm Brief");
  assert.match(brief, /The Brief is the only durable write\./u);
  assert.ok(
    brief.includes(
      "`<wiki-root>/content/docs/project/grilling/<topic>-brainstorm-brief.md`",
    ),
  );
  assert.match(brief, /routed-wiki frontmatter \(title\s+`"<Topic> Brainstorm Brief"`\)/u);
  assert.match(brief, /`grilling\/meta\.json` entry/u);
  const link = brief.match(/\[Routed Wiki Contract\]\(([^)#]+)#routed-wiki-contract\)/u);
  assert.ok(link, "missing Routed Wiki Contract link");
  const target = posix.normalize(`${skillRoot}/${link[1]}`);
  assert.ok(exists(target), `missing ${target}`);
  assert.match(read(target), /^#+ Routed Wiki Contract$/mu);
});

test("the Brainstorm Brief updates each steering turn and holds six items", () => {
  const brief = section("Brainstorm Brief");
  assert.match(
    brief,
    /Update it at the end of every turn in which the user accepted or rejected a\s+shape or stated a preference/u,
  );
  const items = numberedItems(brief);
  assert.equal(items.length, 6);
  const expected = [
    /^Bounded system and operators/u,
    /^Chosen shape/u,
    /^Rejected shapes, each with the reason/u,
    /^User-stated preferences, quoted verbatim/u,
    /^Open forks, each with the proposed default/u,
    /^Evidence anchors/u,
  ];
  expected.forEach((pattern, index) => assert.match(items[index], pattern));
});
