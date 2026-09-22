const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../middleware/authMiddleware");
const { getFeedbacks, createFeedback } = require("../controllers/feedback/feedback.controller");

router.get("/", authMiddleware, getFeedbacks);
router.post("/", authMiddleware, createFeedback);

module.exports = router;