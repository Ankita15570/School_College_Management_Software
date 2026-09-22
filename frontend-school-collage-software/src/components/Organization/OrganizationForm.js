 
"use client";
import { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import axios from "axios";
import { getToken } from "../../utils/auth";

export default function OrganizationForm({ show, onHide, fetchData, editEntry }) {
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    address: "",
    website: "",
    accreditationBody: "",
    naacGrade: "",
    contactPerson: { fullName: "" },
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (editEntry) {
      setFormData({
        name: editEntry.name || "",
        type: editEntry.type || "",
        address: editEntry.address || "",
        website: editEntry.website || "",
        accreditationBody: editEntry.accreditationBody || "",
        naacGrade: editEntry.naacGrade || "",
        contactPerson: { fullName: editEntry.contactPerson?.fullName || "" },
        email: editEntry.email || "",
        password: "", // Do not pre-fill password for security
      });
    } else {
      setFormData({
        name: "",
        type: "",
        address: "",
        website: "",
        accreditationBody: "",
        naacGrade: "",
        contactPerson: { fullName: "" },
        email: "",
        password: "",
      });
    }
  }, [editEntry]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "contactPerson.fullName") {
      setFormData((prev) => ({
        ...prev,
        contactPerson: { fullName: value },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = "Organization Name is required";
    if (!formData.type) newErrors.type = "Organization Type is required";
    if (!formData.contactPerson.fullName) newErrors["contactPerson.fullName"] = "Contact Person Name is required";
    if (!formData.email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Invalid email format";
    if (!editEntry && !formData.password) newErrors.password = "Password is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const data = {
        name: formData.name,
        type: formData.type,
        address: formData.address,
        website: formData.website,
        accreditationBody: formData.accreditationBody,
        naacGrade: formData.naacGrade,
       
        contactPerson: formData.contactPerson,
        email: formData.email,
        password: formData.password || undefined, // Omit password if not provided during edit
      };

      const url = editEntry
        ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/organizations/${editEntry._id}`
        : `${process.env.NEXT_PUBLIC_API_BASE_URL}/organizations`;

      const method = editEntry ? axios.put : axios.post;
      await method(url, data, {
        headers: { 
          "x-auth-token": getToken(),
          "Content-Type": "application/json"
        },
      });
      fetchData();
      onHide();
    } catch (err) {
      console.error("Error submitting organization form:", err);
      setErrors({ submit: err.response?.data?.message || "An error occurred. Please try again." });
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered size="lg">
      <Modal.Header closeButton style={{ backgroundColor: "#1A3159", color: "#FFFFFF" }}>
        <Modal.Title>{editEntry ? "Edit Organization" : "Add Organization"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-md-6">
              <Form.Group className="mb-3">
                <Form.Label style={{ color: "#1A3159", fontWeight: "500" }}>
                  Organization Name
                </Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g., Mahila Mahavidyalaya, Karad"
                  isInvalid={!!errors.name}
                  style={{ borderColor: "#1A3159", borderRadius: "8px" }}
                />
                <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label style={{ color: "#1A3159", fontWeight: "500" }}>
                  Organization Type
                </Form.Label>
                <Form.Select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  isInvalid={!!errors.type}
                  style={{ borderColor: "#1A3159", borderRadius: "8px" }}
                >
                  <option value="">Select Type</option>
                  {["School", "College", "University", "Other"].map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </Form.Select>
                <Form.Control.Feedback type="invalid">{errors.type}</Form.Control.Feedback>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label style={{ color: "#1A3159", fontWeight: "500" }}>
                  Address
                </Form.Label>
                <Form.Control
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="e.g., 123 Main Street, City"
                  style={{ borderColor: "#1A3159", borderRadius: "8px" }}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label style={{ color: "#1A3159", fontWeight: "500" }}>
                  Website
                </Form.Label>
                <Form.Control
                  type="url"
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  placeholder="e.g., https://www.college.com"
                  style={{ borderColor: "#1A3159", borderRadius: "8px" }}
                />
              </Form.Group>
            </div>
            <div className="col-md-6">
              <Form.Group className="mb-3">
                <Form.Label style={{ color: "#1A3159", fontWeight: "500" }}>
                  Accreditation Body
                </Form.Label>
                <Form.Control
                  type="text"
                  name="accreditationBody"
                  value={formData.accreditationBody}
                  onChange={handleChange}
                  placeholder="e.g., NAAC, NBA"
                  style={{ borderColor: "#1A3159", borderRadius: "8px" }}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label style={{ color: "#1A3159", fontWeight: "500" }}>
                  NAAC Grade
                </Form.Label>
                <Form.Control
                  type="text"
                  name="naacGrade"
                  value={formData.naacGrade}
                  onChange={handleChange}
                  placeholder="e.g., B++ (CGPA 2.85)"
                  style={{ borderColor: "#1A3159", borderRadius: "8px" }}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label style={{ color: "#1A3159", fontWeight: "500" }}>
                  Contact Person Name
                </Form.Label>
                <Form.Control
                  type="text"
                  name="contactPerson.fullName"
                  value={formData.contactPerson.fullName}
                  onChange={handleChange}
                  placeholder="e.g., Dr. John Doe"
                  isInvalid={!!errors["contactPerson.fullName"]}
                  style={{ borderColor: "#1A3159", borderRadius: "8px" }}
                />
                <Form.Control.Feedback type="invalid">{errors["contactPerson.fullName"]}</Form.Control.Feedback>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label style={{ color: "#1A3159", fontWeight: "500" }}>
                  Email
                </Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="e.g., admin@organization.com"
                  isInvalid={!!errors.email}
                  style={{ borderColor: "#1A3159", borderRadius: "8px" }}
                />
                <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label style={{ color: "#1A3159", fontWeight: "500" }}>
                  Password
                </Form.Label>
                <Form.Control
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter password"
                  isInvalid={!!errors.password}
                  style={{ borderColor: "#1A3159", borderRadius: "8px" }}
                />
                <Form.Control.Feedback type="invalid">{errors.password}</Form.Control.Feedback>
              </Form.Group>
            </div>
          </div>
          {errors.submit && <div className="text-danger mb-3">{errors.submit}</div>}
          <div className="d-flex justify-content-end">
            <Button
              variant="secondary"
              onClick={onHide}
              className="me-2"
              style={{ backgroundColor: "#6C757D", border: "none" }}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              type="submit"
              style={{ backgroundColor: "#EF7E20", border: "none" }}
            >
              {editEntry ? "Update" : "Add"} Organization
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
}