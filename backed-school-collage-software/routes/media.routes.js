const express = require("express");
const { authMiddleware } = require("../middleware/authMiddleware");
const { uploadMedia } = require("../utils/uploadMedia");
const {
  uploadAndStoreMedia,
} = require("../controllers/media/media.controller");
const router = express.Router();

router.post("/upload-media",  uploadMedia, uploadAndStoreMedia);

module.exports = router;
