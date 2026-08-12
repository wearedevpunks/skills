import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { copyFileSync, mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";

const source = new URL(
  "../skills/frameworks/effect/effect-recoverable-actions/references/strategy-matrix.md",
  import.meta.url,
);

const cells = (row) => {
  const parsed = [];
  let cell = "";

  for (let index = 1; index < row.length - 1; index += 1) {
    const character = row[index];
    if (character === "|" && row[index - 1] !== "\\") {
      parsed.push(cell.trim().replaceAll("\\|", "|"));
      cell = "";
    } else {
      cell += character;
    }
  }

  parsed.push(cell.trim().replaceAll("\\|", "|"));
  return parsed;
};

test("formatted Effect strategy table preserves three semantic columns", () => {
  const directory = mkdtempSync(join(tmpdir(), "effect-strategy-"));
  const formatted = join(directory, "strategy-matrix.md");

  try {
    copyFileSync(source, formatted);
    execFileSync("npx", ["--yes", "oxfmt@0.57.0", "--write", formatted], { stdio: "pipe" });

    const row = readFileSync(formatted, "utf8")
      .split("\n")
      .find((line) => line.includes("Preflight validation over many items"));
    assert.ok(row, "formatted preflight strategy row exists");

    const parsed = cells(row);
    assert.equal(parsed.length, 3);
    assert.equal(
      parsed[1],
      '`validateAll`, `partition`, or `Effect.all(..., { mode: "validate" | "either" })`',
    );
    assert.equal(parsed[2], "Use before the commit path, not during it.");
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
});
