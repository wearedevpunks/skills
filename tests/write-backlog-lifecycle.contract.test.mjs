import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";

const root = path.resolve(import.meta.dirname, "..");
const read = (relativePath) => readFileSync(path.join(root, relativePath), "utf-8");

test("write-backlog requires agent-ready spec", () => {
  const skill = read("skills/agnostic/requirements/write-backlog/SKILL.md");
  assert.match(skill, /authoritative `SPEC\.md`/u);
  assert.match(skill, /`readiness: agent-ready`/u);
  assert.match(skill, /before any provider mutation/u);
});

test("write-backlog uses direct backlog concepts", () => {
  for (const relativePath of [
    "skills/agnostic/requirements/write-backlog/SKILL.md",
    "skills/agnostic/requirements/write-backlog/REFERENCE.md",
    "skills/agnostic/requirements/write-backlog/assets/concepts/backlog-model.md",
  ]) {
    const document = read(relativePath);
    assert.match(document, /`fog`[\s\S]*`grilling`[\s\S]*`research`[\s\S]*`prototype`[\s\S]*`epic`[\s\S]*`story`/u, relativePath);
    assert.doesNotMatch(document, /\b(?:kind|kinds|Kind)\b/u, relativePath);
  }
});

test("write-backlog preserves spec traceability and tracer bullets", () => {
  const reference = read("skills/agnostic/requirements/write-backlog/REFERENCE.md");
  assert.match(reference, /stable `US-###` user stories/u);
  assert.match(reference, /stable `AC-###` acceptance criteria/u);
  assert.match(reference, /`Covers: US-###`/u);
  assert.match(reference, /vertical tracer bullet/u);
  assert.match(reference, /agent-sized/u);
});

test("write-backlog validates the complete blocker graph before mutation", () => {
  const skill = read("skills/agnostic/requirements/write-backlog/SKILL.md");
  assert.match(skill, /Resolve every blocker target/u);
  assert.match(skill, /Reject missing targets, self-blockers, and cycles/u);
  assert.match(skill, /complete projection before the first provider write/u);
});

test("provider adapters do not require a canonical classification field", () => {
  for (const name of ["linear", "github-projects", "azure-devops", "monday"]) {
    const document = read(`skills/agnostic/requirements/write-backlog/assets/providers/${name}-create-payload.md`);
    assert.doesNotMatch(document, /Canonical `kind` storage|canonical Harness kind|`Kind` is canonical|canonical when/u, name);
    assert.match(document, /adapter-specific/u, name);
  }
});

test("create-plan preserves spec before backlog", () => {
  const reference = read("skills/agnostic/planning/create-plan/references/backlog-sync.md");
  assert.match(reference, /authoritative agent-ready `SPEC\.md`/u);
  assert.match(reference, /verified stable blob URL/u);
  assert.match(reference, /write-backlog/u);
  assert.match(reference, /Concrete planning is downstream/u);
  assert.doesNotMatch(reference, /future `SPEC\.md`/u);
});

test("design backlog handoff requires the compiled spec", () => {
  const phase = read("skills/phases/design-phase/phases/backlog.md");
  assert.match(phase, /authoritative agent-ready `SPEC\.md`/u);
  assert.match(phase, /verified stable blob URL/u);
  assert.match(phase, /Activate `write-backlog`/u);
  assert.match(phase, /spec -> backlog -> delivery/u);
});

test("docs onboarding compiles before backlog projection", () => {
  const skill = read("skills/agnostic/docs/docs-onboarding/SKILL.md");
  assert.match(skill, /\bhi init\b/u);
  assert.doesNotMatch(skill, /\bhi scaffold (?:init|setup)\b/u);
  assert.match(skill, /confirmed grill decisions/u);
  assert.match(skill, /agent-ready specs/u);
  assert.match(skill, /Only after each spec is written[^\n]+activate `write-backlog`/u);
  assert.match(skill, /verified stable blob URL/u);
  assert.doesNotMatch(skill, /Backlog mutation is out of scope/u);
});

