const Task = require("../models/Task");
const List = require("../models/List");
const Board = require("../models/Board");
const Project = require("../models/Project");

// Mirrors the frontend routes in App.jsx. Pure so it's easy to test.
const composeLink = ({ clientUrl, workspaceId, projectId, boardId, taskId }) => {
  const base = (clientUrl || "http://localhost:5173").replace(/\/$/, "");
  if (workspaceId && projectId && boardId && taskId) {
    return `${base}/w/${workspaceId}/p/${projectId}/board/${boardId}?task=${taskId}`;
  }
  if (workspaceId && projectId && boardId) {
    return `${base}/w/${workspaceId}/p/${projectId}/board/${boardId}`;
  }
  if (workspaceId && projectId) return `${base}/w/${workspaceId}/p/${projectId}`;
  return `${base}/workspaces`;
};

// Best-effort deep link for a notification. Any lookup failure falls back to
// a less specific link — an email should never fail to send over a link.
const resolveNotificationLink = async ({ relatedTask, relatedProject }) => {
  const clientUrl = process.env.CLIENT_URL;
  try {
    if (relatedTask) {
      const task = await Task.findById(relatedTask);
      const list = task && (await List.findById(task.list));
      const board = list && (await Board.findById(list.board));
      const project = board && (await Project.findById(board.project));
      if (project) {
        return composeLink({
          clientUrl,
          workspaceId: project.workspace,
          projectId: project._id,
          boardId: board._id,
          taskId: task._id,
        });
      }
    }
    if (relatedProject) {
      const project = await Project.findById(relatedProject);
      if (project) return composeLink({ clientUrl, workspaceId: project.workspace, projectId: project._id });
    }
  } catch (error) {
    // fall through to the generic link
  }
  return composeLink({ clientUrl });
};

module.exports = { composeLink, resolveNotificationLink };