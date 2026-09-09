import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, writeFileSync, mkdirSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const collector = fileURLToPath(new URL('./fixtures/v43/admission/collect.py', import.meta.url));
const run = (setup) => {
  const dir = mkdtempSync(join(tmpdir(), 'v43-observation-test-'));
  try {
    mkdirSync(join(dir, 'rollouts'));
    writeFileSync(join(dir, 'events.jsonl'), JSON.stringify({ type: 'thread.started', thread_id: 'root' }) + '\n');
    setup(dir);
    const script = `import importlib.util,json; s=importlib.util.spec_from_file_location('collector', ${JSON.stringify(collector)}); m=importlib.util.module_from_spec(s); s.loader.exec_module(m); print(json.dumps(m.collect(${JSON.stringify(join(dir, 'events.jsonl'))}, ${JSON.stringify(join(dir, 'rollouts'))})))`;
    const result = spawnSync('python3', ['-B', '-c', script], { encoding: 'utf8' });
    assert.equal(result.status, 0, result.stderr);
    return JSON.parse(result.stdout);
  } finally { rmSync(dir, { recursive: true, force: true }); }
};
const usage = (input) => ({ type: 'event_msg', payload: { type: 'token_count', info: { total_token_usage: { input_tokens: input, cached_input_tokens: 4, output_tokens: 3, reasoning_output_tokens: 1 } } } });
const rollout = (dir, id, parent, rows) => writeFileSync(join(dir, 'rollouts', `rollout-${id}.jsonl`), [{ type: 'session_meta', payload: { id, parent_thread_id: parent } }, ...rows].map(JSON.stringify).join('\n'));

test('missing native rollout preserves unknown usage rather than reporting zero', () => {
  const result = run(() => {});
  assert.equal(result.observed_session_token_subtotal.input_tokens, null);
  assert.equal(result.telemetry_complete, false);
  assert.match(result.unknown.join('\n'), /No native rollout/);
});

test('cumulative notifications count once and observed grandchildren are attributed separately', () => {
  const result = run((dir) => {
    rollout(dir, 'root', null, [usage(10), usage(20), usage(20)]);
    rollout(dir, 'child', 'root', [usage(12)]);
    rollout(dir, 'grandchild', 'child', [usage(14)]);
    rollout(dir, 'unrelated', null, [usage(1000)]);
  });
  assert.equal(result.sessions.length, 3);
  assert.equal(result.observed_session_token_subtotal.input_tokens, 46);
  assert.equal(result.observed_session_token_subtotal.noncached_input_tokens, 34);
  assert.equal(result.all_descendants_token_total, null);
  assert.equal(result.admission, 'unassessed');
});

test('counter reset or missing category cannot become complete token evidence', () => {
  const result = run((dir) => rollout(dir, 'root', null, [usage(20), usage(10)]));
  assert.equal(result.observed_session_token_subtotal.input_tokens, null);
  assert.match(result.unknown.join('\n'), /counter reset/);
});

test('opaque nested execution never invents operation or loaded-byte totals', () => {
  const result = run((dir) => rollout(dir, 'root', null, [usage(10), { type: 'response_item', payload: { type: 'custom_tool_call', call_id: 'call1', name: 'exec', input: 'opaque' } }]));
  assert.equal(result.sessions[0].operations.shell, null);
  assert.equal(result.sessions[0].loaded_file_bytes, null);
  assert.match(result.unknown.join('\n'), /nested exec/);
});

test('native stdout usage retains reasoning and line provenance without inventing descendant closure', () => {
  const result = run((dir) => writeFileSync(join(dir, 'events.jsonl'), [
    { type: 'thread.started', thread_id: 'root' },
    { type: 'turn.completed', usage: { input_tokens: 100, cached_input_tokens: 80, output_tokens: 12, reasoning_output_tokens: 4 } },
  ].map(JSON.stringify).join('\n')));
  assert.equal(result.root_stdout_usage_records[0].line, 2);
  assert.equal(result.root_stdout_usage_records[0].usage.reasoning_output_tokens, 4);
  assert.equal(result.all_descendants_token_total, null);
});
