import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const root = new URL('../skills/', import.meta.url);
const read = (path) => readFileSync(new URL(path, root), 'utf8');
const scope = read('agnostic/planning/implement-spec/references/validation-scope.md');
const implement = read('agnostic/planning/implement-spec/SKILL.md');
const lifecycle = read('agnostic/planning/implement-spec/references/lifecycle.md');
const runtime = read('agnostic/planning/implement-spec/references/runtime-product-validation.md');
const worker = read('agnostic/planning/implement-spec/references/parallel-worker-brief.md');
const plan = read('agnostic/planning/create-plan/SKILL.md');
const verifier = read('agnostic/planning/verify-behavior/SKILL.md');
const creator = read('agnostic/planning/create-verification-skill/SKILL.md');
const updater = read('agnostic/planning/update-verification-skill/SKILL.md');
const closeout = read('phases/delivery-phase/phases/closeout.md');
const debugging = read('phases/debugging-phase/SKILL.md');

test('local validation is focused and broadens only on named triggers', () => {
  assert.match(scope, /focused tests for the changed behavior/);
  assert.match(scope, /type and lint checks for the affected workspaces/);
  assert.match(scope, /concrete changed dependency, a focused\nfailure, or an explicit user request/);
  assert.match(scope, /Rerun a check only when its relevant\ninputs changed/);
  assert.match(scope, /an\nunchanged-baseline run is never the classifier/);
});

test('CI owns broad regression with one local broad run fallback', () => {
  assert.match(scope, /CI is the only fresh\nrun/);
  assert.match(scope, /one \*\*local broad run\*\* covering only what CI lacks/);
  assert.match(scope, /Report it as\na local broad run, never as a CI result/);
  assert.match(closeout, /await its CI result and report it per check/);
  assert.match(closeout, /Focused checks never report as a\n  full-suite pass/);
});

test('verification tiers and Owned Stack reuse have one source', () => {
  assert.match(scope, /\*\*Tier 1\*\*: saved receipts and pure-helper checks/);
  assert.match(scope, /Saved receipts never replace current runtime acceptance/);
  assert.match(scope, /Relaunch only when a reset cannot\nrestore known owned state/);
  assert.match(runtime, /Reuse the delivery's Owned Stack after a controlled reset/);
  for (const doc of [implement, lifecycle, runtime, worker, plan]) {
    assert.match(doc, /validation-scope\.md/);
  }
  for (const doc of [closeout, debugging]) {
    assert.match(doc, /`implement-spec`'s\s+`references\/validation-scope\.md`/);
  }
  assert.doesNotMatch(worker, /extra plan validation when feasible/);
});

test('verifier scopes to the plan and returns all its evidence', () => {
  assert.doesNotMatch(verifier, /Cover every in-scope observable story/);
  assert.match(verifier, /Cover the stories the caller's plan\n   changes/);
  assert.match(verifier, /\*\*Observation Manifest\*\*/);
  assert.match(verifier, /generated DTOs and the source predicates/);
  assert.match(verifier, /\*\*speculative\*\*: an assumption no requirement or contract supports/);
  assert.match(verifier, /Capture every manifest observation before evaluating assertions/);
  assert.match(verifier, /let the independent observations and\n   checks of the run complete/);
  assert.match(verifier, /Partial evidence is never a full pass/);
  assert.match(creator, /Observation Manifest from the generated DTOs/);
  assert.match(updater, /Missing Observation Manifest or expectation class/);
});

test('expensive reruns need a New Discriminator', () => {
  assert.match(scope, /state its \*\*New\nDiscriminator\*\*/);
  assert.match(scope, /When the same observation is missing again, revise the diagnostic plan/);
  assert.match(debugging, /state its New Discriminator/);
});
