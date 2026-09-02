import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

const read = (relativePath) =>
  readFileSync(new URL(`../${relativePath}`, import.meta.url), "utf8");

const fogIntake = () =>
  read(
    "skills/agnostic/requirements/write-backlog/references/fog-intake.md",
  );

const normalization = () =>
  read(
    "skills/agnostic/requirements/write-backlog/references/normalization.md",
  );

const deliveryStatus = () =>
  read(
    "skills/agnostic/requirements/write-backlog/references/delivery-status.md",
  );

test("Fog intake preserves one immutable lens and lateral provenance without a stage ladder", () => {
  const guidance = fogIntake();

  assert.match(
    guidance,
    /immutable original intake lens[\s\S]*(?:Business|Functional)[\s\S]*(?:not|never)[\s\S]*(?:maturity|stage)/iu,
  );
  assert.match(
    guidance,
    /Fog is lateral provenance[\s\S]*(?:Product Area|Initiative)[\s\S]*Epic[\s\S]*Stor(?:y|ies)[\s\S]*Tasks?/iu,
  );
  assert.match(
    guidance,
    /exact unknown or Grilling work[\s\S]*support/iu,
  );
  assert.match(
    guidance,
    /Research and Prototype[\s\S]*(?:evidence|verdict)[\s\S]*(?:cannot|never)[\s\S]*(?:authorize|project)/iu,
  );
  assert.doesNotMatch(guidance, /required Stage|cardinality key|stage cardinality/iu);
  assert.match(
    guidance,
    /Returning from a Finder[\s\S]*(?:Fog remains open|leaves the Fog open)[\s\S]*(?:never|does not)[\s\S]*complete/iu,
  );
});

test("historical staged tickets are compatibility evidence and never a current gate", () => {
  const guidance = normalization();

  assert.match(
    guidance,
    /historical[\s\S]*Business[\s\S]*Functional[\s\S]*Technical[\s\S]*compatibility\s+evidence only/iu,
  );
  assert.match(
    guidance,
    /unchanged unless[\s\S]*(?:separately|explicitly) authorized[\s\S]*exact[\s\S]*(?:ticket|operation)/iu,
  );
  assert.match(
    guidance,
    /(?:exclude|never)[\s\S]*(?:automatic|automatically)[\s\S]*(?:migration|normalization|relabel|replacement)/iu,
  );
  assert.match(guidance, /former Stage[\s\S]*(?:not|never)[\s\S]*current gate/iu);
  assert.doesNotMatch(
    guidance,
    /invalid `?Grilling Stage`?|exactly one `?Grilling Stage`?|one Business child[\s\S]*Technical child per Story/iu,
  );
});

test("Fog completion credits only exact production coverage of accepted delivery scope", () => {
  const guidance = deliveryStatus();

  for (const fact of [
    /work started/iu,
    /blocked/iu,
    /review/iu,
    /pull request/iu,
    /merge/iu,
    /staging deployment/iu,
    /production deployment/iu,
  ]) {
    assert.match(guidance, fact);
  }
  assert.match(
    guidance,
    /each fact remains distinct[\s\S]*(?:cannot|does not|never)[\s\S]*(?:infer|imply)/iu,
  );
  assert.match(
    guidance,
    /accepted resulting scope[\s\S]*exact[\s\S]*(?:Story|Stories)[\s\S]*Tasks?[\s\S]*(?:enriched|produced)/iu,
  );
  assert.match(
    guidance,
    /complete the Fog only when exact production evidence covers every accepted\s+resulting Story and Task/iu,
  );
  assert.match(
    guidance,
    /merge[\s\S]*staging[\s\S]*(?:cannot|never)[\s\S]*complete/iu,
  );
  assert.match(
    guidance,
    /Cancelled and Superseded Fogs receive no completion credit/iu,
  );
});
