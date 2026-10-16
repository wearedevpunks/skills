import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

const skillRoot = "skills/agnostic/requirements/requirements-grill";
const read = (path) =>
  readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
const skill = () => read(`${skillRoot}/SKILL.md`);
const router = () => read(`${skillRoot}/phases/router.md`);
const gate = (name) => read(`${skillRoot}/phases/${name}.md`);
const artifact = () => read(`${skillRoot}/references/artifact-output.md`);

test("requirements-grill runs each round through $grilling and closes only through the router's Close Guard", () => {
  assert.match(
    gate("round"),
    /`\$grilling` is the\s+per-round interview primitive, unchanged: the router's frontier is its\s+frontier/u,
  );
  assert.match(router(), /No open question exists and the Close Guard passes \| \[`close\.md`\]/u);
  assert.match(gate("close"), /Re-check every condition of the\s+\[Close Guard\]/u);
  assert.doesNotMatch(skill(), /After the frontier is empty/u);
});

test("requirements-grill uses show-me throughout live branch traversal", () => {
  assert.match(
    gate("round"),
    /through `\$wait-what` with one `\$show-me` view: the smallest\s+applicable view from its catalog, derived from the status, log, and code\s+evidence/u,
  );
  assert.match(
    gate("round"),
    /material ordering,\s+lifetime, transaction, and failure consequences beside the view/u,
  );
  assert.match(
    gate("checkpoint"),
    /a `\$show-me` interface sketch or module\s+tree of the proposed modules/u,
  );
  assert.match(
    gate("close"),
    /invoke `\$show-me` to present the persisted shared understanding:\s+branches with Target and Settled Altitudes, parks with Altitude and\s+reason, glossary, and axioms/u,
  );
  assert.match(gate("close"), /The view is derived; approval applies to\s+the status file and log/u);
});

test("requirements-grill grounds technical branches and preserves independent questions", () => {
  const rows = router();
  const groundRow = rows.indexOf("[`ground.md`](ground.md)");
  const roundRow = rows.indexOf("| A ready question exists | [`round.md`]");
  assert.ok(groundRow !== -1 && roundRow > groundRow);
  assert.match(gate("ground"), /Before the first round, give `\$domain-modeling`/u);

  assert.match(
    gate("ground"),
    /`path:symbol`, schema, contract operation, configuration key, or\s+runtime-flow anchors/u,
  );
  assert.match(
    gate("ground"),
    /missing fact or a source and version mismatch as\s+an exact prerequisite of the question ids it affects; only those questions\s+wait/u,
  );
  assert.match(
    artifact(),
    /Only those dependent questions wait; independent ready questions remain available/u,
  );
});

test("technical questions carry evidence and code consequences", () => {
  assert.match(
    gate("round"),
    /state the evidence\s+anchor and observed constraint, ask one decision, and state its code\s+consequence/u,
  );
  assert.match(
    artifact(),
    /Evidence anchor:.*Observed constraint:.*Question:.*Code consequence:/isu,
  );
  assert.match(
    router(),
    /Planning stays downstream with `create-plan`: edit order, task breakdown,\s+waves, estimates, tuning constants\. No grill question asks them/u,
  );
});

test("technical grounding blocks premature branch closure", () => {
  assert.match(
    artifact(),
    /Technical Grounding.*Evidence anchors.*Applicable dimensions.*Open technical decisions.*Grounding/isu,
  );
  assert.match(
    artifact(),
    /`grounded` means current evidence anchors support every applicable dimension; decisions may still be open.*closure requires each technical decision to be answered, parked, or explicitly deferred/isu,
  );
  assert.match(
    artifact(),
    /`100%`: the branch is settled at its Target Altitude, no question is\s+open,[\s\S]{0,120}code-bearing\s+branch is grounded with no open technical decision/u,
  );
  assert.match(artifact(), /Keep a branch below `100%` while any `100%` condition fails/u);
  assert.match(
    router(),
    /every code-bearing branch is grounded with no open technical decision/u,
  );
});

test("Requirements Phase preserves full requirements authority before projection", () => {
  const requirementsPhase = read("skills/phases/requirements-phase/SKILL.md");

  assert.match(requirementsPhase, /only\s+orchestration\s+route/iu);

  const grill = requirementsPhase.indexOf("`requirements-grill`");
  const spec = requirementsPhase.indexOf("`create-spec`", grill);
  const backlog = requirementsPhase.indexOf("`write-backlog`", spec);
  assert.ok(grill >= 0 && spec > grill && backlog > spec);

  assert.doesNotMatch(
    requirementsPhase,
    /Technical Finder|once per Story|exact existing Story/iu,
  );
});
