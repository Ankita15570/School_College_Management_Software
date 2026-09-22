/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaUser, FaEdit, FaUpload } from "react-icons/fa";
import { Alert, Button } from "react-bootstrap";
import axios from "axios";
import { getToken } from "@/utils/auth";
import UpdateProfileForm from "@/components/profile/UpdateProfileForm";
import "animate.css";

const Profile = () => {
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    role: "",
    department: "",
    employeeId: "",
    designation: "",
    phoneNumber: "",
    dateOfJoining: "",
    profileImage: "",
    organizationId: { name: "" },
  });
  const [showModal, setShowModal] = useState(false);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);

  const fetchUserProfile = async () => {
    try {
      const token = getToken();
      if (!token) return;

      // Load role from JWT immediately
      const payload = JSON.parse(atob(token.split(".")[1]));
      setUserData((prev) => ({ ...prev, role: payload.role || prev.role }));

      // Load full profile from DB
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/users/me`, {
        headers: { "x-auth-token": token },
      });
      setUserData(res.data.data.user);
    } catch (err) {
      console.error("Error fetching user profile:", err);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const handleProfileUpdate = () => {
    fetchUserProfile();
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUploadProfilePicture = async () => {
    if (!selectedFile) {
      setErrors({ upload: "Please select a file to upload." });
      return;
    }

    const formData = new FormData();
    formData.append("media", selectedFile);
    formData.append("userId", userData._id); // Ensure userData._id is available
    formData.append("feature", "profile");

    try {
      const token = getToken();
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/users/me/upload-profile-picture`, formData, {
        headers: {
          "x-auth-token": token,
          "Content-Type": "multipart/form-data",
        },
      });
      setUserData(res.data.data.user);
      setSuccess("Profile picture uploaded successfully!");
      setSelectedFile(null);
      setErrors({});
    } catch (err) {
      console.error("Error uploading profile picture:", err);
      setErrors({ upload: "Failed to upload profile picture." });
      setSuccess("");
    }
  };

  return (
    <div className="container-fluid" style={{ backgroundColor: "#F8F9FA", minHeight: "100vh", padding: "40px 20px" }} role="main" aria-label="Profile page">
      {/* Header */}
      <div className="row align-items-center mb-4">
        <div className="col-12 col-md-6 mb-3 mb-md-0">
          <h1
            className="fw-bold animate__animated animate__fadeIn"
            style={{ color: "#1A3159", fontSize: "2.5rem" }}
          >
            Your Profile
          </h1>
          <p style={{ color: "#555", fontSize: "1.2rem", lineHeight: "1.5" }}>
            View and manage your personal and professional information.
          </p>
        </div>
        <div className="col-12 col-md-6 text-md-end mb-3 mb-md-0">
          <Button
            className="py-2 px-4 shadow-sm animate__animated animate__fadeIn"
            style={{
              backgroundColor: "#EF7E20",
              color: "#FFFFFF",
              border: "2px solid #FF9B50",
              borderRadius: "8px",
              fontWeight: "600",
              transition: "all 0.3s ease",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
            }}
            onClick={() => setShowModal(true)}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = "#FF9B50";
              e.target.style.borderColor = "#EF7E20";
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = "#EF7E20";
              e.target.style.borderColor = "#FF9B50";
            }}
          >
            <FaEdit className="me-2" /> Update Profile
          </Button>
        </div>
      </div>

      {/* Profile Display */}
      <div className="card shadow-sm animate__animated animate__fadeInUp" style={{ border: "none", borderRadius: "8px", backgroundColor: "#FFFFFF", overflow: "hidden" }}>
        <div className="card-header text-center" style={{ backgroundColor: "#1A3159", color: "#FFFFFF", borderRadius: "8px 8px 0 0", padding: "20px" }}>
          <h5 className="mb-0">
            <FaUser className="me-2" style={{ fontSize: "1.5rem" }} /> Your Profile
          </h5> 
        </div>
        <div className="card-body p-4">
          {errors.fetch && (
            <Alert variant="danger" className="animate__animated animate__fadeIn" style={{ fontSize: "0.9rem", borderRadius: "8px", marginBottom: "20px" }}>
              {errors.fetch}
            </Alert>
          )}
          {success && (
            <Alert variant="success" className="animate__animated animate__fadeIn" style={{ fontSize: "0.9rem", borderRadius: "8px", marginBottom: "20px" }}>
              {success}
            </Alert>
          )}
          {errors.upload && (
            <Alert variant="danger" className="animate__animated animate__fadeIn" style={{ fontSize: "0.9rem", borderRadius: "8px", marginBottom: "20px" }}>
              {errors.upload}
            </Alert>
          )}
          <div className="row g-4">
            <div className="col-md-4 col-sm-12 text-center">
              <img
                src={
                  userData.profileImage ||
                  "https://sm.askmen.com/t/askmen_in/article/f/facebook-p/facebook-profile-picture-affects-chances-of-gettin_fr3n.1200.jpg"
                }
                alt="Profile"
                className="rounded-circle mb-3 animate__animated animate__zoomIn"
                style={{ width: "180px", height: "180px", objectFit: "cover", border: "3px solid #EF7E20" }}
              />
              <div className="mb-3">
                <input
                  type="file"
                  accept="image/jpeg,image/png,application/pdf"
                  onChange={handleFileChange}
                  className="form-control"
                  style={{ borderColor: "#1A3159", borderRadius: "8px", fontSize: "0.9rem" }}
                />
              </div>
              <Button
                className="py-2 px-4 shadow-sm"
                style={{
                  backgroundColor: "#EF7E20",
                  color: "#FFFFFF",
                  border: "2px solid #FF9B50",
                  borderRadius: "8px",
                  fontWeight: "600",
                  transition: "all 0.3s ease",
                }}
                onClick={handleUploadProfilePicture}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = "#FF9B50";
                  e.target.style.borderColor = "#EF7E20";
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = "#EF7E20";
                  e.target.style.borderColor = "#FF9B50";
                }}
              >
                <FaUpload className="me-2" /> Upload Picture
              </Button>
            </div>
            <div className="col-md-8 col-sm-12">
              <h5 className="fw-bold mb-3" style={{ color: "#1A3159", fontSize: "1.3rem", fontWeight: "500" }}>
                Personal Details
              </h5>
              <div className="row g-3 mb-4">
                <div className="col-md-6 col-sm-12">
                  <p style={{ fontSize: "0.95rem", fontWeight: "400", color: "#555", lineHeight: "1.6" }}>
                    <strong>Name:</strong> {userData.name || "-"}
                  </p>
                </div>
                <div className="col-md-6 col-sm-12">
                  <p style={{ fontSize: "0.95rem", fontWeight: "400", color: "#555", lineHeight: "1.6" }}>
                    <strong>Email:</strong> {userData.email || "-"}
                  </p>
                </div>
                <div className="col-md-6 col-sm-12">
                  <p style={{ fontSize: "0.95rem", fontWeight: "400", color: "#555", lineHeight: "1.6" }}>
                    <strong>Role:</strong> {userData.role || "-"}
                  </p>
                </div>
                <div className="col-md-6 col-sm-12">
                  <p style={{ fontSize: "0.95rem", fontWeight: "400", color: "#555", lineHeight: "1.6" }}>
                    <strong>Organization:</strong> {userData.organizationId?.name || "-"}
                  </p>
                </div>
                <div className="col-md-6 col-sm-12">
                  <p style={{ fontSize: "0.95rem", fontWeight: "400", color: "#555", lineHeight: "1.6" }}>
                    <strong>Employee ID:</strong> {userData.employeeId || "-"}
                  </p>
                </div>
                <div className="col-md-6 col-sm-12">
                  <p style={{ fontSize: "0.95rem", fontWeight: "400", color: "#555", lineHeight: "1.6" }}>
                    <strong>Phone Number:</strong> {userData.phoneNumber || "-"}
                  </p>
                </div>
              </div>
              <hr style={{ borderColor: "#E9ECEF", opacity: 0.2, margin: "20px 0" }} />
              <h5 className="fw-bold mb-3" style={{ color: "#1A3159", fontSize: "1.3rem", fontWeight: "500" }}>
                Professional Details
              </h5>
              <div className="row g-3">
                <div className="col-md-6 col-sm-12">
                  <p style={{ fontSize: "0.95rem", fontWeight: "400", color: "#555", lineHeight: "1.6" }}>
                    <strong>Department:</strong> {userData.department || "-"}
                  </p>
                </div>
                <div className="col-md-6 col-sm-12">
                  <p style={{ fontSize: "0.95rem", fontWeight: "400", color: "#555", lineHeight: "1.6" }}>
                    <strong>Designation:</strong> {userData.designation || "-"}
                  </p>
                </div>
                <div className="col-md-6 col-sm-12">
                  <p style={{ fontSize: "0.95rem", fontWeight: "400", color: "#555", lineHeight: "1.6" }}>
                    <strong>Date of Joining:</strong> {userData.dateOfJoining ? new Date(userData.dateOfJoining).toLocaleDateString() : "-"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Update Profile Modal */}
      <UpdateProfileForm
        show={showModal}
        onHide={() => setShowModal(false)}
        userData={userData}
        onUpdate={handleProfileUpdate}
      />
    </div>
  );
};

export default Profile;