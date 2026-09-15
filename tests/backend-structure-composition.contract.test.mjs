import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

const read = (path) =>
  readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

const agnosticSkill = read(
  "skills/agnostic/backend/backend-domain-structure/SKILL.md",
);
const agnosticLayout = read(
  "skills/agnostic/backend/backend-domain-structure/references/layout.md",
);
const effectSkill = read(
  "skills/frameworks/effect/effect-backend-structure/SKILL.md",
);
const effectLayout = read(
  "skills/frameworks/effect/effect-backend-structure/references/layout.md",
);
const effectServiceSkill = read(
  "skills/frameworks/effect/effect-service-design/SKILL.md",
);

const effectMechanics =
  /Context\.Service|Layer\.(?:merge|mergeAll|provide|provideMerge)|platform\/effect\/app\.ts/;

test("agnostic entrypoint delegates portable composition detail to its layout", () => {
  assert.match(agnosticSkill, /references\/layout\.md/i);
  assert.match(agnosticSkill, /composition classifier/i);
  assert.match(agnosticSkill, /\*\*Complete when:\*\*/);
  assert.doesNotMatch(agnosticSkill, /cross-child product policy/i);
  assert.doesNotMatch(agnosticSkill, /pure technical binding/i);
  assert.doesNotMatch(agnosticSkill, effectMechanics);

  assert.match(agnosticLayout, /nearest honest parent/i);
  assert.match(agnosticLayout, /Apply this rule recursively/i);
  assert.match(agnosticLayout, /leaf feature or module/i);
  assert.match(agnosticLayout, /nearest common parent feature/i);
  assert.match(agnosticLayout, /process composition root/i);
  assert.match(agnosticLayout, /product policy spanning them/i);
  assert.match(agnosticLayout, /Those children are siblings to one another/i);
  assert.match(agnosticLayout, /pure technical binding/i);
  assert.match(agnosticLayout, /classified exactly once/i);
  assert.doesNotMatch(agnosticLayout, effectMechanics);
});

test("Effect entrypoint delegates detailed ownership and operator rules", () => {
  assert.match(effectSkill, /references\/layout\.md/i);
  assert.match(effectSkill, /ownership classifier/i);
  assert.match(effectSkill, /classify each Layer exactly once/i);
  assert.match(effectSkill, /\*\*Complete when:\*\*/);
  assert.doesNotMatch(effectSkill, /feeds provider outputs/i);
  assert.doesNotMatch(effectSkill, /private `Context\.Service` seams/i);

  const operators = effectLayout.match(
    /## Effect v4 Layer Operators[\s\S]*?(?=\n## |$)/,
  )?.[0];

  assert.match(effectLayout, /Leaf\/module capability implementation Layer/i);
  assert.match(effectLayout, /Nearest common parent business Layer/i);
  assert.match(effectLayout, /Process production root/i);
  assert.match(effectLayout, /leaf `features\/<domain>\/layer\.ts`/i);
  assert.match(effectLayout, /nearest common parent domain's `layer\.ts`/i);
  assert.match(effectLayout, /Those child features are siblings to one another/i);
  assert.doesNotMatch(
    effectLayout,
    /child (?:feature|Layer)[^.\n]*(?:composes|merges)[^.\n]*(?:sibling|peer)/i,
  );

  assert.ok(operators, "Layer operator guidance must exist");
  assert.match(operators, /Layer\.merge/);
  assert.match(operators, /Layer\.mergeAll/);
  assert.match(operators, /combine Layer outputs, errors, and requirements/i);
  assert.match(operators, /Layer\.provide/);
  assert.match(operators, /Provider outputs stay private/i);
  assert.match(operators, /Layer\.provideMerge/);
  assert.match(operators, /retains both target and provider outputs/i);
  assert.match(operators, /Preserve dependency-requiring Layers/i);

  assert.match(effectLayout, /private `Context\.Service` seams/i);
  assert.match(effectLayout, /under `services\/` or in an owner-named module/i);
  assert.match(effectLayout, /platform\/effect\/app\.ts[^.]*production root/i);
});

test("Effect skills keep internal-module topology distinct from service authority", () => {
  assert.match(effectSkill, /references\/layout\.md/i);
  assert.match(
    effectLayout,
    /services\/<capability>\/service\.ts.*public `Context\.Service` capability/i,
  );
  assert.match(
    effectLayout,
    /operations\/<use-case>\/operation\.ts.*private `Effect\.fn` orchestration/i,
  );
  assert.match(
    effectLayout,
    /composition\/<capability>\/service\.ts.*private binding seam/i,
  );
  assert.match(effectLayout, /models\/<model>\.ts/i);
  assert.match(effectLayout, /repositories\/<entity>\.ts/i);
  assert.match(effectLayout, /mappers\/<model>\.ts/i);
  assert.match(effectLayout, /tests\/(?:unit|integration)\//i);
  assert.match(effectLayout, /pass-through barrels/i);
  assert.match(effectLayout, /relative imports within an internal module/i);
  assert.match(effectLayout, /source aliases across module boundaries/i);
  assert.match(effectLayout, /module internals private/i);
  assert.match(effectLayout, /narrow capability/i);
  assert.match(effectLayout, /spread-only mapper/i);
  assert.match(effectLayout, /structurally identical duplicate `\*Data` types/i);

  assert.match(
    effectSkill,
    /\$effect-service-design.*service qualification.*application policy/i,
  );
  assert.match(
    effectServiceSkill,
    /internal-module topology and repository boundaries, use `\$effect-backend-structure`/i,
  );
  assert.doesNotMatch(effectServiceSkill, /operations\/<use-case>\/operation\.ts/i);
});
