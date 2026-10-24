const TaskSubmission = require("../models/TaskSubmission");
const Attachment = require("../models/Attachment");
const asyncHandler = require("../utils/asyncHandler");
const logActivity = require("../utils/logActivity");
const { notifyMany, createNotification } = require("../utils/createNotification");
const { validateFile } = require("../utils/fileValidation");
const { getResourceType, buildPublicId, streamToCloudinary } = require("../utils/cloudinaryUpload");
const { emitToBoard } = require("../socket/emit");
const logger = require("../config/logger");

// @route   POST /api/tasks/:taskId/submissions
// @access  Private (effective role >= member) — req.task/req.project set by requireTaskAccess
// This is the "Complete" button's short form: a note plus optional files,
// submitted as one multipart request. Reuses the exact same Attachment
// model and Cloudinary upload path as the general task-attachments feature.
const createSubmission = asyncHandler(async (req, res) => {
  const { notes } = req.body;
  if (!notes || !notes.trim()) {
    return res.status(400).json({ message: "A short note is required to submit this task for review" });
  }

  const files = req.files || [];

  for (const file of files) {
    const { ok, reason } = validateFile({
      mimetype: file.mimetype,
      size: file.size,
      filename: file.originalname,
    });
    if (!ok) {
      return res.status(400).json({ message: reason });
    }
  }

  const submission = await TaskSubmission.create({
    task: req.task._id,
    submittedBy: req.user._id,
    notes: notes.trim(),
  });

  const attachments = [];
  for (const file of files) {
    const resourceType = getResourceType(file.mimetype);
    const uploadOptions = { folder: `taskflow/submissions/${submission._id}`, resource_type: resourceType };
    const publicId = buildPublicId(file.originalname, resourceType);
    if (publicId) uploadOptions.public_id = publicId;
    const result = await streamToCloudinary(file.buffer, uploadOptions);

    const attachment = await Attachment.create({
      ownerType: "submission",
      ownerId: submission._id,
      uploadedBy: req.user._id,
      url: result.secure_url,
      publicId: result.public_id,
      filename: file.originalname,
      mimeType: file.mimetype,
      size: file.size,
    });
    attachments.push(attachment);
  }

  req.task.reviewStatus = "pending_review";
  await req.task.save();

  await submission.populate("submittedBy", "name email avatarUrl");

  const fullSubmission = { ...submission.toObject(), attachments };

  emitToBoard(req.board._id, "task:updated", { task: req.task });
  emitToBoard(req.board._id, "submission:created", { submission: fullSubmission, taskId: req.task._id.toString() });

  logActivity({
    project: req.project._id,
    actor: req.user._id,
    action: "submission.created",
    targetType: "TaskSubmission",
    targetId: submission._id,
    message: `${req.user.name} submitted "${req.task.title}" for review`,
  });

  // Notify assignees + the task creator (except the submitter themselves)
  const notifyIds = new Set([
    ...req.task.assignees.map((id) => id.toString()),
    req.task.createdBy.toString(),
  ]);
  notifyIds.delete(req.user._id.toString());
  notifyMany([...notifyIds], {
    type: "submission_created",
    message: `${req.user.name} submitted "${req.task.title}" for review`,
    relatedTask: req.task._id,
    relatedProject: req.project._id,
  });

  res.status(201).json({ success: true, submission: fullSubmission });
});

// @route   GET /api/tasks/:taskId/submissions
// @access  Private (task access) — history of every submit/review cycle for this task
const getTaskSubmissions = asyncHandler(async (req, res) => {
  const submissions = await TaskSubmission.find({ task: req.task._id })
    .sort({ createdAt: -1 })
    .populate("submittedBy", "name email avatarUrl")
    .populate("reviewedBy", "name email avatarUrl");

  const submissionIds = submissions.map((s) => s._id);
  const attachments = await Attachment.find({ ownerType: "submission", ownerId: { $in: submissionIds } });

  const withAttachments = submissions.map((s) => ({
    ...s.toObject(),
    attachments: attachments.filter((a) => a.ownerId.toString() === s._id.toString()),
  }));

  res.status(200).json({ success: true, count: withAttachments.length, submissions: withAttachments });
});

// @route   PATCH /api/submissions/:id/review
// @access  Private (effective role >= admin) — req.submission/req.task set by requireSubmissionAccess
const reviewSubmission = asyncHandler(async (req, res) => {
  const { decision, reviewNote } = req.body;
  if (!["approved", "changes_requested"].includes(decision)) {
    return res.status(400).json({ message: "decision must be 'approved' or 'changes_requested'" });
  }

  req.submission.status = decision;
  req.submission.reviewedBy = req.user._id;
  req.submission.reviewNote = reviewNote || "";
  req.submission.reviewedAt = new Date();
  await req.submission.save();

  req.task.reviewStatus = decision;
  await req.task.save();

  emitToBoard(req.board._id, "task:updated", { task: req.task });
  emitToBoard(req.board._id, "submission:reviewed", {
    submission: req.submission,
    taskId: req.task._id.toString(),
  });

  logActivity({
    project: req.project._id,
    actor: req.user._id,
    action: decision === "approved" ? "submission.approved" : "submission.changes_requested",
    targetType: "TaskSubmission",
    targetId: req.submission._id,
    message:
      decision === "approved"
        ? `${req.user.name} approved the submission for "${req.task.title}"`
        : `${req.user.name} requested changes on "${req.task.title}"`,
  });

  if (req.submission.submittedBy.toString() !== req.user._id.toString()) {
    createNotification({
      user: req.submission.submittedBy,
      type: decision === "approved" ? "submission_approved" : "submission_changes_requested",
      message:
        decision === "approved"
          ? `Your submission for "${req.task.title}" was approved`
          : `Changes were requested on your submission for "${req.task.title}"`,
      relatedTask: req.task._id,
      relatedProject: req.project._id,
    });
  }

  res.status(200).json({ success: true, submission: req.submission, task: req.task });
});

module.exports = { createSubmission, getTaskSubmissions, reviewSubmission };