import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const root = new URL('../skills/agnostic/planning/', import.meta.url);
const read = (path) => readFile(new URL(path, root), 'utf8');

test('task context retains execution kernel and source freshness at its public seam', async () => {
  const brief = await read('implement-spec/references/parallel-worker-brief.md');
  for (const term of ['task id/name', 'provider identity', 'dependencies', 'intended outcome',
    'acceptance references', 'execution status', 'Active Write Scope', 'Relevant Input Set',
    'RED/GREEN', 'Architecture Checkpoint', 'Context Pointers', 'Derived Context Excerpt',
    'source revision or content digest', 'excerpt/source mismatch']) assert.ok(brief.includes(term), term);
  assert.match(brief, /timestamp\s+alone cannot detect changed inputs/);
  assert.match(brief, /exact blocked Task Result/);
});

test('only parent reconciles canonical records and cumulative barriers wait', async () => {
  const brief = await read('implement-spec/references/parallel-worker-brief.md');
  assert.match(brief, /`ready_for_gate \| blocked`/);
  assert.match(brief, /`passed \| repair_required \| blocked`/);
  assert.match(brief, /`IMPLEMENTATION-NOTES.md` remain parent-only writes/);
  assert.match(brief, /passed Task Gate can release safe\s+dependents/);
  assert.match(brief, /summary reconciliation\s+is pending/);
  assert.match(brief, /Before an applicable Architecture Checkpoint, reconcile every contributing result/);
  assert.match(brief, /Finalization requires all results reconciled/);
  assert.match(brief, /one skill-application evidence record for every forwarded guidance item/);
  assert.doesNotMatch(brief, /its plan-entry updates|updating the plan entry/);
});

test('planning and notes consume the context/reconciliation authority', async () => {
  const [plan, notes] = await Promise.all([
    read('create-plan/SKILL.md'), read('implement-spec/assets/IMPLEMENTATION-NOTES-TEMPLATE.md'),
  ]);
  assert.match(plan, /parallel-worker-brief.md#compact-task-kernel/);
  assert.doesNotMatch(plan, /Keep `PLAN.md` self-contained: embed/);
  assert.match(notes, /parallel-worker-brief.md#parent-reconciliation/);
  for (const state of ['Parent Task Gate', 'Reconciliation', 'Final acceptance', 'Code Review'])
    assert.ok(notes.includes(state), state);
});
