import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

const read = (path) =>
  readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

const consumers = [
  "skills/agnostic/planning/create-spec/SKILL.md",
  "skills/agnostic/planning/create-plan/SKILL.md",
  "skills/agnostic/planning/implement-spec/SKILL.md",
  "skills/agnostic/docs/docs-onboarding/SKILL.md",
  "skills/agnostic/requirements/write-backlog/SKILL.md",
  "skills/phases/design-phase/phases/backlog.md",
  "skills/phases/delivery-phase/phases/spec.md",
  "skills/phases/delivery-phase/phases/implement.md",
  "skills/agnostic/backend/backend-domain-structure/SKILL.md",
  "skills/agnostic/frontend/frontend-domain-structure/SKILL.md",
  "skills/agnostic/research/improve-codebase-architecture/SKILL.md",
  "skills/misc/wait-what/SKILL.md",
];

test("downstream consumers preserve the routed canonical glossary", () => {
  for (const path of consumers) {
    const skill = read(path);
    assert.match(skill, /read the canonical glossary in the\s+routed `requirements-grill` status artifact/iu, path);
    assert.match(skill, /route proposed terminology changes through `requirements-grill` instead of\s+silently renaming them/iu, path);
  }
});

test("grill close maps every published wiki glossary in the root GLOSSARY-MAP.md", () => {
  const format = read("skills/agnostic/requirements/domain-modeling/GLOSSARY-FORMAT.md");
  assert.match(format, /^## Single vs multi-context repos$/mu);
  assert.match(format, /^## Contexts\n\n- \[Ordering\]\(\.\/src\/ordering\/GLOSSARY\.md\) — /mu);

  const publisher = read("skills/agnostic/requirements/requirements-grill/references/wiki-output.md");
  assert.match(publisher, /repository-root `GLOSSARY-MAP\.md`/u);
  assert.match(publisher, /\(\.\.\/\.\.\/domain-modeling\/GLOSSARY-FORMAT\.md#single-vs-multi-context-repos\)/u);
  assert.match(publisher, /create it if absent/u);
  assert.match(
    publisher,
    /`- \[<Context>\]\(\.\/<wiki-root>\/content\/docs\/project\/domains\/<context>-glossary\.mdx\) — <scope>`/u,
  );
  assert.match(
    publisher,
    /Done when every\s+`domains\/\*-glossary\.mdx` page has exactly one `## Contexts` line in\s+`GLOSSARY-MAP\.md`/u,
  );

  const gaps = read("skills/agnostic/cli/ask-hi/references/known-gaps.md");
  assert.doesNotMatch(gaps, /Glossary location/iu);
});
