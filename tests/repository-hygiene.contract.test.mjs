import assert from "node:assert/strict";
import { readdirSync } from "node:fs";
import path from "node:path";
import test from "node:test";

const root = path.resolve(import.meta.dirname, "..");

const findMetadata = (directory) =>
  readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    if (entry.name === ".git") return [];
    const absolutePath = path.join(directory, entry.name);
    if (entry.isDirectory()) return findMetadata(absolutePath);
    return entry.name === ".DS_Store" ? [path.relative(root, absolutePath)] : [];
  });

test("canonical source excludes platform metadata from distributed skills", () => {
  assert.deepEqual(findMetadata(root), []);
});
