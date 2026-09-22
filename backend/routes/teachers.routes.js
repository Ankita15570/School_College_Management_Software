const express = require("express");
const { authMiddleware } = require("../middleware/authMiddleware");
const { getTeachers } = require("../controllers/teachers/teachers.controller");

const router = express.Router();

// Student routes as per controller
router.get("/", authMiddleware, getTeachers);

module.exports = router;