const jwt = require("jsonwebtoken");
const { sendResponse } = require("../config/response");
const { logger } = require("../config/logger");

const authMiddleware = async (req, res, next) => {
  const token = req.header("x-auth-token");
  if (!token) {
    return sendResponse(res, 401, null, "No token, authorization denied");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    logger.info(`Authenticated user: ${decoded.id}, role: ${decoded.role}`);
    next();
  } catch (err) {
    logger.error(`Token verification failed: ${err.message}`);
    sendResponse(res, 401, null, "Token is not valid");
  }
};

const roleMiddleware = (roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    logger.warn(`Access denied for user ${req.user.id}, role: ${req.user.role}`);
    return sendResponse(res, 403, null, "Access denied");
  }
  next();
};

module.exports = { authMiddleware, roleMiddleware };