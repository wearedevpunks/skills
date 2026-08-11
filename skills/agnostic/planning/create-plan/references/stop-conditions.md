# Stop Conditions

Use this reference to close the planning run.

## Stop here

Yield after planning.

Stop after:

- the plan file is complete
- eligible in-scope backlog sync is complete, or `PLAN.md` records the explicit
  skip reason for a planning-only request and can continue plan completion

Do not:

- spawn implementation workers
- edit code beyond the plan artifact
- drift into implementation discussion that belongs in execution
