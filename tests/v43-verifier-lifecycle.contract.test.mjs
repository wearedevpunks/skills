import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const root = new URL('../skills/agnostic/planning/', import.meta.url);
const read = (path) => readFileSync(new URL(path, root), 'utf8');
const creator = read('create-verification-skill/SKILL.md');
const updater = read('update-verification-skill/SKILL.md');
const runtime = read('implement-spec/references/runtime-product-validation.md');

test('distinct discoverable lifecycle skills retain one portable entrypoint', () => {
  assert.match(creator, /description:.*Uncovered Surface/);
  assert.match(updater, /description:.*Uncovered Behavior/);
  for (const skill of [creator, updater]) {
    assert.doesNotMatch(skill, /disable-model-invocation: true/);
    assert.match(skill, /verify-behavior/);
    assert.match(skill, /\.agents\/skills\/verify-behavior\/references\//);
  }
});

test('creator readiness requires complete live smoke and retained evidence', () => {
  for (const term of ['Interview', 'wiki', 'Doctor', 'Scenario Falsifier', 'Cleanup',
    'Reference Smoke Proof', 'blocked', 'authority/code/runtime/scenario']) {
    assert.ok(creator.includes(term), term);
  }
  assert.match(creator, /confirm\nthat retained evidence still exists/);
  assert.match(creator, /original scenario and affected criteria stay\nblocked/);
});

test('targeted updater preserves ownership and truthful outcomes', () => {
  assert.match(updater, /exactly one of `unchanged`, `updated`, `blocked`, `product-failure`/);
  assert.match(updater, /Preserve unrelated app references, features, journeys and helpers byte-for-byte/);
  assert.match(updater, /Retire an obsolete entry only when current source proves obsolescence/);
  assert.match(updater, /all affected index\/journey\/helper references\n   are reconciled/);
  assert.match(updater, /retry once/);
  assert.match(updater, /debugging-phase/);
  assert.match(updater, /Live proof is required even/);
});

test('implementation resumes original scenario only with complete matching proof', () => {
  assert.match(runtime, /Uncovered Surface.*create-verification-skill/);
  assert.match(runtime, /Uncovered Behavior.*update-verification-skill/);
  assert.match(runtime, /authority, code, runtime and\nscenario identities/);
  assert.match(runtime, /Reuse only complete\nmatching proof/);
  assert.match(runtime, /missing proof before\nclassifying affected acceptance/);
  assert.match(runtime, /Code Review consumes retained evidence without executing/);
});

test('failed drive restores owned state before renewed Doctor and retry', () => {
  assert.match(creator, /restore known owned state,\nthen renew Doctor before another Drive/);
  assert.match(updater, /restore known owned state \(reset\/relaunch\nwhen needed\), then renew Doctor before another Drive/);
});
