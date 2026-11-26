import assert from "node:assert/strict";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { test } from "node:test";

const skillRoot = "skills/phases/orchestrator-phase";
const read = (path) =>
  readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
const exists = (path) => existsSync(new URL(`../${path}`, import.meta.url));
const listDir = (path) =>
  readdirSync(new URL(`../${path}`, import.meta.url)).sort();

const gates = [
  "intake",
  "charter",
  "split",
  "spawn",
  "listen",
  "merge",
  "ship",
  "verify",
  "settle",
  "solo",
  "reopen",
];
const references = ["hosts", "ledger", "charter", "track-brief", "report"];
const gate = (name) => read(`${skillRoot}/phases/${name}.md`);
const router = () => read(`${skillRoot}/phases/router.md`);
const reference = (name) => read(`${skillRoot}/references/${name}.md`);
const skill = () => read(`${skillRoot}/SKILL.md`);
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

test("orchestrator-phase has the exact graph file set and stays explicit-only", () => {
  assert.deepEqual(
    listDir(`${skillRoot}/phases`),
    ["router", ...gates].map((name) => `${name}.md`).sort(),
  );
  assert.deepEqual(
    listDir(`${skillRoot}/references`),
    references.map((name) => `${name}.md`).sort(),
  );
  assert.equal(exists(`${skillRoot}/AUTHORING-HANDOFF.md`), true);
  assert.match(skill(), /^---\nname: orchestrator-phase\n[\s\S]*?disable-model-invocation:\s*true\n[\s\S]*?---/u);
  assert.match(skill(), /\[the orchestrator router\]\(phases\/router\.md\)/u);
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
      section(text, "Durable Handoff"),
      /\[the Track Ledger contract\]\(\.\.\/references\/ledger\.md\)/u,
      `${name}: handoff pointer`,
    );
  }
});

test("exits cover completion, blocker, no-op and human steering across the graph", () => {
  const exits = gates.map((name) => section(gate(name), "Declared Exits")).join("\n");
  assert.match(exits, /`complete`/u);
  assert.match(exits, /`blocked`/u);
  assert.match(exits, /`no-op`/u);
  assert.match(exits, /`checkpoint` `gated`/u);
  assert.match(exits, /`human_steering_required`/u);
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
  assert.match(rows.at(-1).output, /checkpoint `listening`/u);
  assert.match(router(), /transcript continuity and a recorded route suggestion\s+are never required/u);
  assert.match(router(), /send time/u);
});

test("every reference is reachable from the skill, the router or a gate", () => {
  const sources = [skill(), router(), ...gates.map(gate)].join("\n");
  for (const name of references) {
    assert.match(sources, new RegExp(`references/${name}\\.md\\)`, "u"), name);
  }
});

test("only the Host binding names host tools", () => {
  const hostTool =
    /\bt3_|delegate_task|watch_pull_request|request_secret|Greptile|ci-home|Vaultwarden/u;
  const questionTool = /AskUserQuestion|request_user_input/u;
  const files = [
    `${skillRoot}/SKILL.md`,
    `${skillRoot}/phases/router.md`,
    ...gates.map((name) => `${skillRoot}/phases/${name}.md`),
    ...references
      .filter((name) => name !== "hosts")
      .map((name) => `${skillRoot}/references/${name}.md`),
  ];
  for (const file of files) {
    assert.doesNotMatch(read(file), hostTool, file);
    if (!file.endsWith("/SKILL.md") && !file.endsWith("/track-brief.md")) {
      assert.doesNotMatch(read(file), questionTool, file);
    }
  }
  for (const tool of [
    "t3_thread_launch",
    "t3_thread_transfer",
    "t3_thread_send",
    "t3_thread_read",
    "delegate_task",
    "watch_pull_request",
    "request_secret",
  ]) {
    assert.match(reference("hosts"), new RegExp(`\`${tool}\``, "u"), tool);
  }
});

test("the AFK rule bans question tools once and the brief carries it to Tracks", () => {
  const afk = section(skill(), "AFK");
  assert.match(afk, /\*\*Autonomous Decision\*\*/u);
  assert.match(afk, /\*\*Needs-you item\*\*/u);
  assert.match(afk, /never calls `AskUserQuestion`, `request_user_input` or any other question\s+tool/u);
  const brief = reference("track-brief");
  assert.match(brief, /AskUserQuestion, request_user_input or any other question tool/u);
  assert.match(brief, /Never merge: report "ready" with the head commit/u);
  assert.match(brief, /Send no acknowledgements/u);
});

test("Human Gates, merge, start check and go-solo rules hold the grill decisions", () => {
  const gatesText = section(skill(), "Human Gates");
  for (const pattern of [
    /production deploy/u,
    /new functional PR/u,
    /infrastructure that costs money/u,
    /deleting production data, unless an approved migration in a merged PR/u,
    /finds in the human's own\s+messages/u,
  ]) {
    assert.match(gatesText, pattern);
  }
  assert.match(gate("merge"), /exact commit the Track reported ready/u);
  assert.match(gate("merge"), /Merge style is squash/u);
  assert.match(gate("merge"), /1\.5 million changed lines/u);
  assert.match(gate("spawn"), /within 2\s+minutes/u);
  assert.match(gate("listen"), /write `delivering` first, then send\s+`\$delivery-phase`/u);
  assert.match(gate("intake"), /never whether the work fits one thread's\s+context/u);
  assert.match(gate("reopen"), /`\$handoff`/u);
  assert.match(gate("reopen"), /Fork this thread/u);
  assert.match(gate("solo"), /merge returns to the human/u);
  assert.match(section(skill(), "Short Turns"), /no recurring\s+timer/u);
});
