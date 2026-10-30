import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

const read = (path) =>
  readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
const prose = (path) => read(path).replace(/\s+/g, " ");

const root = "skills/agnostic/frontend/frontend-domain-structure";

const lintRuleIds = [
  "layer-order",
  "route-imports",
  "no-peer-feature",
  "no-peer-entity",
  "public-entrypoint",
  "data-source-imports",
  "index-reexports-only",
  "no-self-index-import",
  "layout-placement",
  "composition-shape",
  "no-prefix-siblings",
  "no-prototype-folder",
  "known-top-level",
  "ui-placement",
];
const lintRuleId = new RegExp(lintRuleIds.map((id) => `\`${id}\``).join("|"));

const section = (text, heading) => {
  const match = text.match(
    new RegExp(`^## ${heading}\\n([\\s\\S]*?)(?=^## |(?![\\s\\S]))`, "m"),
  );
  assert.ok(match, `missing ## ${heading}`);
  return match[1];
};

const tableRows = (text) =>
  text
    .split("\n")
    .filter((line) => line.startsWith("|"))
    .map((line) => line.split("|").slice(1, -1).map((cell) => cell.trim()));

const firstColumn = (text) =>
  tableRows(text)
    .slice(2)
    .map(([cell]) => cell);

test("frontend domain structure triggers domain granularity and React splitting review", () => {
  const skill = read(`${root}/SKILL.md`);
  const body = prose(`${root}/SKILL.md`).replace(/^---.*?---/u, "");
  const metadata = read(`${root}/agents/openai.yaml`);

  assert.match(skill, /^name: frontend-domain-structure$/m);
  assert.doesNotMatch(skill, /disable-model-invocation/);
  assert.match(
    skill,
    /description:[\s\S]{0,700}domain (?:boundary|granularity)[\s\S]{0,700}React component splitting/i,
  );
  assert.match(skill, /description:[\s\S]{0,300}entities layer model/i);
  assert.match(skill, /references\/structure\.md/);
  assert.match(skill, /references\/react\/structure\.md/);
  assert.match(
    skill,
    /agnostic reference[\s\S]{0,120}single source of truth for (?:the )?layers, domain\s+classification, placement, and dependency rules/i,
  );
  assert.doesNotMatch(
    body,
    /## (?:Quick Classifier|Boundary Rules|Shared Library Rule|Lint Rules)/i,
  );
  assert.match(
    body,
    /review or diagnostic request[^.]*return findings and a recommended target structure without editing files/i,
  );
  assert.match(
    body,
    /only change files when the user explicitly asks to create, refactor, or implement/i,
  );
  assert.match(body, /then make the smallest coherent move[^.]*validate/i);
  assert.doesNotMatch(skill, /^\d+\. Make the smallest coherent move/gm);

  assert.match(skill, /^\d+\. Run the `frontend-layers` lint rules/m);
  assert.match(body, /test and story files follow the same rules/i);
  assert.match(
    body,
    /apply the layer model only to the scope of the implementation that invoked this skill/i,
  );

  assert.match(metadata, /entities layer model/i);
  assert.match(metadata, /review React component boundaries/i);
  assert.match(
    metadata,
    /split only (?:when|at)[^.]*cohesive responsibility boundary[^.]*evidenced by distinct behavior, meaningful inputs, repeated use, or (?:a )?focused test seam/i,
  );
  assert.match(metadata, /keep tiny, private, related JSX local/i);
  assert.doesNotMatch(
    metadata,
    /cohesive responsibility (?:has|with) (?:its own )?test seam/i,
  );
  assert.doesNotMatch(
    metadata,
    /(?:always|unconditionally) split|split (?:all|every) components?/i,
  );

  for (const [path, text] of [
    ["SKILL.md", body],
    ["agents/openai.yaml", metadata],
    ["references/react/structure.md", read(`${root}/references/react/structure.md`)],
    ["references/migration.md", read(`${root}/references/migration.md`)],
  ]) {
    assert.doesNotMatch(text, lintRuleId, `${path} repeats a Lint Rules id`);
  }
});

