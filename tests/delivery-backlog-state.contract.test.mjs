import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";

const root = path.resolve(import.meta.dirname, "..");
const deliveryStatus = () =>
  readFileSync(
    path.join(
      root,
      "skills/agnostic/requirements/write-backlog/references/delivery-status.md",
    ),
    "utf-8",
  );

test("merge evidence never advances deployment or Fog completion", () => {
  const guidance = deliveryStatus();

  assert.match(guidance, /directly observed merge evidence/iu);
  assert.match(guidance, /merge is never\s+(?:staging|deployment|production)/iu);
  assert.match(guidance, /staging is never production/iu);
  assert.match(
    guidance,
    /merge[\s\S]*leaves[\s\S]*staging[\s\S]*production[\s\S]*Fog[\s\S]*(?:unchanged|open)/iu,
  );
});

test("delivery callers hand off each directly observed fact immediately", () => {
  const guidance = deliveryStatus();

  assert.match(guidance, /reports? only facts? (?:it|they) directly observed/iu);
  assert.match(guidance, /start(?:ed)?|in[- ]progress/iu);
  assert.match(guidance, /block(?:ed|er)[\s\S]*reason[\s\S]*evidence/iu);
  assert.match(guidance, /pull request[\s\S]*URL[\s\S]*state/iu);
  assert.match(guidance, /merge evidence/iu);
  assert.match(guidance, /staging deploy(?:ment)? evidence/iu);
  assert.match(guidance, /production deploy(?:ment)? evidence/iu);
  assert.match(
    guidance,
    /release[\s\S]*branch[\s\S]*name[\s\S]*(?:observed at|time|timestamp)/iu,
  );
  assert.match(guidance, /immediately[\s\S]*(?:write|record)[\s\S]*read back/iu);
});

test("delivery-status is a narrow state-mutation branch behind the provider adapter", () => {
  const guidance = deliveryStatus();

  assert.match(
    guidance,
    /exact linked Story or Task[\s\S]*stable provider (?:IDs?|identit)/iu,
  );
  assert.match(guidance, /same (?:Story and Task )?identit/iu);
  assert.match(guidance, /provider adapter[\s\S]*(?:mapping|mutation|write)[\s\S]*readback/iu);
  assert.match(
    guidance,
    /return[\s\S]*exact observed mutations[\s\S]*(?:exact )?readback/iu,
  );
  assert.match(guidance, /creates? no (?:new )?(?:Story|Task|provider object)/iu);
});

test("Fog completion requires exact production evidence for its complete accepted scope", () => {
  const guidance = deliveryStatus();

  assert.match(
    guidance,
    /accepted resulting scope[\s\S]*Epic[\s\S]*Stor(?:y|ies)[\s\S]*Tasks?/iu,
  );
  assert.match(
    guidance,
    /production evidence[\s\S]*every accepted\s+resulting (?:Story|Task)/iu,
  );
  assert.match(guidance, /accepted\s+Epic\s+contribution[\s\S]*production/iu);
  assert.match(guidance, /shared Epic[\s\S]*(?:remain|stays?) open/iu);
  assert.match(
    guidance,
    /child creation[\s\S]*Task creation[\s\S]*merge[\s\S]*(?:cannot|never)[\s\S]*complete/iu,
  );
  assert.match(guidance, /missing[\s\S]*production evidence[\s\S]*Fog\s+remains open/iu);
  assert.match(guidance, /final[\s\S]*`V\*`[\s\S]*(?:completion|production)/iu);
});

test("partial delivery writes resume from exact readback without inventing pipeline facts", () => {
  const guidance = deliveryStatus();

  assert.match(
    guidance,
    /partial (?:provider )?(?:failure|write)[\s\S]*read back[\s\S]*observed writes[\s\S]*unresolved delta/iu,
  );
  assert.match(guidance, /resume[\s\S]*only[\s\S]*(?:missing|unresolved)/iu);
  assert.match(guidance, /no CI\/CD[\s\S]*adapter design/iu);
  assert.match(guidance, /no automatic pipeline/iu);
});
