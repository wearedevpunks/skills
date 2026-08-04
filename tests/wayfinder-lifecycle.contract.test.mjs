import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

const read = (path) =>
  readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

test("prototype phase delegates construction to prototype", () => {
  const phase = read("skills/phases/prototype-phase/SKILL.md");
  assert.match(phase, /use the `prototype` skill/i);
});

test("design prototype step composes the primitive, not the standalone phase", () => {
  const design = read("skills/phases/design-phase/phases/prototype.md");
  assert.match(design, /activate the lean `prototype` primitive/u);
  assert.match(design, /Standalone `prototype-phase` remains a Finder route/u);
  assert.doesNotMatch(design, /Activate `?\$prototype-phase`?|activate `?\$prototype-phase`?/u);
});

test("prototype lifecycle keeps durable throwaway evidence and human verdicts", () => {
  const primitive = read("skills/agnostic/research/prototype/SKILL.md");
  const phase = read("skills/phases/prototype-phase/SKILL.md");
  const verdict = read("skills/phases/prototype-phase/VERDICT-TEMPLATE.md");
  assert.match(primitive, /prototype\/<slug>/);
  assert.match(primitive, /immutable commit SHA/i);
  assert.match(phase, /accept, iterate, or reject/i);
  assert.match(phase, /PROTOTYPE-VERDICT\.md/);
  assert.match(phase, /grilling, research,\s+another prototype, or `create-spec`/i);
  assert.doesNotMatch(phase, /must.{0,20}grill/i);
  assert.match(verdict, /Artifact commit:/);
});

test("prototype UI variants are safe and reload-stable on the real host", () => {
  const ui = read("skills/agnostic/research/prototype/UI.md");
  assert.match(ui, /existing route, data fetching, params, and auth/i);
  assert.match(ui, /survives reload/i);
  assert.match(ui, /input|textarea|select|contenteditable/i);
  assert.match(ui, /stub(?:bed)? mutations/i);
  assert.match(ui, /production builds/i);
});

test("prototype verdict preserves decision-rich evaluation evidence", () => {
  const phase = read("skills/phases/prototype-phase/SKILL.md");
  const verdict = read("skills/phases/prototype-phase/VERDICT-TEMPLATE.md");
  assert.match(verdict, /Rejected alternatives/);
  assert.match(verdict, /Rejection rationale/);
  assert.match(verdict, /Unresolved risks/);
  assert.match(verdict, /Run command/);
  assert.match(verdict, /Inspection instructions/);
  assert.match(verdict, /Decision-rich snippet \(optional\)/);
  assert.match(phase, /On iterate, update `PROTOTYPE-VERDICT\.md`/i);
  assert.match(phase, /On reject.{0,160}question\s+unresolved.{0,160}`finder-phase`/is);
});

test("prototype evidence is remotely retained before immutable handoff", () => {
  const prototype = read("skills/agnostic/research/prototype/SKILL.md");
  const phase = read("skills/phases/prototype-phase/SKILL.md");
  for (const document of [prototype, phase]) {
    assert.match(document, /remote retention/iu);
    assert.match(document, /verify the remote ref contains the evidence\s+commit/iu);
    assert.match(document, /before\s+returning the immutable commit SHA and path/iu);
  }
});

test("finder implicit invocation is consistent", () => {
  const skill = read("skills/phases/finder-phase/SKILL.md");
  const metadata = read("skills/phases/finder-phase/agents/openai.yaml");
  assert.doesNotMatch(skill, /disable-model-invocation:\s*true/);
  assert.match(metadata, /allow_implicit_invocation:\s*true/);
});

test("wayfinder and finder expose a resumable decision lifecycle", () => {
  const primitive = read("skills/agnostic/planning/wayfinder/SKILL.md");
  const phase = read("skills/phases/finder-phase/SKILL.md");
  const frontier = read(
    "skills/phases/finder-phase/references/frontier-lifecycle.md",
  );
  const convergence = read(
    "skills/phases/finder-phase/references/convergence.md",
  );
  const all = `${phase}\n${frontier}\n${convergence}`;
  assert.match(phase, /destination/i);
  assert.match(phase, /chart mode/i);
  assert.match(phase, /work mode/i);
  assert.match(all, /backlog root is the living map/i);
  assert.match(all, /precise question/i);
  assert.match(all, /open, unblocked, and unclaimed/i);
  assert.match(all, /claim.{0,160}before/is);
  assert.match(convergence, /Resume Input/);
  assert.match(convergence, /immutable child-flow resolution pointers/i);
  assert.match(convergence, /one bounded child flow/i);
  assert.match(convergence, /Repair claims, dependencies, or scope invalidated/i);
  assert.match(convergence, /recompute open, unblocked, unclaimed/i);
  assert.match(convergence, /out-of-scope/i);
  assert.doesNotMatch(primitive, /next (planning |work )?kind/i);
});

