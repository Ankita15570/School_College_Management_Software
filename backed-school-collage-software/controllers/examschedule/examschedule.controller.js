const { sendResponse } = require("../../config/response");
const ExamSchedule = require("../../models/ExamSchedule/ExamSchedule");

exports.getExams = async (req, res) => {
  try {
    const { classId, academicYear } = req.query;
    const query = { organizationId: req.user.organizationId };
    if (classId) query.classId = classId;
    if (academicYear) query.academicYear = academicYear;

    const exams = await ExamSchedule.find(query)
      .populate("classId", "name")
      .populate("createdBy", "name")
      .sort({ examDate: 1 })
      .lean();
    sendResponse(res, 200, exams, "Exams fetched successfully");
  } catch (err) {
    sendResponse(res, 500, null, err.message);
  }
};

exports.createExam = async (req, res) => {
  try {
    if (!["Teacher", "Faculty", "Principal", "OrganizationAdmin"].includes(req.user.role)) {
      return sendResponse(res, 403, null, "Unauthorized");
    }
    const { classId, subject, examType, examDate, startTime, endTime, totalMarks, academicYear } = req.body;
    const exam = new ExamSchedule({
      organizationId: req.user.organizationId,
      classId, subject, examType, examDate,
      startTime, endTime, totalMarks, academicYear,
      createdBy: req.user.id,
    });
    await exam.save();
    sendResponse(res, 201, exam, "Exam created successfully");
  } catch (err) {
    sendResponse(res, 500, null, err.message);
  }
};

exports.updateExam = async (req, res) => {
  try {
    const exam = await ExamSchedule.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!exam) return sendResponse(res, 404, null, "Exam not found");
    sendResponse(res, 200, exam, "Exam updated successfully");
  } catch (err) {
    sendResponse(res, 500, null, err.message);
  }
};

exports.deleteExam = async (req, res) => {
  try {
    await ExamSchedule.findByIdAndDelete(req.params.id);
    sendResponse(res, 200, null, "Exam deleted successfully");
  } catch (err) {
    sendResponse(res, 500, null, err.message);
  }
};
