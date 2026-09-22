const { sendResponse } = require("../../config/response");
const Notice = require("../../models/Notice/Notice");

exports.getNotices = async (req, res) => {
  try {
    const { academicYear } = req.query;
    const query = { organizationId: req.user.organizationId };
    if (academicYear) query.academicYear = academicYear;

    const notices = await Notice.find(query)
      .populate("createdBy", "name")
      .sort({ createdAt: -1 })
      .lean();
    sendResponse(res, 200, notices, "Notices fetched successfully");
  } catch (err) {
    sendResponse(res, 500, null, err.message);
  }
};

exports.createNotice = async (req, res) => {
  try {
    if (!["Principal", "OrganizationAdmin", "Teacher", "Faculty"].includes(req.user.role)) {
      return sendResponse(res, 403, null, "Unauthorized");
    }
    const { title, description, deadline, targetRoles, academicYear } = req.body;
    const notice = new Notice({
      organizationId: req.user.organizationId,
      title, description, deadline,
      targetRoles: targetRoles || ["All"],
      academicYear,
      createdBy: req.user.id,
    });
    await notice.save();
    sendResponse(res, 201, notice, "Notice created successfully");
  } catch (err) {
    sendResponse(res, 500, null, err.message);
  }
};

exports.updateNotice = async (req, res) => {
  try {
    const notice = await Notice.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!notice) return sendResponse(res, 404, null, "Notice not found");
    sendResponse(res, 200, notice, "Notice updated successfully");
  } catch (err) {
    sendResponse(res, 500, null, err.message);
  }
};

exports.deleteNotice = async (req, res) => {
  try {
    await Notice.findByIdAndDelete(req.params.id);
    sendResponse(res, 200, null, "Notice deleted successfully");
  } catch (err) {
    sendResponse(res, 500, null, err.message);
  }
};
