const jwt = require("jsonwebtoken");

const jwtSecret = process.env.JWT_SECRET;

exports.authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(403).json({ message: "Authentication token required" });
  }

  try {
    const decoded = jwt.verify(token, jwtSecret);
    req.user = decoded;
    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: "Invalid or expired token" });
  }
};

exports.authorize = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(403).json({ message: "Authentication required" });
    }

    const { role } = req.user;

    if (!allowedRoles.includes(role)) {
      return res
        .status(403)
        .json({ message: "You do not have permission to perform this action" });
    }

    next();
  };
};