test("write-backlog examples demonstrate spec projection", () => {
  const examples = read("skills/agnostic/requirements/write-backlog/EXAMPLES.md");
  assert.match(examples, /readiness: agent-ready/u);
  assert.match(examples, /US-001/u);
  assert.match(examples, /AC-001/u);
  assert.match(examples, /immutable spec link/u);
  assert.doesNotMatch(examples, /From `requirements-grill` artifacts to backlog/u);
});

test("shared consumers do not reintroduce backlog-first lifecycle", () => {
  for (const relativePath of [
    "skills/agnostic/requirements/write-backlog/SKILL.md",
    "skills/agnostic/planning/create-plan/references/backlog-sync.md",
    "skills/phases/design-phase/phases/backlog.md",
    "skills/agnostic/docs/docs-onboarding/SKILL.md",
    "skills/agnostic/requirements/requirements-grill/SKILL.md",
  ]) {
    const document = read(relativePath);
    assert.doesNotMatch(document, /epics? anchor future|one future `SPEC\.md`|From `requirements-grill` artifacts/u, relativePath);
  }
  const grill = read("skills/agnostic/requirements/requirements-grill/SKILL.md");
  assert.match(grill, /closed shared understanding routes to `create-spec`/u);
  assert.doesNotMatch(grill, /backlog\/user-story creation is the next phase|usually backlog\/user-story creation/u);
});

test("story bodies carry spec authority and demonstration seams", () => {
  const shape = read("skills/agnostic/requirements/write-backlog/assets/concepts/story-shape.md");
  assert.match(shape, /Immutable spec/u);
  assert.match(shape, /Source stories/u);
  assert.match(shape, /Acceptance criteria/u);
  assert.match(shape, /Demonstration/u);
  assert.doesNotMatch(shape, /once it exists/u);
});

test("provider adapters preflight the complete graph before creation", () => {
  for (const name of ["linear", "github-projects", "azure-devops", "monday"]) {
    const document = read(`skills/agnostic/requirements/write-backlog/assets/providers/${name}-create-payload.md`);
    const preflight = document.indexOf("## Preflight before creation");
    const creation = document.indexOf("## Create ");
    assert.ok(preflight >= 0 && (creation < 0 || preflight < creation), `${name}: preflight order`);
    assert.match(document, /complete in-memory projection/u, name);
    assert.match(document, /missing targets, self-edges, and cycles/u, name);
    assert.match(document, /milestone/u, name);
    assert.match(document, /representable/u, name);
    assert.doesNotMatch(
      document,
      /Create (?:the milestone-eligible|selected concrete)[\s\S]{0,240}Stop (?:materialization )?on a missing/u,
      `${name}: no create-then-validate ordering`,
    );
  }
});

test("provider classification is configured and never bootstrapped by default", () => {
  for (const name of ["linear", "github-projects", "azure-devops", "monday"]) {
    const document = read(`skills/agnostic/requirements/write-backlog/assets/providers/${name}-create-payload.md`);
    assert.match(document, /Inspect configured provider metadata/u, name);
    assert.match(document, /Only when explicitly configured/u, name);
    assert.match(document, /Classification examples assume explicit configuration/u, name);
    assert.doesNotMatch(document, /Resolve or create the `Kind`|If .*`Kind`.*absent, create|does not exist, create a project\/process custom/u, name);
  }
});

test("provider adapters preserve visible direct taxonomy without custom fields", () => {
  for (const name of ["linear", "github-projects", "azure-devops", "monday"]) {
    const document = read(`skills/agnostic/requirements/write-backlog/assets/providers/${name}-create-payload.md`);
    assert.match(document, /Fallback order:/u, name);
    assert.match(document, /stable title prefix/u, name);
    assert.match(document, /fail preflight/u, name);
    assert.doesNotMatch(document, /omit classification|otherwise omit that value/u, name);
  }
});

