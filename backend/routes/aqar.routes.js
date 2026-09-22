const express = require("express");
const { authMiddleware } = require("../middleware/authMiddleware");
const { getAQAREntries, getAQAREntryById, createAQAREntry, updateAQAREntry, deleteAQAREntry, updateStatusChange } = require("../controllers/AQAR/aqar.controller");

const router = express.Router();

// AQAR routes
router.get("/:part/:academicYear", authMiddleware, getAQAREntries);
router.get("/:part/:criterion/:academicYear", authMiddleware, getAQAREntries);
router.get("/:part/:criterion/:id", authMiddleware, getAQAREntryById);
router.post("/:part", authMiddleware, createAQAREntry);
router.post("/:part/:criterion", authMiddleware, createAQAREntry);
router.put("/:part/:criterion/:id", authMiddleware, updateAQAREntry);
router.delete("/:part/:criterion/:id", authMiddleware, deleteAQAREntry);
router.put("/:part/:id", authMiddleware, updateAQAREntry);
router.delete("/:part/:id", authMiddleware, deleteAQAREntry);
router.put("/:part/:criterion/:id/status", authMiddleware, updateStatusChange);
router.put("/:part/:id/status", authMiddleware, updateStatusChange);


 
module.exports = router;