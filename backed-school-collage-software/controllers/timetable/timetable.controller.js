const { sendResponse } = require("../../config/response");
const { TimeTable } = require("../../models/TimeTable/TimeTable");

exports.getAllTimetables = async (req, res) => {
  try {
    const user = req.user;
    let query = {};
    if (user.role === "SuperAdmin") {
      // SuperAdmin sees all timetables
    } else if (user.role === "OrganizationAdmin" || user.role === "Principal") {
      query.organizationId = user.organizationId;
    } else if (user.role === "Teacher" || user.role === "Faculty") {
      query.userId = user.id;
    } else {
      return sendResponse(res, 403, null, "Unauthorized access");
    }

    // If userId param provided (for teacher's own timetable fetch)
    if (req.params.userId) {
      query.userId = req.params.userId;
    }
    if (req.params.academicYear) {
      query.academicYear = req.params.academicYear;
    }

    const timetables = await TimeTable.find(query)
      .populate("userId", "name")
      .populate("schedule.periods.userId", "name");
    sendResponse(res, 200, timetables, "Timetables fetched successfully");
  } catch (err) {
    sendResponse(res, 500, null, err.message);
  }
};

exports.getTimetableById = async (req, res) => {
  try {
    const timetable = await TimeTable.findById(req.params.id).populate("schedule.periods.userId", "name");
    if (!timetable) {
      return sendResponse(res, 404, "Timetable not found");
    }
    if (
      req.user.role !== "SuperAdmin" &&
      req.user.role !== "OrganizationAdmin" &&
      (req.user.role !== "Principal" || timetable.organizationId.toString() !== req.user.organizationId.toString()) &&
      (req.user.role !== "Teacher" || !timetable.schedule.some((day) => day.periods.some((p) => p.userId?._id.toString() === req.user._id.toString())))
    ) {
      return sendResponse(res, 403, "Unauthorized access");
    }
    sendResponse(res, 200, { timetable }, "Timetable fetched successfully");
  } catch (err) {
    sendResponse(res, 500, err.message);
  }
};

exports.createTimetable = async (req, res) => {
  try {
    const { class: className, academicYear, schedule, targetUserId } = req.body;

    if (!["SuperAdmin", "OrganizationAdmin", "Principal", "Teacher", "Faculty"].includes(req.user.role)) {
      return sendResponse(res, 403, "Only authorized roles can create timetables");
    }

    const assignedUserId = targetUserId || req.user.id;

    const timetable = new TimeTable({
      organizationId: req.user.organizationId || undefined,
      userId: assignedUserId,
      class: className,
      academicYear,
      schedule: schedule.map((day) => ({
        day: day.day,
        periods: day.periods.map((period) => ({
          time: period.time,
          subject: period.subject,
          class: period.class,
          userId: assignedUserId,
        })),
      })),
    });

    await timetable.save();
    await timetable.populate("schedule.periods.userId", "name");
    sendResponse(res, 201, { timetable }, "Timetable created successfully");
  } catch (err) {
    sendResponse(res, 500, err.message);
  }
};

exports.updateTimetable = async (req, res) => {
  try {
    const timetable = await TimeTable.findById(req.params.id);
    if (!timetable) {
      return sendResponse(res, 404, "Timetable not found");
    }
    if (
      req.user.role !== "SuperAdmin" &&
      req.user.role !== "OrganizationAdmin" &&
      (req.user.role !== "Principal" || timetable.organizationId.toString() !== req.user.organizationId.toString())
    ) {
      return sendResponse(res, 403, "Only authorized roles can update timetables");
    }

    const { class: className, academicYear, schedule } = req.body;

    timetable.set({
      class: className,
      academicYear,
      schedule: schedule.map((day) => ({
        day: day.day,
        periods: day.periods.map((period) => ({
          time: period.time,
          subject: period.subject,
          class: period.class,
          userId: period.userId || undefined,
        })),
      })),
    });

    await timetable.save();
    await timetable.populate("schedule.periods.userId", "name");
    sendResponse(res, 200, { timetable }, "Timetable updated successfully");
  } catch (err) {
    sendResponse(res, 500, err.message);
  }
};

exports.deleteTimetable = async (req, res) => {
  try {
    const timetable = await TimeTable.findById(req.params.id);
    if (!timetable) {
      return sendResponse(res, 404, "Timetable not found");
    }
    if (
      req.user.role !== "SuperAdmin" &&
      req.user.role !== "OrganizationAdmin" &&
      (req.user.role !== "Principal" || timetable.organizationId.toString() !== req.user.organizationId.toString())
    ) {
      return sendResponse(res, 403, "Only authorized roles can delete timetables");
    }

    await timetable.deleteOne();
    sendResponse(res, 200, "Timetable deleted successfully");
  } catch (err) {
    sendResponse(res, 500, err.message);
  }
};