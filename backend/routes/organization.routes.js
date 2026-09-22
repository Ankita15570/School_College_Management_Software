const express = require("express");
const { getAllOrganizations, getOrganizationById, createOrganization, updateOrganization, deleteOrganization } = require("../controllers/organization/organization.controller");
const { authMiddleware } = require("../middleware/authMiddleware");
const router = express.Router();

router.get("/", authMiddleware, getAllOrganizations);
router.get("/:id", authMiddleware, getOrganizationById);
router.post("/", authMiddleware, createOrganization);
router.put("/:id", authMiddleware, updateOrganization);
router.delete("/:id", authMiddleware, deleteOrganization);

module.exports = router;