const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Protects routes — requires a valid JWT, either in the
// Authorization header ("Bearer <token>") or in an httpOnly cookie
const protect = async (req, res, next) => {
  let token;

  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer")) {
    token = authHeader.split(" ")[1];
  } else if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach the user (without password) to the request
    req.user = await User.findById(decoded.id);

    if (!req.user) {
      return res.status(401).json({ message: "User belonging to this token no longer exists" });
    }

    next();
  } catch (error) {
    return res.status(401).json({ message: "Not authorized, token invalid or expired" });
  }
};

// Restricts access to specific roles, e.g. authorize("admin")
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "You do not have permission to perform this action" });
    }
    next();
  };
};

module.exports = { protect, authorize };
