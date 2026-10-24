const TaskSubmission = require("../models/TaskSubmission");
const Task = require("../models/Task");
const List = require("../models/List");
const Board = require("../models/Board");
const resolveProjectRole = require("../utils/resolveProjectRole");

// Loads the submission, walks up its task -> list -> board -> project to
// resolve the user's effective role. Attaches req.submission, req.task,
// req.list, req.board, req.project, req.workspace, req.effectiveRole.
const requireSubmissionAccess = async (req, res, next) => {
  try {
    const submission = await TaskSubmission.findById(req.params.id);
    if (!submission) {
      return res.status(404).json({ message: "Submission not found" });
    }

    const task = await Task.findById(submission.task);
    if (!task) {
      return res.status(404).json({ message: "Parent task not found" });
    }

    const list = await List.findById(task.list);
    const board = await Board.findById(list.board);
    const { project, workspace, effectiveRole } = await resolveProjectRole(board.project, req.user._id);

    req.submission = submission;
    req.task = task;
    req.list = list;
    req.board = board;
    req.project = project;
    req.workspace = workspace;
    req.effectiveRole = effectiveRole;

    next();
  } catch (error) {
    return res.status(error.status || 400).json({ message: error.message || "Invalid submission id" });
  }
};

module.exports = { requireSubmissionAccess };