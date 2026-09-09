"""Readonly native admission measurement. No execution, scheduling, or admission decision."""
import argparse
import hashlib
import json
from pathlib import Path
from datetime import datetime

TOKEN_FIELDS = ('input_tokens', 'cached_input_tokens', 'output_tokens', 'reasoning_output_tokens')

def records(path):
    return [(i, json.loads(line)) for i, line in enumerate(Path(path).read_text().splitlines(), 1) if line.strip()]

def stamp(value):
    return datetime.fromisoformat(value.replace('Z', '+00:00')).timestamp()

def collect(events_path, rollout_directory):
    events = records(events_path)
    roots = {r['thread_id'] for _, r in events if r.get('type') == 'thread.started'}
    if len(roots) != 1:
        raise ValueError('Exactly one emitted root thread identity required')
    root = next(iter(roots))
    stdout_usage = [{'line': line, 'usage': row['usage']} for line, row in events if row.get('type') == 'turn.completed' and isinstance(row.get('usage'), dict)]
    sessions = {}
    for path in sorted(Path(rollout_directory).rglob('rollout-*.jsonl')):
        try:
            rows = records(path)
        except (json.JSONDecodeError, OSError):
            # Concurrent unrelated sessions can have a partial final write.
            # If this is a required thread it remains missing, never a zero subtotal.
            continue
        meta = next((r['payload'] for _, r in rows if r.get('type') == 'session_meta'), None)
        if meta:
            identifier = meta.get('id')
            source = meta.get('source', {})
            spawn = source.get('subagent', {}).get('thread_spawn', {}) if isinstance(source, dict) else {}
            parent = meta.get('parent_thread_id') or spawn.get('parent_thread_id')
            if identifier in sessions:
                raise ValueError('Duplicate rollout identity requires explicit reconciliation: ' + str(identifier))
            sessions[identifier] = (path, rows, parent)
    selected = {root}
    while True:
        descendants = {key for key, (_, _, parent) in sessions.items() if parent in selected}
        if descendants <= selected:
            break
        selected |= descendants
    unknown = []
    per_session = []
    for identifier in sorted(selected):
        if identifier not in sessions:
            unknown.append(f'No native rollout for emitted thread {identifier}')
            continue
        path, rows, parent = sessions[identifier]
        counts = [(i, r) for i, r in rows if r.get('type') == 'event_msg' and r.get('payload', {}).get('type') == 'token_count' and r.get('payload', {}).get('info')]
        usages = [(i, r['payload']['info'].get('total_token_usage', {})) for i, r in counts]
        tokens = {key: None for key in TOKEN_FIELDS}
        if usages and all(all(isinstance(u.get(k), int) and u[k] >= 0 for k in TOKEN_FIELDS) for _, u in usages):
            # These are cumulative session totals; summing repeated notifications double-counts usage.
            monotonic = all(all(b[k] >= a[k] for k in TOKEN_FIELDS) for (_, a), (_, b) in zip(usages, usages[1:]))
            if monotonic:
                tokens = {key: usages[-1][1][key] for key in TOKEN_FIELDS}
            else:
                unknown.append(f'{identifier}: cumulative token counter reset; resume attribution needs reconciliation')
        else:
            unknown.append(f'{identifier}: required native token categories absent')
        tokens['noncached_input_tokens'] = tokens['input_tokens'] - tokens['cached_input_tokens'] if tokens['input_tokens'] is not None and tokens['cached_input_tokens'] is not None and tokens['input_tokens'] >= tokens['cached_input_tokens'] else None
        operations = {'shell': 0, 'provider': 0, 'wait': 0, 'spawn': 0, 'followup': 0}
        operation_provenance = []
        opaque_calls = []
        call_ids = set()
        starts, finishes = [], []
        for line, row in rows:
            payload = row.get('payload', {})
            typ = payload.get('type')
            if row.get('type') == 'event_msg' and typ == 'task_started': starts.append(row['timestamp'])
            if row.get('type') == 'event_msg' and typ == 'task_complete': finishes.append(row['timestamp'])
            if typ not in ('function_call', 'custom_tool_call'): continue
            cid = payload.get('call_id') or payload.get('id')
            if cid is None:
                unknown.append(f'{identifier}:{line}: operation has no deduplication identity')
                continue
            if cid in call_ids: continue
            call_ids.add(cid)
            name = payload.get('name', '')
            category = None
            if name in ('exec_command', 'shell', 'shell_command'): category = 'shell'
            elif name in ('spawn_agent',): category = 'spawn'
            elif name in ('followup_task', 'send_input', 'send_message'): category = 'followup'
            elif name in ('wait', 'wait_agent', 'wait_threads', 'write_stdin', 'sleep'): category = 'wait'
            elif name.startswith('mcp__'): category = 'provider'
            elif name == 'exec': opaque_calls.append(line)
            if category:
                operations[category] += 1
                operation_provenance.append({'line': line, 'call_id': cid, 'category': category})
        if opaque_calls:
            unknown.append(f'{identifier}: nested exec tool operations need native expansion at lines {opaque_calls}')
            operations = {key: None for key in operations}
        # Session parent identities enumerate observed descendants only; spawning results must independently close the set.
        per_session.append({'thread_id': identifier, 'parent_thread_id': parent, 'rollout': str(path), 'sha256': hashlib.sha256(path.read_bytes()).hexdigest(), 'tokens': tokens, 'token_source_lines': [i for i, _ in usages], 'operations': operations, 'operation_provenance': operation_provenance, 'observed_turn_starts': len(starts), 'resumptions': None, 'compactions': sum(1 for _, r in rows if r.get('type') == 'compacted' or (r.get('type') == 'event_msg' and r.get('payload', {}).get('type') == 'context_compacted')), 'first_to_last_elapsed_seconds': stamp(finishes[-1]) - stamp(starts[0]) if starts and finishes and len(starts) == len(finishes) else None, 'loaded_file_bytes': None})
    unknown.extend(['All-descendant closure needs decoded spawn-result identities and terminal outcomes; metadata alone is insufficient', 'Resumptions need invocation/session lineage, not turn count', 'Actual loaded-file bytes need native file-load evidence; source sizes and shell-output sizes are not substitutes', 'Root active elapsed excluding waits needs native wait interval attribution', 'Assurance requires independent gate and seeded-defect adjudication'])
    observed_totals = {key: sum(s['tokens'][key] for s in per_session) if per_session and all(s['tokens'][key] is not None for s in per_session) else None for key in (*TOKEN_FIELDS, 'noncached_input_tokens')}
    return {'schema': 'v43-native-observation-v1', 'root_thread_id': root, 'root_stdout_usage_records': stdout_usage, 'sessions': per_session, 'observed_session_token_subtotal': observed_totals, 'all_descendants_token_total': None, 'telemetry_complete': False, 'unknown': unknown, 'admission': 'unassessed', 'source': {'events': str(events_path), 'sha256': hashlib.sha256(Path(events_path).read_bytes()).hexdigest()}}

if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--events', required=True)
    parser.add_argument('--rollouts', required=True)
    parser.add_argument('--out', required=True)
    args = parser.parse_args()
    Path(args.out).write_text(json.dumps(collect(args.events, args.rollouts), indent=2) + '\n')
