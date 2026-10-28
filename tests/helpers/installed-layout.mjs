// Consumers install every skill flat at `.agents/skills/<id>`, so a relative link resolves in that layout,
// not in the categorised source tree. `resolveInstalled` maps a link to the source file it reaches there.
import { existsSync, readdirSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

export const repoRoot = path.dirname(path.dirname(path.dirname(fileURLToPath(import.meta.url))));
const sourceRoot = path.join(repoRoot, "skills");
const installedRoot = path.join(path.sep, "installed");

const walk = (directory) =>
  readdirSync(directory).flatMap((name) => {
    const full = path.join(directory, name);
    return statSync(full).isDirectory() ? walk(full) : [full];
  });

/** Every source file below `skills/`. */
export const sourceFiles = () => walk(sourceRoot);

const skillDirectories = new Map(
  walk(sourceRoot)
    .filter((file) => path.basename(file) === "SKILL.md")
    .map((file) => [path.basename(path.dirname(file)), path.dirname(file)]),
);

/** Source directory of the skill that owns `file`, or undefined outside a skill. */
export const owningSkill = (file) => {
  let directory = path.dirname(path.resolve(repoRoot, file));
  while (directory.startsWith(sourceRoot) && !existsSync(path.join(directory, "SKILL.md"))) {
    directory = path.dirname(directory);
  }
  return directory.startsWith(sourceRoot) ? directory : undefined;
};

/**
 * Source path that the relative link `target` (no fragment) in source `file` reaches once installed, or
 * undefined when it reaches no installed skill file.
 */
export const resolveInstalled = (file, target) => {
  const absolute = path.resolve(repoRoot, file);
  const skill = owningSkill(absolute);
  if (skill === undefined) return undefined;
  const from = path.join(installedRoot, path.basename(skill), path.relative(skill, path.dirname(absolute)));
  const [id, ...rest] = path.relative(installedRoot, path.resolve(from, target)).split(path.sep);
  const directory = skillDirectories.get(id);
  const resolved = directory === undefined ? undefined : path.join(directory, ...rest);
  return resolved !== undefined && existsSync(resolved) ? resolved : undefined;
};
