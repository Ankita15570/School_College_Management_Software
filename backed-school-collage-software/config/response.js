const { logger } = require("./logger");

const sendResponse = (res, status, data, message) => {
  logger.info(`Response: ${status} - ${message}`);
  res.status(status).json({
    success: status >= 200 && status < 300,
    data,
    message,
  });
};

module.exports = { sendResponse };