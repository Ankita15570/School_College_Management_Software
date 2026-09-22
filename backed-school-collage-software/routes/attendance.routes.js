const express = require("express");
const { authMiddleware } = require("../middleware/authMiddleware");
const { getAttendance, markAttendance, getAttendanceSummary } = require("../controllers/attendance/attendance.controller");
const router = express.Router();

router.get("/", authMiddleware, getAttendance);
router.get("/summary", authMiddleware, getAttendanceSummary);
router.post("/", authMiddleware, markAttendance);

module.exports = router;
