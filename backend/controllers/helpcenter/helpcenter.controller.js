const { logger } = require("../../config/logger");
const { sendResponse } = require("../../config/response");
const HelpCenter = require("../../models/HelpCenter/HelpCenter");


exports.getHelpRequests = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  try {
    const query = req.user.role === "SuperAdmin" ? {} : { userId: req.user.id, organizationId: req.user.organizationId };
    const helpRequests = await HelpCenter.find(query)
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .populate("userId", "name email")
      .populate("organizationId", "name")
      .lean();
    const total = await HelpCenter.countDocuments(query);
    logger.info(`Retrieved help requests: page ${page}, limit ${limit}, role: ${req.user.role}`);
    sendResponse(res, 200, { helpRequests, total, page: Number(page), pages: Math.ceil(total / limit) }, "Help requests retrieved");
  } catch (err) {
    logger.error(`Get help requests error: ${err.message}`);
    sendResponse(res, 500, null, err.message);
  }
};

exports.createHelpRequest = async (req, res) => {
  try {
    const organizationId = req.user.role === "SuperAdmin" ? req.body.organizationId : req.user.organizationId;
    if (!organizationId) {
      logger.warn("Organization ID missing for help request creation");
      return sendResponse(res, 400, null, "Organization ID is required");
    }

    const { issue, type , academicYear } = req.body;
    if (!issue || !type) {
      logger.warn("Issue or type missing for help request creation");
      return sendResponse(res, 400, null, "Issue and type are required");
    }

    const helpRequest = new HelpCenter({
      organizationId,
      userId: req.user.id,
      issue,
      type,
      academicYear,
    });
    await helpRequest.save();
    logger.info(`Help request created by user: ${req.user.id}, type: ${type}`);
    sendResponse(res, 201, helpRequest, "Help request created successfully");
  } catch (err) {
    logger.error(`Help request creation error: ${err.message}`);
    sendResponse(res, 400, null, err.message);
  }
};

exports.updateHelpRequest = async (req, res) => {
  const { id } = req.params;
  try {
    if (req.user.role !== "SuperAdmin") {
      logger.warn(`Unauthorized attempt to update help request: ${req.user.id}`);
      return sendResponse(res, 403, null, "Only SuperAdmin can update help requests");
    }

    const { status  } = req.body;
    if (!["Open", "In Progress", "Resolved"].includes(status)) {
      logger.warn(`Invalid status provided: ${status}`);
      return sendResponse(res, 400, null, "Invalid status");
    }

    const helpRequest = await HelpCenter.findByIdAndUpdate(
      id,
      { status, updatedAt: Date.now() },
      { new: true, runValidators: true }
    )
      .populate("userId", "name email")
      .populate("organizationId", "name")
      .lean();
    if (!helpRequest) {
      logger.warn(`Help request update failed: Help request ${id} not found`);
      return sendResponse(res, 404, null, "Help request not found");
    }
    logger.info(`Help request updated: ${id}, status: ${status}`);
    sendResponse(res, 200, helpRequest, "Help request updated successfully");
  } catch (err) {
    logger.error(`Help request update error: ${err.message}`);
    sendResponse(res, 400, null, err.message);
  }
};