test("finder keeps fog broad until it graduates to a precise question", () => {
  const phase = read("skills/phases/finder-phase/SKILL.md");
  const frontier = read(
    "skills/phases/finder-phase/references/frontier-lifecycle.md",
  );
  const all = `${phase}\n${frontier}`;
  assert.match(all, /fog.{0,160}frontier or uncertainty description/is);
  assert.match(all, /precise question.{0,160}(?:grilling|research|prototype)/is);
  assert.doesNotMatch(
    all,
    /fog item graduates when it can be stated as a precise question now/i,
  );
});

test("wayfinder separates capability placement from execution chronology", () => {
  const primitive = read("skills/agnostic/planning/wayfinder/SKILL.md");
  const frontier = read(
    "skills/phases/finder-phase/references/frontier-lifecycle.md",
  );
  const all = `${primitive}\n${frontier}`;
  assert.match(all, /capability module/i);
  assert.match(all, /execution milestones.{0,160}blocker-derived chronology/is);
  assert.doesNotMatch(all, /module\/milestone/i);
});

test("finder routes physical claim and resolution mutation through write-backlog", () => {
  const convergence = read(
    "skills/phases/finder-phase/references/convergence.md",
  );
  assert.match(
    convergence,
    /claim is a semantic output.{0,160}`write-backlog`/is,
  );
  assert.match(
    convergence,
    /resolution is a semantic output.{0,160}`write-backlog`/is,
  );
});

test("research durable mode remains optional", () => {
  const research = read(
    "skills/agnostic/research/parallel-research/SKILL.md",
  );
  assert.match(research, /optional durable/i);
  assert.match(research, /response-only/i);
});

test("research and docs ingest preserve one primary-source report", () => {
  const report = read(
    "skills/agnostic/research/parallel-research/DURABLE-REPORT.md",
  );
  const ingest = read(
    "skills/phases/docs-ingest-phase/references/learning-artifacts.md",
  );
  assert.match(report, /2-4 readonly lanes/i);
  assert.match(report, /coordinator or one designated consolidator/i);
  assert.match(report, /one consolidated report/i);
  assert.match(report, /primary source for every retained factual claim/i);
  assert.match(report, /research\/<slug>/);
  assert.match(report, /immutable commit SHA and path/i);
  assert.match(ingest, /report as primary evidence/i);
  assert.match(ingest, /keep`, `update`, `consolidate`, `replace`,\s+or `mark_stale`/i);
});

test("research parent enforces one durable report writer", () => {
  const research = read(
    "skills/agnostic/research/parallel-research/SKILL.md",
  );
  assert.match(research, /lanes remain readonly/i);
  assert.match(
    research,
    /only the coordinator or one designated\s+consolidator may write and commit exactly one report/i,
  );
});

test("parallel research durable retention commit does not trigger its skip rule", () => {
  const research = read(
    "skills/agnostic/research/parallel-research/SKILL.md",
  );
  assert.match(research, /skip.{0,200}source or code mutation/is);
  assert.match(research, /skip.{0,200}unrelated\s+writes/is);
  assert.match(research, /one retained durable-report commit/i);
  assert.doesNotMatch(research, /skip this skill[^.]*\bcommits\b/i);
});

test("durable research is remotely retained before immutable handoff", () => {
  const skill = read("skills/agnostic/research/parallel-research/SKILL.md");
  const contract = read("skills/agnostic/research/parallel-research/DURABLE-REPORT.md");
  for (const document of [skill, contract]) {
    assert.match(document, /push or explicitly retain `research\/<slug>`/iu);
    assert.match(document, /verify the retained ref contains the report commit/iu);
    assert.match(document, /before returning the immutable (?:commit )?SHA and path/iu);
  }
});

test("create-spec no-interview compiler", () => {
  const skill = read("skills/agnostic/planning/create-spec/SKILL.md");
  assert.match(skill, /compiler of confirmed decisions/i);
  assert.doesNotMatch(skill, /ask(?:ing)? (?:the user|questions)|questioning\.md/i);
});

test("spec compiler emits agent-ready traceable specs or one atomic failure", () => {
  const skill = read("skills/agnostic/planning/create-spec/SKILL.md");
  const readiness = read(
    "skills/agnostic/planning/create-spec/references/readiness.md",
  );
  const template = read(
    "skills/agnostic/planning/create-spec/assets/SPEC-TEMPLATE.md",
  );
  const requirements = read("skills/phases/requirements-phase/SKILL.md");
  const delivery = read("skills/phases/delivery-phase/phases/spec.md");
  const all = `${skill}\n${readiness}\n${template}`;
  assert.match(all, /research\s+reports/i);
  assert.match(all, /prototype\s+verdict/i);
  assert.match(all, /ADRs/i);
  assert.match(all, /glossary/i);
  assert.match(all, /axioms/i);
  assert.match(all, /constraints/i);
  assert.match(readiness, /one `spec-not-ready` result/i);
  assert.match(readiness, /Write no partial spec/i);
  assert.match(template, /readiness: agent-ready/);
  assert.match(template, /US-001/);
  assert.match(template, /AC-001/);
  assert.match(template, /Covers: US-001/);
  assert.match(template, /Accepted Technical Decisions/);
  assert.match(template, /Accepted Testing Decisions/);
  assert.match(template, /Verification Seams/);
  assert.match(requirements, /requirements-grill -> create-spec/);
  assert.match(requirements, /invoke `create-spec` immediately/i);
  assert.match(requirements, /spec-written/);
  assert.match(delivery, /agent-ready/);
  assert.doesNotMatch(all, /write-backlog` automatically|before final drafting/i);
});

