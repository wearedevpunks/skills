const DEPTHS = ["Business", "Functional", "Technical"];
const CONFLICT_IDENTITIES = ["ambiguous", "duplicate", "conflict"];
const isStableIdentity = (value) =>
  typeof value === "string" && value.trim().length > 0;

const hasExactBusinessProjection = (child) =>
  isStableIdentity(child?.projectedProductArea) &&
  isStableIdentity(child.projectedInitiative) &&
  isStableIdentity(child.projectedEpic) &&
  child.hierarchyReadback === "exact";

const businessChildCollectionConflicts = (children) => {
  if (!Array.isArray(children)) return false;
  return (
    children.length > 1 ||
    children.some(
      (child) =>
        !child ||
        child.identity !== "exact" ||
        (child.status === "accepted" &&
          child.scope === "in-scope" &&
          child.projection === "read-back" &&
          !hasExactBusinessProjection(child)),
    )
  );
};

const deriveBusinessStageRoute = (state) => {
  if (!Array.isArray(state.businessChildren)) {
    return state.business === "accepted"
      ? "human-steering"
      : "business-grilling";
  }
  if (state.businessChildren.length === 0) {
    return state.business === "accepted"
      ? "human-steering"
      : "business-grilling";
  }

  const [child] = state.businessChildren;
  if (child.status !== "accepted" || child.scope !== "in-scope") {
    return "business-grilling";
  }
  if (child.resolution !== "immutable") return "human-steering";
  if (child.projection !== "read-back") return "reconcile";
  if (!hasExactBusinessProjection(child)) return "human-steering";
  return "ready";
};

const childCollectionConflicts = (children, foreignKey) => {
  if (!Array.isArray(children)) return false;

  const seen = new Set();
  for (const child of children) {
    if (!child || CONFLICT_IDENTITIES.includes(child.identity)) return true;
    const key = child[foreignKey];
    if (!isStableIdentity(key)) return true;
    if (seen.has(key)) return true;
    seen.add(key);
  }

  return false;
};

const functionalProjectionConflicts = (children, businessChildren) => {
  if (!Array.isArray(children)) return false;

  const projectedEpic = businessChildren?.[0]?.projectedEpic;
  const stories = new Set();
  for (const child of children) {
    if (
      child?.status !== "accepted" ||
      child.scope !== "in-scope" ||
      child.projection !== "read-back"
    ) {
      continue;
    }
    if (
      !isStableIdentity(projectedEpic) ||
      !isStableIdentity(child.projectedStory) ||
      child.projectedStoryParentEpic !== projectedEpic ||
      !isStableIdentity(child.projectedStoryMilestone) ||
      child.projectedStoryMilestoneKind !== "V*" ||
      child.projectedStoryFogLink !== "exact" ||
      child.projectedStorySourceLink !== "exact" ||
      child.projectedStoryMembershipReadback !== "exact"
    ) {
      return true;
    }
    if (stories.has(child.projectedStory)) return true;
    stories.add(child.projectedStory);
  }
  return false;
};

