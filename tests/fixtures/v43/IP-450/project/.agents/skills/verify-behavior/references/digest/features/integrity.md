# Integrity

Authority: [product.md](../../../../../../product.md).
User behavior/entry: check an exported payload in the run-owned digest directory.
Prerequisites: Repository Commit proof and Digest Doctor.
Driver: use the app's optional check helper with exported committed bytes.
Positive end state: digest accepts unchanged export. Scenario Falsifier: corrupted
export is accepted against the original manifest. Relevant Negative Condition:
append corruption to the export, check against unchanged manifest, expect nonzero
status; inspect actual downstream bytes and original committed bytes to establish
that rejection preserved the committed source. Side effects: export and manifest
under scratch. Variant: corrupt export. Gotcha: keep the original manifest when
corrupting bytes; regenerating it would weaken the falsifier.
