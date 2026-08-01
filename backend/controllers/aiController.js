const Board = require("../models/Board");
const List = require("../models/List");
const Task = require("../models/Task");
const User = require("../models/User");
const asyncHandler = require("../utils/asyncHandler");
const { generateText, generateJSON } = require("../utils/geminiClient");
const escapeRegex = require("../utils/escapeRegex");

// @route   POST /api/projects/:projectId/ai/draft-task
// @access  Private (effective role >= member)
// Body: { title }
// Every AI output here is a SUGGESTION returned to the client for the user
// to review/edit/accept — nothing is auto-saved. The client sends the final,
// user-approved text through the normal POST /api/lists/:id/tasks endpoint,
// so it goes through the exact same validation as a manually written task.
const draftTaskDescription = asyncHandler(async (req, res) => {
  const { title } = req.body;
  if (!title) {
    return res.status(400).json({ message: "title is required" });
  }

  const prompt = `You are helping a software team write a clear task description for their project management tool.

Project name: "${req.project.name}"
Task title: "${title}"

Write a concise task description (2-4 sentences) and 2-4 short acceptance criteria bullet points for this task, based only on the title and project context given. Do not invent specific technical details (file names, exact numbers) that weren't implied by the title.

Respond with ONLY valid JSON in exactly this shape:
{
  "description": "string",
  "acceptanceCriteria": ["string", "string"]
}`;

  try {
    const result = await generateJSON(prompt);
    res.status(200).json({ success: true, suggestion: result });
  } catch (error) {
    res.status(502).json({ message: "AI drafting failed, please try again or write the description manually", detail: error.message });
  }
});

// @route   POST /api/projects/:projectId/ai/suggest-label
// @access  Private (effective role >= member)
// Body: { title, description }
const suggestLabel = asyncHandler(async (req, res) => {
  const { title, description = "" } = req.body;
  if (!title) {
    return res.status(400).json({ message: "title is required" });
  }

  const prompt = `Classify this software project task.

Title: "${title}"
Description: "${description}"

Respond with ONLY valid JSON in exactly this shape:
{
  "label": "Bug" | "Feature" | "Chore",
  "priority": "low" | "medium" | "high",
  "reasoning": "one short sentence explaining the choice"
}`;

  try {
    const result = await generateJSON(prompt);
    res.status(200).json({ success: true, suggestion: result });
  } catch (error) {
    res.status(502).json({ message: "AI suggestion failed, please set label/priority manually", detail: error.message });
  }
});

// @route   POST /api/projects/:projectId/ai/search
// @access  Private (project access)
// Body: { query }
// SECURITY NOTE: Gemini never generates or executes a raw database query.
// It only extracts a small set of constrained filter fields from the
// natural-language query; this controller then builds the actual MongoDB
// query itself from those fields. This prevents prompt injection or a
// malformed AI response from ever translating into an arbitrary DB operation.
const naturalLanguageSearch = asyncHandler(async (req, res) => {
  const { query } = req.body;
  if (!query) {
    return res.status(400).json({ message: "query is required" });
  }

  const prompt = `Extract search filters from this natural-language request for a task board.

Request: "${query}"

Respond with ONLY valid JSON in exactly this shape (use null for anything not mentioned):
{
  "priority": "low" | "medium" | "high" | null,
  "isOverdue": true | false | null,
  "isDone": true | false | null,
  "assigneeNameContains": "string or null",
  "labelContains": "string or null",
  "keywordInTitle": "string or null"
}`;

  let filters;
  try {
    filters = await generateJSON(prompt);
  } catch (error) {
    return res.status(502).json({ message: "AI could not interpret that search, try rephrasing", detail: error.message });
  }

  // ---- Build the real, safe MongoDB query from the extracted (constrained) fields ----
  const boards = await Board.find({ project: req.project._id }).select("_id");
  const lists = await List.find({ board: { $in: boards.map((b) => b._id) } }).select("_id isDoneList");

  let candidateListIds = lists.map((l) => l._id);
  if (filters.isDone === true) {
    candidateListIds = lists.filter((l) => l.isDoneList).map((l) => l._id);
  } else if (filters.isDone === false || filters.isOverdue === true) {
    candidateListIds = lists.filter((l) => !l.isDoneList).map((l) => l._id);
  }

  const mongoFilter = { list: { $in: candidateListIds } };

  if (filters.priority && ["low", "medium", "high"].includes(filters.priority)) {
    mongoFilter.priority = filters.priority;
  }
  if (filters.isOverdue === true) {
    mongoFilter.dueDate = { $ne: null, $lt: new Date() };
  }
  if (filters.labelContains) {
    mongoFilter.labels = { $regex: escapeRegex(filters.labelContains), $options: "i" };
  }
  if (filters.keywordInTitle) {
    mongoFilter.title = { $regex: escapeRegex(filters.keywordInTitle), $options: "i" };
  }
  if (filters.assigneeNameContains) {
    const matchingUsers = await User.find({
      name: { $regex: escapeRegex(filters.assigneeNameContains), $options: "i" },
    }).select("_id");
    mongoFilter.assignees = { $in: matchingUsers.map((u) => u._id) };
  }

  const tasks = await Task.find(mongoFilter)
    .populate("assignees", "name email avatarUrl")
    .sort({ dueDate: 1 })
    .limit(100);

  res.status(200).json({ success: true, interpretedFilters: filters, count: tasks.length, tasks });
});

// Reusable — called from sprintController.closeSprint, not exposed as its own route.
// Generates a short narrative summary of a completed sprint from its tasks.
const generateSprintSummary = async ({ sprint, completedTasks, incompleteTasks }) => {
  const completedTitles = completedTasks.map((t) => t.title).slice(0, 20);
  const incompleteTitles = incompleteTasks.map((t) => t.title).slice(0, 20);

  const prompt = `Write a short (3-5 sentence) standup-style summary of this completed sprint for a software team. Be factual and concise — do not invent details beyond what's listed.

Sprint: "${sprint.name}"
Goal: "${sprint.goal || "No goal set"}"
Completed tasks (${completedTasks.length} total): ${completedTitles.join("; ") || "none"}
Incomplete tasks (${incompleteTasks.length} total): ${incompleteTitles.join("; ") || "none"}

Respond with plain text only, no markdown formatting.`;

  return generateText(prompt);
};

module.exports = { draftTaskDescription, suggestLabel, naturalLanguageSearch, generateSprintSummary };
