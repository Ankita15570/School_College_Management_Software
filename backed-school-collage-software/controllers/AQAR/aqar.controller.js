const { sendResponse } = require("../../config/response");
const AQAR = require("../../models/AQAR/AQAR");

exports.getAQAREntries = async (req, res) => {
  try {
    const user = req.user;
    const { part, criterion, academicYear } = req.params;

    if (!["A", "B"].includes(part)) {
      return sendResponse(res, 400, "Invalid part specified");
    }
    if (
      part === "B" &&
      !["I", "II", "III", "IV", "V", "VI", "VII"].includes(criterion)
    ) {
      return sendResponse(res, 400, "Invalid criterion specified");
    }
    if (part === "A" && criterion) {
      return sendResponse(res, 400, "Part A does not require a criterion");
    }

    let query = { part };
    if (part === "B") query.criterion = criterion;

    // Role-based query modification
    if (user.role === "SuperAdmin") {
      // No additional filters for SuperAdmin, fetch all organizations' records
    } else if (["OrganizationAdmin", "Principal"].includes(user.role)) {
      query.organizationId = user.organizationId; // Fetch all AQAR for the user's organization
    } else if (user.role === "Faculty") {
      query.userId = user.id; // Fetch only the faculty's own records
    } else {
      return sendResponse(res, 403, "Unauthorized access");
    }

    const entries = await AQAR.find({ academicYear, ...query })
      .populate("userId", "name")
      .populate("organizationId", "name")
      .populate("media", "url filename")
      .lean();

    sendResponse(res, 200, entries, "AQAR entries fetched successfully");
  } catch (err) {
    sendResponse(res, 500, err.message);
  }
};

exports.getAQAREntryById = async (req, res) => {
  try {
    const { part, criterion, id } = req.params;

    if (!["A", "B"].includes(part)) {
      return sendResponse(res, 400, "Invalid part specified");
    }
    if (
      part === "B" &&
      !["I", "II", "III", "IV", "V", "VI", "VII"].includes(criterion)
    ) {
      return sendResponse(res, 400, "Invalid criterion specified");
    }
    if (part === "A" && criterion) {
      return sendResponse(res, 400, "Part A does not require a criterion");
    }

    const entry = await AQAR.findById(id)
      .populate("media", "url filename")
      .lean();
    if (!entry) {
      return sendResponse(res, 404, "AQAR entry not found");
    }
    if (
      req.user.role !== "SuperAdmin" &&
      entry.organizationId.toString() !== req.user.organizationId?.toString()
    ) {
      return sendResponse(res, 403, "Unauthorized access");
    }
    if (
      entry.part !== part ||
      (part === "B" && entry.criterion !== criterion)
    ) {
      return sendResponse(
        res,
        400,
        "Entry does not match specified part or criterion"
      );
    }

    sendResponse(res, 200, "AQAR entry fetched successfully", { entry });
  } catch (err) {
    sendResponse(res, 500, err.message);
  }
};

exports.createAQAREntry = async (req, res) => {
  try {
    const user = req.user;
    if (
      !["SuperAdmin", "OrganizationAdmin", "Principal", "Faculty"].includes(
        user.role
      )
    ) {
      return sendResponse(res, 403, "Unauthorized to create AQAR entries");
    }

    const { part, criterion } = req.params;
    const { title, media, academicYear, keyIndicator, status } = req.body;

    if (!["A", "B"].includes(part)) {
      return sendResponse(res, 400, "Invalid part specified");
    }
    if (
      part === "B" &&
      !["I", "II", "III", "IV", "V", "VI", "VII"].includes(criterion)
    ) {
      return sendResponse(res, 400, "Invalid criterion specified");
    }
    if (part === "A" && criterion) {
      return sendResponse(res, 400, "Part A does not require a criterion");
    }

    const organizationId =
      user.role === "SuperAdmin"
        ? req.body.organizationId
        : user.organizationId;
    if (!organizationId) {
      return sendResponse(res, 400, "Organization ID is required");
    }

    const entry = new AQAR({
      organizationId,
      userId: user.id,
      part,
      criterion: part === "B" ? criterion : null,
      title,
      media: media || null, // Use the mediaId from the frontend
      academicYear,
      keyIndicator: part === "B" ? keyIndicator : null, // Only set for Part B
      status: status || "Pending", // Default to Pending if not provided
    });

    await entry.save();
    sendResponse(res, 201, "AQAR entry created successfully", { entry });
  } catch (err) {
    console.error(err);
    sendResponse(res, 500, err.message);
  }
};

