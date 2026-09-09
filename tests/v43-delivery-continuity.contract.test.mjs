import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const delivery = resolve(root, 'skills/phases/delivery-phase');
const read = path => readFileSync(resolve(delivery, path), 'utf8');

test('one continuity owner defines compact envelopes and fail-closed authority', () => {
  const contract = read('references/context-continuity.md');
  for (const field of ['authority_kind', 'locator', 'selector', 'identity', 'freshness_rule',
    'delivery_goal_identity', 'accepted_bounds_identity', 'git_identity', 'active_identity',
    'evidence_freshness', 'stop_condition', 'authority_or_evidence_created', 'changed_facts',
    'invalidated_evidence', 'next_eligible_phase', 'blocker_or_stop_reason']) assert.ok(contract.includes(field), field);
  assert.match(contract, /complete \| blocked \| failed \| skipped \| human_steering_required/);
  assert.match(contract, /exactly one bounded refresh/);
  assert.match(contract, /unchanged evidence cannot restart/);
  assert.match(contract, /non_authoritative: true/);
  assert.match(contract, /before\/after legacy digests match/);
});

test('phase exits and handoff point at common authority without stale review policy', () => {
  for (const name of readdirSync(resolve(delivery, 'phases'))) {
    if (!name.endsWith('.md') || name === 'review.md') continue;
    const text = read(`phases/${name}`);
    assert.match(text, /context-continuity\.md/, name);
    assert.doesNotMatch(text, /review_count < 3|fix 3|three-pass|third repair/, name);
  }
  const handoff = read('references/phase-handoff.md');
  assert.match(handoff, /receiving task always cold-routes/);
  assert.match(handoff, /unknowns:/);
  assert.match(handoff, /Post-Command Handoff/);
  assert.doesNotMatch(handoff, /After fix 3/);
  assert.match(readFileSync(resolve(root, 'skills/agnostic/generic/handoff/SKILL.md'), 'utf8'), /phase-handoff\.md#phase-exit-and-delivery-handoff/);
});

test('failure continuity consumes gate owners and preserves scoped evidence recovery', () => {
  const failure = read('references/failure-continuity.md');
  assert.match(failure, /parallel-worker-brief\.md/);
  assert.match(failure, /parallel-orchestration\.md/);
  assert.match(failure, /old worker stopped and cleanup completed/);
  assert.match(failure, /exactly one scoped repair worker/);
  assert.match(failure, /new actionable evidence/);
  assert.match(failure, /distinguish named hypotheses/);
  assert.match(failure, /weaker gates, changed requirements/);
});

test('new local relative pointers resolve to real public contracts', () => {
  const paths = ['SKILL.md','references/context-continuity.md','references/failure-continuity.md','references/phase-handoff.md', 'phases/router.md'];
  for (const path of paths) for (const match of read(path).matchAll(/\]\(([^)#]+)(?:#[^)]*)?\)/g)) {
    if (/^https?:/.test(match[1])) continue;
    assert.doesNotThrow(() => readFileSync(resolve(delivery, dirname(path), match[1])), `${path}: ${match[1]}`);
  }
});


test('planning consumes exact retained agent-ready specification and current backlog proof', () => {
  const router = read('phases/router.md');
  const gates = read('references/artifact-state.md');
  assert.match(router, /Before planning[\s\S]*agent-ready `SPEC\.md`[\s\S]*verified remote/);
  assert.match(router, /artifact-state\.md/);
  assert.match(router, /Requirements Phase before planning/);
  assert.match(gates, /readiness: agent-ready/);
  assert.match(gates, /retained ref contains the exact spec commit/);
  assert.match(gates, /bytes matching\n  the current SPEC identity/);
  assert.match(gates, /current Write Backlog result/);
  assert.match(gates, /Exact provider readback/);
  assert.match(gates, /no additional spec\n  approval or review gate/);
});
