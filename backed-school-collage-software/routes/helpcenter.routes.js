const express = require("express");
const { authMiddleware } = require("../middleware/authMiddleware");
const { getHelpRequests, createHelpRequest, updateHelpRequest } = require("../controllers/helpcenter/helpcenter.controller");
const router = express.Router();

router.get("/", authMiddleware, getHelpRequests);
router.post("/", authMiddleware, createHelpRequest);
router.put("/:id", authMiddleware, updateHelpRequest);

module.exports = router;