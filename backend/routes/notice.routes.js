const express = require("express");
const { authMiddleware } = require("../middleware/authMiddleware");
const { getNotices, createNotice, updateNotice, deleteNotice } = require("../controllers/notice/notice.controller");
const router = express.Router();

router.get("/", authMiddleware, getNotices);
router.post("/", authMiddleware, createNotice);
router.put("/:id", authMiddleware, updateNotice);
router.delete("/:id", authMiddleware, deleteNotice);

module.exports = router;
