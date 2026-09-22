const { logger } = require("../config/logger");
const { sendResponse } = require("../config/response");

const errorHandler = (err, req, res, next) => {
  logger.error(`Error: ${err.message}, Stack: ${err.stack}`);
  sendResponse(res, err.status || 500, null, err.message || "Internal Server Error");
};

module.exports = {errorHandler};