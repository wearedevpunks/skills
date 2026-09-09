import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
const source = (relative) => readFile(new URL(`../skills/${relative}`, import.meta.url), 'utf8');
test('scaffold and update select one authoritative preservation rule', async () => {
  const text = await source('agnostic/cli/hi-cli/references/post-command-flow.md');
  assert.equal(text.match(/^## Project Verifier preservation$/gm)?.length, 1);
  assert.equal(text.match(/\]\(#project-verifier-preservation\)/g)?.length, 2);
  assert.match(text, /byte-for-byte/);
  assert.match(text, /Keep an absent Project Verifier absent/);
  assert.match(text, /never invoke `create-verification-skill` or `update-verification-skill`/);
});
test('docs navigation reaches the authoritative read-only boundary', async () => {
  const router = await source('phases/docs-ingest-phase/SKILL.md');
  const wiki = await source('phases/docs-ingest-phase/references/wiki-ingest.md');
  assert.match(router, /Feature Maps as read-only navigation inputs/);
  assert.match(router, /never creates, edits, regenerates, or maintains Feature Maps/);
  assert.match(router, /invokes either verification lifecycle skill, or performs a verifier audit/);
  assert.match(wiki, /\.\.\/SKILL.md#project-verifier-boundary/);
  assert.match(wiki, /even when the ingested source describes changed behavior/);
});
