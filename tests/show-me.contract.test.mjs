import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

const read = (path) =>
  readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

const showMePath = "skills/misc/show-me";

test("show-me retains pinned HumanLayer provenance and stays model-invoked", () => {
  const skill = read(`${showMePath}/SKILL.md`);
  const license = read(`${showMePath}/LICENSE`);
  const upstream = read(`${showMePath}/UPSTREAM.md`);

  assert.match(skill, /^---\nname: show-me\ndescription:/);
  assert.doesNotMatch(skill, /disable-model-invocation/);
  assert.match(license, /Copyright \(c\) 2026 HumanLayer/);
  assert.match(upstream, /4d8d644ca747517973f58d7953f58d7cd07520cd/);
});

test("show-me uses the smallest authority-preserving visual", () => {
  const skill = read(`${showMePath}/SKILL.md`);

  assert.match(skill, /current topic.*visually/is);
  assert.match(skill, /explicit.*explain|asks.*visual/is);
  assert.match(skill, /three or more.*mappings.*branches.*dependencies/is);
  assert.match(skill, /smallest.*view/is);
  assert.match(skill, /textual conclusion/is);
  assert.match(skill, /never.*authority|does not replace.*authority/is);
  assert.match(skill, /HTML.*explicit.*artifact intent/is);
  assert.doesNotMatch(skill, /Bash\(open/);
});

test("planning entrypoints present requirements, specs, plans, and delivery", () => {
  const grill = read(
    "skills/agnostic/requirements/requirements-grill/SKILL.md",
  );
  const spec = read("skills/agnostic/planning/create-spec/SKILL.md");
  const plan = read("skills/agnostic/planning/create-plan/SKILL.md");
  const implementation = read(
    "skills/agnostic/planning/implement-spec/SKILL.md",
  );

  assert.match(grill, /\$show-me.*shared understanding.*approval/is);
  assert.match(spec, /\$show-me.*completed spec/is);
  assert.match(spec, /no.*approval gate/is);
  assert.match(plan, /\$show-me.*task graph.*before.*wait-what/is);
  assert.match(implementation, /\$show-me.*implementation notes/is);
  assert.match(implementation, /does not replace.*evidence/is);
});

test("requirements grill delegates completion scheduling while retaining presentation", () => {
  const grill = read(
    "skills/agnostic/requirements/requirements-grill/SKILL.md",
  );

  assert.match(
    grill,
    /After `\$grilling` completes and the durable artifacts are current, invoke\s+`\$show-me`/u,
  );
  assert.doesNotMatch(
    grill,
    /frontier is empty|frontier remains open|empty-frontier/iu,
  );
});

test("phase entrypoints present complex state without taking authority", () => {
  const docs = read("skills/phases/docs-ingest-phase/SKILL.md");
  const finder = read("skills/phases/finder-phase/SKILL.md");
  const businessFinder = read("skills/phases/business-finder/SKILL.md");
  const grillingGate = read("skills/phases/finder-phase/phases/grilling.md");
  const functionalFinder = read("skills/phases/functional-finder/SKILL.md");
  const debugging = read("skills/phases/debugging-phase/SKILL.md");
  const review = read("skills/phases/review-phase/SKILL.md");
  const prototype = read("skills/phases/prototype-phase/SKILL.md");

  assert.match(docs, /\$show-me.*complex.*flow|complex.*flow.*\$show-me/is);
  assert.match(
    finder,
    /\[Generic Grilling\]\(phases\/grilling\.md\)/u,
  );
  assert.match(
    businessFinder,
    /\$show-me[\s\S]*all relevant existing Product Areas and Initiatives[\s\S]*proposed impact/iu,
  );
  assert.match(
    businessFinder,
    /\$wait-what[\s\S]*repitch/iu,
  );
  assert.match(grillingGate, /wrapper's intake[\s\S]*presentation profile/iu);
  assert.match(
    functionalFinder,
    /\$show-me[\s\S]*each decision[\s\S]*observable workflow[\s\S]*milestone context[\s\S]*final Epic projection/iu,
  );
  assert.match(debugging, /\$show-me.*evidence matrix/is);
  assert.match(review, /\$show-me.*retained.*report/is);
  assert.match(prototype, /\$show-me.*variant.*verdict/is);
});

test("backlog visualizes material topology decisions while handoff stays untouched", () => {
  const backlog = read(
    "skills/agnostic/requirements/write-backlog/SKILL.md",
  );
  const handoff = read("skills/agnostic/generic/handoff/SKILL.md");

  assert.match(backlog, /\$show-me.*authority-derived topology/isu);
  assert.match(
    backlog,
    /Boundary, goal,[\s\S]*reparenting, or reorganization changes require explicit approval/iu,
  );
  assert.match(
    backlog,
    /\$show-me` visual when the relationships are harder to[\s\S]*understand than the prose/iu,
  );
  assert.match(backlog, /visual does not replace[\s\S]*traceability/iu);
  assert.match(
    backlog,
    /\$wait-what` when proposed ticket wording or project terms do not land/iu,
  );
  assert.doesNotMatch(handoff, /show-me/);
});
