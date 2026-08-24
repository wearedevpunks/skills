---
name: handback
description: Hand control back when a blocker or proposed next step crosses accepted goal bounds, changes accepted requirements, weakens a gate, or substantially redesigns implementation.
---

# Handback

Autonomy applies only while the next action remains inside the accepted goal.

Return `human_steering_required` with:

- initial goal and accepted bounds
- current phase and last known-good state
- attempts and evidence
- blocker and what it prevents
- proposed next action
- why it changes scope or authority
- exact human decision required

Preserve completed in-bounds work, then stop. The authority guard passes only
on explicit human authorization for the proposed next action. A proposal is not
authority. “All steps”, “full
delivery”, “do not stop”, and equivalent persistence language apply only within
accepted bounds.

`human_steering_required` is a terminal, non-success outcome. Expanded design,
implementation, delegation, and recursive review begin only after authority.
