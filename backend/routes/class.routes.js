const express = require("express");
const { authMiddleware } = require("../middleware/authMiddleware");
const { getAllClasses, getClassById, createClass, updateClass, deleteClass } = require("../controllers/class/class.controller");

const router = express.Router();

// Class routes as per controller
router.get("/", authMiddleware, getAllClasses);
router.get("/:id", authMiddleware, getClassById);
router.post("/", authMiddleware, createClass);
router.put("/:id", authMiddleware, updateClass);
router.delete("/:id", authMiddleware, deleteClass);

module.exports = router;