const logger = require("../config/logger");

// A tiny singleton so any controller/util can emit without importing the
// whole socket setup or passing `io` through every function call. Safe to
// call before initSocket() has run (e.g. in tests, or if sockets are ever
// disabled) — emits just become no-ops instead of throwing.
let io = null;

const setIO = (instance) => {
  io = instance;
};

const emitToBoard = (boardId, event, payload) => {
  if (!io) return;
  try {
    io.to(`board:${boardId}`).emit(event, payload);
  } catch (error) {
    logger.warn("Socket emitToBoard failed", { event, message: error.message });
  }
};

const emitToUser = (userId, event, payload) => {
  if (!io) return;
  try {
    io.to(`user:${userId}`).emit(event, payload);
  } catch (error) {
    logger.warn("Socket emitToUser failed", { event, message: error.message });
  }
};

module.exports = { setIO, emitToBoard, emitToUser };