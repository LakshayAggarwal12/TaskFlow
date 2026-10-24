const dotenv = require("dotenv");
dotenv.config();

const http = require("http");
const connectDB = require("./src/config/db");
const app = require("./src/app");
const initSocket = require("./src/socket");
const logger = require("./src/config/logger");
const { startReminderCron } = require("./src/jobs/reminderJob");

connectDB();

// Socket.io needs the raw HTTP server (not the Express app) so it can
// upgrade connections to WebSockets on the same port.
const httpServer = http.createServer(app);
initSocket(httpServer);

const PORT = process.env.PORT || 5000;

httpServer.listen(PORT, () => {
  logger.info(`Server running in ${process.env.NODE_ENV || "development"} mode on port ${PORT}`);
  startReminderCron();
});