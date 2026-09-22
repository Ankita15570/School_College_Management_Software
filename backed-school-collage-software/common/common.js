const User = require("../models/User/User");

const VALID_ROLES = [
  "SuperAdmin",
  "OrganizationAdmin",
  "Principal",
  "Faculty",
  "Teacher",
  "Management Staff",
  "Accountant",
  "Clerk",
  "parents"
];

// Map roles to short prefixes for ID generation
const ROLE_PREFIXES = {
  SuperAdmin: "SA",
  OrganizationAdmin: "OA",
  Principal: "PR",
  Faculty: "FA",
  Teacher: "TE",
  "Management Staff": "MS",
  Accountant: "AC",
  Clerk: "CL",
  parents: "PA"
};

const generateUniqueEmployeeId = async (role, retries = 3) => {
  // Validate role
  if (!role || !VALID_ROLES.includes(role)) {
    throw new Error(`Invalid role. Must be one of: ${VALID_ROLES.join(", ")}`);
  }

  const prefix = ROLE_PREFIXES[role];
  const datePart = new Date().toISOString().split('T')[0].replace(/-/g, ''); // e.g., 20250726
  const fullPrefix = prefix + datePart; // e.g., SA20250726

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      // Count existing IDs with this prefix for today
      const count = await User.countDocuments({
        employeeId: { $regex: `^${fullPrefix}` },
      });

      const nextNumber = (count + 1).toString().padStart(4, '0'); // e.g., 0001
      const newId = `${fullPrefix}${nextNumber}`; // e.g., SA202507260001

      // Verify the ID doesn't already exist
      const existingUser = await User.findOne({ employeeId: newId });
      if (existingUser) {
        continue; // Retry if ID exists
      }

      return newId;
    } catch (error) {
      if (attempt === retries) {
        throw new Error(`Failed to generate unique ID for ${role} after ${retries} attempts: ${error.message}`);
      }
    }
  }
};

module.exports = {
  generateUniqueEmployeeId,
};