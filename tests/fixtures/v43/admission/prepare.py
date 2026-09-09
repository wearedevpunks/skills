"""Freeze source bytes and prepare disposable repositories; never execute native agents."""
import argparse
import hashlib
import json
import os
from pathlib import Path
import shutil
import subprocess
import tarfile
import tempfile

BASELINE = '584ea4bddd5bcfcf780baf9fb67ff736ba7d0626'

def git(root, *args):
    return subprocess.check_output(['git', '-C', str(root), *args])

def entry(root, path):
    if path.is_symlink():
        target = os.readlink(path)
        if not path.resolve().is_relative_to(root.resolve()) or not path.exists():
            raise ValueError('Unclosed source symlink: ' + str(path))
        return {'path': str(path.relative_to(root)), 'symlink': target}
    return {'path': str(path.relative_to(root)), 'sha256': hashlib.sha256(path.read_bytes()).hexdigest(), 'bytes': path.stat().st_size, 'executable': bool(path.stat().st_mode & 0o111)}

def manifest(root, paths=None):
    candidates = sorted(root.rglob('*')) if paths is None else sorted(paths)
    rows = [entry(root, path) for path in candidates if '.git' not in path.relative_to(root).parts and (path.is_symlink() or path.is_file())]
    return {'files': rows, 'sha256': hashlib.sha256(json.dumps(rows, sort_keys=True, separators=(',', ':')).encode()).hexdigest()}

def working_paths(source):
    names = git(source, 'ls-files', '-z', '--cached', '--others', '--exclude-standard').decode().split('\0')
    return [source / name for name in sorted(set(filter(None, names))) if (source / name).exists() or (source / name).is_symlink()]

def freeze(source, destination):
    if git(source, 'branch', '--show-current').decode().strip() != 'main': raise ValueError('Canonical source must be main')
    before = manifest(source, working_paths(source))
    destination.mkdir(parents=True, exist_ok=False)
    baseline = destination / 'baseline'
    baseline.mkdir()
    with tempfile.TemporaryFile() as archive:
        subprocess.run(['git', '-C', str(source), 'archive', BASELINE], stdout=archive, check=True)
        archive.seek(0)
        with tarfile.open(fileobj=archive) as tar: tar.extractall(baseline, filter='data')
    candidate = destination / 'candidate'
    candidate.mkdir()
    for row in before['files']:
        origin = source / row['path']
        target = candidate / row['path']
        target.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(origin, target, follow_symlinks=False)
    if manifest(candidate) != before or manifest(source, working_paths(source)) != before:
        raise ValueError('Candidate changed during snapshot; discard this unmeasured freeze')
    result = {'baseline_commit': BASELINE, 'candidate_head': git(source, 'rev-parse', 'HEAD').decode().strip(), 'baseline': manifest(baseline), 'candidate': manifest(candidate)}
    (destination / 'source-manifests.json').write_text(json.dumps(result, indent=2) + '\n')
    for root in (baseline, candidate):
        for path in root.rglob('*'):
            if path.is_file() and not path.is_symlink(): path.chmod(0o555 if path.stat().st_mode & 0o111 else 0o444)
    return result

def prepare(sources, destination, variant, fixture, seed=None, branch=None, seed_commit=None, seed_tree=None):
    if fixture != 'full-small': raise ValueError('Only full-small is execution-ready; other matrix entries remain pending')
    source = sources / variant
    frozen = json.loads((sources / 'source-manifests.json').read_text())[variant]
    if manifest(source) != frozen: raise ValueError('Frozen source bytes changed')
    template = Path(__file__).parent / 'full-small'
    if seed is None:
        shutil.copytree(template, destination)
        git(destination, 'init', '-b', 'team/stefan/admission')
        git(destination, 'add', '.')
        git(destination, '-c', 'user.name=Admission fixture', '-c', 'user.email=fixture@example.invalid', 'commit', '-m', 'test: freeze accepted delivery fixture')
    else:
        if not branch or not seed_commit or not seed_tree:
            raise ValueError('Remote-backed fixture requires run branch and exact seed commit/tree')
        subprocess.run(['git', 'clone', '--no-hardlinks', str(seed), str(destination)], check=True, stdout=subprocess.PIPE)
        if git(destination, 'rev-parse', seed_commit + '^{tree}').decode().strip() != seed_tree:
            raise ValueError('Seed commit/tree mismatch')
        git(destination, 'checkout', '-b', branch, seed_commit)
        if git(destination, 'rev-parse', 'HEAD').decode().strip() != seed_commit:
            raise ValueError('Prepared HEAD differs from frozen seed')
    skills = destination / '.agents' / 'skills'
    skills.mkdir(parents=True)
    for skill in sorted(source.glob('skills/**/SKILL.md')):
        link = skills / skill.parent.name
        if link.exists():
            # Preserve both canonical authorities; stable first path keeps the ordinary name.
            link = skills / ('--'.join(skill.parent.relative_to(source / 'skills').parts))
        shutil.copytree(skill.parent, link)
        for path in link.rglob('*'):
            if path.is_file(): path.chmod(0o755 if path.stat().st_mode & 0o111 else 0o644)
    result = {'variant': variant, 'fixture': fixture, 'source_manifest_sha256': frozen['sha256'], 'fixture_tree': git(destination, 'rev-parse', 'HEAD^{tree}').decode().strip(), 'accepted_artifact_manifest': manifest(template), 'repository': str(destination)}
    return result

if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    commands = parser.add_subparsers(dest='command', required=True)
    f = commands.add_parser('freeze')
    f.add_argument('--source', type=Path, required=True)
    f.add_argument('--out', type=Path, required=True)
    p = commands.add_parser('fixture')
    p.add_argument('--sources', type=Path, required=True)
    p.add_argument('--out', type=Path, required=True)
    p.add_argument('--variant', choices=['baseline', 'candidate'], required=True)
    p.add_argument('--fixture', required=True)
    p.add_argument('--seed', type=Path)
    p.add_argument('--branch')
    p.add_argument('--seed-commit')
    p.add_argument('--seed-tree')
    args = parser.parse_args()
    print(json.dumps(freeze(args.source, args.out) if args.command == 'freeze' else prepare(args.sources, args.out, args.variant, args.fixture, args.seed, args.branch, args.seed_commit, args.seed_tree), indent=2))