test("agent-ready compiler output is sufficient for downstream delivery", () => {
  const createSpec = read("skills/agnostic/planning/create-spec/SKILL.md");
  const createPlan = read("skills/agnostic/planning/create-plan/SKILL.md");
  const implementSpec = read("skills/agnostic/planning/implement-spec/SKILL.md");
  const implementLifecycle = read(
    "skills/agnostic/planning/implement-spec/references/lifecycle.md",
  );
  const delivery = read("skills/phases/delivery-phase/SKILL.md");
  const router = read("skills/phases/delivery-phase/phases/router.md");
  const spec = read("skills/phases/delivery-phase/phases/spec.md");
  const all = `${createSpec}\n${createPlan}\n${implementSpec}\n${implementLifecycle}\n${delivery}\n${router}\n${spec}`;

  assert.match(createSpec, /`readiness: agent-ready` is sufficient downstream/i);
  assert.match(router, /matching agent-ready `SPEC\.md`/i);
  assert.match(router, /HITL checkpoint is explicit user control/i);
  assert.doesNotMatch(all, /(?:approved|reviewed) spec(?:ification| folder)?/i);
  assert.doesNotMatch(all, /no reviewed matching spec/i);
});

test("spec compiler records neutral compiler state without human approval", () => {
  const createSpec = read("skills/agnostic/planning/create-spec/SKILL.md");
  const template = read(
    "skills/agnostic/planning/create-spec/assets/SPEC-TEMPLATE.md",
  );
  const bookkeeping = read(
    "skills/agnostic/planning/create-spec/references/wiki-bookkeeping.md",
  );
  assert.match(template, /status: compiled/u);
  assert.match(template, /readiness: agent-ready/u);
  assert.match(bookkeeping, /Compiled/u);
  assert.match(createSpec, /human approval.{0,160}separate optional action/is);
  assert.doesNotMatch(`${template}\n${bookkeeping}`, /Approved|status: approved/u);
});

test("create-plan produces worker ownership and wave fields", () => {
  const skill = read("skills/agnostic/planning/create-plan/SKILL.md");
  const schema = read(
    "skills/agnostic/planning/create-plan/references/plan-schema.md",
  );
  const reviewer = read(
    "skills/agnostic/planning/create-plan/references/planner-task-graph.md",
  );
  assert.match(skill, /`owned_paths`/u);
  assert.match(skill, /`wave_boundary`/u);
  assert.match(schema, /Every task must include:[\s\S]*`owned_paths`[\s\S]*`wave_boundary`/u);
  assert.match(schema, /\*\*owned_paths\*\*:/u);
  assert.match(schema, /\*\*wave_boundary\*\*:/u);
  assert.match(reviewer, /missing\s+`owned_paths`/u);
  assert.match(reviewer, /missing\s+`wave_boundary`/u);
});

