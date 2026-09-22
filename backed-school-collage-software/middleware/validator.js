const { validationResult } = require("express-validator");
const { sendResponse } = require("../config/response");
const { logger } = require("../config/logger");

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMsg = errors.array().map((err) => err.msg).join(", ");
    logger.warn(`Validation error: ${errorMsg}`);
    return sendResponse(res, 400, null, errorMsg);
  }
  next();
};

module.exports = {validate};