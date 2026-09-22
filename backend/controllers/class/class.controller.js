const { sendResponse } = require("../../config/response");
const Class = require("../../models/Class/Class");


exports.getAllClasses = async (req, res) => {
  try {
    const user = req.user;
    let classes;
    if (user.role === "SuperAdmin") {
      classes = await Class.find()
        .populate("teacherId", "name")
        .lean();
    } else if (["OrganizationAdmin", "Principal" , "Teacher"].includes(user.role)) {
      classes = await Class.find({ organizationId: user.organizationId })
        .populate("teacherId", "name")
        .lean();
    } else if (["Faculty", "Teacher"].includes(user.role)) {
      classes = await Class.find({ teacherId: user._id })
        .populate("teacherId", "name")
        .lean();
    } else {
      return sendResponse(res, 403, "Unauthorized access");
    }

    classes = classes.map(cls => ({
      ...cls,
      teacherName: cls.teacherId ? cls.teacherId.name : "-",
      studentCount: cls.students ? cls.students.length : 0
    }));

    sendResponse(res, 200, classes , "Classes fetched successfully");
  } catch (err) {
    sendResponse(res, 500, err.message);
  }
};

exports.getClassById = async (req, res) => {
  try {
    const cls = await Class.findById(req.params.id)
      .populate("teacherId", "name")
      .lean();
    if (!cls) {
      return sendResponse(res, 404, "Class not found");
    }
    if (req.user.role !== "SuperAdmin" && cls.organizationId.toString() !== req.user.organizationId?.toString()) {
      return sendResponse(res, 403, "Unauthorized access");
    }
    cls.teacherName = cls.teacherId ? cls.teacherId.name : "-";
    cls.studentCount = cls.students ? cls.students.length : 0;
    sendResponse(res, 200, "Class fetched successfully", { class: cls });
  } catch (err) {
    sendResponse(res, 500, err.message);
  }
};

exports.createClass = async (req, res) => {
  try {
    const user = req.user;
    if (!["SuperAdmin", "OrganizationAdmin", "Principal" , "Teacher"].includes(user.role)) {
      return sendResponse(res, 403, "Unauthorized to create classes");
    }

    const { name, academicYear, teacherId } = req.body;
    const organizationId = user.role === "SuperAdmin" ? req.body.organizationId : user.organizationId;
    if (!organizationId) {
      return sendResponse(res, 400, "Organization ID is required");
    }

    const cls = new Class({
      organizationId,
      name,
      academicYear,
      teacherId: teacherId || undefined,
      students: [],
    });

    await cls.save();
    const populatedClass = await Class.findById(cls._id)
      .populate("teacherId", "name")
      .lean();
    populatedClass.teacherName = populatedClass.teacherId ? populatedClass.teacherId.name : "-";
    populatedClass.studentCount = populatedClass.students ? populatedClass.students.length : 0;

    sendResponse(res, 201, "Class created successfully", { class: populatedClass });
  } catch (err) {
    sendResponse(res, 500, err.message);
  }
};

exports.updateClass = async (req, res) => {
  try {
    const user = req.user;
    if (!["SuperAdmin", "OrganizationAdmin", "Principal"].includes(user.role)) {
      return sendResponse(res, 403, "Unauthorized to update classes");
    }

    const cls = await Class.findById(req.params.id);
    if (!cls) {
      return sendResponse(res, 404, "Class not found");
    }
    if (req.user.role !== "SuperAdmin" && cls.organizationId.toString() !== req.user.organizationId?.toString()) {
      return sendResponse(res, 403, "Unauthorized access");
    }

    const { name, academicYear, teacherId } = req.body;

    cls.set({
      name,
      academicYear,
      teacherId: teacherId || undefined,
    });

    await cls.save();
    const populatedClass = await Class.findById(cls._id)
      .populate("teacherId", "name")
      .lean();
    populatedClass.teacherName = populatedClass.teacherId ? populatedClass.teacherId.name : "-";
    populatedClass.studentCount = populatedClass.students ? populatedClass.students.length : 0;

    sendResponse(res, 200, "Class updated successfully", { class: populatedClass });
  } catch (err) {
    sendResponse(res, 500, err.message);
  }
};

exports.deleteClass = async (req, res) => {
  try {
    if (req.user.role !== "SuperAdmin") {
      return sendResponse(res, 403, "Only SuperAdmin can delete classes");
    }

    const cls = await Class.findById(req.params.id);
    if (!cls) {
      return sendResponse(res, 404, "Class not found");
    }

    // Check if class has students
    if (cls.students.length > 0) {
      return sendResponse(res, 400, "Cannot delete class with enrolled students");
    }

    await cls.deleteOne();
    sendResponse(res, 200, "Class deleted successfully");
  } catch (err) {
    sendResponse(res, 500, err.message);
  }
};