import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

const read = (path) =>
  readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

const root = "skills/agnostic/frontend/frontend-domain-structure";

test("frontend domain structure triggers domain granularity and React splitting review", () => {
  const skill = read(`${root}/SKILL.md`);
  const metadata = read(`${root}/agents/openai.yaml`);
  const body = skill.replace(/^---[\s\S]*?---/u, "");

  assert.match(skill, /^name: frontend-domain-structure$/m);
  assert.doesNotMatch(skill, /disable-model-invocation/);
  assert.match(
    skill,
    /description:[\s\S]{0,700}domain (?:boundary|granularity)[\s\S]{0,700}React component splitting/i,
  );
  assert.match(skill, /references\/structure\.md/);
  assert.match(skill, /references\/react\/structure\.md/);
  assert.match(
    skill,
    /agnostic reference[\s\S]{0,120}single source of truth for domain\s+classification, layer placement, and dependency rules/i,
  );
  assert.doesNotMatch(
    body,
    /## (?:Quick Classifier|Boundary Rules|Shared Library Rule)/i,
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
  assert.doesNotMatch(body, /^\d+\. Make the smallest coherent move/gm);

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
});

test("agnostic guidance classifies domain worthiness and recursive boundaries", () => {
  const structure = read(`${root}/references/structure.md`);

  assert.match(structure, /invariant owner/i);
  assert.match(structure, /smallest stable domain/i);
  assert.match(structure, /scan (?:the )?siblings/i);
  assert.match(structure, /cosmetic[^.]*micro-(?:feature|module)/i);
  assert.match(structure, /one-file folder/i);
  assert.match(
    structure,
    /real consumers across application or surface boundaries belongs to a\s+shared library or package/i,
  );
  assert.match(
    structure,
    /shared library owns code reused across application or surface boundaries/i,
  );
  assert.match(structure, /application- or\s+surface-spanning code/i);
  assert.doesNotMatch(
    structure,
    /across application boundaries|cross-app code/i,
  );
  assert.match(structure, /recursive[^.]*semantic/i);
  assert.match(structure, /deliberate public entrypoint/i);
  assert.match(structure, /cross-domain deep imports/i);
  assert.match(structure, /cycles/i);
  assert.match(structure, /peer-feature imports are highly discouraged/i);
  assert.match(structure, /permit one only when[^.]*justified/i);
  assert.match(structure, /one-way, acyclic relationship/i);
  assert.match(structure, /imported feature's public entrypoint/i);
  assert.doesNotMatch(
    structure,
    /(?:peer|sibling|other)[ -]feature imports? (?:are )?(?:forbidden|prohibited)|features? (?:must|may|should|can) not import (?:peer|sibling|other) features?|features? never import (?:peer|sibling|other) features?/i,
  );
  assert.doesNotMatch(structure, /React|JSX|component splitting/i);
});

test("React guidance splits by responsibility and preserves cohesive local code", () => {
  const react = read(`${root}/references/react/structure.md`);

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
  assert.match(react, /architecture tests[^.]*file-count thresholds/i);
  assert.doesNotMatch(
    react,
    /(?:always|unconditionally) (?:split|extract)|(?:split|extract) every (?:component|JSX|helper)/i,
  );
});
