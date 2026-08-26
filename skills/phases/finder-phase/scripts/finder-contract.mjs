const DEPTHS = ["Business", "Functional", "Technical"];
const CONFLICT_IDENTITIES = ["ambiguous", "duplicate", "conflict"];

const deriveChildStageRoute = ({
  selected,
  children,
  foreignKey,
  grillingRoute,
  validateAcceptedChild = () => true,
}) => {
  if (!Array.isArray(selected)) return grillingRoute;
  if (selected.length === 0) return grillingRoute;
  if (new Set(selected).size !== selected.length) return "human-steering";

  const matchesBySelected = selected.map((selectedIdentity) =>
    (Array.isArray(children) ? children : []).filter(
      (child) => child[foreignKey] === selectedIdentity,
    ),
  );

  if (
    matchesBySelected.some(
      (matches) =>
        matches.length > 1 ||
        matches.some((child) => CONFLICT_IDENTITIES.includes(child.identity)),
    )
  ) {
    return "human-steering";
  }

  if (
    matchesBySelected
      .filter(
        (matches) =>
          matches.length === 1 &&
          matches[0].status === "accepted" &&
          matches[0].scope === "in-scope",
      )
      .some(([child]) => !validateAcceptedChild(child))
  ) {
    return "human-steering";
  }

  if (
    matchesBySelected
      .filter(
        (matches) =>
          matches.length === 1 &&
          matches[0].status === "accepted" &&
          matches[0].scope === "in-scope",
      )
      .some(([child]) => child.projection !== "read-back")
  ) {
    return "reconcile";
  }

  if (
    matchesBySelected.some(
      (matches) =>
        matches.length !== 1 ||
        matches[0].status !== "accepted" ||
        matches[0].scope !== "in-scope",
    )
  ) {
    return grillingRoute;
  }

  return "ready";
};

export const deriveFinderRoute = (state) => {
  if (!DEPTHS.includes(state.targetDepth)) return "human-steering";
  if (state.humanSteering === "required") return "human-steering";
  if (CONFLICT_IDENTITIES.includes(state.fogIdentity)) {
    return "human-steering";
  }
  if (state.fogIdentity !== "exact") return "ensure-fog";
  if (CONFLICT_IDENTITIES.includes(state.businessIdentity)) {
    return "human-steering";
  }
  if (state.acceptedEvidence === "conflict") return "human-steering";
  if (state.scopeExpansion === "approval-required") {
    return "scope-expansion-checkpoint";
  }
  if (state.support === "research") return "research";
  if (state.support === "prototype") return "prototype";
  if (state.businessEvidenceScope === "out-of-scope") {
    return "business-grilling";
  }
  if (!["accepted"].includes(state.business)) return "business-grilling";
  if (state.businessProjection !== "read-back") return "reconcile";
  if (state.targetDepth === "Business") return "return-target";

  const functionalRoute = deriveChildStageRoute({
    selected: state.selectedStoryIntents,
    children: state.functionalChildren,
    foreignKey: "storyIntent",
    grillingRoute: "functional-grilling",
  });
  if (functionalRoute !== "ready") return functionalRoute;
  if (state.targetDepth === "Functional") return "return-target";

  const technicalRoute = deriveChildStageRoute({
    selected: state.selectedStories,
    children: state.technicalChildren,
    foreignKey: "story",
    grillingRoute: "technical-grilling",
    validateAcceptedChild: (child) =>
      child.resolution === "immutable" &&
      child.specReadiness === "agent-ready" &&
      child.stableBlob === "verified" &&
      Number.isInteger(child.taskIntentCount) &&
      child.taskIntentCount > 0,
  });
  if (technicalRoute !== "ready") return technicalRoute;
  return "return-target";
};
