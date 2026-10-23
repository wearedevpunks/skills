# Standards Axis

This Axis Run checks whether the change conforms to the repository's
documented standards. The source context holds them: the `AGENTS.md` chain of
the touched paths, the matched Codebase Rules, and the `SKILL.md` of each skill
the plan assigned. Requirements belong to the Spec Axis Run.

Check every changed file against every rule that applies to its path. Place
each finding on the changed line it concerns.

## Hard rules

A documented standard from the source context is a hard rule. A change that
breaks one is a finding at P0, P1 or P2 by its impact. The body cites the
source file and quotes the rule. Where a linter, formatter or type checker
already enforces a rule, that tool owns it.

Apply the hard rules to these concerns:

- **Security:** a concrete risk the change introduces, such as injection,
  secret exposure, a missing authorization check or unsafe input handling.
  Name the input path and the impact; category `security`.
- **Architecture:** code placed in a module or surface that the source context
  assigns to another owner; a changed producer (schema, contract, client, env,
  config, callback) whose consumers did not move with it in the change.
- **Skill guidance:** each assigned skill's `SKILL.md` is guidance the change
  claims to follow. A changed artifact that contradicts it is a finding; cite
  the skill file and its rule.

## Smell baseline

Fowler code smells (_Refactoring_, ch. 3) apply even where the repository
documents nothing. Each smell is a judgement call: report it at P3, as
information, with category `maintainability`, titled as possible ("possible
Feature Envy") and quoting the hunk. Where a documented standard endorses the
pattern, the standard wins and the smell drops.

- **Mysterious Name:** a function, variable or type whose name hides what it
  does or holds. Fix: rename it; if no honest name comes, the design is murky.
- **Duplicated Code:** the same logic shape in more than one hunk or file.
  Fix: extract the shared shape and call it from both.
- **Feature Envy:** a method that reaches into another object's data more than
  its own. Fix: move it onto the data it envies.
- **Data Clumps:** the same few fields or parameters travel together. Fix:
  bundle them into one type and pass that.
- **Primitive Obsession:** a primitive or string stands in for a domain
  concept. Fix: give the concept its own small type.
- **Repeated Switches:** the same `switch` or `if` cascade on the same type
  recurs. Fix: polymorphism, or one map both sites share.
- **Shotgun Surgery:** one logical change forces scattered edits across many
  files. Fix: gather what changes together into one module.
- **Divergent Change:** one module is edited for several unrelated reasons.
  Fix: split it so each module changes for one reason.
- **Speculative Generality:** abstractions, parameters or hooks for needs the
  spec does not have. Fix: inline them until a real need shows.
- **Message Chains:** long `a.b().c().d()` navigation the caller depends on.
  Fix: hide the walk behind one method on the first object.
- **Middle Man:** a class or function that mostly delegates onward. Fix: call
  the real target directly.
- **Refused Bequest:** a subclass or implementer that ignores or overrides most
  of what it inherits. Fix: replace inheritance with composition.
