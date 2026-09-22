const { logger } = require("../../config/logger");
const { sendResponse } = require("../../config/response");
const User = require("../../models/User/User");
const { uploadMedia } = require("../../utils/uploadMedia");

const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate("organizationId", "name")
      .lean();
    if (!user) {
      // User not in DB — return basic info from JWT token
      return sendResponse(res, 200, {
        user: {
          _id: req.user.id,
          role: req.user.role,
          organizationId: req.user.organizationId || null,
          name: "",
          email: "",
          department: "",
          designation: "",
          phoneNumber: "",
          dateOfJoining: "",
          profileImage: "",
          employeeId: "",
        }
      }, "Profile retrieved from token");
    }
    logger.info(`Profile retrieved for user: ${req.user.id}`);
    sendResponse(res, 200, { user }, "Profile retrieved");
  } catch (err) {
    logger.error(`Get user profile error: ${err.message}`);
    sendResponse(res, 500, null, err.message);
  }
};

const updateUserProfile = async (req, res) => {
  try {
    const {
      name,
      email,
      department,
      employeeId,
      designation,
      phoneNumber,
      dateOfJoining,
      profileImage,
    } = req.body;

    // Validate required fields based on role
    if (!name) {
      return sendResponse(res, 400, null, "Name is required");
    }
    if (!email) {
      return sendResponse(res, 400, null, "Email is required");
    }

    const needsEmployeeFields = ["Principal", "Teacher", "Accountant", "Clerk", "Faculty", "Management Staff"].includes(req.user.role);
    if (needsEmployeeFields) {
      if (!phoneNumber) return sendResponse(res, 400, null, "Phone number is required");
      if (!designation) return sendResponse(res, 400, null, "Designation is required");
      if (!dateOfJoining) return sendResponse(res, 400, null, "Date of joining is required");
    }
    if (["Teacher", "Accountant", "Clerk"].includes(req.user.role) && !department) {
      return sendResponse(res, 400, null, "Department is required");
    }

    // Check for email uniqueness (excluding current user)
    const existingUser = await User.findOne({
      email,
      _id: { $ne: req.user.id },
    });
    if (existingUser) {
      logger.warn(`Email already in use: ${email}`);
      return sendResponse(res, 400, null, "Email is already in use");
    }

    // Define update data
    const updateData = {
      name,
      email,
      department,
      employeeId,
      designation,
      phoneNumber,
      dateOfJoining,
      profileImage,
      updatedAt: Date.now(),
    };

    const user = await User.findByIdAndUpdate(req.user.id, updateData, {
      new: true,
      runValidators: true,
    })
      .populate("organizationId", "name")
      .lean();

    if (!user) {
      logger.warn(`User not found for update: ${req.user.id}`);
      return sendResponse(res, 404, null, "User not found — please re-login");
    }

    logger.info(`Profile updated for user: ${req.user.id}`);
    sendResponse(res, 200, { user }, "Profile updated successfully");
  } catch (err) {
    logger.error(`Update user profile error: ${err.message}`);
    sendResponse(res, 400, null, err.message);
  }
};

const uploadProfilePicture = async (req, res) => {
  try {
    if (!req.file) {
      return sendResponse(res, 400, null, "No file uploaded");
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { profileImage: req.fileUrl },
      { new: true, runValidators: true }
    ).lean();

    if (!user) {
      logger.warn(`User not found: ${req.user.id}`);
      return sendResponse(res, 404, null, "User not found");
    }

    logger.info(`Profile picture uploaded for user: ${req.user.id}`);
    sendResponse(res, 200, { user }, "Profile picture uploaded successfully");
  } catch (err) {
    console.log(err, "err");
    sendResponse(res, 500, null, err.message);
  }
};

module.exports = { getUserProfile, updateUserProfile, uploadProfilePicture };
