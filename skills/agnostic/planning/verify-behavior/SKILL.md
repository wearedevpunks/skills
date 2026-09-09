---
name: verify-behavior
description: Verify observable product behavior or reproduce reported failures through selected project-owned app references and falsifiable end-to-end evidence.
---

# Verify Behavior

One portable entrypoint consumes the **Project Verifier**: project-owned executable
knowledge below `.agents/skills/verify-behavior/references/`. The invoking workflow
owns setup authorization, fixes, acceptance classification, reruns, and durable
publication. This skill selects references and returns observed scenario evidence;
`review-phase` owns Code Review, not Verification.

## Select

1. Read the caller's accepted checks or failure report, selected scenario and app
   identities, mode, code ref, and runtime bounds. `verify` exercises implemented
   acceptance criteria; `reproduce` exercises the reported baseline failure before
   fixes. Infer mode only when omitted. Cover every in-scope observable story unless
   the caller explicitly bounded the run to one scenario.
2. For every run, read the project index at
   `.agents/skills/verify-behavior/references/README.md`. Select only the required
   Surface Verification References through its app pointers. For a scenario spanning
   apps, load its Cross-App Journey and follow its selected app/feature pointers.
   Keep a selection trace: selected check → index → app → feature → journey/helper
   when applicable, with the reason each reference was needed.
3. In each selected app, read `references/<app>/README.md`, then its Feature Map
   index at `features/README.md`. Load only entries needed by the selected scenario.
   Load optional helpers only when the app or feature's invocation condition fires.
   An index lists pointers and selection criteria; it does not duplicate launch or
   driver instructions. A Cross-App Journey composes app references in scenario
   order, names exchanged state and one observable result, and points to mechanics
   owned by each app. A full index audit requires an explicit full-audit scope.
4. Return **Uncovered Surface** when a required app has no Surface Verification
   Reference (including when the project index is absent). Return **Uncovered
   Behavior** when an existing app reference lacks the required Feature Map entry
   or executable drive path. Name the affected checks and exact missing knowledge;
   keep their status `blocked`. `implement-spec` owns invoking
   `create-verification-skill` or `update-verification-skill`, respectively, then
   resuming the original scenario. Missing knowledge is not verified proof from
   improvised automation. This entrypoint reads project references; lifecycle
   creation preserves existing app references and Feature Map entries and adds
   only the selected missing coverage.

## Reference contract

The shared skill owns this portable contract. App-specific mechanics live only
below the project-owned `references/` tree; they are not shared product drivers or
separate app-specific `SKILL.md` capabilities.

Each **Surface Verification Reference** co-locates these app-level sections in its
`README.md`, with pointers for conditionally needed details:

- **Launch**: bounded prerequisites, run-owned instance/scratch setup and identity.
- **Doctor**: observable readiness checks for that instance and its dependencies.
- **Drive**: driver selection, entry mechanics, and Feature Map pointers.
- **Evidence**: observable state, side effects and capture locations outside cleanup.
- **Cleanup**: resources created by this run, provenance checks and exact removal.
- **Feature Map**: `features/README.md` selects individual behavior references;
  optional helpers have explicit invocation conditions and remain app-owned.

Each Feature Map entry states user-facing behavior, user entry point, driver
recipe, observable end state, variants, side effects, prerequisites and gotchas.
It links product/domain authority for meaning and requirements instead of copying
that authority. It records positive proof and a **Scenario Falsifier**: the observable
result that would disprove the expected behavior. Important behavior includes a
**Relevant Negative Condition** when applicable, with the actual downstream result
to inspect; relevance, not an exhaustive negative suite, determines coverage.

## Exercise

1. Record `Channel: browser | computer-use | cli` and why the chosen exposed
   capability exercises the complete user path. Browser covers web interaction;
   computer-use covers native/OS interaction; CLI covers command-line product
   behavior through its real executable. When the required capability is unavailable,
   return `blocked` with the exact capability or access prerequisite. Do not invent
   tool names, capture APIs, upload commands, recordings, or artifact URLs.
2. Freeze authority, code, runtime and scenario identities for this proof. Establish
   only authorized, run-owned state through Launch. Keep credentials, secrets,
   personal data and sensitive state out of prompts, screenshots, recordings,
   reports and retained evidence; name a missing prerequisite
   without its value and keep affected checks blocked. Leave required human
   authentication or approval actions to the user.
3. Pass Doctor before Drive. Follow the selected Feature Map path end-to-end and
   record actions, observed positive result, Scenario Falsifier and its observation.
   For important behavior, exercise the applicable Relevant Negative Condition and
   inspect actual downstream state, not just a successful command or acknowledgement.
   Record why a negative condition is inapplicable when that is the case.
4. After a surprising failure, restore known run-owned state and renew Doctor
   before another Drive or interpreting subsequent results.
   Distinguish inaccessible setup, reference drift and observed product failure;
   retain the failure evidence for the invoking workflow. Missing interaction proof
   stays missing even if unit tests or source inspection pass.
5. Retain evidence with the selected check and state it demonstrates. Cleanup only
   resources proven owned by this run, including after failure; record cleanup
   outcomes and preserve evidence outside removed scratch. Report unexpected
   ownership as a cleanup blocker rather than deleting unowned resources.
6. Recheck frozen inputs. Changed authority, code, runtime or scenario conditions
   invalidate affected proof; return the exact affected checks for rerun. Existing
   creator/updater proof may be reused only when all four identities match the
   original requested scenario; otherwise run the missing proof. `implement-spec`
   owns evidence freshness and acceptance classification.

## Result

**`reproduce`:** confirmed | partially confirmed | not reproduced | blocked

**`verify`:** verified | partially verified | not verified | blocked

`not reproduced` means the complete reported path was exercised and the failure
was absent. Inaccessible state, missing credentials, failed setup or unavailable
capabilities mean `blocked`. A contradictory observed result means `not verified`
in verify mode; partial status names exactly which checks have proof.

Return mode, branch/code ref, channel, authority/runtime/scenario identities,
selection trace, per-check actions and observations, positive proof, Scenario
Falsifier, applicable negative condition and downstream result, overall status,
evidence paths or links that exist, cleanup outcome, and blockers with next action.
Coverage gaps retain the original scenario and affected acceptance criteria for
lifecycle repair. Do not claim reproduction or verification without cited evidence.
