import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { test } from "node:test";

const read = (path) =>
  readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

const architectRoot = "skills/agnostic/security/architect-pipeline";
const architectSkill = read(`${architectRoot}/SKILL.md`);
const architectSources = [
  architectSkill,
  read(`${architectRoot}/references/security-by-design.md`),
  read(`${architectRoot}/references/infrastructure-deployment.md`),
].join("\n");

test("architect-pipeline is model-invoked and owns provider-neutral orchestration", () => {
  const metadataPath = `${architectRoot}/agents/openai.yaml`;

  assert.ok(existsSync(`${architectRoot}/SKILL.md`));
  assert.ok(existsSync(metadataPath));
  assert.match(architectSkill, /^---\nname: architect-pipeline\ndescription:/u);
  assert.doesNotMatch(architectSkill, /disable-model-invocation/u);
  assert.match(architectSkill, /CI\/CD.*pipeline/iu);
  assert.match(architectSkill, /release.*deployment.*promotion/iu);
  assert.match(architectSkill, /\$audit-cicd-security/iu);
  assert.match(read(metadataPath), /\$architect-pipeline/iu);
  assert.match(architectSkill, /provider-neutral/iu);
});

test("architect-pipeline routes formal CI/CD security work without embedding an audit mode", () => {
  assert.match(
    architectSkill,
    /explicit CI\/CD security (?:audit|audits), (?:reviews?|threat models?).*\$audit-cicd-security/isu,
  );
  assert.doesNotMatch(architectSources, /security-audit\.md/iu);
  assert.doesNotMatch(architectSources, /#\s+(?:formal )?(?:CI\/CD )?security audit/iu);
  assert.doesNotMatch(architectSources, /audit portfolio/iu);
});

test("infrastructure deployment reference preserves the provider-neutral control theory", () => {
  const infrastructure = read(
    `${architectRoot}/references/infrastructure-deployment.md`,
  );

  for (const criterion of [
    /preview or plan/iu,
    /immutable revision/iu,
    /environment identity/iu,
    /apply gate/iu,
    /state authority/iu,
    /locking or concurrency/iu,
    /drift detection/iu,
    /retry/iu,
    /recovery/iu,
  ]) {
    assert.match(infrastructure, criterion);
  }
});

test("architect-pipeline contains no Pulumi-specific APIs, commands, or file formats", () => {
  assert.doesNotMatch(
    architectSources,
    /\bPulumi\b|pulumi(?:\s|`|\.|:)|ComponentResource|Output<T>|Pulumi(?:Plugin)?\.yaml/iu,
  );
});

test("Pulumi workflow-facing skills delegate generic orchestration and retain engine semantics", () => {
  const bestPractices = read(
    "skills/frameworks/pulumi/pulumi-best-practices/SKILL.md",
  );
  const component = read("skills/frameworks/pulumi/pulumi-component/SKILL.md");
  const providerUpgrade = read(
    "skills/frameworks/pulumi/provider-upgrade/SKILL.md",
  );

  for (const skill of [bestPractices, component, providerUpgrade]) {
    assert.match(skill, /\$architect-pipeline/iu);
  }

  assert.match(bestPractices, /pulumi preview/iu);
  assert.match(bestPractices, /pulumi up/iu);
  assert.match(component, /pulumi package/iu);
  assert.match(component, /provider/iu);
  assert.match(providerUpgrade, /provider/iu);
  assert.match(providerUpgrade, /pulumi preview/iu);
  assert.match(providerUpgrade, /pulumi up/iu);
});
