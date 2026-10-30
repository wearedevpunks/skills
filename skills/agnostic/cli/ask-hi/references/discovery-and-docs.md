# Discovery, design and docs family

This family covers human intake before requirements (Finder), human-evaluated prototypes, product design from existing evidence, docs and wiki ingest, onboarding, and writing skills or agent docs. Finder starts only from a human-typed wrapper; the engine creates or resumes one Fog, routes support to research or prototype children, and returns a bounded result with next human options; the Fog stays open and the human starts `$requirements-phase` separately. `$design-phase` runs intake → grill → brand → design system → compose → motion plan → variant rounds (quality gate, verdict) → promote → backlog → brief, then stops for the human to start `$delivery-phase`. `$docs-ingest-phase` resolves the project wiki contract, then runs exactly one branch per pass.

- `$business-finder` | `$functional-finder` → `$finder-phase` → `$grilling` ↔ `$parallel-research` | `$prototype-phase` → `$write-backlog` → human → `$requirements-phase`
- `$design-phase` → `$requirements-grill` → `$brandkit` → `$shadcn` → `$imagegen-frontend-web|mobile` → `$find-animation-opportunities` → `$prototype-variants` ⇄ quality gate → verdict → promote → backlog → human → `$delivery-phase`
- `$docs-ingest-phase` → setup | capture | health | private/internal | public (`$writing-fragments` → `$writing-beats` → `$writing-shape`)
- `hi init` → `$hi-cli` → `$writing-for-agents` → `$rule-authoring` → `$docs-onboarding` → `$requirements-phase`

## `$finder-phase`
Explicit-only; Pack `planning`. Durable graph engine that creates or resumes exactly one Fog for one explicit Business or Functional intake.
- **Use when:** a human typed `$business-finder` or `$functional-finder`; inputs: lens, intake profile, ceiling `Initiative|Epic`, one product request, optional Fog identity or handoff. **Not for:** requirements closure, specs or delivery-depth projection (`$requirements-phase`); review (`$review-phase`, invoked by the human).
- **Steps:** bootstrap reads contract, state graph, handoff; reconstructs state from fresh evidence; router on every entry, first match: 1 conflict or projection above ceiling → human-steering; 2 no exact Fog readback → ensure-fog; 3 one open Research child → research; 4 one open Prototype child → prototype; 5 accepted projection intent without readback → reconcile; 6 bounded result ready → return-target; 7 else → grilling. Each gate writes the handoff, then stops or re-enters.
- **Gates:** ensure-fog: allocate the wiki Fog id once, upsert via `$write-backlog`, exact readback. grilling: reuse/create one `Kind/grilling` child, one `$grilling` conversation in the wrapper profile (`$wait-what`, `$show-me`). research: `$parallel-research` report retained by SHA + path. prototype: `$prototype-phase` verdict + immutable pointer. reconcile: ceiling-safe intent → `$write-backlog` (preview, write, readback). return-target: Fog id, lens, children, evidence, readback, unresolved decisions, next human options.
- **Calls:** `$write-backlog`, `$grilling`, `$parallel-research`, `$prototype-phase`, `$wait-what`, `$show-me`. **Called by:** `$business-finder`, `$functional-finder`.
- **Writes:** `.devpunks/finder-phase/handoffs/<durable-wiki-fog-id>.md` (Status `complete|blocked|skipped|checkpoint|human_steering_required`, Fog/provider/snapshot identities, immutable lens, child ids, relations, evidence, ceiling, projection, unresolved decisions); provider Fog, child items, relations, optional Product Area/Initiative/Epic via `$write-backlog`.
- **Stops / gates:** evidence authority: direct evidence > workflow-native artifacts > handoff > suggested route. `human_steering_required` stops before any mutation intent. `approval_required` checkpoint at reconcile. Return never claims the Fog resolved; delivery evidence owns completion. Research and prototype results never accept product direction.
- **Source:** `.agents/skills/finder-phase/SKILL.md`, `phases/{router,ensure-fog,grilling,research,prototype,reconcile,return-target,human-steering}.md`, `references/{entrypoint-contract,root-routing,state-graph,runtime-handoff}.md`, `scripts/finder-contract.mjs`

