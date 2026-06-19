# Deepening

Use this reference when a shallow cluster should become a deeper module.

## Dependency Categories

### In-process

Pure computation, in-memory state, no I/O. Usually deepen directly and test through the new interface.

### Local-substitutable

Dependencies with local test stand-ins, such as an in-memory filesystem or local database. Test the deepened module with the stand-in.

### Remote but owned

Owned services across a network boundary. Define a port at the seam; production uses the transport adapter, tests use an in-memory adapter.

### True external

Third-party services. Inject the dependency behind a port and test with a mock adapter.

## Seam Discipline

- Do not introduce a seam unless behavior actually varies across it.
- A test adapter can justify a seam when it lets behavior be tested through the public interface.
- Do not expose internal seams just because tests use them.

## Replace, Do Not Layer

- Write new tests at the deepened module's interface.
- Delete shallow-module tests that become redundant.
- Assert observable outcomes through the interface.
- Avoid tests that must change when implementation internals move.
