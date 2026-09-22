const express = require("express");
const { authMiddleware } = require("../middleware/authMiddleware");
const { getAllDiaries, getDiariesBySection, createOrUpdateDiaryEntry, updateSubEntry, deleteSubEntry } = require("../controllers/dailyEventDiary/dailyEventDiary.controller");
const router = express.Router();

// Routes
router.get('/:academicYear', authMiddleware, getAllDiaries);
router.get('/:section/:academicYear', authMiddleware, getDiariesBySection);
router.post('/:section', authMiddleware, createOrUpdateDiaryEntry);
router.put('/:section/:id/:subEntryIndex', authMiddleware, updateSubEntry);
router.delete('/:section/:id/:subEntryIndex', authMiddleware,deleteSubEntry);

module.exports = router;