## `$business-finder`
Explicit-only; Pack `planning`. Captures uncertain product intent in business language; optional structure up to Initiative.
- **Use when:** a colleague without technical background brings a product idea. **Not for:** implementation or architecture questions; Epic/Story/Task projection (`$functional-finder`, `$requirements-phase`).
- **Steps:** 1 Intake: actor, problem/opportunity, outcome/value, evidence, constraints, non-goals, urgency, open questions, in the human's words; done when unknowns are explicit. 2 `$wait-what` when a term misses. 3 `$show-me` before each structure decision. 4 Run `$finder-phase` with lens `Business`, ceiling `Initiative`. 5 Optional Product Area/Initiative via `$write-backlog`. 6 Bounded return.
- **Calls:** `$finder-phase`, `$wait-what`, `$show-me`, `$write-backlog`. **Called by:** human.
- **Writes:** as `$finder-phase`.
- **Stops / gates:** skipped or unresolved structure never blocks; no completion claim.
- **Source:** `.agents/skills/business-finder/SKILL.md`

## `$functional-finder`
Explicit-only; Pack `planning`. Develops uncertain product behavior nontechnically; optional structure up to Epic.
- **Use when:** a functional colleague describes behavior; no Business run needed. **Not for:** architecture, APIs, data models, Stories, Tasks or commands (`$requirements-phase`).
- **Steps:** 1 Intake = Business profile + actor, trigger, workflow, observable result, domain rules, alternate/failure paths, acceptance signals, boundaries, dependencies, technical handoff questions, target `V*`. 2 `$wait-what`; `$show-me` at each decision (workflow, failure path, dependency, milestone, Epic projection). 3 `$finder-phase` with lens `Functional`, ceiling `Epic`. 4 Optional Product Area/Initiative/Epic via `$write-backlog`. 5 Bounded return with Epic readback.
- **Calls:** `$finder-phase`, `$wait-what`, `$show-me`, `$write-backlog`. **Called by:** human.
- **Writes:** as `$finder-phase`.
- **Stops / gates:** as `$business-finder`.
- **Source:** `.agents/skills/functional-finder/SKILL.md`

## `$prototype-phase`
Model-invoked; Pack `planning`. Standalone human-evaluated prototype for one claim, from construction to verdict.
- **Use when:** a Finder prototype gate or `$wayfinder` route needs a human verdict on one precise question. **Not for:** design work (`$design-phase` builds variants in the real app); production code.
- **Steps:** 1 Claim one question; record expected learning + source ticket. 2 Build with `$prototype` on `prototype/<slug>`. 3 Give the run command; `$show-me` per variant; ask accept | iterate | reject. 4 Iterate: update `PROTOTYPE-VERDICT.md`, commit, rebuild only the tested part. 5 Accept/reject: finalize the verdict from `VERDICT-TEMPLATE.md`, commit, push, verify the remote ref, return SHA + path to `$finder-phase`. Reject keeps the question open.
- **Calls:** `$prototype`, `$show-me`. **Called by:** `$finder-phase` (prototype gate), `$create-spec` (gap route); `$wayfinder` recommends it.
- **Writes:** branch `prototype/<slug>`; `PROTOTYPE-VERDICT.md` beside the artifact (Question, Source ticket, Verdict, Run command, Evidence, Rejected alternatives, Risks, Implications, Open decisions, Artifact commit, Artifact path).
- **Stops / gates:** remote retention verified before return; a verdict is evidence, never production authorization; the visual informs, the human decides.
- **Source:** `.agents/skills/prototype-phase/SKILL.md`, `VERDICT-TEMPLATE.md`