test("implement-spec routes explicit dual execution modes without implicit fan-out", () => {
  const skill = read("skills/agnostic/planning/implement-spec/SKILL.md");
  const lifecycle = read(
    "skills/agnostic/planning/implement-spec/references/lifecycle.md",
  );
  const sequential = read(
    "skills/agnostic/planning/implement-spec/references/sequential.md",
  );
  const parallel = read(
    "skills/agnostic/planning/implement-spec/references/parallel.md",
  );
  const notes = read(
    "skills/agnostic/planning/implement-spec/assets/IMPLEMENTATION-NOTES-TEMPLATE.md",
  );
  const all = `${skill}\n${lifecycle}`;

  assert.match(all, /user or plan intent/i);
  assert.match(all, /default to `sequential`/i);
  assert.match(all, /load only the selected mode reference/i);
  assert.match(sequential, /exactly one implementation worker/i);
  assert.match(sequential, /parent validation/i);
  assert.match(parallel, /explicitly authorized/i);
  assert.match(parallel, /independent.{0,160}disjoint/is);
  assert.match(parallel, /dependencies.{0,160}one-task wave/is);
  assert.match(notes, /## Execution Mode/u);
  assert.doesNotMatch(parallel, /Every `implement-spec` run executes through plan-derived worker waves/u);
});

test("delivery implementation honors the selected execution mode", () => {
  const phase = read("skills/phases/delivery-phase/phases/implement.md");
  assert.match(phase, /read the selected `Execution Mode`/i);
  assert.match(
    phase,
    /`sequential`.{0,160}entire task loop.{0,160}exactly one implementation\s+worker/is,
  );
  assert.match(phase, /parent.{0,160}parent validation/is);
  assert.match(
    phase,
    /only explicitly selected `parallel`.{0,240}safe disjoint tasks.{0,240}waves/is,
  );
  assert.doesNotMatch(phase, /^\s*- Launch every currently unblocked task/mu);
});

test("spec compiler serializes dependency and branch-base decisions", () => {
  const createSpec = read("skills/agnostic/planning/create-spec/SKILL.md");
  const readiness = read(
    "skills/agnostic/planning/create-spec/references/readiness.md",
  );
  const quality = read(
    "skills/agnostic/planning/create-spec/references/spec-quality-bar.md",
  );
  const template = read(
    "skills/agnostic/planning/create-spec/assets/SPEC-TEMPLATE.md",
  );
  const createPlan = read("skills/agnostic/planning/create-plan/SKILL.md");

  for (const document of [createSpec, readiness, quality, template]) {
    assert.match(document, /Dependency Readiness/u);
    assert.match(document, /Branch\/Base Intent/u);
  }
  assert.match(template, /dependency.{0,160}evidence/is);
  assert.match(template, /parent.{0,160}base.{0,160}constraint/is);
  assert.match(template, /No Stack Required/u);
  assert.match(template, /Not applicable/u);
  assert.match(createPlan, /Preserve `No Stack Required` or `Ready`/u);
  assert.match(createPlan, /`Blocked` is invalid agent-ready input/u);
  assert.match(
    createPlan,
    /If `Branch\/Base Intent` is not `Not applicable`/u,
  );
});

test("spec compiler rejects incomplete dependency and story coverage", () => {
  const readiness = read(
    "skills/agnostic/planning/create-spec/references/readiness.md",
  );
  const fixtures = JSON.parse(
    read("tests/fixtures/create-spec-readiness.json"),
  );
  assert.equal(fixtures.invalid.length, 3);
  assert.match(readiness, /dependency readiness/i);
  assert.match(readiness, /every `US-###` has at least one `AC-###`/i);
  assert.match(readiness, /nonexistent `US-###`/i);
});

test("spec compiler returns remotely verified blob authority before backlog projection", () => {
  const createSpec = read("skills/agnostic/planning/create-spec/SKILL.md");
  const requirements = read("skills/phases/requirements-phase/SKILL.md");
  for (const document of [createSpec, requirements]) {
    assert.match(document, /push or explicitly retain the spec commit/iu);
    assert.match(document, /verify the retained ref contains the spec commit/iu);
    assert.match(document, /construct and verify a stable blob URL\s+before `write-backlog`/iu);
    assert.doesNotMatch(document, /commit SHA plus repository-relative path, or a stable blob URL/u);
  }
  const backlog = read("skills/agnostic/requirements/write-backlog/SKILL.md");
  assert.match(backlog, /verified stable blob URL/u);
});
