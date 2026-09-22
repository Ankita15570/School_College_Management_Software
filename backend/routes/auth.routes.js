const express = require("express");
const {
  registerSuperAdmin,
  login,
  getUserInfo,
} = require("../controllers/auth/auth.controller");
const { authMiddleware } = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/register-superadmin", registerSuperAdmin);

router.post("/login", login);

router.get("/get-user-info", authMiddleware , getUserInfo);


module.exports = router;
