---
name: prototype-phase
description: Run a standalone human-evaluated prototype when Wayfinder routes an uncertain product or technical claim to experimentation.
disable-model-invocation: true
---

# Prototype Phase

Own one claim from construction through a human verdict, then return evidence
to Wayfinder. Use the `prototype` skill to build the throwaway artifact.

## Steps

1. Claim one precise question. Record the expected learning and source ticket.
2. Use the `prototype` skill on `prototype/<slug>`. Do not merge prototype code
   into production.
3. Give the user the run command. When alternatives exist, use `$show-me` to
   present each variant's meaningful differences, evidence, and constraints
   before asking for a natural-language verdict: accept, iterate, or reject. A
   visual supports the verdict; it does not supply one.
4. On iterate, update `PROTOTYPE-VERDICT.md` with the observed evidence,
   rejected alternatives, risks, and requested change; commit it, keep this
   phase active, and rebuild only what the feedback tests.
5. On accept or reject, finalize `PROTOTYPE-VERDICT.md` beside the artifact using
   [VERDICT-TEMPLATE.md](VERDICT-TEMPLATE.md), commit it, and establish remote retention by pushing the throwaway branch or using an explicit durable retention mechanism. Verify the remote ref contains the evidence commit before returning the immutable commit SHA and path to `finder-phase`.
6. On reject, record the rejection rationale and leave the original question
   unresolved for `finder-phase`; rejection closes this artifact, not the
   decision frontier.

## Completion

- Accept and reject return to `finder-phase`; iterate updates the verdict and
  remains here.
- Wayfinder recomputes the frontier. It may route next to grilling, research,
  another prototype, or `create-spec`; no route is mandatory.
- The verdict is evidence, not production authorization.
