import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { test } from "node:test";

const writers = {
  grill: new URL(
    "../skills/agnostic/requirements/requirements-grill/references/wiki-output.md",
    import.meta.url,
  ),
  spec: new URL(
    "../skills/agnostic/planning/create-spec/references/wiki-bookkeeping.md",
    import.meta.url,
  ),
};

const read = (url) => readFileSync(url, "utf8");

const slug = (heading) =>
  heading
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s-]/gu, "")
    .replace(/\s+/gu, "-");

// Returns the link targets in `text` whose path ends with `file`, after
// checking that each one resolves from `from` to an existing file and heading.
const resolvedLinks = (from, text, file) => {
  const targets = [...text.matchAll(/\]\(([^)\s]+)\)/gu)]
    .map(([, target]) => target)
    .filter((target) => target.split("#")[0].endsWith(file));
  for (const target of targets) {
    const [path, anchor] = target.split("#");
    const url = new URL(path, from);
    assert.ok(existsSync(url), `${target} resolves from ${from.pathname}`);
    if (anchor) {
      const headings = [...read(url).matchAll(/^#{1,6} (.+)$/gmu)].map(([, h]) => slug(h));
      assert.ok(headings.includes(anchor), `${target} names an existing heading`);
    }
  }
  return targets;
};

const section = (text, heading) => {
  const start = text.indexOf(`\n${heading}\n`);
  assert.notEqual(start, -1, `${heading} exists`);
  const rest = text.slice(start + heading.length + 2);
  const end = rest.search(/^#{1,3} /mu);
  return end === -1 ? rest : rest.slice(0, end);
};

test("grill and spec writers resolve the wiki root from the project wiki contract", () => {
  for (const [name, url] of Object.entries(writers)) {
    const text = read(url);
    assert.doesNotMatch(text, /apps\/wiki/u, `${name} hard-codes no wiki root`);
    assert.ok(
      resolvedLinks(url, text, "docs-ingest-phase/references/wiki-contract.md").length > 0,
      `${name} links the wiki contract`,
    );
  }
});

test("grill and spec writers append log entries by the one docs-ingest log rule", () => {
  for (const [name, url] of Object.entries(writers)) {
    const text = read(url);
    assert.ok(
      resolvedLinks(url, text, "docs-ingest-phase/references/wiki-ingest.md").some((target) =>
        target.endsWith("#log"),
      ),
      `${name} points to wiki-ingest.md#log`,
    );
    assert.doesNotMatch(
      text,
      /oldest-first|newest-first|append-only|entry cap|\d+[- ]entr/iu,
      `${name} restates no log rule`,
    );
    assert.doesNotMatch(text, /^## \[YYYY-MM-DD\]/mu, `${name} keeps no own log entry format`);
  }
});

test("create-spec logs the spec on the routed project surface", () => {
  const routed = section(read(writers.spec), "### Routed project wiki");
  assert.match(routed, /`spec` entry[\s\S]*\(.*wiki-ingest\.md#log\)/u);
});
