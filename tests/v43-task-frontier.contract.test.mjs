import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import assert from 'node:assert/strict';

const root = new URL('../', import.meta.url);
const read = (path) => readFileSync(new URL(path, root), 'utf8');
const orchestration = read('skills/agnostic/planning/implement-spec/references/parallel-orchestration.md');
test('frontier contract preserves parent gate, custody, stability and capacity obligations', () => {
  for (const phrase of ['passed`, `repair_required` or `blocked', 'Capture the Relevant Input Set before and after checks', 'complete eligible frontier', 'Capacity one delegates one worker', 'zero records a capacity blocker', 'proves the old writer has stopped', 'relevant typecheck and lint passed', 'missing, malformed or unsupported result']) {
    assert.ok(orchestration.includes(phrase), phrase);
  }
});
test('architecture keeps cumulative closure with dependency-local consumption gates', () => {
  const architecture = read('skills/agnostic/planning/implement-spec/references/architecture-conformance.md');
  for (const phrase of ['Independent safe', 'Reconcile parent-owned shared summaries', 'every Responsibility Acceptance Criterion', 'entire migration ledger is empty', 'zero drift']) assert.ok(architecture.includes(phrase), phrase);
  assert.ok(!architecture.includes('before\ncomputing the next wave'));
});
test('installed swarm-planner copies share the canonical planning contract', () => {
  const canonical = read('skills/agnostic/planning/swarm-planner/SKILL.md');
  const legacy = read('skills/agnostic/subagents/swarm-planner/SKILL.md').replace('../../planning/create-plan/', '../create-plan/');
  assert.equal(canonical, legacy);
  for (const field of ['read_dependencies', 'shared_runtime_resources', 'relevant_input_set']) assert.ok(canonical.includes(field));
});
