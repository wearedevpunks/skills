const failure = (code, details = {}) => ({ ok: false, code, ...details });

const stableId = (value) => typeof value === "string" && value.trim() === value && value.length > 0;

/**
 * Validate the complete provider-neutral Task graph before any provider write.
 * Milestone order contains stable V* identities from earliest to latest.
 */
export const validateTaskBlockerGraph = ({ milestoneOrder, stories, tasks } = {}) => {
  if (
    !Array.isArray(milestoneOrder) ||
    !Array.isArray(stories) ||
    stories.length === 0 ||
    !Array.isArray(tasks) ||
    tasks.length === 0
  ) {
    return failure("GRAPH_REQUIRED");
  }

  const milestoneRank = new Map();
  for (const milestoneId of milestoneOrder) {
    if (!stableId(milestoneId)) return failure("MILESTONE_ID_REQUIRED");
    if (milestoneRank.has(milestoneId)) {
      return failure("MILESTONE_ID_DUPLICATE", { milestoneId });
    }
    milestoneRank.set(milestoneId, milestoneRank.size);
  }

  const storiesById = new Map();
  for (const story of stories) {
    if (!story || !stableId(story.id)) return failure("STORY_ID_REQUIRED");
    if (storiesById.has(story.id)) return failure("STORY_ID_DUPLICATE", { storyId: story.id });
    if (!Array.isArray(story.milestoneIds) || story.milestoneIds.length !== 1) {
      return failure("STORY_MILESTONE_CARDINALITY", { storyId: story.id });
    }
    const [milestoneId] = story.milestoneIds;
    if (!stableId(milestoneId) || !milestoneRank.has(milestoneId)) {
      return failure("STORY_MILESTONE_UNKNOWN", { storyId: story.id, milestoneId });
    }
    storiesById.set(story.id, story);
  }

  const tasksById = new Map();
  for (const task of tasks) {
    if (!task || !stableId(task.id)) return failure("TASK_ID_REQUIRED");
    if (tasksById.has(task.id)) return failure("TASK_ID_DUPLICATE", { taskId: task.id });
    tasksById.set(task.id, task);
  }

  const orderedTasks = [...tasksById.values()].sort((left, right) => left.id.localeCompare(right.id));
  const taskCountByStory = new Map([...storiesById.keys()].map((storyId) => [storyId, 0]));
  for (const task of orderedTasks) {
    if (!Array.isArray(task.milestoneIds) || task.milestoneIds.length !== 1) {
      return failure("MILESTONE_CARDINALITY", { taskId: task.id });
    }
    const [milestoneId] = task.milestoneIds;
    if (!stableId(milestoneId) || !milestoneRank.has(milestoneId)) {
      return failure("MILESTONE_UNKNOWN", { taskId: task.id, milestoneId });
    }
    if (!stableId(task.storyId)) {
      return failure("PARENT_STORY_ID_REQUIRED", { taskId: task.id });
    }
    const parentStory = storiesById.get(task.storyId);
    if (!parentStory) {
      return failure("PARENT_STORY_MISSING", { taskId: task.id, storyId: task.storyId });
    }
    if (parentStory.milestoneIds[0] !== milestoneId) {
      return failure("TASK_STORY_MILESTONE_MISMATCH", {
        taskId: task.id,
        storyId: task.storyId,
        storyMilestoneId: parentStory.milestoneIds[0],
        taskMilestoneId: milestoneId,
      });
    }
    if (!Array.isArray(task.blockedBy)) return failure("BLOCKERS_REQUIRED", { taskId: task.id });
    taskCountByStory.set(task.storyId, taskCountByStory.get(task.storyId) + 1);
  }

  for (const [storyId, taskCount] of taskCountByStory) {
    if (taskCount === 0) return failure("STORY_TASK_REQUIRED", { storyId });
  }

  const edges = [];
  for (const task of orderedTasks) {
    const blockingTaskIds = [...task.blockedBy].sort((left, right) =>
      String(left).localeCompare(String(right)),
    );
    for (const blockingTaskId of blockingTaskIds) {
      if (!stableId(blockingTaskId)) {
        return failure("BLOCKER_ID_REQUIRED", { blockedTaskId: task.id });
      }
      const blockingTask = tasksById.get(blockingTaskId);
      if (!blockingTask) {
        return failure("BLOCKER_TARGET_MISSING", {
          blockedTaskId: task.id,
          blockingTaskId,
        });
      }
      if (blockingTaskId === task.id) return failure("SELF_EDGE", { taskId: task.id });
      if (
        milestoneRank.get(blockingTask.milestoneIds[0]) > milestoneRank.get(task.milestoneIds[0])
      ) {
        return failure("FUTURE_BLOCKER", {
          blockedTaskId: task.id,
          blockingTaskId,
        });
      }
      edges.push({ blockedTaskId: task.id, blockingTaskId });
    }
  }

  const state = new Map();
  const visit = (taskId, path) => {
    if (state.get(taskId) === "visiting") {
      return failure("CYCLE", { cycle: [...path.slice(path.indexOf(taskId)), taskId] });
    }
    if (state.get(taskId) === "visited") return null;

    state.set(taskId, "visiting");
    const task = tasksById.get(taskId);
    for (const blockingTaskId of [...task.blockedBy].sort()) {
      const cycle = visit(blockingTaskId, [...path, taskId]);
      if (cycle) return cycle;
    }
    state.set(taskId, "visited");
    return null;
  };

  for (const task of orderedTasks) {
    const cycle = visit(task.id, []);
    if (cycle) return cycle;
  }

  return { ok: true, taskIds: orderedTasks.map(({ id }) => id), edges };
};
