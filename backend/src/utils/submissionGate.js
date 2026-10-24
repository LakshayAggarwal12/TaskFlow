// Pure helpers for the task-completion review gate — kept separate from
// moveTask so the actual decision logic can be unit tested without mocking
// Task/List models at all.

// A task can only enter a "Done" list once its latest submission has been
// approved.
const canEnterDoneList = (reviewStatus) => reviewStatus === "approved";

// Moving a task OUT of a Done list back into a regular list reopens it —
// any previous approval no longer applies, so it needs to be resubmitted.
// Moving between two non-Done lists, or between two Done lists, leaves the
// review status untouched.
const nextReviewStatusAfterMove = ({ reviewStatus, sourceIsDone, targetIsDone }) => {
  if (sourceIsDone && !targetIsDone) return "none";
  return reviewStatus;
};

module.exports = { canEnterDoneList, nextReviewStatusAfterMove };