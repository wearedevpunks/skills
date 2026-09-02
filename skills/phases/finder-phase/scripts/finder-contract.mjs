const LENSES = ["Business", "Functional"];
const CONFLICTS = ["ambiguous", "conflict", "duplicate"];

const conflicts = (value) => CONFLICTS.includes(value);
const stable = (value) => typeof value === "string" && value.trim().length > 0;

const childConflict = (children) => {
  if (!Array.isArray(children)) return true;
  const ids = new Set();
  for (const child of children) {
    if (!child || child.identity !== "exact" || !stable(child.id) || ids.has(child.id)) {
      return true;
    }
    ids.add(child.id);
  }
  return false;
};

export const deriveFinderRoute = (state) => {
  if (!LENSES.includes(state.targetLens)) return "human-steering";
  if (state.humanSteering === "required") return "human-steering";
  if (conflicts(state.fogIdentity)) return "human-steering";
  if (state.fogIdentity !== "exact") return "ensure-fog";
  if (!LENSES.includes(state.intakeLens)) return "human-steering";

  if (childConflict(state.grillingChildren)) return "human-steering";
  if (state.selection?.decision === "ambiguous") return "human-steering";
  if (
    state.selection?.decision === "reuse" &&
    !state.grillingChildren?.some(
      (child) => child.id === state.selection.childId,
    )
  ) {
    return "human-steering";
  }

  if (state.support?.decision === "ambiguous") return "human-steering";
  if (["requested", "pending"].includes(state.support?.status)) {
    return "human-steering";
  }
  if (state.support?.status === "unresolved") {
    if (
      !state.grillingChildren?.some(
        (child) => child.id === state.support.supports,
      )
    ) {
      return "human-steering";
    }
    if (state.support.kind === "Research") return "research";
    if (state.support.kind === "Prototype") return "prototype";
    return "human-steering";
  }

  if (state.projection?.status === "ambiguous") return "human-steering";
  if (["pending", "read-back"].includes(state.projection?.status)) {
    const ceiling =
      state.targetLens === "Business"
        ? new Set(["ProductArea", "Initiative"])
        : new Set(["ProductArea", "Initiative", "Epic"]);
    if (
      !Array.isArray(state.projection.kinds) ||
      state.projection.kinds.some((kind) => !ceiling.has(kind))
    ) {
      return "human-steering";
    }
  }
  if (state.projection?.status === "pending") return "reconcile";
  if (state.boundedResult === "ready") return "return-target";
  return "grilling";
};
