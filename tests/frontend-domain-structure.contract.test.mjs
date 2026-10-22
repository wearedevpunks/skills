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
  "public-entrypoint",
  "no-prototype-folder",
  "known-top-level",
  "ui-placement",
];
const lintRuleId = new RegExp(lintRuleIds.join("|"));

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
  assert.match(skill, /description:[^\n]*\n[^\n]*composition layer/i);
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

  assert.match(metadata, /composition layer/i);
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
  ]) {
    assert.doesNotMatch(text, lintRuleId, `${path} repeats a Lint Rules id`);
  }
});

test("agnostic reference fixes the layer model with Composition on top", () => {
  const structure = prose(`${root}/references/structure.md`);

  assert.deepEqual(firstColumn(section(read(`${root}/references/structure.md`), "Layers")), [
    "`app/` or `routes/`",
    "`composition/`",
    "`features/`",
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
    /only `integrations\/` imports `server\/`[^.]*server public entrypoints/i,
  );
  assert.match(structure, /`app\/api\/` handlers import only `server\/`/i);
  assert.doesNotMatch(structure, /These labels may differ between projects/i);

  assert.match(
    structure,
    /Composition owns app-wide providers, Surface shells, page templates,? and cross-feature registries/i,
  );
  assert.match(
    structure,
    /first level[^.]*`providers\/` plus one folder per Surface/i,
  );
  assert.match(structure, /inside a Surface[^.]*`shell\/` and `pages\/<page>\/`/i);

  assert.match(structure, /a Feature never imports another Feature/i);
  assert.match(
    structure,
    /nearest composition[^.]*connects them through props, slots,? or callbacks/i,
  );
  assert.doesNotMatch(
    structure,
    /highly discouraged|peer-feature exception|permit one only/i,
  );
  assert.match(
    structure,
    /shell parts that features consume[^.]*are Modules[^.]*shell assembly is Composition/i,
  );
  assert.match(
    structure,
    /mock data, demo data,? and fake runtimes are Integrations/i,
  );
  assert.match(structure, /no production UI[^.]*folder named "prototype"/i);

  assert.match(structure, /a domain is the first folder under a layer/i);
  assert.match(
    structure,
    /`index\.ts` or `index\.tsx`[^.]*only cross-domain entrypoint/i,
  );
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

test("agnostic guidance classifies domain worthiness and recursive boundaries", () => {
  const structure = prose(`${root}/references/structure.md`);

  assert.match(structure, /invariant owner/i);
  assert.match(structure, /smallest stable domain/i);
  assert.match(structure, /scan (?:the )?siblings/i);
  assert.match(structure, /cosmetic[^.]*micro-(?:feature|module)/i);
  assert.match(structure, /one-file folder/i);
  assert.match(
    structure,
    /real consumers in more than one application belongs to a shared package/i,
  );
  assert.match(structure, /two Surfaces of one app[^.]*Feature or Module/i);
  assert.match(structure, /recursive[^.]*semantic/i);
  assert.match(structure, /deliberate public entrypoint/i);
  assert.match(structure, /cross-domain deep imports/i);
  assert.match(structure, /cycles/i);
});

test("React guidance places Composition and splits by responsibility", () => {
  const react = prose(`${root}/references/react/structure.md`);

  assert.match(react, /`composition\/providers\/`/);
  assert.match(react, /shells and page templates[^.]*`composition\/<surface>\/`/i);
  assert.match(
    react,
    /page template exports its page component[^.]*optional `generateMetadata`[^.]*loader functions/i,
  );
  assert.match(react, /route file only connects them/i);
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
