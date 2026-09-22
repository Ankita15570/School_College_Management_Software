const express = require("express");
const { authMiddleware } = require("../middleware/authMiddleware");
const { getAllStudents, getStudentById, createStudent, updateStudent, deleteStudent } = require("../controllers/student/student.controller");

const router = express.Router();

// Student routes as per controller
router.get("/", authMiddleware, getAllStudents);
router.get("/:id", authMiddleware, getStudentById);
router.post("/", authMiddleware, createStudent);
router.put("/:id", authMiddleware, updateStudent);
router.delete("/:id", authMiddleware, deleteStudent);

module.exports = router;