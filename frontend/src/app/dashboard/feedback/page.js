 
"use client";
import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaStar, FaPaperPlane, FaUser, FaEnvelope, FaComment, FaCheckCircle, FaQuestionCircle } from "react-icons/fa";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import axios from "axios";
import { getToken } from "@/utils/auth";
import Link from "next/link";
import "animate.css";
import { useSelector } from "react-redux";

const Feedback = () => {
  const { academicYear } = useSelector((state) => state.academicYear);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    feedbackType: "General Feedback",
    rating: 0,
    message: "",
    followUp: false,
    academicYear : academicYear
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleRating = (rating) => {
    setFormData((prev) => ({ ...prev, rating }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.message.trim()) {
      setError("Please provide your feedback message.");
      return;
    }

    try {
      const token = getToken();
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/feedback`,
        formData,
        { headers: { "x-auth-token": token } }
      );
      setSubmitted(true);
      setError("");
      setFormData({
        name: "",
        email: "",
        feedbackType: "General Feedback",
        rating: 0,
        message: "",
        followUp: false,
      });
      setTimeout(() => setSubmitted(false), 3000);
    } catch (err) {
      console.error("Error submitting feedback:", err);
      setError("Failed to submit feedback. Please try again.");
    }
  };

  return (
    <div className="container-fluid" style={{ backgroundColor: "#F8F9FA", minHeight: "100vh" }} role="main" aria-label="Feedback page">
      {/* Header */}
      <div className="row align-items-center mb-4">
        <div className="col-12 text-center">
          <h1
            className="fw-bold mb-2 animate__animated animate__fadeIn"
            style={{ color: "#1A3159", fontSize: "2.5rem" }}
          >
            Share Your Feedback
          </h1>
          <p style={{ color: "#555", fontSize: "1.2rem", lineHeight: "1.5" }}>
            We value your input! Let us know how we can improve our software.
          </p>
        </div>
      </div>

      {/* Navigation Button */}
      <div className="row mb-4">
        <div className="col-12 text-center">
          <Link href="/faqs">
            <button
              className="btn py-2 px-4 animate__animated animate__fadeIn"
              style={{
                background: "linear-gradient(135deg, #1A3159, #2A4A8A)",
                color: "#FFFFFF",
                border: "none",
                borderRadius: "6px",
                fontWeight: "600",
                boxShadow: "0 2px 8px rgba(26, 49, 89, 0.2)",
                transition: "all 0.3s ease",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = "scale(1.05)";
                e.target.style.boxShadow = "0 4px 12px rgba(26, 49, 89, 0.3)";
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = "scale(1)";
                e.target.style.boxShadow = "0 2px 8px rgba(26, 49, 89, 0.2)";
              }}
              aria-label="View FAQs"
            >
              <FaQuestionCircle className="me-2" /> View FAQs
            </button>
          </Link>
        </div>
      </div>

      {/* Feedback Form */}
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="card shadow-sm animate__animated animate__fadeInUp" style={{ border: "none", borderRadius: "8px", backgroundColor: "#FFFFFF" }}>
            <div
              className="card-header text-center"
              style={{ backgroundColor: "#1A3159", color: "#FFFFFF", borderRadius: "8px 8px 0 0" }}
            >
              <FaComment className="me-2" /> Feedback Form
            </div>
            <div className="card-body p-3">
              {submitted && (
                <div
                  className="alert alert-success d-flex align-items-center animate__animated animate__fadeIn"
                  role="alert"
                  style={{ borderRadius: "6px", fontSize: "0.9rem", padding: "10px" }}
                >
                  <FaCheckCircle className="me-2" />
                  Thank you for your feedback! We’ll review it soon.
                </div>
              )}
              {error && (
                <div
                  className="alert alert-danger animate__animated animate__fadeIn"
                  role="alert"
                  style={{ borderRadius: "6px", fontSize: "0.9rem", padding: "10px" }}
                >
                  {error}
                </div>
              )}
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label" style={{ color: "#1A3159", fontWeight: "500", fontSize: "1rem" }}>
                    Your Name (Optional) <FaUser className="ms-1" />
                  </label>
                  <input
                    type="text"
                    name="name"
                    className="form-control"
                    placeholder="Enter your name"
                    value={formData.name}
                    onChange={handleChange}
                    style={{
                      border: "1px solid #E9ECEF",
                      borderRadius: "6px",
                      fontSize: "1rem",
                      fontWeight: "400",
                      padding: "10px",
                      transition: "border-color 0.3s",
                    }}
                    onFocus={(e) => (e.target.style.borderColor = "#EF7E20")}
                    onBlur={(e) => (e.target.style.borderColor = "#E9ECEF")}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label" style={{ color: "#1A3159", fontWeight: "500", fontSize: "1rem" }}>
                    Email (Optional) <FaEnvelope className="ms-1" />
                  </label>
                  <input
                    type="email"
                    name="email"
                    className="form-control"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
                    style={{
                      border: "1px solid #E9ECEF",
                      borderRadius: "6px",
                      fontSize: "1rem",
                      fontWeight: "400",
                      padding: "10px",
                      transition: "border-color 0.3s",
                    }}
                    onFocus={(e) => (e.target.style.borderColor = "#EF7E20")}
                    onBlur={(e) => (e.target.style.borderColor = "#E9ECEF")}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label" style={{ color: "#1A3159", fontWeight: "500", fontSize: "1rem" }}>
                    Feedback Type
                  </label>
                  <select
                    name="feedbackType"
                    className="form-control"
                    value={formData.feedbackType}
                    onChange={handleChange}
                    style={{
                      border: "1px solid #E9ECEF",
                      borderRadius: "6px",
                      fontSize: "1rem",
                      fontWeight: "400",
                      padding: "10px",
                      transition: "border-color 0.3s",
                    }}
                    onFocus={(e) => (e.target.style.borderColor = "#EF7E20")}
                    onBlur={(e) => (e.target.style.borderColor = "#E9ECEF")}
                  >
                    <option value="General Feedback">General Feedback</option>
                    <option value="Bug Report">Bug Report</option>
                    <option value="Feature Request">Feature Request</option>
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label" style={{ color: "#1A3159", fontWeight: "500", fontSize: "1rem" }}>
                    Rate Our Software (1-5)
                  </label>
                  <div className="d-flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <OverlayTrigger
                        key={star}
                        placement="top"
                        overlay={<Tooltip>Rate {star} star{star > 1 ? "s" : ""}</Tooltip>}
                      >
                        <FaStar
                          size={30}
                          className="me-1"
                          style={{ cursor: "pointer", color: formData.rating >= star ? "#EF7E20" : "#D3D3D3" }}
                          onClick={() => handleRating(star)}
                        />
                      </OverlayTrigger>
                    ))}
                  </div>
                </div>
                <div className="mb-3">
                  <label className="form-label" style={{ color: "#1A3159", fontWeight: "500", fontSize: "1rem" }}>
                    Your Feedback <FaComment className="ms-1" />
                  </label>
                  <textarea
                    name="message"
                    className="form-control"
                    placeholder="Tell us about your experience..."
                    value={formData.message}
                    onChange={handleChange}
                    rows="5"
                    required
                    style={{
                      border: "1px solid #E9ECEF",
                      borderRadius: "6px",
                      fontSize: "1rem",
                      fontWeight: "400",
                      padding: "10px",
                      transition: "border-color 0.3s",
                    }}
                    onFocus={(e) => (e.target.style.borderColor = "#EF7E20")}
                    onBlur={(e) => (e.target.style.borderColor = "#E9ECEF")}
                  />
                </div>
                <div className="mb-3 form-check">
                  <input
                    type="checkbox"
                    name="followUp"
                    className="form-check-input"
                    checked={formData.followUp}
                    onChange={handleChange}
                    style={{ borderColor: "#E9ECEF" }}
                  />
                  <label className="form-check-label" style={{ color: "#1A3159", fontWeight: "400", fontSize: "1rem" }}>
                    Would you like a follow-up?
                  </label>
                </div>
                <div className="text-center">
                  <OverlayTrigger
                    placement="top"
                    overlay={<Tooltip>Submit your feedback</Tooltip>}
                  >
                    <button
                      type="submit"
                      className="btn py-2 px-4 animate__animated animate__fadeIn"
                      style={{
                        background: "linear-gradient(135deg, #EF7E20, #FF9B50)",
                        color: "#FFFFFF",
                        border: "none",
                        borderRadius: "6px",
                        fontWeight: "600",
                        boxShadow: "0 2px 8px rgba(239, 126, 32, 0.2)",
                        transition: "all 0.3s ease",
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.transform = "scale(1.05)";
                        e.target.style.boxShadow = "0 4px 12px rgba(239, 126, 32, 0.3)";
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.transform = "scale(1)";
                        e.target.style.boxShadow = "0 2px 8px rgba(239, 126, 32, 0.2)";
                      }}
                    >
                      <FaPaperPlane className="me-2" /> Submit Feedback
                    </button>
                  </OverlayTrigger>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Feedback;