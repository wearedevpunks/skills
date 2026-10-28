import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolveInstalled } from './helpers/installed-layout.mjs';
const root = new URL('../', import.meta.url);
const lifecycle = readFileSync(new URL('skills/agnostic/planning/implement-spec/references/lifecycle.md', root), 'utf8');
const review = readFileSync(new URL('skills/phases/delivery-phase/phases/review.md', root), 'utf8');
test('draft visibility and implementation proof stay at their public seams', () => {
  for (const phrase of ['first meaningful in-scope commit', 'Search by recorded head', 'exact provider readback', 'final acceptance evidence']) assert.ok(lifecycle.includes(phrase), phrase);
});
test('review completion, repair and risk policy remain explicit', () => {
  for (const phrase of ['two completed passes', 'Focused Repair Validation', 'two Axis Runs with Engine\nFallback', 'review-phase/references/routing.md', '--accepted-risk', '--human-direction', 'incomplete', 'semantic input change', 'stagnant loop']) assert.ok(review.toLowerCase().includes(phrase.toLowerCase()), phrase);
  assert.doesNotMatch(review, /review_count\s*[<>]=?\s*3/);
});
test('cross-skill protocol links resolve', () => {
  for (const [file, body] of [['skills/agnostic/planning/implement-spec/references/lifecycle.md', lifecycle], ['skills/phases/delivery-phase/phases/review.md', review]]) {
    for (const match of body.matchAll(/\]\(([^)]+\.md)\)/g)) assert.ok(resolveInstalled(file, match[1]) !== undefined, match[1]);
  }
});