const technicalProjectionConflicts = (children, functionalChildren) => {
  if (!Array.isArray(children)) return false;

  const storyMilestones = new Map(
    (Array.isArray(functionalChildren) ? functionalChildren : [])
      .filter(
        (child) =>
          child?.status === "accepted" &&
          child.scope === "in-scope" &&
          child.projection === "read-back" &&
          isStableIdentity(child.projectedStory) &&
          isStableIdentity(child.projectedStoryMilestone),
      )
      .map((child) => [child.projectedStory, child.projectedStoryMilestone]),
  );
  const taskIds = new Set();
  const tasks = [];
  for (const child of children) {
    if (
      child?.status !== "accepted" ||
      child.scope !== "in-scope" ||
      child.projection !== "read-back"
    ) {
      continue;
    }
    const storyMilestone = storyMilestones.get(child.story);
    if (
      !isStableIdentity(storyMilestone) ||
      child.taskGraphReadback !== "exact" ||
      !Array.isArray(child.projectedTasks) ||
      child.projectedTasks.length !== child.taskIntentCount
    ) {
      return true;
    }
    for (const task of child.projectedTasks) {
      if (
        !task ||
        !isStableIdentity(task.id) ||
        task.story !== child.story ||
        task.milestone !== storyMilestone ||
        task.readback !== "exact" ||
        !Array.isArray(task.blockedBy) ||
        task.blockedBy.some((identity) => !isStableIdentity(identity)) ||
        taskIds.has(task.id)
      ) {
        return true;
      }
      taskIds.add(task.id);
      tasks.push(task);
    }
  }

  const taskGraph = new Map(tasks.map((task) => [task.id, task.blockedBy]));
  for (const task of tasks) {
    if (
      new Set(task.blockedBy).size !== task.blockedBy.length ||
      task.blockedBy.includes(task.id) ||
      task.blockedBy.some((identity) => !taskGraph.has(identity))
    ) {
      return true;
    }
  }

  const visiting = new Set();
  const visited = new Set();
  const hasCycle = (taskId) => {
    if (visiting.has(taskId)) return true;
    if (visited.has(taskId)) return false;
    visiting.add(taskId);
    if (taskGraph.get(taskId).some(hasCycle)) return true;
    visiting.delete(taskId);
    visited.add(taskId);
    return false;
  };
  if ([...taskGraph.keys()].some(hasCycle)) return true;

  return false;
};

const technicalSelectionConflicts = ({
  selectedStoryIntents,
  selectedStories,
  functionalChildren,
}) => {
  if (!Array.isArray(selectedStories) || selectedStories.length === 0) {
    return false;
  }

  const selectedIntents = new Set(
    Array.isArray(selectedStoryIntents) ? selectedStoryIntents : [],
  );
  const selectedFunctionalChildren = (
    Array.isArray(functionalChildren) ? functionalChildren : []
  ).filter(
    (child) =>
      selectedIntents.has(child.storyIntent) &&
      child.status === "accepted" &&
      child.scope === "in-scope" &&
      child.projection === "read-back",
  );

  return (
    new Set(selectedStories).size !== selectedStories.length ||
    selectedStories.some(
      (story) =>
        !isStableIdentity(story) ||
        selectedFunctionalChildren.filter(
          (child) => child.projectedStory === story,
        ).length !== 1,
    )
  );
};

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
      .some(
        ([child]) =>
          child.identity !== "exact" ||
          child.resolution !== "immutable" ||
          !validateAcceptedChild(child),
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
  if (
    businessChildCollectionConflicts(state.businessChildren) ||
    childCollectionConflicts(state.functionalChildren, "storyIntent") ||
    childCollectionConflicts(state.technicalChildren, "story") ||
    functionalProjectionConflicts(
      state.functionalChildren,
      state.businessChildren,
    ) ||
    technicalProjectionConflicts(
      state.technicalChildren,
      state.functionalChildren,
    )
  ) {
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
  if (state.business !== "accepted") {
    if (
      state.targetDepth !== "Business" &&
      state.business === "missing" &&
      state.businessPathIdentity === "exact" &&
      state.businessPathDecision === "reuse-unchanged"
    ) {
      return "adopt-business-path";
    }
    return "business-grilling";
  }
  const businessRoute = deriveBusinessStageRoute(state);
  if (businessRoute !== "ready") return businessRoute;
  if (state.targetDepth === "Business") return "return-target";

  const functionalRoute = deriveChildStageRoute({
    selected: state.selectedStoryIntents,
    children: state.functionalChildren,
    foreignKey: "storyIntent",
    grillingRoute: "functional-grilling",
  });
  if (functionalRoute !== "ready") return functionalRoute;
  if (state.targetDepth === "Functional") return "return-target";
  if (technicalSelectionConflicts(state)) return "human-steering";

  const technicalRoute = deriveChildStageRoute({
    selected: state.selectedStories,
    children: state.technicalChildren,
    foreignKey: "story",
    grillingRoute: "technical-grilling",
    validateAcceptedChild: (child) =>
      child.specReadiness === "agent-ready" &&
      child.stableBlob === "verified" &&
      Number.isInteger(child.taskIntentCount) &&
      child.taskIntentCount > 0,
  });
  if (technicalRoute !== "ready") return technicalRoute;
  return "return-target";
};
