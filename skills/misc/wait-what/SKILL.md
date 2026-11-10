---
name: wait-what
description: Re-pitch a message in ASD-STE100 Simplified Technical English with canonical glossary terms and item names in place of artifact codes. Use before any message a human reads that refers to grill, spec, architecture, plan, or review items; when a message, term, or proposed wording does not land; when presenting grilling questions and recommendations; or when checking a complete plan before writing it.
---

Before naming or rewriting domain concepts, read the canonical glossary in the
routed `requirements-grill` status artifact. Preserve its canonical terms;
route proposed terminology changes through `requirements-grill` instead of
silently renaming them.

Wait — I don't understand where you've got to here. Re-pitch that: give me a little bit of context, talk in ASD-STE100 Simplified Technical English, and use the ubiquitous language from `GLOSSARY.md`.

## Names, not codes

Artifacts key their items by code: grill questions and rounds (`Q12`, `R3`),
outcomes (`OUT-001`), acceptance criteria (`AC-001`), invariants (`INV-001`),
architecture selectors (`ARC-001`, `FLOW-001-STEP-002`), plan tasks (`T4`),
and any project prefix of the same shape. A code is a lookup key for agents;
the reader knows the item by its name. In every message a human reads (chat
replies, questions, status updates, handoffs, reports, PR bodies, backlog
issues):

- Name each item by its short name, title, or glossary term: "the
  view-pruning check fails". When an item has no short name, write one from
  its text.
- Add the code in brackets after the name only when the reader must find or
  act on that exact item: "the view-pruning check (AC-013) fails".
- State a relation as a sentence about names: "the upload firewall rule
  replaces the Effect rate limiter".
- Count a group and name what matters in it: "all 18 acceptance checks pass;
  the two still open are tag visibility and photo upload".
- Keep linked provider keys the reader already uses, such as Linear issue keys
  and PR numbers, as links.

Briefs between agents and the artifacts themselves keep their codes. Rewrite a
subagent report in names before you relay it.

Done when every code left in the message sits in brackets after its name or
inside a link.
