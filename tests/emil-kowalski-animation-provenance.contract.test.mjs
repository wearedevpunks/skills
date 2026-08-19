import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { test } from "node:test";

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url));
const sha256 = (path) => createHash("sha256").update(read(path)).digest("hex");

const imports = [
  {
    directory: "skills/frameworks/expo/animate-expo",
    files: {
      "SKILL.md": "2121fc72ffa476492c1b91ccf96c7b26aade9d1a332dc5834ba3526e1102b00d",
      "RECIPES.md": "1193cb71334da2e2341778dd92bec9ac79d989cb07fd55d661f324ed5871e718",
    },
  },
  {
    directory: "skills/agnostic/frontend/animate",
    files: {
      "SKILL.md": "f6317335da2662e92270dc0a6128bea95d7216cd751f86628e3ac6b72804e805",
      "RECIPES.md": "21ff63d84391db8d96ecdf9170095f55a42c836ccc36fd3269c4772bab031ba2",
    },
  },
  {
    directory: "skills/agnostic/frontend/review-animations",
    files: {
      "SKILL.md": "61cf8ac0c4c8e1f63385298c546b16c65ca9aec34abddcd04e821c16712d671d",
      "STANDARDS.md": "e7d3605034acda54ca13e43aec9e64d65b53de20f75b11b8d694e373012fbe07",
    },
  },
];

test("Emil Kowalski animation skills retain pinned source and license bytes", () => {
  for (const { directory, files } of imports) {
    for (const [file, expected] of Object.entries(files)) {
      assert.equal(sha256(`${directory}/${file}`), expected, `${directory}/${file}`);
    }

    assert.equal(
      sha256(`${directory}/LICENSE`),
      "4ff5bdb7887ec1435c9cab0e8d1a7caee704d894d65c2a008ccc68b1cc2f260b",
      `${directory}/LICENSE`,
    );

    const provenance = read(`${directory}/UPSTREAM.md`).toString("utf8");
    assert.match(provenance, /github\.com\/emilkowalski\/skills/);
    assert.match(provenance, /e879241fab3cdb22e8d95587cdbf40b57a88d7da/);
    assert.match(provenance, /byte-identical upstream MIT license/);
  }
});
