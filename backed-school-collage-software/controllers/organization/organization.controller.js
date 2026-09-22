const { default: mongoose } = require("mongoose");
const { generateUniqueEmployeeId } = require("../../common/common");
const { sendResponse } = require("../../config/response");
const Organization = require("../../models/Organization/Organization");
const User = require("../../models/User/User");

exports.getAllOrganizations = async (req, res) => {
  try {
    const user = req.user;
    let organizations;
    if (user.role === "SuperAdmin") {
      organizations = await Organization.find();
    } else {
      organizations = await Organization.find({ createdBy: user._id });
    }
    sendResponse(res, 200, organizations, "Organizations fetched successfully");
  } catch (err) {
    sendResponse(res, 500, err.message);
  }
};

exports.getOrganizationById = async (req, res) => {
  try {
    const orgId = mongoose.Types.ObjectId.createFromHexString(req.params.id);

    const organization = await Organization.aggregate([
      {
        $match: { _id: orgId },
      },
      {
        $lookup: {
          from: "users", // collection name in MongoDB
          let: { orgId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$organizationId", "$$orgId"] },
                    { $eq: ["$role", "OrganizationAdmin"] },
                  ],
                },
              },
            },
            {
              $project: {
                _id: 0,
                profileImage: 1,
                name: 1,
                email: 1,
              },
            },
          ],
          as: "organizationAdmin",
        },
      },
      {
        $addFields: {
          profileImageUrl: {
            $ifNull: [
              { $arrayElemAt: ["$organizationAdmin.profileImage", 0] },
              null,
            ],
          },
        },
      },
      {
        $project: {
          organizationAdmin: 0, // hide admin array if not needed
        },
      },
    ]);

    if (!organization || organization.length === 0) {
      return sendResponse(res, 404, "Organization not found");
    }

    sendResponse(
      res,
      200,
      organization[0],
      "Organization fetched successfully"
    );
  } catch (err) {
    console.error("Error fetching organization:", err);
    sendResponse(res, 500, err.message);
  }
};

exports.createOrganization = async (req, res) => {
  try {
    const {
      name,
      type,
      address,
      website,
      accreditationBody,
      naacGrade,
      contactPerson,
      email,
      password,
    } = req.body;

    let user = await User.findOne({ email });
    if (user) {
      return sendResponse(res, 400, null, "Email already exists");
    }

    const organization = new Organization({
      name,
      type,
      address,
      website,
      accreditationBody,
      naacGrade,
      contactPerson,
      email,
      password, // Store plain text password as requested
      createdBy: req.user.id || req.user._id,
    });

    await organization.save();

    const employeeId = await generateUniqueEmployeeId("OrganizationAdmin");

    user = new User({
      name,
      email,
      password,
      role: "OrganizationAdmin",
      organizationId: organization._id,
      employeeId,
    });

    await user.save();

    sendResponse(res, 201, organization, "Organization created successfully");
  } catch (err) {
    sendResponse(res, 500, err.message);
  }
};

exports.updateOrganization = async (req, res) => {
  try {
    const organization = await Organization.findById(req.params.id);
    if (!organization) {
      return sendResponse(res, 404, "Organization not found");
    }
    if (
      req.user.role !== "SuperAdmin" &&
      organization.createdBy.toString() !== req.user._id.toString()
    ) {
      return sendResponse(res, 403, "Unauthorized access");
    }

    const {
      name,
      type,
      address,
      website,
      accreditationBody,
      naacGrade,
      contactPerson,
      email,
      password,
    } = req.body;

    organization.set({
      name,
      type,
      address,
      website,
      accreditationBody,
      naacGrade,
      contactPerson,
      email,
      password: password || organization.password, // Update password only if provided
    });

    await organization.save();
    sendResponse(res, 200, "Organization updated successfully", {
      organization,
    });
  } catch (err) {
    sendResponse(res, 500, err.message);
  }
};

exports.deleteOrganization = async (req, res) => {
  try {
    const organization = await Organization.findById(req.params.id);
    if (!organization) {
      return sendResponse(res, 404, "Organization not found");
    }
    if (req.user.role !== "SuperAdmin") {
      return sendResponse(res, 403, "Only SuperAdmin can delete organizations");
    }

    await organization.deleteOne();
    sendResponse(res, 200, "Organization deleted successfully");
  } catch (err) {
    sendResponse(res, 500, err.message);
  }
};
