"use client";
import { useState, useEffect } from "react";
import { Modal, Button, Form, Alert } from "react-bootstrap";
import axios from "axios";
import { getToken } from "@/utils/auth";

// Define Key Indicators for each criterion
const keyIndicators = {
  "criterion-i": [
    "Curricular Planning and Implementation",
    "Academic Flexibility",
    "Curriculum Enrichment",
    "Feedback System",
  ],
  "criterion-ii": [
    "Student Enrolment and Profile",
    "Catering to Student Diversity",
    "Teaching-Learning Process",
    "Teacher Profile and Quality",
    "Evaluation Process and Reforms",
    "Student Performance and Learning Outcome",
    "Student Satisfaction Survey",
  ],
  "criterion-iii": [
    "Resource Mobilization for Research",
    "Innovation Ecosystem",
    "Research Publications and Awards",
    "Extension Activities",
    "Collaboration",
  ],
  "criterion-iv": [
    "Physical Facilities",
    "Library as Learning Resource",
    "IT Infrastructure",
    "Maintenance of Campus Infrastructure",
  ],
  "criterion-v": [
    "Student Support",
    "Student Progression",
    "Student Participation and Activities",
    "Alumni Engagement",
  ], 
  "criterion-vi": [
    "Institutional Vision and Leadership",
    "Strategy Development and Deployment",
    "Faculty Empowerment Strategies",
    "Financial Management and Resource Mobilization",
    "Internal Quality Assurance System",
  ],
  "criterion-vii": [
    "Institutional Values and Social Responsibilities",
    "Best Practices",
    "Institutional Distinctiveness",
  ],
};

export default function AQARForm({ show, onHide, fetchData, editEntry, section, sectionName, academicYear }) {
  const [formData, setFormData] = useState({
    title: "",
    media: null,
    keyIndicator: "",
    status: "Pending", // Default status for new entries
  });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState("");
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const token = getToken();
        if (token) {
          const res = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/get-user-info`, {
            headers: { "x-auth-token": token },
          });
          setUserId(res.data.data.user._id);
        }
      } catch (err) {
        console.error("Error fetching user info:", err);
      }
    };
    fetchUserInfo();

    if (editEntry) {
      setFormData({
        title: editEntry.title || "",
        media: null, // File input cannot be prefilled
        keyIndicator: editEntry.keyIndicator || "",
        status: editEntry.status || "Pending", // Retain existing status if editing
      });
    } else {
      setFormData({
        title: "",
        media: null,
        keyIndicator: "",
        status: "Pending", // Default to Pending for new entries
      });
    }
  }, [editEntry]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "media") {
      setFormData((prev) => ({ ...prev, media: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title) newErrors.title = "Title is required.";
    if (section !== "part-a" && !formData.keyIndicator) newErrors.keyIndicator = "Key Indicator is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setSuccess("");

    if (!validateForm()) return;

    try {
      let mediaId = editEntry?.media?._id || null;

      // Upload file to /media/upload-media if a new file is selected
      if (formData.media) {
        const formDataUpload = new FormData();
        formDataUpload.append("media", formData.media);
        formDataUpload.append("userId", userId);
        formDataUpload.append("feature", "aqar");
        formDataUpload.append("academicYear", academicYear);

        const mediaResponse = await axios.post(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/media/upload-media`,
          formDataUpload,
          {
            headers: {
              "x-auth-token": getToken(),
              "Content-Type": "multipart/form-data",
            },
          }
        );
        mediaId = mediaResponse.data.data._id;
      }

      const data = {
        title: formData.title,
        media: mediaId || null, // Send the mediaId (null if no file)
        academicYear: academicYear,
        keyIndicator: section === "part-a" ? null : formData.keyIndicator, // Only send keyIndicator for Part B
        status: formData.status, // Include status in the submission
      };

      console.log(data, "data ==>");
      const part = section === "part-a" ? "A" : "B";
      const criterion = section === "part-a" ? null : section.split("-")[1].toUpperCase();
      const url = editEntry
        ? criterion
          ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/aqar/${part}/${criterion}/${editEntry._id}`
          : `${process.env.NEXT_PUBLIC_API_BASE_URL}/aqar/${part}/${editEntry._id}`
        : criterion
        ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/aqar/${part}/${criterion}`
        : `${process.env.NEXT_PUBLIC_API_BASE_URL}/aqar/${part}`;

      const method = editEntry ? "put" : "post";

      await axios[method](url, data, {
        headers: {
          "x-auth-token": getToken(),
          "Content-Type": "application/json",
        },
      });

      setSuccess(`Entry ${editEntry ? "updated" : "added"} successfully!`);
      fetchData();
      setTimeout(() => {
        onHide();
        setSuccess("");
      }, 1000);
    } catch (err) {
      console.error("Error submitting AQAR form:", err);
      setErrors({ submit: err.response?.data?.message || "An error occurred. Please try again." });
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton style={{ backgroundColor: "#1A3159", color: "#FFFFFF" }}>
        <Modal.Title>{editEntry ? "Edit " : `Add - ${sectionName}`}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h6 className="mb-3" style={{ color: "#1A3159" }}>{sectionName}</h6>
        {errors.submit && <Alert variant="danger">{errors.submit}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Title</Form.Label>
            <Form.Control
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g., Courses Offered 2025"
              required
            />
            {errors.title && <div className="text-danger">{errors.title}</div>}
          </Form.Group>

          {section !== "part-a" && (
            <Form.Group className="mb-3">
              <Form.Label>Key Indicator</Form.Label>
              <Form.Select
                name="keyIndicator"
                value={formData.keyIndicator}
                onChange={handleChange}
                required
              >
                <option value="">Select Key Indicator</option>
                {keyIndicators[section]?.map((indicator, index) => (
                  <option key={index} value={indicator}>
                    {indicator}
                  </option>
                ))}
              </Form.Select>
              {errors.keyIndicator && <div className="text-danger">{errors.keyIndicator}</div>}
            </Form.Group>
          )}

          <Form.Group className="mb-3">
            <Form.Label>Upload Document</Form.Label>
            <Form.Control
              type="file"
              name="media"
              accept=".pdf,.jpg,.png"
              onChange={handleChange}
            />
          </Form.Group>

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
              {editEntry ? "Update" : "Add"} Entry
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
}