## `$design-phase`
Explicit-only; Pack `frontend`. Durable Workflow Graph from brand evidence through a design system, accepted Compositions and quality-checked variant rounds on the real route to committed Design-Owned UI Code, backlog linkage and a delivery brief.
- **Use when:** product design work on a real route of an existing app (routes, tokens, `components.json`, DESIGN.md, screenshots, Figma, brand). **Not for:** throwaway prototypes (`$prototype-phase`); a target app that does not exist; new Stories/Tasks (`$requirements-phase`); starting delivery (the human types `$delivery-phase`).
- **Steps:** bootstrap loads the router on every entry; first match: 1 unresolved steering decision → `human_steering_required`; 2 goal, surface or spec folder unclear, or several handoffs match → `design_target_unclear`; 3 same-authority conflict → `design_state_conflict`; 4 pending brand, compose or verdict checkpoint without a reply → checkpoint; 5 reply → the owning gate; 6 intake evidence missing/low-confidence/stale → intake (surface `web|expo`, existing-UI intent, one scope unit per real route); 7 constraints missing → grill (`$requirements-grill`); 8 no Brand Kit and no fresh intake brand artifacts → brand (`$brandkit` boards; else a trace row records the skip); 9 DESIGN.md or theme missing/stale → design-system (DESIGN.md template; web `$shadcn` theme, `cva` variants, design system page; Expo NativeWind via `$expo-tailwind-setup`); 10 scope unit without accepted Compositions → compose (`$imagegen-frontend-web` + `$imagegen-frontend-mobile` briefs + DESIGN.md + shadcn-Primitive Directive + copy lens); 11 Composition without a decided Motion Plan → motion-plan (`$find-animation-opportunities`); 12 round due, unbuilt, failing or stale → variant-round (3-5 variants behind dev-only `?variant=` on the real route via `$prototype-variants`, `$shadcn`, `$design-taste-frontend`, `$image-to-code`, `$emil-design-eng`, `$animate`|`$animate-expo`, `$mobile-native`; existing-UI intent `improve-existing` passes to `$design-taste-frontend`'s redesign route; 375px + 1280px checks); 13 built variant without a quality result → quality-gate (light `$break-ui`, `$mobile-native` checklist, `$review-animations`, copy lens, Motion Plan conformance); 14 all variants pass, no Verdict → verdict (`riff | combine | keep | reject`); 15 `keep` without a promote commit → promote (full `$break-ui` + fix, in-place production rewrite, switch and losing variants removed, dev-only worst-case fixtures kept, promote commit, approved artifact contract); 16 promote commit without a backlog outcome → backlog; 17 `requirements_phase_return` → terminal; 18 linked ids without a brief → delivery-handoff; 19 fresh brief → `design_complete`.
- **Backlog phase:** reads the grill glossary; needs an agent-ready `SPEC.md` with verified blob URL linking the approved artifact contract; new Stories/Tasks → evidence back to `$requirements-phase`; in-scope → `$repo-asset-management` attachments, promote commit + contract linked to existing backlog ids.
- **Calls:** `$requirements-grill`, `$brandkit`, `$shadcn`, `$expo-tailwind-setup`, `$imagegen-frontend-web`, `$imagegen-frontend-mobile`, `$find-animation-opportunities`, `$prototype-variants`, `$design-taste-frontend`, `$image-to-code`, `$emil-design-eng`, `$animate`, `$animate-expo`, `$mobile-native`, `$break-ui`, `$review-animations`, `$repo-asset-management`; Codex image generation (native, or T3 `delegate_task`). **Called by:** human.
- **Writes:** `DESIGN-HANDOFF.md` beside `SPEC.md` (Design Target, Round State with round counter, Motion Plan, Artifact Index, Approved Artifact Contracts, Route Trace, Gate Outcomes); DESIGN.md, theme, component variants, design system page; variant code on the working branch; promote commit (its files are Design-Owned UI Code); durable visual links; delivery brief (promote commit, ids, links, surfaces, scope, constraints, checks, Design-Owned UI Code boundary, before/after PR evidence).
- **Stops / gates:** the router is the sole route authority; gates own every child-skill activation. Human checkpoints: brand, compose, verdict. Acceptance comes only from the user's explicit words; a recorded `keep` is the approval. Every image comes from the Codex image ladder or the gate blocks (`image_generation_unavailable|pending`); no code or HTML fallback. A later visual change re-enters the router (layout change → compose, else a new round). Temp files and transient URLs are never final evidence; stops after presenting the brief.
- **Source:** `.agents/skills/design-phase/SKILL.md`, `phases/{router,intake,grill,brand,design-system,compose,motion-plan,variant-round,quality-gate,verdict,promote,backlog,delivery-handoff}.md`, `references/{design-handoff,image-generation,design-md-template,shadcn-primitive-directive,copy-lens}.md`

## `$design-taste-frontend`
Model-invoked; Pack `frontend`. Taste-skill 2.1 anti-slop art direction for pages and app screens: a script deals researched directions, a strict house style is measured in a real browser, and a look-and-fix loop runs on screenshots.
- **Use when:** building, redesigning, restyling, polishing or reviewing a page (landing, marketing, product, portfolio, one-pager) or an app screen (dashboard, admin or analytics view, settings, inbox); every design-phase variant. **Not for:** design images without code (`$imagegen-frontend-web|mobile`).
- **Steps:** decide page or app screen first; an app screen follows `references/app-screens.md` (`draw.mjs --app`, `inspect.mjs --app`). Page run: 1 read the brief and project; 2 write the argument; 3 draw the direction (`scripts/draw.mjs` deals three of twenty); 4 find the idea; 5 write the words; 6 build it, still; 7 gate (`lint.mjs`, `inspect.mjs` at 1440/768/390, `scenes.mjs`; fix every `FAIL`); 8 look (critique screenshots, fix the top three, at most three rounds); 9 move (motion layer); 10 report. Redesign route "Redesign, restyle or review of an existing page or app screen": record the before; a review stops at the critique; keep stack, content and what works; type → colour → frame → states → stock components; prove before/after.
- **Calls:** none. **Called by:** `$design-phase` (variant-round, every variant; `improve-existing` runs its redesign route; its `references/copy.md` feeds the copy lens). **Writes:** code; working files under `.taste-skill/`. **Stops / gates:** reports only with 0 `FAIL` at every width on the final page.
- **Source:** `.agents/skills/design-taste-frontend/SKILL.md`, `references/{app-screens,critique,copy}.md`

## `$image-to-code`
Model-invoked; Pack `frontend`. Generates website design images first, analyzes them, then implements to match.
- **Use when:** visually important web tasks; design-phase variant-round with accepted Compositions as its design images. **Not for:** cropping old images; images only (`$imagegen-frontend-web`).
- **Steps:** generate large section-specific images; deep analysis (text, type, spacing, buttons, color); anti-drift implementation; done at the clarity check.
- **Calls:** none. **Called by:** `$design-phase` (variant-round). **Writes:** images + code. **Stops / gates:** clarity check.
- **Source:** `.agents/skills/image-to-code/SKILL.md`

## `$imagegen-frontend-web`
Model-invoked; Pack `frontend`. Premium website design reference images, one horizontal image per section.
- **Use when:** design-phase compose needs web Compositions. **Not for:** code (`$image-to-code`); multi-section boards.
- **Steps:** one image per section; variation engine; one palette across images; done at the clarity check.
- **Calls:** none. **Called by:** `$design-phase` (compose). **Writes:** images. **Stops / gates:** clarity check.
- **Source:** `.agents/skills/imagegen-frontend-web/SKILL.md`

## `$imagegen-frontend-mobile`
Model-invoked; Pack `frontend`. App-native mobile screen and flow images in phone mockups; images only.
- **Use when:** design-phase compose needs mobile Compositions for iOS, Android or cross-platform. **Not for:** code.
- **Steps:** platform mode; screen-first, enough screens; app design bible; consistent logical flow; device frame; done at the quality check.
- **Calls:** none. **Called by:** `$design-phase` (compose). **Writes:** images. **Stops / gates:** quality check.
- **Source:** `.agents/skills/imagegen-frontend-mobile/SKILL.md`

## `$brandkit`
Model-invoked; Pack `frontend`. Premium brand-guidelines boards: logo system, color, type, image direction; images only.
- **Use when:** design-phase brand gate needs a Brand Kit. **Not for:** screen Compositions (`$imagegen-frontend-web|mobile`); code.
- **Steps:** brand intake; strategy first; logo concept methods; board composition (default 3x3 panel system); done when the boards cover the brand system.
- **Calls:** none. **Called by:** `$design-phase` (brand). **Writes:** images. **Stops / gates:** none; design-phase brand checkpoint follows.
- **Source:** `.agents/skills/brandkit/SKILL.md`

## `$shadcn`
Model-invoked (not user-invocable); Pack `frontend`. Adds, searches, fixes, styles and composes shadcn/ui components; maps DESIGN.md to a theme.
- **Use when:** a project with `components.json`, shadcn init or presets, or a design system from DESIGN.md. **Not for:** non-shadcn component libraries.
- **Steps:** read project context; critical rules (styling, forms, composition, components over custom markup, icons); CLI via `npx shadcn@latest`; `design-system.md`: DESIGN.md → tokens → theme → `cva` variants → design system page → verify.
- **Calls:** none. **Called by:** `$design-phase` (design-system, variant-round). **Writes:** components, theme. **Stops / gates:** design-system verify step.
- **Source:** `.agents/skills/shadcn/SKILL.md`, `design-system.md`, `rules/*.md`

## `$find-animation-opportunities`
Model-invoked; Pack `frontend`. Readonly search for places that should animate; proposes motion with exact values, rejects the rest.
- **Use when:** "what could animate here?"; design-phase motion-plan. **Not for:** implementing motion (`$animate`); critiquing existing motion (`$review-animations`).
- **Steps:** hunt the code or UI; output opportunities table, rejected candidates (required), verdict.
- **Calls:** none. **Called by:** `$design-phase` (motion-plan). **Writes:** nothing. **Stops / gates:** readonly.
- **Source:** `.agents/skills/find-animation-opportunities/SKILL.md`

## `$prototype-variants`
Explicit-only; Pack `frontend`. Builds genuinely different versions of one UI piece behind a live visual picker, then promotes the chosen one.
- **Use when:** a human or the design-phase variant-round and promote gates need variants on the real route. **Not for:** throwaway logic prototypes (`$prototype`).
- **Steps:** scope; recon; choose directions; build the picker harness; verify and hand off; promote on selection.
- **Calls:** none. **Called by:** `$design-phase` (variant-round, promote). **Writes:** variant code. **Stops / gates:** promote only on a selection.
- **Source:** `.agents/skills/prototype-variants/SKILL.md`

## `$emil-design-eng`
Model-invoked; Pack `frontend`. Emil Kowalski's UI polish bar: component design, animation decisions, invisible details.
- **Use when:** building or critiquing UI craft; design-phase variant-round craft bar. **Not for:** worst-case data (`$break-ui`); a motion review verdict (`$review-animations`).
- **Steps:** core philosophy; required review format; animation decision framework (whether, purpose, easing, duration); springs; component building principles.
- **Calls:** none. **Called by:** `$design-phase` (variant-round). **Writes:** code or review. **Stops / gates:** none.
- **Source:** `.agents/skills/emil-design-eng/SKILL.md`

## `$break-ui`
Model-invoked; Pack `frontend`. Feeds a UI worst-case data behind a dev-only "Demo data / Worst case" toggle and reports what broke, with a fix each.
- **Use when:** stress-test or edge-case requests; design-phase quality-gate (light) and promote (full + fix). **Not for:** visual critique (`$emil-design-eng`); motion (`$review-animations`).
- **Steps:** 1 map the surface; 2 build the worst case; 3 wire the toggle; 4 break it; 5 report (What broke, Decisions for you, What held up) and stop; 6 fix on request.
- **Calls:** none. **Called by:** `$design-phase` (quality-gate, promote). **Writes:** fixtures, toggle, fixes on request. **Stops / gates:** stops after the report unless fixing was asked.
- **Source:** `.agents/skills/break-ui/SKILL.md`

## `$mobile-native`
Model-invoked; Pack `frontend`. Makes a web app feel native on a phone: hover, tap, viewport, inputs, scroll, safe areas, gestures, browser chrome.
- **Use when:** web UI built or reviewed for mobile, PWAs, bottom sheets, carousels, touch; design-phase variant-round (responsive web) and quality-gate. **Not for:** motion (`$animate`); React Native (`$animate-expo`).
- **Steps:** symptom table → fixes; baseline; Never Ship table; output lists what needs a real phone.
- **Calls:** none. **Called by:** `$design-phase` (variant-round, quality-gate). **Writes:** code. **Stops / gates:** Never Ship table; real-hardware items stay open.
- **Source:** `.agents/skills/mobile-native/SKILL.md`

## `$docs-ingest-phase`
Model-invoked; Pack `docs`. Routes docs-affecting work through the project wiki contract into setup/adoption, source capture, health, private/internal ingest or public docs.
- **Use when:** specs need durable domain capture, public docs need writing, wiki routing changes, or code changes alter architecture, setup, contracts, operator workflow or user-facing behavior. **Not for:** Project Verifier Feature Maps (`$update-verification-skill`); writes to root `docs/`, which is legacy input only.
- **Steps:** router: 1 scope unclear → ask one question. 2 Resolve the wiki contract (six fields in `<wiki-root>/AGENTS.md`: location, raw home, canonical article tree, discovery entrypoints, source owners, validation commands) → `resolved | missing | conflicting`. 3 Branch, first match: setup/adoption | capture | health | private/internal | public | no-op. 4 A gap covering the destination → setup (with setup authority) or gap report + stop. Order: capture before ingest of that source; private before public. Each branch ends; re-enter the router.
- **Branches:** capture: bytes + SHA-256 → reuse by SHA or place → `git commit --only` → `scripts/verify-captured-source.mjs`; outcomes `not captured | saved-uncommitted | unverified | committed` (local commit, no push). Health: structural record per validation command + semantic record (`stale_claim | contradiction | missing_connection | discovery_gap`). Private/internal: learnings → flows → concepts → discovery → operations (`project/reference/`, `project/runbooks/`) → validation + outcome + log. Spec ingest freshness by `ingested_revision` + `sources[].sha256`. Public: small patch edits directly; substantial → private writer bundle via `$writing-fragments`, mandatory fragment sufficiency checkpoint, `$writing-beats`, `$writing-shape`, final page, meta/sidebar.
- **Calls:** `$writing-fragments`, `$writing-beats`, `$writing-shape`, `$show-me` (complex flows); `$docs-onboarding` after setup. **Called by:** `$delivery-phase` (`phases/docs-ingest.md`), `$create-plan` (novel wiki findings), `$requirements-grill` (wiki contract), `$bug-resolution-phase` (debt), human.
- **Writes:** `<wiki-root>/raw/<origin>/<slug>/<revision12>/<file>` + `source.json`; flow pages (`type: flow`), concept pages (`type: concept`), `meta.json`, discovery-map entries, `SPEC.md` / `IMPLEMENTATION-NOTES.md` ingest frontmatter, learning artifacts (`learning_type: bug|knowledge`), writer bundle `<wiki-root>/content/docs/project/public-docs/<slug>/{fragments,beats,shape}.md`, append-only `<wiki-root>/log.md` entries `## [YYYY-MM-DD] <capture|ingest|maintenance|grill|spec> | <subject>`.
- **Stops / gates:** stops when the path is done + outcome reported, no-op reason given, gap report written, a surface/policy/source is missing, or the fragment checkpoint waits. Setup authority = a user request this task or delegating guidance; adopt moves or deletes nothing. Writes no speculative future truth.
- **Source:** `.agents/skills/docs-ingest-phase/SKILL.md`, `phases/{router,private-internal,public-docs}.md`, `references/{wiki-contract,source-capture,health,wiki-ingest,learning-artifacts,flow-pages,concept-pages,fumadocs-routing,public-docs,legacy-root-docs}.md`

## `$docs-onboarding`
Model-invoked; Pack `docs`. Reconstructs initial wiki and spec context for an existing project.
- **Use when:** after `hi init` reports wiki structure `pass` and the wiki destination is usable. **Not for:** creating a wiki (`$docs-ingest-phase` setup); Finder intake (the human types a Finder wrapper).
- **Steps:** 1 Read the grill glossary. 2 Read repo + wiki guidance. 3 Backlog discovery: remote provider, then local clues; done when both lanes are covered or a location is asked. 4 Build + persist the Project Map before questions. 5 Targeted `$requirements-grill` on project-wide reconstruction decisions. 6 `$write-backlog` initialization: Root, Product Areas, Initiatives, `V*`, saved views. 7 Per accepted flow: `$requirements-phase` (`$create-architecture` before `$create-spec`); project only with exact existing Epic/Story + authority, else blocked delta + exact Finder invocation for the human. 8 Navigation/indexes.
- **Calls:** `$requirements-grill`, `$write-backlog`, `$requirements-phase`. **Called by:** `$hi-cli` (init), `$docs-ingest-phase` (after setup).
- **Writes:** `<wiki-root>/content/docs/project/onboarding/project-map.md`, `onboarding-grill-status.md`, `onboarding-grill-log.md`, `onboarding/index.mdx`, `onboarding/meta.json`, `project/meta.json`; reconstructed pairs with Evidence Level `Confirmed|Inferred|Contradicted|Missing`.
- **Stops / gates:** `Contradicted` / `Missing` block compilation; not-ready results leave no partial artifact and no mutation; invents no rationale, notes or debt; resumes from saved state.
- **Source:** `.agents/skills/docs-onboarding/SKILL.md`, `references/artifact-contract.md`

## `$writing-fragments`
Model-invoked; Pack `docs`. Mines raw material into a durable fragments document.
- **Use when:** public docs or articles before structure; docs-ingest's first writer stage. **Not for:** beats or page shape (`$writing-beats`, `$writing-shape`).
- **Steps:** standalone: ask the path once, re-read before write, append with `---`, keep user edits. Docs-ingest mode: private bundle, frontmatter `type: writer-artifact`, `artifact: fragments`, `target`, `source`, `updated`. Done when material is captured and leftovers are kept.
- **Calls:** none. **Called by:** `$docs-ingest-phase`. **Writes:** `fragments.md`. **Stops / gates:** docs-ingest fragment sufficiency checkpoint follows.
- **Source:** `.agents/skills/writing-fragments/SKILL.md`

## `$writing-beats`
Model-invoked; Pack `docs`. Turns fragments into an ordered journey of reader-facing beats.
- **Use when:** shaping a narrative or instructional path from fragments. **Not for:** the final page structure (`$writing-shape`).
- **Steps:** standalone: 2-3 starting options, one beat per write. Docs-ingest: read `fragments.md`, write `beats.md` with Accepted Beat Path + Parked Beats. Done when the journey ends where the page promise is met, gaps named.
- **Calls:** none. **Called by:** `$docs-ingest-phase`. **Writes:** `beats.md`. **Stops / gates:** none.
- **Source:** `.agents/skills/writing-beats/SKILL.md`

## `$writing-shape`
Model-invoked; Pack `docs`. Chooses the final structure for a public page from fragments and beats.
- **Use when:** turning beats into a publishable page plan. **Not for:** raw material mining (`$writing-fragments`).
- **Steps:** standalone: 2-3 openings, force a choice, grow by paragraph. Docs-ingest: read both, write `shape.md` (Page Promise, Structure, Format Decisions). Done when the structure is argued and the opening matches the body.
- **Calls:** none. **Called by:** `$docs-ingest-phase`. **Writes:** `shape.md`. **Stops / gates:** none.
- **Source:** `.agents/skills/writing-shape/SKILL.md`

## `$writing-for-agents`
Model-invoked; Pack `docs`. Reference for any agent-consumed document: skills, `AGENTS.md`, `CLAUDE.md`, pointer targets.
- **Use when:** creating or editing skills, `AGENTS.md` or `CLAUDE.md`. **Not for:** public-reader docs (`$docs-ingest-phase` public branch).
- **Steps:** apply context pointers, the two loads, information hierarchy and disclosure, completion criteria, split rules, leading words, positive phrasing, pruning; skills also read `SKILL-MECHANICS.md` (frontmatter, invocation, router skills).
- **Calls:** none. **Called by:** `$rule-authoring`, `$hi-cli` (init/update follow-through).
- **Writes:** nothing itself. **Stops / gates:** none.
- **Source:** `.agents/skills/writing-for-agents/SKILL.md`, `SKILL-MECHANICS.md`

## `$write-graph-based-skills`
Model-invoked; Pack `docs`. Authors skills as Durable Workflow Graphs: create, convert, repair.
- **Use when:** a skill needs routing, repair, cold resume or premature-completion defense. **Not for:** one atomic, cheap-to-restart action; write it as direct composition.
- **Steps:** router on every entry, earliest missing/stale phase: 1 qualify (obligation map; graph vs direct). 2 model-state (guards, steering terminal). 3 define-authority (direct > workflow-native > handoff > suggestion). 4 write-router (`SKILL.md` bootstrap + `phases/router.md`, no gate body in root). 5 write-phases (one `phases/<gate>.md` per gate: guard, inputs, action, invariants, evidence, exits, handoff). 6 define-handoffs (schema, storage, discovery, exit coverage). 7 verify-disclosure. 8 test-routes (ten scenarios). 9 audit, the only terminal.
- **Calls:** none. **Called by:** human.
- **Writes:** `<target-skill>/AUTHORING-HANDOFF.md`, target `SKILL.md`, `phases/router.md`, `phases/<gate>.md`, optional `references/`.
- **Stops / gates:** terminal `human_steering_required`; complete only after audit.
- **Source:** `.agents/skills/write-graph-based-skills/SKILL.md`, `phases/*.md`, `references/authoring-contract.md`

## `$rule-authoring`
Model-invoked; Pack `docs`. Maintains project-owned Codebase Rules after `hi init` or `hi update`.
- **Use when:** the `hi init` / `hi update` post-command handoff reaches rules. **Not for:** other edits to `AGENTS.md`; use `$writing-for-agents`.
- **Steps:** read or create `.agents/rules/index.md`; one invariant per scope-grouped rule file, backed by Code Evidence or an accepted decision; index by id, scope, path trigger, task trigger, tags, file; scoped `AGENTS.md` = scope + skill routing + one Registry pointer; evaluate activated rules `pass | fail | not-applicable`. Done when the index is exhaustive, pointers resolve, project rules are preserved.
- **Calls:** `$writing-for-agents`. **Called by:** `$hi-cli`.
- **Writes:** `.agents/rules/index.md`, `.agents/rules/<scope>/*.md`, scoped `AGENTS.md`.
- **Stops / gates:** keeps existing project rules.
- **Source:** `.agents/skills/rule-authoring/SKILL.md`, `references/migration.md`

## `$hi-cli`
Model-invoked; no Pack (installed by `hi operator install|update`). Operates `hi` / `hint` (`@punks/cli`) through init, update, diff, check, tools ensure, report, upgrade, operator and post-command flows.
- **Use when:** a user runs or asks about `hi`, `hint`, or generated `.devpunks/` work. **Not for:** Project Verifier work (`$create-verification-skill`, `$update-verification-skill` via `$implement-spec`).
- **Steps:** run one bounded command; classify; follow one branch of `references/post-command-flow.md`; stop at branch completion or an exact blocker. Init: read `.devpunks/installed.json`, `AGENT-HANDOFF.md`, `AGENT-SYSTEM-PROMPT.md`; `$writing-for-agents` then `$rule-authoring` to author `AGENTS.md` from `.devpunks/specs/prompts/**`; tailor `.agents/subagents/manifest.mjs`, rerun `hi update`; review `lint.scopes`; wiki structure check → `pass` activates `$docs-onboarding`; `hi check --json`. Update: row table, then the same two skills before completing a changed update. Report: activate `$retro` scoped to only the reported issue, put its findings into `--steps`, `--expected` and `--actual` (no project-environment fixes), then `hi report`.
- **Calls:** `$writing-for-agents`, `$rule-authoring`, `$docs-onboarding`, `$retro` (Pack `misc`; before `hi report`). **Called by:** human.
- **Writes:** root/scoped `AGENTS.md` with sibling `CLAUDE.md` symlinks, `.agents/subagents/manifest.mjs`; harness agent files only via `hi update`; Project Verifier references byte-preserved.
- **Stops / gates:** existing `.devpunks/` files create no work; the Registry installs no wiki.
- **Source:** `.agents/skills/hi-cli/SKILL.md`, `references/{post-command-flow,commands,wiki-structure,managed-lint}.md`

## Framework and language packs
All model-invoked unless marked. Read `.agents/skills/<name>/SKILL.md`.

- `$agent-browser` (`frontend`): browser automation, Lightpanda default, Chrome for rendering.
- `$animate` (`frontend`): build an animation in decision order, from whether to animate through exit; `$design-phase` variant-round uses it per accepted Motion Plan entry.
- `$review-animations` (`frontend`, explicit-only): critique motion code against a craft bar; `$design-phase` quality-gate requires its Approve.
- `$frontend-domain-structure` (`frontend`): fixed entities layer model (composition, features, entities, modules, integrations), frontend domain boundaries, Data Sources, imports, component splitting.
- `$backend-domain-structure` (`backend`, `python`): domain-first layers, thin transport.
- `$backend-recoverable-actions` (`backend`): transaction, retry, rollback, compensation for multi-step mutations.
- `$logging-best-practices` (`backend`): wide events, canonical log lines.
- `$effect` (`effect`): Effect v4 workflows, schemas, config, streams, HTTP, Atom, tests.
- `$effect-backend-structure` (`effect`): Effect module, action, repository and Layer layout.
- `$effect-recoverable-actions` (`effect`): Effect recoverability for chained operations.
- `$effect-service-design` (`effect`): Effect service and Layer design or audit.
- Pack `expo`: `$add-app-clip`, `$animate-expo`, `$building-native-ui`, `$eas-simulator`, `$eas-update-insights`, `$expo-api-routes`, `$expo-brownfield`, `$expo-cicd-workflows`, `$expo-deployment`, `$expo-dev-client`, `$expo-examples`, `$expo-module`, `$expo-observe`, `$expo-skill-eval`, `$expo-tailwind-setup`, `$expo-ui`, `$native-data-fetching`, `$upgrading-expo`, `$use-dom`, `$web-to-native`: one Expo/EAS topic each, named by the skill.
- `$next-best-practices` (`nextjs`): file conventions, RSC, data, metadata, route handlers.
- `$next-cache-components` (`nextjs`): Next 16 PPR, `use cache`, cacheLife/cacheTag/updateTag.
- `$async-react-patterns` (`react`): React 19 Actions, useActionState, useOptimistic, Suspense.
- `$react-doctor` (`react`): only on explicit request or React runtime API overlap.
- `$vercel-composition-patterns` (`react`): compound components, fewer boolean props.
- `$vercel-react-best-practices` (`react`): React/Next performance.
- Pack `pulumi`: `$pulumi-overview` (route any IaC task), `$pulumi-best-practices`, `$pulumi-component`, `$pulumi-automation-api`, `$pulumi-esc`, `$provider-upgrade`, `$package-usage`.
- Pack `python`: `$async-python-patterns`, `$python-backend-structure`, `$python-code-style`, `$python-design-patterns`, `$python-testing-patterns`.
- `$quality-types` (`typescript`): branded types, unions, real tests, OpenTelemetry.
- `$model-checking` (`typescript`): tsprover Models of shared-state, job, resync and delivery flows; traces become Pinned Replays.
- `$tanstack-query` (`tanstack-query`): server state with TanStack Query v5.
- `$turborepo` (`turborepo`): tasks, cache, filters, boundaries.
- `$sqlalchemy-schema-design` (`sqlalchemy`): SQLAlchemy 2.x models, Alembic.
- `$better-auth-best-practices` (`better-auth`): Better Auth integration.
- `$elysiajs` (`elysia`): ElysiaJS backend.
- Pack `video` (optional): `$cinetic` (code-made films and motion design with Remotion or HyperFrames), `$earshot` (listen to judge, trim or compare sound), `$real-sound` (soundtracks from real licensed recordings).
