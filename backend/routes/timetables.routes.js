const express = require("express");
const { authMiddleware } = require("../middleware/authMiddleware");
const { getAllTimetables, getTimetableById, createTimetable, updateTimetable, deleteTimetable } = require("../controllers/timetable/timetable.controller");
const router = express.Router();

router.get("/", authMiddleware, getAllTimetables);
router.get("/user/:userId/:academicYear", authMiddleware, getAllTimetables);
router.get("/:id", authMiddleware, getTimetableById);
router.post("/", authMiddleware, createTimetable);
router.put("/:id", authMiddleware, updateTimetable);
router.delete("/:id", authMiddleware, deleteTimetable);

module.exports = router;