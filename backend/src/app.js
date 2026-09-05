const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");

const authRoutes = require("./routes/authRoutes");
const workspaceRoutes = require("./routes/workspaceRoutes");
const projectRoutes = require("./routes/projectRoutes");
const boardRoutes = require("./routes/boardRoutes");
const listRoutes = require("./routes/listRoutes");
const taskRoutes = require("./routes/taskRoutes");
const commentRoutes = require("./routes/commentRoutes");
const attachmentRoutes = require("./routes/attachmentRoutes");
const sprintRoutes = require("./routes/sprintRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");
const { initSentry, Sentry } = require("./config/sentry");
const logger = require("./config/logger");

// Express app setup, separated from server.js so tests can import and hit
// this app directly with Supertest without binding a real port or touching
// Mongo connection / cron startup.
const app = express();

const { isEnabled: sentryEnabled } = initSentry(app);

// ---- Core Middleware ----
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);

// HTTP request logging, routed through winston instead of straight to stdout
if (process.env.NODE_ENV !== "test") {
  app.use(
    morgan(process.env.NODE_ENV === "production" ? "combined" : "dev", {
      stream: { write: (message) => logger.http(message.trim()) },
    })
  );
}

// ---- Health check ----
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok", message: "TaskFlow API is running" });
});

// ---- Routes ----
app.use("/api/auth", authRoutes);
app.use("/api/workspaces", workspaceRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/boards", boardRoutes);
app.use("/api/lists", listRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/attachments", attachmentRoutes);
app.use("/api/sprints", sprintRoutes);
app.use("/api/notifications", notificationRoutes);

// ---- Error Handling (must be last) ----
if (sentryEnabled) {
  app.use(Sentry.Handlers.errorHandler());
}
app.use(notFound);
app.use(errorHandler);

module.exports = app;