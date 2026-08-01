const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");

dotenv.config();

const connectDB = require("./src/config/db");
const authRoutes = require("./src/routes/authRoutes");
const workspaceRoutes = require("./src/routes/workspaceRoutes");
const projectRoutes = require("./src/routes/projectRoutes");
const boardRoutes = require("./src/routes/boardRoutes");
const listRoutes = require("./src/routes/listRoutes");
const taskRoutes = require("./src/routes/taskRoutes");
const commentRoutes = require("./src/routes/commentRoutes");
const sprintRoutes = require("./src/routes/sprintRoutes");
const { notFound, errorHandler } = require("./src/middleware/errorMiddleware");

// Connect to MongoDB
connectDB();

const app = express();

// ---- Core Middleware ----
app.use(express.json()); // parse JSON request bodies
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true, // allow cookies to be sent cross-origin
  })
);

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
app.use("/api/sprints", sprintRoutes);

// ---- Error Handling (must be last) ----
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || "development"} mode on port ${PORT}`);
});
