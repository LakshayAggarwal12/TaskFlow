const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Pulls the JWT out of a socket.io handshake — pure, no I/O, easy to unit
// test. Mirrors authMiddleware.protect's dual support: the client sends the
// token explicitly via the `auth` payload (since httpOnly cookies aren't
// readable by client JS anyway), but a cookie is accepted as a fallback for
// any client that relies on it instead.
const extractSocketToken = (handshake) => {
  if (handshake?.auth?.token) {
    return handshake.auth.token;
  }
  const cookieHeader = handshake?.headers?.cookie;
  if (cookieHeader) {
    const match = cookieHeader.split(";").map((c) => c.trim()).find((c) => c.startsWith("token="));
    if (match) return decodeURIComponent(match.split("=")[1]);
  }
  return null;
};

// Socket.io connection middleware — verifies the token and attaches the
// authenticated user to the socket, same shape as authMiddleware.protect.
const authenticateSocket = async (socket, next) => {
  const token = extractSocketToken(socket.handshake);
  if (!token) {
    return next(new Error("Not authorized, no token provided"));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) {
      return next(new Error("User belonging to this token no longer exists"));
    }
    socket.user = user;
    next();
  } catch (error) {
    next(new Error("Not authorized, token invalid or expired"));
  }
};

module.exports = { extractSocketToken, authenticateSocket };