test("agnostic reference fixes the entities layer model with Composition on top", () => {
  const structure = prose(`${root}/references/structure.md`);

  assert.deepEqual(firstColumn(section(read(`${root}/references/structure.md`), "Layers")), [
    "`app/` or `routes/`",
    "`composition/`",
    "`features/`",
    "`entities/`",
    "`modules/`",
    "`integrations/`",
    "`ui/`",
  ]);
  assert.match(structure, /each layer imports only lower layers/i);
  assert.match(structure, /route layer[^.]*imports only `composition\/`/i);
  assert.match(
    structure,
    /`proxy\.ts`, `middleware\.ts`,? and `instrumentation\.ts`[^.]*route layer/i,
  );
  assert.match(
    structure,
    /`server\/` sits outside the layers[^.]*`effect-backend-structure`/i,
  );
  assert.match(
    structure,
    /only `remote\/` Data Sources and API handlers import `server\/`/i,
  );
  assert.match(structure, /API handlers import only `server\/`/i);
  assert.match(structure, /`app\/\(shop\)\/api\/`/);
  assert.match(structure, /Style and asset imports/i);
  assert.match(structure, /at any depth of a feature or entity domain/i);
  assert.match(structure, /never re-exports its own `remote\/` or\s+`simulated\/`/i);
  assert.doesNotMatch(structure, /These labels may differ between projects/i);
  assert.doesNotMatch(structure, /\bSurface\b/);

  assert.match(
    structure,
    /Composition holds the global root providers, the proxy,? and routing/i,
  );
  assert.match(
    structure,
    /first level is fixed: `providers\/`, `proxy\/`,? and `routing\/`/i,
  );
  assert.match(
    structure,
    /`routing\/` holds[^.]*`access\/`, `shells\/<name>\/`,? and `pages\/<page>\/`/i,
  );
  assert.match(structure, /a \*\*Shell\*\* is the layout of one route group/i);
  assert.match(
    structure,
    /layout file lives only in `composition\/routing\/shells\/<name>\/`/i,
  );
  assert.match(structure, /`providers\/` holds only global root providers/i);

  assert.match(structure, /a Feature never imports another Feature/i);
  assert.match(structure, /a Feature combines one or more Entities/i);
  assert.match(
    structure,
    /nearest composition[^.]*connects them through props, slots,? or callbacks/i,
  );
  assert.doesNotMatch(
    structure,
    /highly discouraged|peer-feature exception|permit one only/i,
  );

  assert.match(structure, /an \*\*Entity\*\* is a repository-like domain for one business entity/i);
  assert.match(structure, /an Entity never imports another Entity/i);
  assert.match(structure, /logic that spans two Entities lives in a Feature/i);

  assert.match(structure, /a \*\*Data Source\*\* implements a port/i);
  assert.match(structure, /`remote\/`[^.]*server-backed/i);
  assert.match(structure, /`simulated\/`[^.]*in-memory/i);
  assert.match(structure, /only Composition and tests import a Data Source/i);
  assert.match(structure, /`remote\/index\.ts`[^.]*browser/i);
  assert.match(structure, /`remote\/server\.ts`[^.]*`import "server-only"`/i);
  assert.match(structure, /no production UI[^.]*folder named "prototype"/i);

  assert.match(structure, /a Module carries no product terms/i);
  assert.match(structure, /an Integration is an adapter to a third-party system/i);

  assert.match(structure, /a domain is the first folder under a layer/i);
  assert.match(
    structure,
    /domain `index\.ts` or `index\.tsx`[^.]*or a subpath `index\.ts` or `index\.tsx`[^.]*cross-domain entrypoint/i,
  );
  assert.match(structure, /an `index` file only re-exports/i);
  assert.match(structure, /never imports its own folder's `\.\/index`/i);
  assert.match(structure, /one domain folder with subpaths/i);
  assert.match(structure, /`ui\/` is exempt/i);
  assert.match(
    structure,
    /layer root is `src\/` when it exists, else the package root/i,
  );
  assert.match(
    structure,
    /any other top-level folder under the layer root is an error/i,
  );
  assert.match(
    structure,
    /in a monorepo[^.]*shared UI package[^.]*app-local `ui\/` folder is an error/i,
  );
  assert.match(
    structure,
    /single-package repository[^.]*`src\/ui\/` is the lowest layer/i,
  );
  assert.match(structure, /test and story files follow the same rules/i);
  assert.match(structure, /`\.test\.`, `\.spec\.` or `\.stories\.`/);
  assert.match(structure, /references\/migration\.md|\(migration\.md\)/);
  assert.doesNotMatch(structure, /\bReact\b|\bJSX\b|component splitting/);
});

test("agnostic reference owns the Lint Rules table that frontend-layers implements", () => {
  const lintRules = section(
    read(`${root}/references/structure.md`),
    "Lint Rules",
  );

  assert.equal(
    tableRows(lintRules).filter((row) => row.every((cell) => /^-+$/.test(cell)))
      .length,
    1,
    "one table under ## Lint Rules",
  );
  assert.deepEqual(
    firstColumn(lintRules),
    lintRuleIds.map((id) => `\`${id}\``),
  );
  for (const [, meaning] of tableRows(lintRules).slice(2)) {
    assert.ok(meaning, "each rule states when it is an error");
  }
  assert.match(lintRules, /`frontend-layers`[^.]*implements this table/i);
  assert.match(lintRules, /`react-frontend-layers`[^.]*`react` Pack/i);
  assert.match(lintRules, /this table is the authority/i);
});

test("migration reference maps the composition-layer model to the entities layer model", () => {
  const skill = prose(`${root}/SKILL.md`);
  const migration = prose(`${root}/references/migration.md`);

  assert.match(skill, /\(references\/migration\.md\)/);
  assert.match(skill, /`modules\/<domain>`[^.]*`composition\/<surface>\/`[^.]*`mock\*`/i);
  for (const [from, to] of [
    ["`modules/<domain>/`", "`entities/<entity>/`"],
    ["`composition/<surface>/shell/`", "`composition/routing/shells/<name>/`"],
    ["`composition/<surface>/pages/<page>/`", "`composition/routing/pages/<page>/`"],
    ["`integrations/<mock-or-fake>/`", "`simulated/`"],
    ["`integrations/<server-reader>/`", "`remote/server.ts`"],
  ]) {
    assert.ok(migration.includes(from), `migration map lacks ${from}`);
    assert.ok(migration.includes(to), `migration map lacks ${to}`);
  }
  assert.match(migration, /feature-scoped providers[^.]*move into their Feature/i);
  assert.match(migration, /agnostic code[^.]*stays in `modules\/`/i);
});

test("agnostic guidance classifies domain worthiness and recursive boundaries", () => {
  const structure = prose(`${root}/references/structure.md`);

  assert.match(structure, /invariant owner/i);
  assert.match(structure, /smallest stable domain/i);
  assert.match(structure, /scan (?:the )?siblings/i);
  assert.match(structure, /cosmetic[^.]*micro-(?:feature|entity|module)/i);
  assert.match(structure, /one-file folder/i);
  assert.match(
    structure,
    /real consumers in more than one application belongs to a shared package/i,
  );
  assert.match(structure, /two Shells of one app[^.]*Feature, Entity or Module/i);
  assert.match(structure, /recursive[^.]*semantic/i);
  assert.match(structure, /deliberate public entrypoint/i);
  assert.match(structure, /cross-domain deep imports/i);
  assert.match(structure, /cycles/i);
});

test("React guidance places Composition and splits by responsibility", () => {
  const react = prose(`${root}/references/react/structure.md`);

  assert.match(react, /`composition\/providers\/`/);
  assert.match(react, /`composition\/routing\/shells\/<name>\/`/);
  assert.match(react, /`composition\/routing\/pages\/<page>\/`/);
  assert.match(
    react,
    /page template exports its page component[^.]*optional `generateMetadata`[^.]*loader functions/i,
  );
  assert.match(react, /route file only connects them/i);
  assert.match(react, /`index\.tsx` only re-exports/i);
  assert.match(react, /feature-scoped context[^.]*provider[^.]*stays in that Feature/i);
  assert.doesNotMatch(react, /`composition\/<surface>\/`|\bSurface\b/);
  assert.doesNotMatch(
    react,
    /peer-feature exception|providers stay in an app-local module|does not mandate architecture tests|Framework folders vary/i,
  );

  assert.match(react, /responsibility[^.]*test seam/i);
  assert.match(react, /thin orchestration shell/i);
  assert.match(react, /display-ready props/i);
  assert.match(
    react,
    /custom hook owns cohesive state, query, mutation, or workflow logic/i,
  );
  assert.match(react, /pure utilities/i);
  assert.match(react, /tiny[^.]*private[^.]*related JSX[^.]*local/i);
  assert.match(react, /co-locate[^.]*tiny[^.]*related render helpers/i);
  assert.match(react, /separate file[^.]*independent responsibility/i);
  assert.match(react, /focused behavior tests/i);
  assert.match(react, /owning component, hook, model, or feature seam/i);
  assert.match(react, /narrow(?:est)? validation/i);
  assert.doesNotMatch(
    react,
    /(?:always|unconditionally) (?:split|extract)|(?:split|extract) every (?:component|JSX|helper)/i,
  );
});