test("Linear preflights the complete configured intake Kind taxonomy", () => {
  const linear = read(
    "skills/agnostic/requirements/write-backlog/assets/providers/linear-create-payload.md",
  );

  assert.match(
    linear,
    /before (?:any|the first) write.{0,240}Kind\/fog.{0,120}Kind\/grilling.{0,120}Kind\/research.{0,120}Kind\/prototype/is,
  );
  assert.match(
    linear,
    /create missing (?:Kind )?labels only when explicit workspace policy\s+permits/is,
  );
  assert.match(
    linear,
    /otherwise.{0,160}setup blocker.{0,160}missing\s+label/is,
  );
  assert.match(
    linear,
    /incomplete configured `Kind` taxonomy.{0,200}(?:must not|do not) use (?:a )?title prefix/is,
  );
});

test("pre-spec intake dependency graph is validated before mutation", () => {
  const skill = read("skills/agnostic/requirements/write-backlog/SKILL.md");
  const reference = read("skills/agnostic/requirements/write-backlog/REFERENCE.md");
  for (const document of [skill, reference]) {
    assert.match(document, /complete intake dependency graph/u);
    assert.match(document, /missing targets,\s+self-edges, and cycles/u);
    assert.match(document, /before (?:the first provider write|mutation)/u);
  }
});

test("fog intake carries uncertainty while graduated intake carries a precise question", () => {
  const skill = read("skills/agnostic/requirements/write-backlog/SKILL.md");
  const reference = read("skills/agnostic/requirements/write-backlog/REFERENCE.md");
  for (const document of [skill, reference]) {
    assert.match(
      document,
      /`fog`.{0,200}frontier or uncertainty description/is,
    );
    assert.match(
      document,
      /`grilling`, `research`, or `prototype`.{0,200}precise question/is,
    );
    assert.doesNotMatch(document, /(?:each|one) `fog`[^.]{0,200}precise question/is);
  }
});

test("finder-derived learning keeps fog as provider-aware evidence parent", () => {
  const model = read(
    "skills/agnostic/requirements/write-backlog/assets/concepts/backlog-model.md",
  );
  const finder = read("skills/phases/finder-phase/SKILL.md");
  const frontier = read(
    "skills/phases/finder-phase/references/frontier-lifecycle.md",
  );
  const all = `${model}\n${finder}\n${frontier}`;

  assert.match(
    all,
    /Finder-derived `grilling`, `research`, or `prototype`.{0,240}fog.{0,120}evidence parent/is,
  );
  assert.match(
    all,
    /fog remains root-level.{0,240}(?:not|is not) (?:a )?delivery/is,
  );
  assert.match(all, /fog remains root-level.{0,240}`SPEC\.md` anchor/is);
  assert.match(all, /fog remains root-level.{0,240}capability module/is);
  assert.match(all, /fog remains root-level.{0,240}execution item/is);
  assert.match(
    model,
    /when the provider supports.{0,200}native (?:intake )?parent.{0,200}otherwise.{0,200}evidence link/is,
  );
  assert.match(
    finder,
    /handoff.{0,200}(?:supplies|includes).{0,80}fog parent/is,
  );
});

test("provider adapters preserve fog parent evidence within native capabilities", () => {
  const linear = read(
    "skills/agnostic/requirements/write-backlog/assets/providers/linear-create-payload.md",
  );
  const github = read(
    "skills/agnostic/requirements/write-backlog/assets/providers/github-projects-create-payload.md",
  );
  const azure = read(
    "skills/agnostic/requirements/write-backlog/assets/providers/azure-devops-create-payload.md",
  );
  const monday = read(
    "skills/agnostic/requirements/write-backlog/assets/providers/monday-create-payload.md",
  );

  assert.match(linear, /Finder-derived.{0,200}`parentId`.{0,120}source fog/is);
  assert.match(github, /source fog.{0,200}(?:`parentIssueId`|`addSubIssue`)/is);
  assert.match(azure, /Parent\s+relation.{0,120}source fog/is);
  assert.match(
    monday,
    /source fog.{0,240}immutable evidence link.{0,200}capability group/is,
  );
});

