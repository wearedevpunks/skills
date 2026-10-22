import assert from "node:assert/strict";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { test } from "node:test";

const skillRoot = "skills/phases/design-phase";
const read = (path) =>
  readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
const exists = (path) => existsSync(new URL(`../${path}`, import.meta.url));
const listDir = (path) =>
  readdirSync(new URL(`../${path}`, import.meta.url)).sort();

const gates = [
  "intake",
  "grill",
  "brand",
  "design-system",
  "compose",
  "motion-plan",
  "variant-round",
  "quality-gate",
  "verdict",
  "promote",
  "backlog",
  "delivery-handoff",
];
const gate = (name) => read(`${skillRoot}/phases/${name}.md`);
const router = () => read(`${skillRoot}/phases/router.md`);
const reference = (name) => read(`${skillRoot}/references/${name}.md`);
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
  const start = text.indexOf(`## ${heading}\n`);
  assert.notEqual(start, -1, `missing section ${heading}`);
  const rest = text.slice(start + heading.length + 4);
  const end = rest.search(/^## /mu);
  return end === -1 ? rest : rest.slice(0, end);
};

test("design-phase has the exact graph file set and stays explicit-only", () => {
  assert.deepEqual(
    listDir(`${skillRoot}/phases`),
    ["router", ...gates].map((name) => `${name}.md`).sort(),
  );
  assert.equal(exists(`${skillRoot}/phases/approval.md`), false);
  assert.equal(exists(`${skillRoot}/phases/prototype.md`), false);
  assert.equal(exists(`${skillRoot}/AUTHORING-HANDOFF.md`), true);
  const skill = read(`${skillRoot}/SKILL.md`);
  assert.match(skill, /^---\n[\s\S]*?disable-model-invocation:\s*true\n[\s\S]*?---/u);
  assert.match(skill, /\[the design router\]\(phases\/router\.md\)/u);
  assert.match(
    read(`${skillRoot}/agents/openai.yaml`),
    /allow_implicit_invocation:\s*false/u,
  );
});

test("every gate defines the normalized gate contract in order", () => {
  for (const name of gates) {
    const text = gate(name);
    const positions = gateSections.map((heading) =>
      text.indexOf(`\n## ${heading}\n`),
    );
    for (const [index, position] of positions.entries()) {
      assert.notEqual(position, -1, `${name}: missing ${gateSections[index]}`);
    }
    assert.deepEqual(
      positions,
      [...positions].sort((a, b) => a - b),
      `${name}: sections out of order`,
    );
    assert.match(
      section(text, "Declared Exits"),
      /`human_steering_required`/u,
      `${name}: steering exit`,
    );
    assert.match(
      section(text, "Durable Handoff"),
      /\[the design handoff contract\]\(\.\.\/references\/design-handoff\.md\)/u,
      `${name}: handoff pointer`,
    );
  }
});

test("router precedence resolves every row to one flat gate or stop outcome", () => {
  const rows = [...router().matchAll(/^\| (\d+) \| (.+) \| (.+) \|$/gmu)].map(
    ([, priority, evidence, output]) => ({
      priority: Number(priority),
      evidence,
      output,
    }),
  );
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
    for (const file of links) {
      assert.equal(exists(`${skillRoot}/phases/${file}`), true, file);
      linked.add(file.replace(/\.md$/u, ""));
    }
  }
  assert.deepEqual([...linked].sort(), [...gates].sort());
  assert.match(rows[0].output, /terminal `human_steering_required`/u);
});

