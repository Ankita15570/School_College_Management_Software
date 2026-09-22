const { sendResponse } = require("../../config/response");
const { logger } = require("../../config/logger");
const User = require("../../models/User/User");

const getTeachers = async (req, res) => {
  try {
    const query = { role: { $in: ["Teacher", "Faculty"] } };

    if (req.user.role !== "SuperAdmin") {
      query.organizationId = req.user.organizationId;
    }

    const teachers = await User.find(query)
      .select("-password -resetPasswordToken -resetPasswordExpires")
      .sort({ name: 1 })
      .lean();

    sendResponse(res, 200, { teachers }, "Teachers fetched successfully");
  } catch (error) {
    logger.error(`Error in getTeachers: ${error.message}`);
    sendResponse(res, 500, null, "Server error");
  }
};

module.exports = { getTeachers };
