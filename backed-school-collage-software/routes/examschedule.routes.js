const express = require("express");
const { authMiddleware } = require("../middleware/authMiddleware");
const { getExams, createExam, updateExam, deleteExam } = require("../controllers/examschedule/examschedule.controller");
const router = express.Router();

router.get("/", authMiddleware, getExams);
router.post("/", authMiddleware, createExam);
router.put("/:id", authMiddleware, updateExam);
router.delete("/:id", authMiddleware, deleteExam);

module.exports = router;