exports.updateAQAREntry = async (req, res) => {
  try {
    const user = req.user;
    if (
      !["SuperAdmin", "OrganizationAdmin", "Principal", "Faculty"].includes(
        user.role
      )
    ) {
      return sendResponse(res, 403, "Unauthorized to update AQAR entries");
    }

    const { part, criterion, id } = req.params;
    const { title, media, academicYear, keyIndicator, status } = req.body;

    if (!["A", "B"].includes(part)) {
      return sendResponse(res, 400, "Invalid part specified");
    }
    if (
      part === "B" &&
      !["I", "II", "III", "IV", "V", "VI", "VII"].includes(criterion)
    ) {
      return sendResponse(res, 400, "Invalid criterion specified");
    }
    if (part === "A" && criterion) {
      return sendResponse(res, 400, "Part A does not require a criterion");
    }

    const entry = await AQAR.findById(id);
    if (!entry) {
      return sendResponse(res, 404, "AQAR entry not found");
    }
    if (
      req.user.role !== "SuperAdmin" &&
      entry.organizationId.toString() !== req.user.organizationId?.toString()
    ) {
      return sendResponse(res, 403, "Unauthorized access");
    }
    if (
      entry.part !== part ||
      (part === "B" && entry.criterion !== criterion)
    ) {
      return sendResponse(
        res,
        400,
        "Entry does not match specified part or criterion"
      );
    }

    // Only Principal or OrganizationAdmin can update status
    if (status && !["OrganizationAdmin", "Principal"].includes(user.role)) {
      return sendResponse(res, 403, "Only Principal or OrganizationAdmin can update status");
    }

    entry.set({
      title,
      media: media || entry.media, // Use new mediaId or keep existing
      academicYear,
      keyIndicator: part === "B" ? keyIndicator : entry.keyIndicator, // Only update for Part B
      status: status || entry.status, // Update status if provided, otherwise retain existing
    });

    await entry.save();
    const populatedEntry = await AQAR.findById(entry._id)
      .populate("media", "url filename")
      .lean();

    sendResponse(res, 200, "AQAR entry updated successfully", {
      entry: populatedEntry,
    });
  } catch (err) {
    sendResponse(res, 500, err.message);
  }
};

exports.deleteAQAREntry = async (req, res) => {
  try {
    const { part, criterion, id } = req.params;

    if (!["A", "B"].includes(part)) {
      return sendResponse(res, 400, "Invalid part specified");
    }
    if (
      part === "B" &&
      !["I", "II", "III", "IV", "V", "VI", "VII"].includes(criterion)
    ) {
      return sendResponse(res, 400, "Invalid criterion specified");
    }
    if (part === "A" && criterion) {
      return sendResponse(res, 400, "Part A does not require a criterion");
    }

    const entry = await AQAR.findById(id);
    if (!entry) {
      return sendResponse(res, 404, "AQAR entry not found");
    }
    if (
      entry.part !== part ||
      (part === "B" && entry.criterion !== criterion)
    ) {
      return sendResponse(
        res,
        400,
        "Entry does not match specified part or criterion"
      );
    }

    await entry.deleteOne();
    sendResponse(res, 200, "AQAR entry deleted successfully");
  } catch (err) {
    sendResponse(res, 500, err.message);
  }
};

exports.updateStatusChange = async (req, res) => {
  try {
    const user = req.user;
    const { part, criterion, id } = req.params;
    const { status } = req.body;

    // Validate part parameter
    if (!["A", "B"].includes(part)) {
      return sendResponse(res, 400, "Invalid part specified");
    }

    // Validate criterion for Part B
    if (
      part === "B" &&
      !["I", "II", "III", "IV", "V", "VI", "VII"].includes(criterion)
    ) {
      return sendResponse(res, 400, "Invalid criterion specified");
    }

    if (part === "A" && criterion) {
      return sendResponse(res, 400, "Part A does not require a criterion");
    }

    // Validate status
    if (!["Approved", "Rejected"].includes(status)) {
      return sendResponse(res, 400, "Status must be 'Approved' or 'Rejected'");
    }

    // Fetch the AQAR entry
    const entry = await AQAR.findById(id);
    if (!entry) {
      return sendResponse(res, 404, "AQAR entry not found");
    }

    // Authorization check: Only OrganizationAdmin or Principal can update status
    if (!["OrganizationAdmin", "Principal"].includes(user.role)) {
      return sendResponse(res, 403, "Only OrganizationAdmin or Principal can update status");
    }

    // Ensure the entry belongs to the user's organization (except for SuperAdmin)
    if (
      user.role !== "SuperAdmin" &&
      entry.organizationId.toString() !== user.organizationId?.toString()
    ) {
      return sendResponse(res, 403, "Unauthorized access to this entry");
    }

    // Verify part and criterion match
    if (
      entry.part !== part ||
      (part === "B" && entry.criterion !== criterion)
    ) {
      return sendResponse(
        res,
        400,
        "Entry does not match specified part or criterion"
      );
    }

    // Update the status
    entry.status = status;
    await entry.save();

    // Populate media for the response
    const updatedEntry = await AQAR.findById(id).populate("media", "url filename").lean();

    sendResponse(res, 200, { entry: updatedEntry }, "AQAR status updated successfully");
  } catch (err) {
    console.error("Error updating AQAR status:", err);
    sendResponse(res, 500, err.message);
  }
};