const jwt = require("jsonwebtoken");

// Middleware to check if the user is authenticated
const authMiddleware = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  // If no token is found, deny access
  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  try {
    // Verify the token and attach the user info to the request
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: "Token is not valid" });
  }
};

// Middleware to check if the user has the required role(s) to access a resource
const roleMiddleware = (roles) => {
  return (req, res, next) => {
    // If the user's role is not in the allowed roles, forbid access
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Access forbidden" });
    }
    next();
  };
};

module.exports = { authMiddleware, roleMiddleware };
