const { logger } = require("../../config/logger");
const { sendResponse } = require("../../config/response");
const Feedback = require("../../models/Feedback/Feedback");


const getFeedbacks = async (req, res) => {
  if (req.user.role !== "SuperAdmin") {
    logger.warn(`Unauthorized attempt to view feedbacks: ${req.user.id}`);
    return sendResponse(res, 403, null, "Only SuperAdmin can view feedbacks");
  }

  const { page = 1, limit = 10 } = req.query;
  try {
    const feedbacks = await Feedback.find({})
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .populate("userId", "name email")
      .populate("organizationId", "name")
      .lean();
    const total = await Feedback.countDocuments({});
    logger.info(`Retrieved feedbacks: page ${page}, limit ${limit}, role: ${req.user.role}`);
    sendResponse(res, 200, { feedbacks, total, page: Number(page), pages: Math.ceil(total / limit) }, "Feedbacks retrieved");
  } catch (err) {
    logger.error(`Get feedbacks error: ${err.message}`);
    sendResponse(res, 500, null, err.message);
  }
};

const createFeedback = async (req, res) => {
  try {
    const organizationId = req.user.role === "SuperAdmin" ? req.body.organizationId : req.user.organizationId;
    if (!organizationId) {
      logger.warn("Organization ID missing for feedback creation");
      return sendResponse(res, 400, null, "Organization ID is required");
    }

    const { name, email, feedbackType, rating, message, followUp  , academicYear,} = req.body;
    if (!message) {
      logger.warn("Message missing for feedback creation");
      return sendResponse(res, 400, null, "Feedback message is required");
    }

    const feedback = new Feedback({
      organizationId,
      userId: req.user.id,
      name,
      email,
      feedbackType,
      rating,
      message,
      followUp,
      academicYear,
    });
    await feedback.save();
    logger.info(`Feedback created by user: ${req.user.id}, type: ${feedbackType}`);
    sendResponse(res, 201, feedback, "Feedback created successfully");
  } catch (err) {
    logger.error(`Feedback creation error: ${err.message}`);
    sendResponse(res, 400, null, err.message);
  }
};

module.exports = { getFeedbacks, createFeedback };