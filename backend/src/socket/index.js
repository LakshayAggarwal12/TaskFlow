const { Server } = require("socket.io");
const { authenticateSocket } = require("./auth");
const { setIO } = require("./emit");
const resolveProjectRole = require("../utils/resolveProjectRole");
const Board = require("../models/Board");
const logger = require("../config/logger");

// Wires up Socket.io on the existing HTTP server. Rooms used:
//   user:<userId>  — every connected user auto-joins their own room, used
//                    for live notification delivery (see createNotification.js)
//   board:<boardId> — joined explicitly via the "board:join" event, used for
//                    live task/list/comment sync while a board is open
const initSocket = (httpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: process.env.CLIENT_URL || "http://localhost:5173",
      credentials: true,
    },
  });

  io.use(authenticateSocket);

  io.on("connection", (socket) => {
    socket.join(`user:${socket.user._id}`);

    socket.on("board:join", async (boardId, callback) => {
      try {
        const board = await Board.findById(boardId);
        if (!board) return callback?.({ ok: false, message: "Board not found" });

        // Re-check access on every join — a socket connection can outlive
        // a user's membership being revoked, so this can't be a one-time
        // check done only at connection time.
        await resolveProjectRole(board.project, socket.user._id);

        socket.join(`board:${boardId}`);
        callback?.({ ok: true });
      } catch (error) {
        callback?.({ ok: false, message: error.message || "Access denied" });
      }
    });

    socket.on("board:leave", (boardId) => {
      socket.leave(`board:${boardId}`);
    });

    socket.on("disconnect", () => {
      // Rooms are cleaned up automatically by socket.io on disconnect —
      // nothing to do here, kept as a hook point for future logging/presence.
    });
  });

  setIO(io);
  logger.info("Socket.io initialized");
  return io;
};

module.exports = initSocket;