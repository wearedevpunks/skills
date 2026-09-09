import assert from "node:assert/strict";
import { mkdtempSync, readFileSync, readdirSync, writeFileSync, mkdirSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { acceptedBoundsHash, standaloneLineageId, standaloneRunId, standaloneSnapshotHash, normalizeReviewTarget, normalizeReviewSources, sourceSetHash, reviewReportPath, encodeReviewReport, sha256Hex, deriveReviewRouting, validateRetainedPass, resolveRetainedRun, assessReadonlyValidation, planDeliveryReviewGate } from "../../../../skills/phases/review-phase/scripts/review-contract.mjs";
const evidence = process.argv[2];
assert.ok(evidence, "evidence directory argument required");
const seed = fileURLToPath(new URL("./seed/", import.meta.url));
const files = readdirSync(seed).sort().map(identity => ({ identity, bytes: readFileSync(join(seed, identity)) }));
const packet = JSON.parse(readFileSync(join(evidence, "packet.json")));
const results = ["primary", "challenger"].flatMap(name => JSON.parse(readFileSync(join(evidence, name + ".json"))).lens_results);
assert.deepEqual(results.slice(0,5).map(result => result.coverage), ["standards", "skill_adherence", "architecture", "simplify", "spec"]);
assert.ok(results.every(result => result.outcome === "findings" && result.packet_identity === packet.packet_identity));
assert.notEqual(results[0].reviewer_identity, results[5].reviewer_identity);
const ref = (result, index) => JSON.stringify([results[result].reviewer_identity, results[result].coverage, index]);
const issues = [
  {id:"ownership",lens:"standards",severity:"high",location:"export.mjs:3-5",impact:"Cross-owner account balance is returned.",evidence:"Actual exportAccount('alice','B') returned B balance; actor is unused.",action:"Reject unmatched owner before response.",refs:[ref(0,0),ref(4,0),ref(5,0)]},
  {id:"domain-contract",lens:"architecture",severity:"medium",location:"export.mjs:2-5",impact:"Domain imports presentation and returns a string balance.",evidence:"Static view.mjs import; runtime typeof balance is string.",action:"Return numeric domain balance without view import.",refs:[ref(2,0),ref(4,1),ref(5,1)]},
  {id:"skill-evidence",lens:"skill_adherence",severity:"medium",location:"IMPLEMENTATION-NOTES.md:2",impact:"Guidance claim contradicts changed source.",evidence:"Exactly one record exists but claims no view dependency while line 2 imports it.",action:"Apply the guidance and record truthful implementation evidence.",refs:[ref(1,0)]},
  {id:"duplicate-branch",lens:"simplify",severity:"low",location:"export.mjs:7-8",impact:"Identical branches obscure the fee formula.",evidence:"Both paths return balance * 0.1.",action:"Use one formula.",refs:[ref(3,0)]},
  {id:"discount",lens:"spec",severity:"medium",location:"export.mjs:6-9",impact:"Accepted 50% discount is ignored.",evidence:"Actual fee(20,.5) returned 2 instead of 1.",action:"Apply the discount to the fee.",refs:[ref(4,2)]},
];
const findings = issues.map(({refs,...issue}) => ({...issue,return_route:"implementation"}));
const targetEvidence = { locator:"fixture:IP-453-cross-file", files, scopeEntries: files.map(file=>file.identity) };
const normalized_target = normalizeReviewTarget("standalone", targetEvidence);
const sourceEvidence = files.filter(file=>file.identity.endsWith('.md')).map(file=>({path:file.identity,bytes:file.bytes}));
const sources = normalizeReviewSources(sourceEvidence);
const bounds = "IP-453-seeded-native";
const boundsHash = acceptedBoundsHash(bounds,targetEvidence.scopeEntries);
const lineage = standaloneLineageId(targetEvidence.locator,boundsHash);
const snapshot = standaloneSnapshotHash(targetEvidence);
assert.equal(snapshot,packet.snapshot_hash);
const run = standaloneRunId(lineage,snapshot);
const reviewed_at = new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d+Z$/, "Z");
const reportPath = reviewReportPath({lineageId:lineage,reviewedAt:reviewed_at,snapshotHash:snapshot});
const report = {review_lineage_id:lineage,review_run_id:run,accepted_bounds_identity:bounds,accepted_bounds_hash:boundsHash,reviewed_at,mode:"standalone",normalized_target,snapshot_hash:snapshot,excluded_envelope:[reportPath],source_paths_and_hashes:sources,source_set_hash:sourceSetHash(sources),lens_outcomes:Object.fromEntries(results.slice(0,5).map(result=>[result.coverage,"findings"])),findings,routing:deriveReviewRouting(findings),validation:[{command:"node tests/fixtures/v43/IP-453/prove-native.mjs <evidence-dir>",isolation:"disposable-snapshot",before_hash:snapshot,after_hash:snapshot,outcome:"passed",evidence:"native-audit.json records actual identity/schema/routing/retention checks; focused-repair.log retains affected behavior checks separately."}],delivery_goal_identity:null,review_ordinal:null,preceding_repair_ordinal:null,review_epoch:{protocol:"primary-challenger-v1",packet_identity:packet.packet_identity,results,adjudications:issues.map(issue=>({candidate_refs:issue.refs,finding_id:issue.id,evidence:issue.evidence}))}};
const scratch=mkdtempSync(join(tmpdir(),"ip-453-retention-"));
const git=(...args)=>execFileSync("git",args,{cwd:scratch,encoding:"utf8"}).trim();
try {
 git("init","-q");git("config","user.name","IP-453 Fixture");git("config","user.email","fixture@example.invalid");
 git("commit","--allow-empty","-qm","test: initialize isolated review fixture");
 const bytes=encodeReviewReport(report,{domain:"cli"});const localPath=join(scratch,reportPath);mkdirSync(dirname(localPath),{recursive:true});writeFileSync(localPath,bytes);
 // Real retention failure: the designated report destination is initially a directory.
 const blockedPath=join(scratch,"blocked-report");mkdirSync(blockedPath);
 let retentionFailure;
 try {writeFileSync(blockedPath,bytes);} catch(error) {retentionFailure=error.code;}
 assert.equal(retentionFailure,"EISDIR");
 assert.ok(readFileSync(localPath).equals(bytes));
 git("add","--",reportPath);git("commit","-qm","test: retain native review report");
 const commit=git("rev-parse","HEAD");git("update-ref","refs/heads/native-review-proof",commit);
 const resolved=execFileSync("git",["show",`${commit}:${reportPath}`],{cwd:scratch});
 const candidate={reportPath,reportBytes:bytes,resolvedReportBytes:resolved,reportSha256:sha256Hex(bytes),reportCommitSha:commit,retainedRef:"refs/heads/native-review-proof",refContainsCommit:git("rev-parse","refs/heads/native-review-proof")===commit,commitPaths:git("diff-tree","--no-commit-id","--name-only","-r",commit).split('\n')};
 const expected={mode:"standalone",acceptedBoundsIdentity:bounds,targetEvidence,sourceEvidence,auxiliaryEnvelopePaths:[],approvedRetainedRefs:[candidate.retainedRef],wikiDomain:"cli",reviewProtocol:"primary-challenger-v1",assignedCoverage:results.map(({reviewer_identity,role,coverage})=>({reviewer_identity,role,coverage}))};
 assert.deepEqual(validateRetainedPass(candidate,expected),{valid:true,errors:[]});
 const entry={candidate,expected};assert.equal(resolveRetainedRun([entry,entry]).status,"reuse");
 const stale=structuredClone(expected);stale.targetEvidence.files=files.map(file=>({...file,bytes:Buffer.from(file.bytes)}));stale.targetEvidence.files[0].bytes=Buffer.from("semantic change");
 assert.equal(validateRetainedPass(candidate,stale).valid,false);
 assert.equal(assessReadonlyValidation({beforeHash:snapshot,afterHash:sha256Hex(Buffer.from('semantic change'))}).passConsumed,false);
 const gate={currentState:"repair_active",acceptedBoundsValid:true,targetSupported:true,recoveredReviewCount:1};
 assert.equal(planDeliveryReviewGate(gate).state,"focused_validation");
 assert.equal(planDeliveryReviewGate({...gate,acceptedRiskTrigger:{kind:"security",evidence:"accepted ownership repair in native report"}}).state,"review_due");
 assert.equal(planDeliveryReviewGate({...gate,recoveredReviewCount:2}).state,"review_budget_exhausted");
 writeFileSync(join(evidence,"native-review-report.md"),bytes);
 execFileSync("git",["bundle","create",join(evidence,"native-retention.bundle"),"--all"],{cwd:scratch});
 writeFileSync(join(evidence,"native-audit.json"),JSON.stringify({packet_identity:packet.packet_identity,packet_sha256:sha256Hex(readFileSync(join(evidence,'packet.json'))),five_obligations:results.slice(0,5).map(result=>result.coverage),candidate_count:results.reduce((sum,result)=>sum+result.candidates.length,0),accepted_issues:issues.map(issue=>({id:issue.id,severity:issue.severity,route:'implementation'})),retention_failure:retentionFailure,retention_retry_same_bytes:true,retention_commit:commit,retained_ref:candidate.retainedRef,report_path:reportPath,report_sha256:candidate.reportSha256,validation:validateRetainedPass(candidate,expected),same_run_reuse:true,semantic_change_rejected:true,ordinary_repair:'focused_validation',risk_second:'review_due',ceiling:'review_budget_exhausted',native_mode:'standalone frozen seeded artifact bundle; delivery counting exercised through public helper',scratch,cleanup:'removed after bundle and evidence retention'},null,2));
} finally {rmSync(scratch,{recursive:true,force:true});}