test("write-backlog invocation advertises both lifecycle branches", () => {
  const skill = read("skills/agnostic/requirements/write-backlog/SKILL.md");
  const description = skill.match(/^description: (.+)$/mu)?.[1] ?? "";
  assert.match(description, /pre-spec intake/u);
  assert.match(description, /agent-ready post-spec delivery projection/u);
});

test("design backlog bodies exclude implementation notes", () => {
  const phase = read("skills/phases/design-phase/phases/backlog.md");
  assert.match(phase, /accepted product and design constraints, acceptance context, and artifact links/u);
  assert.doesNotMatch(phase, /implementation notes/u);
});

test("write-backlog physically updates existing decision tickets", () => {
  const skill = read("skills/agnostic/requirements/write-backlog/SKILL.md");
  assert.match(skill, /update-existing branch/u);
  assert.match(skill, /claim, release, or resolve/u);
  assert.match(skill, /immutable resolution pointer/u);

  const providerSignals = new Map([
    ["linear", /issueUpdate/u],
    ["github-projects", /updateIssue/u],
    ["azure-devops", /JSON Patch update/u],
    ["monday", /change_item_column_values/u],
  ]);
  for (const [name, signal] of providerSignals) {
    const document = read(`skills/agnostic/requirements/write-backlog/assets/providers/${name}-create-payload.md`);
    assert.match(document, /## Update existing decision tickets/u, name);
    assert.match(document, /claim, release, and resolve/u, name);
    assert.match(document, signal, name);
  }
});

test("learning closure returns evidence to Wayfinder without delivery authorization", () => {
  for (const relativePath of [
    "skills/agnostic/requirements/write-backlog/SKILL.md",
    "skills/agnostic/requirements/write-backlog/assets/concepts/story-shape.md",
    "skills/agnostic/requirements/write-backlog/assets/providers/linear-create-payload.md",
    "skills/agnostic/requirements/write-backlog/assets/providers/github-projects-create-payload.md",
    "skills/agnostic/requirements/write-backlog/assets/providers/azure-devops-create-payload.md",
    "skills/agnostic/requirements/write-backlog/assets/providers/monday-create-payload.md",
  ]) {
    const document = read(relativePath);
    assert.doesNotMatch(document, /accepted direction|created or updated (?:implementation )?(?:items|epics\/stories)/iu, relativePath);
  }
  const skill = read("skills/agnostic/requirements/write-backlog/SKILL.md");
  assert.match(skill, /Evidence returns to Wayfinder for reconciliation; closure does not authorize delivery/u);
});

test("all provider bodies preserve immutable spec and story traceability", () => {
  for (const name of ["linear", "github-projects", "azure-devops", "monday"]) {
    const document = read(`skills/agnostic/requirements/write-backlog/assets/providers/${name}-create-payload.md`);
    assert.match(document, /Epic body ownership:[\s\S]*immutable spec link/u, name);
    assert.match(document, /Story body ownership:[\s\S]*source `US-###`[\s\S]*covered `AC-###`[\s\S]*demonstration[\s\S]*accepted artifact links/u, name);
  }
});

test("create-plan backlog reference links to the canonical model", () => {
  const document = read("skills/agnostic/planning/create-plan/references/backlog-sync.md");
  const match = document.match(
    /\(https:\/\/github\.com\/wearedevpunks\/skills\/blob\/main\/(skills\/agnostic\/requirements\/write-backlog\/assets\/concepts\/backlog-model\.md)\)/u,
  );
  assert.ok(match, "backlog model link is projection-independent");
  assert.doesNotThrow(() => read(match[1]));
});
