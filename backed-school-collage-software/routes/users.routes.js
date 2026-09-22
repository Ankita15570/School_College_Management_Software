const express = require("express");
const {
  getUserProfile,
  updateUserProfile,
  uploadProfilePicture,
} = require("../controllers/profile/profile.controller");
const { authMiddleware } = require("../middleware/authMiddleware");
const { uploadMedia } = require("../utils/uploadMedia");
const router = express.Router();

router.get("/me", authMiddleware, getUserProfile);
router.put("/me", authMiddleware, updateUserProfile);
router.post(
  "/me/upload-profile-picture",
  authMiddleware,
  uploadMedia,
  uploadProfilePicture
);

module.exports = router;
