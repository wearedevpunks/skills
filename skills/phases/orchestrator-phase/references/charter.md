# Charter Contract

`.orchestrator/<run>/charter.md` holds the run's rules and binds each role to
the project's real tools. The Orchestrator writes it at run start, shows it in
its first report, and amends it in place when the human changes a rule.

## Sections

1. **Host.** The [Host binding](hosts.md) table this run uses.
2. **Repositories.** Per repository: local path, host project, default branch,
   git host.
3. **Integration branch.** "none", or its name, base and the reason (expected
   final PR above about 1.5 million changed lines).
4. **Merge style.** Squash. Rebase of an Integration branch is allowed.
5. **Review gate.** Per repository: the checks and the PR review mechanism
   that must be clean on the ready commit.
6. **Targets.** Per repository and environment: release or deploy command,
   guard command, and `autonomous` or `Human Gate`.
7. **Secret stores.** The vault, the env manager and the CLI that reads and
   writes each.
8. **Human Gates.** The four gates of the skill plus any the human adds.
9. **Model settings.** Model and options for Tracks and for Workers.
10. **People.** Colleagues whose open PRs to check for overlap before a
    Track opens one.
11. **Test identities.** Accounts Workers use for verification, by store
    reference, never by value.
