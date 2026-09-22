 
"use client";
import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Alert } from "react-bootstrap";
import { FaEdit } from "react-icons/fa";
import axios from "axios";
import { getToken } from "@/utils/auth";
import "animate.css";

const UpdateProfileForm = ({ show, onHide, userData, onUpdate }) => {
  const [formData, setFormData] = useState(userData);

  useEffect(() => {
    setFormData(userData);
  }, [userData]);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const newErrors = {};
    const role = userData.role;
    if (!formData.name) newErrors.name = "Name is required.";
    if (!formData.email) newErrors.email = "Email is required.";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Invalid email format.";
    const needsEmployeeFields = ["Principal", "Teacher", "Accountant", "Clerk", "Faculty", "Management Staff"].includes(role);
    if (needsEmployeeFields) {
      if (!formData.phoneNumber) newErrors.phoneNumber = "Phone number is required.";
      else if (!/^\d{10}$/.test(formData.phoneNumber)) newErrors.phoneNumber = "Phone number must be 10 digits.";
      if (!formData.designation) newErrors.designation = "Designation is required.";
      if (!formData.dateOfJoining) newErrors.dateOfJoining = "Date of joining is required.";
    }
    if (["Teacher", "Accountant", "Clerk"].includes(role) && !formData.department) {
      newErrors.department = "Department is required.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setErrors({});
    setSuccess("");

    if (!validateForm()) return;

    try {
      const data = {
        name: formData.name,
        email: formData.email,
        department: formData.department,
        employeeId: formData.employeeId,
        designation: formData.designation,
        phoneNumber: formData.phoneNumber,
        dateOfJoining: formData.dateOfJoining ? new Date(formData.dateOfJoining).toISOString() : undefined,
        profileImage: formData.profileImage || undefined,
      };

      const token = getToken();
      await axios.put(`${process.env.NEXT_PUBLIC_API_BASE_URL}/users/me`, data, {
        headers: { "x-auth-token": token, "Content-Type": "application/json" },
      });
      setSuccess("Profile updated successfully!");
      onUpdate();
      setTimeout(() => {
        onHide();
        setSuccess("");
      }, 3000);
    } catch (err) {
      console.error("Error saving profile:", err);
      setErrors({ submit: err.response?.data?.message || "Failed to save profile." });
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered >
      <Modal.Header
        style={{
          backgroundColor: "#1A3159",
          color: "#FFFFFF",
          borderRadius: "8px 8px 0 0",
          padding: "20px",
        }}
      >
        <Modal.Title style={{ fontSize: "1.5rem", fontWeight: "500" }}>Update Profile</Modal.Title>
        <Button
          variant="link"
          onClick={onHide}
          style={{ color: "#FFFFFF", textDecoration: "none" }}
        >
          <i className="bi bi-x-lg"></i>
        </Button>
      </Modal.Header>
      <Modal.Body style={{ backgroundColor: "#FFFFFF", padding: "30px" }}>
        {errors.submit && (
          <Alert variant="danger" className="animate__animated animate__fadeIn" style={{ fontSize: "0.9rem", borderRadius: "8px" }}>
            {errors.submit}
          </Alert>
        )}
        {success && (
          <Alert variant="success" className="animate__animated animate__fadeIn" style={{ fontSize: "0.9rem", borderRadius: "8px" }}>
            {success}
          </Alert>
        )}
        <Form onSubmit={handleSave}>
          <h5 className="fw-bold mb-4" style={{ color: "#1A3159", fontSize: "1.3rem", fontWeight: "500" }}>Personal Details</h5>
          <Form.Group className="mb-3">
            <Form.Label style={{ color: "#1A3159", fontWeight: "500" }}>Name</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g., Dr. John Doe"
              className={errors.name ? "is-invalid" : ""}
              style={{
                border: "1px solid #1A3159",
                borderRadius: "8px",
                fontSize: "0.95rem",
                fontWeight: "400",
                padding: "12px",
                transition: "all 0.3s ease",
                boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "#EF7E20";
                e.target.style.boxShadow = "0 0 8px rgba(239, 126, 32, 0.2)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "#1A3159";
                e.target.style.boxShadow = "0 2px 4px rgba(0,0,0,0.05)";
              }}
              required
            />
            {errors.name && <div className="invalid-feedback">{errors.name}</div>}
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label style={{ color: "#1A3159", fontWeight: "500" }}>Email</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="e.g., john.doe@university.edu"
              className={errors.email ? "is-invalid" : ""}
              style={{
                border: "1px solid #1A3159",
                borderRadius: "8px",
                fontSize: "0.95rem",
                fontWeight: "400",
                padding: "12px",
                transition: "all 0.3s ease",
                boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "#EF7E20";
                e.target.style.boxShadow = "0 0 8px rgba(239, 126, 32, 0.2)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "#1A3159";
                e.target.style.boxShadow = "0 2px 4px rgba(0,0,0,0.05)";
              }}
              required
            />
            {errors.email && <div className="invalid-feedback">{errors.email}</div>}
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label style={{ color: "#1A3159", fontWeight: "500" }}>Employee ID</Form.Label>
            <Form.Control
              type="text"
              name="employeeId"
              value={formData.employeeId}
              onChange={handleChange}
              placeholder="e.g., EMP12345"
              className={errors.employeeId ? "is-invalid" : ""}
              style={{
                border: "1px solid #1A3159",
                borderRadius: "8px",
                fontSize: "0.95rem",
                fontWeight: "400",
                padding: "12px",
                transition: "all 0.3s ease",
                boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "#EF7E20";
                e.target.style.boxShadow = "0 0 8px rgba(239, 126, 32, 0.2)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "#1A3159";
                e.target.style.boxShadow = "0 2px 4px rgba(0,0,0,0.05)";
              }}
            />
          </Form.Group>
          <hr style={{ borderColor: "#E9ECEF", opacity: 0.2, margin: "25px 0" }} />
          <h5 className="fw-bold mb-4" style={{ color: "#1A3159", fontSize: "1.3rem", fontWeight: "500" }}>Professional Details</h5>
          <Form.Group className="mb-3">
            <Form.Label style={{ color: "#1A3159", fontWeight: "500" }}>Department</Form.Label>
            <Form.Control
              type="text"
              name="department"
              value={formData.department}
              onChange={handleChange}
              placeholder="e.g., Computer Science"
              className={errors.department ? "is-invalid" : ""}
              style={{
                border: "1px solid #1A3159",
                borderRadius: "8px",
                fontSize: "0.95rem",
                fontWeight: "400",
                padding: "12px",
                transition: "all 0.3s ease",
                boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "#EF7E20";
                e.target.style.boxShadow = "0 0 8px rgba(239, 126, 32, 0.2)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "#1A3159";
                e.target.style.boxShadow = "0 2px 4px rgba(0,0,0,0.05)";
              }}
              required={["Teacher", "Accountant", "Clerk"].includes(userData.role)}
            />
            {errors.department && <div className="invalid-feedback">{errors.department}</div>}
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label style={{ color: "#1A3159", fontWeight: "500" }}>Designation</Form.Label>
            <Form.Control
              type="text"
              name="designation"
              value={formData.designation}
              onChange={handleChange}
              placeholder="e.g., Professor"
              className={errors.designation ? "is-invalid" : ""}
              style={{
                border: "1px solid #1A3159",
                borderRadius: "8px",
                fontSize: "0.95rem",
                fontWeight: "400",
                padding: "12px",
                transition: "all 0.3s ease",
                boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "#EF7E20";
                e.target.style.boxShadow = "0 0 8px rgba(239, 126, 32, 0.2)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "#1A3159";
                e.target.style.boxShadow = "0 2px 4px rgba(0,0,0,0.05)";
              }}
              required
            />
            {errors.designation && <div className="invalid-feedback">{errors.designation}</div>}
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label style={{ color: "#1A3159", fontWeight: "500" }}>Phone Number</Form.Label>
            <Form.Control
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              placeholder="e.g., 9876543210"
              className={errors.phoneNumber ? "is-invalid" : ""}
              style={{
                border: "1px solid #1A3159",
                borderRadius: "8px",
                fontSize: "0.95rem",
                fontWeight: "400",
                padding: "12px",
                transition: "all 0.3s ease",
                boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "#EF7E20";
                e.target.style.boxShadow = "0 0 8px rgba(239, 126, 32, 0.2)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "#1A3159";
                e.target.style.boxShadow = "0 2px 4px rgba(0,0,0,0.05)";
              }}
              required
            />
            {errors.phoneNumber && <div className="invalid-feedback">{errors.phoneNumber}</div>}
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label style={{ color: "#1A3159", fontWeight: "500" }}>Date of Joining</Form.Label>
            <Form.Control
              type="date"
              name="dateOfJoining"
              value={formData.dateOfJoining ? new Date(formData.dateOfJoining).toISOString().split("T")[0] : ""}
              onChange={handleChange}
              className={errors.dateOfJoining ? "is-invalid" : ""}
              style={{
                border: "1px solid #1A3159",
                borderRadius: "8px",
                fontSize: "0.95rem",
                fontWeight: "400",
                padding: "12px",
                transition: "all 0.3s ease",
                boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "#EF7E20";
                e.target.style.boxShadow = "0 0 8px rgba(239, 126, 32, 0.2)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "#1A3159";
                e.target.style.boxShadow = "0 2px 4px rgba(0,0,0,0.05)";
              }}
              required
            />
            {errors.dateOfJoining && <div className="invalid-feedback">{errors.dateOfJoining}</div>}
          </Form.Group>
          <div className="text-end mt-4">
            <Button
              variant="secondary"
              onClick={onHide}
              style={{
                backgroundColor: "#6C757D",
                border: "none",
                borderRadius: "8px",
                fontWeight: "600",
                padding: "12px 24px",
                marginRight: "10px",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = "#5A6268";
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = "#6C757D";
              }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              style={{
                backgroundColor: "#EF7E20",
                border: "2px solid #FF9B50",
                borderRadius: "8px",
                fontWeight: "600",
                padding: "12px 24px",
                transition: "all 0.3s ease",
              }}
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
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default UpdateProfileForm;