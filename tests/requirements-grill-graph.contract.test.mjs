import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join, normalize } from "node:path";
import { test } from "node:test";

const skillRoot = "skills/agnostic/requirements/requirements-grill";
const read = (path) =>
  readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
const readBytes = (path) => readFileSync(new URL(`../${path}`, import.meta.url));
const exists = (path) => existsSync(new URL(`../${path}`, import.meta.url));
const listDir = (path) =>
  readdirSync(new URL(`../${path}`, import.meta.url)).sort();
const isDir = (path) => statSync(new URL(`../${path}`, import.meta.url)).isDirectory();
const walk = (path) =>
  listDir(path).flatMap((name) =>
    isDir(`${path}/${name}`) ? walk(`${path}/${name}`) : [`${path}/${name}`],
  );

const gates = ["ground", "round", "checkpoint", "close"];
const gate = (name) => read(`${skillRoot}/phases/${name}.md`);
const router = () => read(`${skillRoot}/phases/router.md`);
const skill = () => read(`${skillRoot}/SKILL.md`);
const artifact = () => read(`${skillRoot}/references/artifact-output.md`);

const gateSections = [
  "Entry Guard",
  "Inputs",
  "Actor-Like Gate Boundary",
  "Bounded Action",
  "Invariants",
  "Completion Evidence",
  "Declared Exits",
  "Durable Handoff",
  "Stop Or Router Re-entry",
];