test("router keeps re-entry, cold resume, brand skip, and staleness rules", () => {
  const text = router();
  assert.match(
    text,
    /later visual change[\s\S]{0,300}layout[\s\S]{0,200}`compose`[\s\S]{0,200}Otherwise[\s\S]{0,120}`variant-round`/iu,
  );
  assert.match(text, /cold resume, read the round\s+counter/iu);
  assert.match(text, /brand skip[\s\S]{0,200}fresh brand artifacts/iu);
  assert.match(text, /## Staleness Rules/u);
  assert.match(text, /## Route Trace/u);
});

test("verdict routes riff and combine to a new round, keep to promote, reject to router", () => {
  const exits = section(gate("verdict"), "Declared Exits");
  assert.match(exits, /`riff`[^\n]*`variant-round`/u);
  assert.match(exits, /`combine`[^\n]*`variant-round`/u);
  assert.match(exits, /`keep`[^\n]*`promote`/u);
  assert.match(exits, /`reject`[\s\S]{0,120}router\s+re-derivation/u);
  assert.match(gate("verdict"), /`keep` is the approval/u);
  assert.match(gate("verdict"), /never is approval|is never\s+approval/u);
});

test("variants live on the real route behind a dev-only ?variant= switch", () => {
  const text = gate("variant-round");
  assert.match(text, /`\?variant=`/u);
  assert.match(text, /real route/u);
  assert.match(text, /dev-only `\?variant=` switch/u);
  assert.match(text, /3 by default; up to 5[\s\S]{0,40}never more than 5/u);
  assert.match(text, /375px and 1280px/u);
  assert.match(text, /`design-taste-frontend`, always/u);
  assert.match(text, /`mobile-native`, mandatory for responsive web/u);
  assert.match(text, /`animate-expo` on Expo/u);
  assert.match(
    text,
    /existing-UI intent `improve-existing`, pass that intent to\s+`design-taste-frontend` and run its route "Redesign, restyle or review of\s+an existing page or app screen"/u,
  );
  for (const skill of ["prototype-variants", "image-to-code", "emil-design-eng", "shadcn"]) {
    assert.match(text, new RegExp(`\`${skill}\``, "u"), skill);
  }
  assert.match(text, /round counter increases only when a new round starts/u);
  assert.match(text, /`built`/u);
});

test("no design-phase text instructs standalone HTML, prototype branches, or isolated routes", () => {
  const executable = [
    read(`${skillRoot}/SKILL.md`),
    router(),
    ...gates.map(gate),
  ];
  const shared = listDir(`${skillRoot}/references`).map((file) =>
    read(`${skillRoot}/references/${file}`),
  );
  for (const text of executable) {
    assert.doesNotMatch(text, /HTML/u);
    assert.doesNotMatch(text, /`\$?prototype`/u);
  }
  for (const text of [...executable, ...shared]) {
    assert.doesNotMatch(text, /prototype\/<slug>|\/prototypes\//u);
    assert.doesNotMatch(text, /\$prototype\b(?!-)/u);
  }
});

test("shared references exist and are linked from the gates that use them", () => {
  assert.deepEqual(listDir(`${skillRoot}/references`), [
    "copy-lens.md",
    "design-handoff.md",
    "design-md-template.md",
    "image-generation.md",
    "shadcn-primitive-directive.md",
  ]);
  const uses = {
    "image-generation": ["brand", "compose"],
    "shadcn-primitive-directive": ["compose"],
    "copy-lens": ["compose", "quality-gate"],
    "design-md-template": ["design-system"],
  };
  for (const [name, users] of Object.entries(uses)) {
    for (const user of users) {
      assert.match(
        gate(user),
        new RegExp(`\\]\\(\\.\\./references/${name}\\.md\\)`, "u"),
        `${user} -> ${name}`,
      );
    }
  }
  assert.match(router(), /\]\(\.\.\/references\/design-handoff\.md\)/u);
});

test("human checkpoints are exactly brand, compose, and verdict", () => {
  const checkpointGates = ["brand", "compose", "verdict"];
  for (const name of gates) {
    const text = gate(name);
    const exits = section(text, "Declared Exits");
    const isCheckpoint = checkpointGates.includes(name);
    assert.equal(/HUMAN checkpoint:/u.test(text), isCheckpoint, name);
    assert.equal(/^- `checkpoint` /mu.test(exits), isCheckpoint, name);
  }
});

test("image generation follows the Codex ladder and blocks visibly", () => {
  const ladder = reference("image-generation");
  assert.match(ladder, /1\. \*\*The agent is Codex\.\*\*/u);
  assert.match(ladder, /2\. \*\*Inside T3\.\*\*[\s\S]*delegate_task\([\s\S]*providerInstanceId: "codex"/u);
  assert.match(ladder, /clientRequestId/u);
  assert.match(ladder, /mode: "wait"/u);
  assert.match(ladder, /isolation: "shared"/u);
  assert.match(ladder, /task_status/u);
  assert.match(ladder, /3\. \*\*`codex` CLI installed\*\*[\s\S]*codex exec/u);
  assert.match(ladder, /4\. \*\*None of the above\.\*\* Exit `blocked`/u);
  assert.match(ladder, /no fallback to code or HTML/u);
  for (const name of gates) {
    assert.doesNotMatch(
      gate(name),
      /fall\s*back[^.\n]{0,80}(code|HTML|prototype)/iu,
      name,
    );
  }
});

test("compose briefs carry DESIGN.md, the directive, and the copy lens", () => {
  const text = gate("compose");
  assert.match(
    text,
    /both `imagegen-frontend-web` and\s+`imagegen-frontend-mobile`, unless the user named one surface/u,
  );
  assert.match(text, /Append to every brief[\s\S]{0,80}the full DESIGN\.md[\s\S]{0,200}shadcn-Primitive Directive[\s\S]{0,200}copy lens/u);
  assert.match(reference("shadcn-primitive-directive"), /shadcn\/ui primitives/u);
  assert.match(reference("shadcn-primitive-directive"), /tokens in the DESIGN\.md/u);
  const lens = reference("copy-lens");
  assert.match(lens, /`design-taste-frontend`, file `references\/copy\.md`/u);
  assert.match(lens, /"Copy AI tells"/u);
});

test("design-system fills the Stitch template and applies shadcn Steps 3 to 7 without a stop", () => {
  const text = gate("design-system");
  assert.match(text, /Steps 3 to 7 inside the existing app/u);
  assert.match(text, /`npx shadcn@latest init`[\s\S]{0,200}never `--template`/u);
  assert.match(text, /NativeWind theme config/u);
  assert.match(text, /Expo component library is parked/u);
  assert.match(text, /Continue without a stop/u);
  const template = reference("design-md-template");
  assert.match(template, /Google Stitch DESIGN\.md/u);
  for (const token of ["colors:", "typography:", "rounded:", "spacing:", "components:"]) {
    assert.match(template, new RegExp(`^${token}`, "mu"), token);
  }
  for (const heading of ["Overview", "Colors", "Do's and Don'ts", "Known Gaps"]) {
    assert.match(template, new RegExp(`^## ${heading}$`, "mu"), heading);
  }
});

test("motion plan ledger moves proposed, accepted, built, verified with one writer each", () => {
  const handoff = reference("design-handoff");
  assert.match(handoff, /`proposed → accepted → built → verified`/u);
  assert.match(gate("motion-plan"), /`find-animation-opportunities`/u);
  assert.match(gate("motion-plan"), /state\s+`proposed`/u);
  assert.match(gate("motion-plan"), /to `accepted`/u);
  assert.match(gate("variant-round"), /to `built`/u);
  assert.match(gate("quality-gate"), /to `verified`/u);
});

test("quality gate runs five checks per variant and passes only passing variants", () => {
  const text = gate("quality-gate");
  for (const check of [
    /Light `break-ui`/u,
    /`mobile-native` checklist/u,
    /`review-animations`/u,
    /\[The copy lens\]/u,
    /Motion Plan conformance/u,
  ]) {
    assert.match(text, check);
  }
  assert.match(text, /pass or fail per check per variant/u);
  assert.match(text, /Only variants whose latest result is pass reach the Verdict/u);
  assert.match(section(text, "Declared Exits"), /`variants_failed`[\s\S]{0,120}`variant-round`/u);
});

test("promote passes full break-ui, removes the switch, commits, and writes the contract", () => {
  const text = gate("promote");
  assert.match(text, /full `break-ui`/u);
  assert.match(text, /zero open "What broke" items; every "Decision\s+for you" closed by the user; the fixture and toggle dev-only/u);
  assert.match(text, /Rewrite the kept variant in place/u);
  assert.match(text, /Remove the `\?variant=` switch/u);
  assert.match(text, /worst-case fixtures and their toggle, dev-only/u);
  assert.match(text, /Commit the design-owned files/u);
  assert.match(text, /approved artifact contract/u);
  const brief = gate("delivery-handoff");
  assert.match(brief, /the promote commit/u);
  assert.match(brief, /Design-Owned UI Code of the promote commit is accepted input/u);
  assert.match(brief, /only as a recorded defect fix/u);
  assert.match(brief, /invoke `\$delivery-phase` explicitly/u);
});

test("design handoff lives beside SPEC.md with a discovery rule and durable assets", () => {
  const handoff = reference("design-handoff");
  assert.match(handoff, /beside `SPEC\.md` in the resolved spec folder/u);
  assert.match(handoff, /`create-spec`'s\s+`references\/folder-naming\.md`/u);
  assert.match(handoff, /`repo-asset-management`/u);
  assert.match(handoff, /## Discovery/u);
  assert.match(handoff, /round counter/u);
  for (const field of [
    "scope unit",
    "artifact intent",
    "evidence summary",
    "accepted constraints",
    "implementation notes",
    "acceptance checks",
    "staleness risks",
    "promote commit SHA",
  ]) {
    assert.match(section(handoff, "Approved Artifact Contract"), new RegExp(field, "u"), field);
  }
});

test("intake keeps the low-confidence rule and records the redesign fields", () => {
  const text = gate("intake");
  assert.match(text, /fewer than the\s+routes plus one style, component, or content source/u);
  for (const field of ["surface", "existing-UI intent", "`components.json`", "DESIGN.md", "fresh brand artifacts", "screenshots"]) {
    assert.match(text, new RegExp(field.replace(/\./gu, "\\."), "u"), field);
  }
  assert.match(gate("grill"), /Activate `requirements-grill` from this gate only/u);
});