const section = (text, heading) => {
  const start = text.indexOf(`\n## ${heading}\n`);
  assert.notEqual(start, -1, `missing ## ${heading}`);
  const rest = text.slice(start + heading.length + 5);
  const end = rest.search(/^## /mu);
  return end === -1 ? rest : rest.slice(0, end);
};

// Numbered step `n.` of a Workflow-style list, up to the next top-level step.
const step = (text, n) => {
  const start = text.search(new RegExp(`^${n}\\. `, "mu"));
  assert.notEqual(start, -1, `missing step ${n}`);
  const rest = text.slice(start);
  const end = rest.slice(3).search(new RegExp(`^${n + 1}\\. `, "mu"));
  return end === -1 ? rest : rest.slice(0, end + 3);
};

test("requirements-grill is a flat graph: bootstrap, router, four gates, two references", () => {
  assert.deepEqual(
    listDir(`${skillRoot}/phases`),
    ["router", ...gates].map((name) => `${name}.md`).sort(),
  );
  assert.deepEqual(listDir(`${skillRoot}/references`), [
    "artifact-output.md",
    "wiki-output.md",
  ]);
  assert.equal(exists(`${skillRoot}/AUTHORING-HANDOFF.md`), true);
  assert.equal(exists(`${skillRoot}/references/grilling-flow.md`), false);
  assert.deepEqual(listDir(skillRoot), [
    "AUTHORING-HANDOFF.md",
    "SKILL.md",
    "phases",
    "references",
  ]);
});

test("SKILL.md is a model-invocable bootstrap that loads the router and holds no gate body", () => {
  const text = skill();
  assert.match(text, /^---\nname: requirements-grill\ndescription:/u);
  assert.doesNotMatch(text, /disable-model-invocation/u);
  assert.match(text, /\[the grill router\]\(phases\/router\.md\)/u);
  assert.match(text, /on every invocation and resume/iu);
  assert.match(text, /Load exactly the one gate the router selects/u);
  for (const heading of gateSections) {
    assert.doesNotMatch(text, new RegExp(`^## ${heading}$`, "mu"), heading);
  }
  assert.doesNotMatch(text, /^Required calls:/mu);
});

test("every gate carries the graph audit sections in order and names its required calls", () => {
  for (const name of gates) {
    const text = gate(name);
    const positions = gateSections.map((heading) =>
      text.indexOf(`\n## ${heading}\n`),
    );
    for (const [index, position] of positions.entries()) {
      assert.notEqual(position, -1, `${name}: ${gateSections[index]}`);
    }
    assert.deepEqual(
      [...positions].sort((a, b) => a - b),
      positions,
      `${name}: section order`,
    );
    assert.match(section(text, "Bounded Action"), /^Required calls: /mu, name);
    assert.match(
      section(text, "Durable Handoff"),
      /\[Gate Outcomes\]\(\.\.\/references\/artifact-output\.md#gate-outcomes\)/u,
      name,
    );
    assert.match(
      section(text, "Stop Or Router Re-entry"),
      /re-enter \[`router\.md`\]\(router\.md\)/u,
      name,
    );
    for (const sibling of gates.filter((other) => other !== name)) {
      assert.doesNotMatch(text, new RegExp(`\\]\\(${sibling}\\.md`, "u"), `${name} -> ${sibling}`);
    }
  }
});

test("router precedence returns one output per row and links exactly the four gates", () => {
  const rows = [...section(router(), "Route Precedence").matchAll(
    /^\| (\d+) \| (.+?) \| (.+?) \|$/gmu,
  )].map(([, priority, evidence, output]) => ({
    priority: Number(priority),
    evidence,
    output,
  }));
  assert.deepEqual(
    rows.map(({ priority }) => priority),
    Array.from({ length: rows.length }, (_, index) => index + 1),
  );
  const linked = new Set();
  for (const { output } of rows) {
    const links = [...output.matchAll(/\]\(([a-z-]+\.md)\)/gu)].map(
      ([, file]) => file,
    );
    if (links.length === 0) {
      assert.match(output, /^(terminal|checkpoint|blocked) `/u, output);
    }
    assert.ok(links.length <= 1, output);
    for (const file of links) {
      assert.equal(exists(`${skillRoot}/phases/${file}`), true, file);
      linked.add(file.replace(/\.md$/u, ""));
    }
  }
  assert.deepEqual([...linked].sort(), [...gates].sort());
  assert.match(rows[0].output, /terminal `human_steering_required`/u);

  const groundRow = rows.find(({ output }) => /ground\.md/u.test(output));
  assert.match(groundRow.evidence, /Brief that has no Brief import record or a sha256 that differs/u);
  assert.match(groundRow.evidence, /compile gap/u);
  assert.match(groundRow.evidence, /precision inputs settle a level/u);
});

test("router reads four precision inputs and starts each branch at the next level", () => {
  const inputs = section(router(), "Precision Inputs");
  assert.match(
    inputs,
    /1\. the Finder Fog graph[\s\S]*when the caller\s+supplies Finder context[\s\S]*2\. the Brainstorm Brief[\s\S]*3\. the grill status file, then the grill log[\s\S]*4\. code evidence/u,
  );
  assert.match(inputs, /A branch works at the first\s+Altitude above its Settled Altitude/u);
  assert.match(inputs, /row 4 selects `ground` to record it,\s+and the branch then starts at the next level/u);
  assert.match(router(), /The router reads and selects; it writes nothing/u);
});

test("the Altitude Ladder is defined once in the router with planning kept downstream", () => {
  const ladder = section(router(), "Altitude Ladder");
  assert.match(ladder, /single definition of the Altitude Ladder/u);
  assert.match(ladder, /\*\*L1 Outcome\*\*: users, flows, scope, observable behavior, states, copy,\s+non-goals/u);
  assert.match(
    ladder,
    /\*\*L2 Shape\*\*: deployables, boundaries, state ownership and authority,\s+contracts between parts, data lifecycle, external dependencies/u,
  );
  assert.match(
    ladder,
    /\*\*L3 Modules\*\*: primitives and libraries with exact module and symbol,[\s\S]*seams and adapters[\s\S]*dependency direction[\s\S]*type and schema shapes, file and folder layout, resource\s+lifetime owner/u,
  );
  assert.match(
    ladder,
    /At L3 the grill decides module names, interfaces,\s+primitives, seam placement, and file layout/u,
  );
  assert.match(
    ladder,
    /Planning stays downstream with `create-plan`: edit order, task breakdown,\s+waves, estimates, tuning constants\. No grill question asks them/u,
  );

  const others = [
    skill(),
    ...gates.map(gate),
    ...listDir(`${skillRoot}/references`).map((file) =>
      read(`${skillRoot}/references/${file}`),
    ),
  ];
  for (const text of others) {
    assert.doesNotMatch(text, /\*\*L[123] (?:Outcome|Shape|Modules)\*\*:/u);
    assert.doesNotMatch(text, /Planning stays downstream/u);
  }
  for (const name of ["ground", "round", "checkpoint"]) {
    assert.match(gate(name), /\]\(router\.md#altitude-ladder\)/u, name);
  }
});

test("Target Altitude is L3 for code-bearing and L1 for product-only, and only rises", () => {
  const ladder = section(router(), "Altitude Ladder");
  assert.match(ladder, /\*\*Target Altitude\*\*: L3 for a code-bearing branch, L1 for a product-only\s+branch/u);
  assert.match(
    ladder,
    /becomes code-bearing when an accepted answer has a code\s+consequence[\s\S]{0,160}its Target Altitude then rises to L3/u,
  );
  assert.match(ladder, /A Target Altitude\s+only rises; less depth needs a user park at a named Altitude/u);
  assert.match(ladder, /\*\*Settled Altitude\*\*: the deepest Altitude at which every question/u);
  assert.match(
    step(section(gate("checkpoint"), "Bounded Action"), 5),
    /code consequence, mark the\s+branch code-bearing and raise its Target Altitude to L3/u,
  );
});

test("each round asks exactly one Altitude, the shallowest with a ready question", () => {
  assert.match(section(router(), "Altitude Ladder"), /One Round asks questions at exactly one Altitude/u);
  const selection = section(router(), "Round Selection");
  assert.match(
    selection,
    /round Altitude is the\s+shallowest Altitude that has a ready question in any branch/u,
  );
  assert.match(selection, /round\s+frontier is every ready question at that Altitude/u);
  assert.match(selection, /Branches descend\s+independently/u);
  assert.match(section(gate("round"), "Invariants"), /One round asks exactly one Altitude/u);
});

test("a missing required-call record holds the next round", () => {
  const text = router();
  const rows = section(text, "Route Precedence");
  const checkpointRow = rows.indexOf("round lines are complete and its checkpoint lines are absent");
  const completeRow = rows.indexOf("round lines are incomplete");
  const roundRow = rows.indexOf("| A ready question exists |");
  assert.ok(checkpointRow !== -1 && completeRow > checkpointRow && roundRow > completeRow);
  assert.match(
    text,
    /round lines of R<N> are `grilling`, `wait-what`, and `show-me`; its\s+checkpoint lines are `domain-modeling`, `flow-lenses`, `expand`, and\s+`level derivation`/u,
  );
  assert.match(text, /starts round R<N\+1>\s+only after both sets of R<N> are complete/u);
  assert.match(
    section(text, "Close Guard"),
    /rounds before a recorded\s+`Altitude upgrade: R<N>` are exempt/u,
  );
  assert.match(
    step(section(gate("checkpoint"), "Bounded Action"), 9),
    /`missing` with the reason; the router holds the next round until it runs/u,
  );
});

test("ground finds facts through subagents, never asks, and imports the Brief without re-asking", () => {
  const text = gate("ground");
  assert.match(section(text, "Actor-Like Gate Boundary"), /finds facts through subagents/u);
  assert.match(section(text, "Actor-Like Gate Boundary"), /Ground never asks the user anything/u);
  assert.match(section(text, "Invariants"), /No user question/u);

  const brief = step(section(text, "Bounded Action"), 3);
  assert.match(brief, /`answered` log\s+entries with `Source: Brainstorm Brief` and their Altitude/u);
  assert.match(brief, /rejected shapes become rejected alternatives on the owning question/u);
  assert.match(brief, /open forks become `unanswered` questions at their Altitude/u);
  assert.match(brief, /A preference the Brief records is\s+recorded `answered` and never re-asked/u);
  assert.match(brief, /On a changed sha256, import only the delta/u);

  const grounding = step(section(text, "Bounded Action"), 8);
  assert.match(grounding, /through subagents/u);
  assert.match(grounding, /stack skill/u);
  assert.match(grounding, /`opensrc`/u);
});

test("round runs $grilling unchanged through $wait-what with a $show-me view and $wayfinder for one stuck unknown", () => {
  const text = gate("round");
  assert.match(section(text, "Actor-Like Gate Boundary"), /`\$grilling` is the\s+per-round interview primitive, unchanged/u);
  const ask = step(section(text, "Bounded Action"), 4);
  assert.match(ask, /Run `\$grilling` over exactly the frontier questions/u);
  assert.match(ask, /through `\$wait-what` with one `\$show-me` view/u);
  assert.match(ask, /At L3,\s+the view is an interface sketch or a module tree/u);
  const stuck = step(section(text, "Bounded Action"), 2);
  assert.match(stuck, /invoke `\$wayfinder` with the unknown/u);
  for (const route of ["grilling", "research", "prototype"]) {
    assert.match(stuck, new RegExp(`- \`${route}\`:`, "u"), route);
  }
  assert.match(text, /^Required calls: `\$grilling`, `\$wait-what`, `\$show-me`; `\$wayfinder` for a stuck\s+unknown/mu);
});

test("checkpoint runs on every response set: record, domain model, flow lenses, derive N+1, call evidence", () => {
  const text = gate("checkpoint");
  const action = section(text, "Bounded Action");
  assert.match(action, /Run every step on every response set, a partial set included/u);
  assert.match(step(action, 1), /Leave each omitted question\s+`unanswered`; never infer an answer/u);
  assert.match(step(action, 2), /Run `\$domain-modeling` with the status glossary/u);
  const lenses = step(action, 3);
  assert.match(lenses, /Run `\$flow-lenses` on the flows that the changed\s+decisions touch/u);
  assert.match(
    lenses,
    /Each candidate gap becomes an `unanswered`\s+question at its implied Altitude[\s\S]*resolved by evidence[\s\S]*parked or deferred/u,
  );
  const derive = step(action, 7);
  assert.match(derive, /derive the branch's level N\+1\s+questions/u);
  for (const input of [
    /`\$codebase-design`\s+vocabulary/u,
    /applicable stack skills/u,
    /`opensrc` for the exact\s+primitive module/u,
    /`\$show-me` interface sketch or module\s+tree/u,
  ]) {
    assert.match(derive, input);
  }
  assert.match(
    step(action, 9),
    /Write the `checkpoint` lines:\s+`domain-modeling`, `flow-lenses`, `expand` \([\s\S]*?\), and `level derivation`/u,
  );
  assert.match(
    text,
    /^Required calls: `\$domain-modeling` and `\$flow-lenses` on every response set;\s+for an L3 derivation, `\$codebase-design`, the applicable stack skills,\s+`opensrc`, and `\$show-me`/mu,
  );
  assert.match(artifact(), /^- flow-lenses: R<N> run — /mu);
});

test("a level takes rounds until Expand and Flow Lenses add nothing at it", () => {
  const action = section(gate("checkpoint"), "Bounded Action");
  const expand = step(action, 4);
  assert.match(expand, /name the decisions it\s+opens at its own Altitude, by the design tree of `\$grilling`/u);
  assert.match(expand, /"agree all"\s+reply accepts the round's recommendations, and the level settles only by\s+the \[Settled Altitude\]/u);
  assert.match(expand, /Imported Brief answers are\s+trusted; Expand reads only this response set/u);
  assert.match(step(action, 7), /When a branch's level N settles in step 6/u);

  const ladder = section(router(), "Altitude Ladder");
  assert.match(
    ladder,
    /latest\s+checkpoint's Expand and Flow Lenses passes added no question to the branch\s+at that Altitude/u,
  );
  assert.match(ladder, /A level can take any number of rounds/u);
  assert.match(section(router(), "Route Precedence"), /\| 12 \| A branch's working level is settled/u);
  assert.match(section(router(), "Close Guard"), /rounds before the grill's first\s+`expand` line need no `expand` line/u);
  assert.match(artifact(), /^- expand: R<N> run — <new Q ids at the round Altitude \| none>/mu);
});

test("close admits closure only through the Close Guard and explicit confirmation", () => {
  const guard = section(router(), "Close Guard");
  assert.match(guard, /no question is `unanswered`/u);
  assert.match(
    guard,
    /every active branch is settled at its Target Altitude, or parked at a named\s+Altitude with the user's reason recorded/u,
  );
  assert.match(guard, /every auto-pinned default records its Altitude/u);
  assert.match(guard, /every round's Required Calls record is complete/u);
  assert.match(
    step(section(gate("checkpoint"), "Bounded Action"), 1),
    /`Source: auto-pinned default` and its Altitude/u,
  );

  const text = gate("close");
  const action = section(text, "Bounded Action");
  assert.match(step(action, 1), /Re-check every condition of the\s+\[Close Guard\]\(router\.md#close-guard\)/u);
  assert.match(step(action, 2), /run `\$domain-modeling` for a final consistency pass/u);
  assert.match(step(action, 2), /invoke `\$show-me` to present the persisted shared understanding/u);
  assert.match(step(action, 3), /`confirmed` only on the user's\s+explicit words/u);
  assert.match(step(action, 4), /run wiki synthesis by \[wiki output\]/u);
  assert.match(step(action, 4), /hand the status file and log to `\$create-architecture`/u);
  assert.match(section(text, "Invariants"), /Wiki synthesis runs only after explicit closure/u);
});

test("artifact-output defines the four altitude fields", () => {
  const text = artifact();
  assert.match(text, /^Altitude: L1 \| L2 \| L3$/mu);
  assert.match(
    text,
    /^\| Branch \| Completion \| Target altitude \| Settled altitude \|/mu,
  );
  assert.match(text, /^- Altitude: L1 \| L2 \| L3$/mu);
  assert.match(
    text,
    /^\| Question id \| Branch \| Altitude \| Prerequisites \| Question \| State \|$/mu,
  );
  assert.match(text, /^- Brief import: <brief path> sha256 <hash> R<N> \| none$/mu);
  assert.match(text, /^## Legacy Status$/mu);
});

test("no file under requirements-grill carries an Illustrative default", () => {
  for (const file of walk(skillRoot)) {
    assert.doesNotMatch(read(file), /Illustrative/u, file);
  }
});

test("grilling/SKILL.md stays byte-identical to the skills base", () => {
  const sha = createHash("sha256")
    .update(readBytes("skills/agnostic/requirements/grilling/SKILL.md"))
    .digest("hex");
  assert.equal(
    sha,
    "f22d5fa0fab7077190e9ab85142d2952d9fa7dad1b5b38f80bf1f316fd4759ea",
  );
});

const slug = (heading) =>
  heading
    .trim()
    .toLowerCase()
    .replace(/`/gu, "")
    .replace(/[^\p{L}\p{N} _-]/gu, "")
    .replace(/ /gu, "-");

const anchorsOf = (path) => {
  const seen = new Map();
  const anchors = new Set();
  const text = read(path).replace(/^```[\s\S]*?^```/gmu, "");
  for (const [, heading] of text.matchAll(/^#{1,6} (.+)$/gmu)) {
    const base = slug(heading);
    const count = seen.get(base) ?? 0;
    anchors.add(count === 0 ? base : `${base}-${count}`);
    seen.set(base, count + 1);
  }
  for (const [, id] of text.matchAll(/<a id="([^"]+)"/gu)) anchors.add(id);
  return anchors;
};

test("every relative Markdown link and anchor in the grill and its neighbours resolves", () => {
  const files = [
    "skills/agnostic/requirements/brainstorm/SKILL.md",
    "skills/agnostic/requirements/flow-lenses/SKILL.md",
    ...walk(skillRoot),
    "skills/phases/requirements-phase/SKILL.md",
    ...walk("skills/agnostic/planning/create-architecture"),
    ...walk("skills/agnostic/cli/ask-hi"),
  ].filter((file) => file.endsWith(".md"));
  const missing = [];
  let checked = 0;
  for (const file of files) {
    const text = read(file)
      .replace(/^```[\s\S]*?^```/gmu, "")
      .replace(/`[^`\n]*`/gu, "");
    for (const [, target] of text.matchAll(/\]\(([^)\s]+)\)/gu)) {
      if (/^(?:[a-z]+:|\/)/iu.test(target)) continue;
      const [path, anchor] = target.split("#");
      const resolved = path ? normalize(join(dirname(file), path)) : file;
      checked += 1;
      if (!exists(resolved)) {
        missing.push(`${file} -> ${target} (file)`);
        continue;
      }
      if (anchor && !anchorsOf(resolved).has(anchor)) {
        missing.push(`${file} -> ${target} (anchor)`);
      }
    }
  }
  assert.ok(checked > 20, `only ${checked} links checked`);
  assert.deepEqual(missing, []);
  assert.match(
    read("skills/agnostic/requirements/flow-lenses/SKILL.md"),
    /requirements-grill\/phases\/router\.md#altitude-ladder\)/u,
  );
});

test("requirements-phase step 3 completes at Target Altitude or explicit park", () => {
  const workflow = section(read("skills/phases/requirements-phase/SKILL.md"), "Workflow");
  assert.match(
    step(workflow, 3),
    /use `requirements-grill`[\s\S]*Complete\s+this step when every material branch is settled at its Target Altitude or\s+explicitly parked/u,
  );
});

test("create-architecture runs flow-lenses, routes L3 decisions, and returns gaps with their Altitude", () => {
  const root = "skills/agnostic/planning/create-architecture";
  const third = step(section(read(`${root}/SKILL.md`), "Steps"), 3);
  assert.match(third, /invoke the installed `\$flow-lenses` skill/u);
  assert.doesNotMatch(third, /brainstorm/u);
  assert.match(third, /Return each material gap to\s+`requirements-grill` with its Altitude/u);
  assert.match(
    step(section(read(`${root}/SKILL.md`), "Steps"), 4),
    /place accepted L3 Modules\s+decisions in the template's \*\*Modules and Interfaces\*\* section/u,
  );

  const contract = read(`${root}/references/artifact-contract.md`);
  assert.match(contract, /`flow-lenses` owns the lens labels/u);
  assert.match(
    contract,
    /each decision gap with the Altitude \(L1 Outcome, L2 Shape,\s+or L3 Modules\) of the question it implies/u,
  );
  const template = read(`${root}/assets/ARCHITECTURE-TEMPLATE.md`);
  assert.match(template, /^## Modules and Interfaces$/mu);
  assert.match(template, /lens label from `flow-lenses`; that skill owns the list/u);
  for (const text of [read(`${root}/SKILL.md`), contract, template]) {
    assert.doesNotMatch(text, /brainstorm/iu);
  }
});

test("no skill outside brainstorm calls $brainstorm as a gap scan", () => {
  const gapScanCall =
    /(?:invoke|complete|re-run|run|composes?)[^.\n]{0,60}`\$brainstorm`|`\$brainstorm`[^.\n]{0,20}(?:to completion|on the accepted|against)|\*\*Calls:\*\*[^*\n]*\$brainstorm|\(with [^)]*\$brainstorm/u;
  const offenders = walk("skills")
    .filter((file) => file.endsWith(".md"))
    .filter((file) => !file.startsWith("skills/agnostic/requirements/brainstorm/"))
    .filter((file) => gapScanCall.test(read(file)));
  assert.deepEqual(offenders, []);
});

test("ask-hi describes the proposal loop, the Altitude-routed grill, and flow-lenses", () => {
  const root = "skills/agnostic/cli/ask-hi";
  for (const file of ["references/requirements.md", "references/phase-graph.md"]) {
    const text = read(`${root}/${file}`);
    assert.match(text, /proposal loop/u, file);
    assert.match(text, /Altitude-routed|one Altitude per round/u, file);
    assert.match(text, /`?\$flow-lenses`?/u, file);
    assert.doesNotMatch(text, /\(with `\$grilling`, `\$brainstorm`/u, file);
  }
  const requirements = read(`${root}/references/requirements.md`);
  assert.match(requirements, /^## `\$flow-lenses`$/mu);
  assert.match(requirements, /L1 Outcome → L2 Shape → L3 Modules/u);
  assert.match(read(`${root}/SKILL.md`), /flow lenses/u);
  assert.match(read(`${root}/references/baseline.md`), /brainstorm, flow-lenses/u);
});
