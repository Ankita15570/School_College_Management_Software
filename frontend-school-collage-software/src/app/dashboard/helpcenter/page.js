"use client";
import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaEnvelope, FaComments, FaQuestionCircle } from "react-icons/fa";
import axios from "axios";
import { getToken } from "@/utils/auth";
import { useRouter } from "next/navigation";
import Link from "next/link";
import "animate.css";

export default function HelpCenter() {
  const [academicYear, setAcademicYear] = useState("2025 - 2026");

  const [contactForm, setContactForm] = useState({
    issue: "",
    type: "General",
    academicYear,
  });
  const [showSuccess, setShowSuccess] = useState(false);
  const [helpRequests, setHelpRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const handleAcademicYearChange = (e) => {
    setAcademicYear(e.target.value);
  };

  const academicYears = [];
  for (let year = 2015; year < 2030; year++) {
    academicYears.push(`${year} - ${year + 1}`);
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setContactForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = getToken();
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/help-center`,
        contactForm,
        { headers: { "x-auth-token": token } }
      );
      setShowSuccess(true);
      setContactForm({ issue: "", type: "General" });
      fetchHelpRequests();
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (err) {
      console.error("Error submitting help request:", err);
      alert("Failed to submit help request.");
    }
  };

  const fetchHelpRequests = async () => {
    try {
      const token = getToken();
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/help-center`,
        {
          headers: { "x-auth-token": token },
        }
      );
      setHelpRequests(res.data.data.helpRequests);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching help requests:", err);
      setLoading(false);
      router.push("/login");
    }
  };

  useEffect(() => {
    fetchHelpRequests();
  }, [router]);

  return (
    <div
      className="container-fluid"
      style={{ backgroundColor: "#F8F9FA", minHeight: "100vh" }}
      role="main"
      aria-label="Help Center page"
    >
      {/* Header */}
      <div className="row align-items-center mb-4">
        <div className="col-12 text-center">
          <h1
            className="fw-bold mb-2 animate__animated animate__fadeIn"
            style={{ color: "#1A3159", fontSize: "2.5rem" }}
          >
            Help Center
          </h1>
          <p style={{ color: "#555", fontSize: "1.2rem", lineHeight: "1.5" }}>
            Submit a support request or view your request status.
          </p>
        </div>
      </div>
      
      {/* Navigation Buttons */}
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

      <div className="row g-4">
        {/* Contact Support Section */}
        <div className="col-md-4">
          <div
            className="card shadow-sm animate__animated animate__fadeInUp"
            style={{
              border: "none",
              borderRadius: "8px",
              backgroundColor: "#FFFFFF",
            }}
          >
            <div
              className="card-header text-center"
              style={{
                backgroundColor: "#1A3159",
                color: "#FFFFFF",
                borderRadius: "8px 8px 0 0",
              }}
            >
              <FaEnvelope className="me-2" /> Contact Support
            </div>
            <div className="card-body p-3">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <select
                    name="type"
                    className="form-control"
                    value={contactForm.type}
                    onChange={handleInputChange}
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
                    <option value="Technical">Technical</option>
                    <option value="Account">Account</option>
                    <option value="General">General</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="mb-3">
                  <textarea
                    name="issue"
                    className="form-control"
                    placeholder="Describe your issue"
                    value={contactForm.issue}
                    onChange={handleInputChange}
                    style={{
                      border: "1px solid #E9ECEF",
                      borderRadius: "6px",
                      fontSize: "1rem",
                      fontWeight: "400",
                      minHeight: "100px",
                      padding: "10px",
                      transition: "border-color 0.3s",
                    }}
                    onFocus={(e) => (e.target.style.borderColor = "#EF7E20")}
                    onBlur={(e) => (e.target.style.borderColor = "#E9ECEF")}
                  />
                </div>
                <button
                  type="submit"
                  className="btn w-100"
                  style={{
                    background: "linear-gradient(135deg, #EF7E20, #FF9B50)",
                    color: "#FFFFFF",
                    border: "none",
                    borderRadius: "6px",
                    fontWeight: "600",
                    padding: "10px",
                    boxShadow: "0 2px 8px rgba(239, 126, 32, 0.2)",
                    transition: "all 0.3s ease",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = "scale(1.05)";
                    e.target.style.boxShadow =
                      "0 4px 12px rgba(239, 126, 32, 0.3)";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = "scale(1)";
                    e.target.style.boxShadow =
                      "0 2px 8px rgba(239, 126, 32, 0.2)";
                  }}
                >
                  Submit Request
                </button>
                {showSuccess && (
                  <div
                    className="alert alert-success mt-3 animate__animated animate__fadeIn"
                    role="alert"
                    style={{
                      borderRadius: "6px",
                      fontSize: "0.9rem",
                      padding: "10px",
                    }}
                  >
                    Your request has been submitted successfully!
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>

        {/* Help Requests Section */}
        <div className="col-md-4">
          <div
            className="card shadow-sm animate__animated animate__fadeInUp"
            style={{
              border: "none",
              borderRadius: "8px",
              backgroundColor: "#FFFFFF",
            }}
          >
            <div
              className="card-header text-center"
              style={{
                backgroundColor: "#1A3159",
                color: "#FFFFFF",
                borderRadius: "8px 8px 0 0",
              }}
            >
              <FaEnvelope className="me-2" /> Your Help Requests
            </div>
            <div className="card-body p-3">
              {loading ? (
                <div className="text-center p-3">
                  <div
                    className="spinner-border"
                    style={{ color: "#EF7E20" }}
                    role="status"
                  >
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              ) : helpRequests.length === 0 ? (
                <p
                  className="text-muted p-3"
                  style={{
                    fontSize: "1rem",
                    fontWeight: "400",
                    lineHeight: "1.5",
                  }}
                >
                  No help requests found.
                </p>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover mb-0">
                    <thead
                      style={{
                        backgroundColor: "#F8F9FA",
                        color: "#555",
                        fontWeight: "500",
                        fontSize: "0.95rem",
                      }}
                    >
                      <tr>
                        <th>Type</th>
                        <th>Issue</th>
                        <th>Status</th>
                        <th>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {helpRequests.map((request) => (
                        <tr
                          key={request._id}
                          style={{ transition: "background-color 0.3s" }}
                          onMouseEnter={(e) =>
                            (e.currentTarget.style.backgroundColor = "#F8F9FA")
                          }
                          onMouseLeave={(e) =>
                            (e.currentTarget.style.backgroundColor = "#FFFFFF")
                          }
                        >
                          <td style={{ fontSize: "0.9rem", fontWeight: "400" }}>
                            {request.type}
                          </td>
                          <td style={{ fontSize: "0.9rem", fontWeight: "400" }}>
                            {request.issue.slice(0, 50)}...
                          </td>
                          <td>
                            <span
                              className={`badge ${
                                request.status === "Open"
                                  ? "bg-warning"
                                  : request.status === "In Progress"
                                  ? "bg-info"
                                  : "bg-success"
                              }`}
                              style={{
                                fontSize: "0.85rem",
                                padding: "6px 10px",
                                borderRadius: "4px",
                              }}
                            >
                              {request.status}
                            </span>
                          </td>
                          <td style={{ fontSize: "0.9rem", fontWeight: "400" }}>
                            {new Date(request.createdAt).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Live Chat & Resources Section */}
        <div className="col-md-4">
          <div
            className="card shadow-sm animate__animated animate__fadeInUp"
            style={{
              border: "none",
              borderRadius: "8px",
              backgroundColor: "#FFFFFF",
            }}
          >
            <div
              className="card-header text-center"
              style={{
                backgroundColor: "#1A3159",
                color: "#FFFFFF",
                borderRadius: "8px 8px 0 0",
              }}
            >
              <FaComments className="me-2" /> Live Chat & Resources
            </div>
            <div className="card-body text-center p-3">
              <div className="animate__animated animate__pulse animate__infinite animate__slow">
                <FaComments
                  style={{
                    fontSize: "3rem",
                    color: "#EF7E20",
                    marginBottom: "1rem",
                  }}
                />
              </div>
              <h5
                style={{
                  color: "#1A3159",
                  fontWeight: "500",
                  fontSize: "1.2rem",
                  marginBottom: "0.5rem",
                }}
              >
                Coming Soon!
              </h5>
              <p
                style={{
                  color: "#555",
                  fontSize: "1rem",
                  fontWeight: "400",
                  lineHeight: "1.5",
                }}
              >
                Live chat and additional resources will be available soon. Check
                our FAQs for immediate help.
              </p>
              <Link href="/faqs">
                <button
                  className="btn mt-2"
                  style={{
                    background: "linear-gradient(135deg, #EF7E20, #FF9B50)",
                    color: "#FFFFFF",
                    border: "none",
                    borderRadius: "6px",
                    fontWeight: "600",
                    padding: "8px 16px",
                    boxShadow: "0 2px 8px rgba(239, 126, 32, 0.2)",
                    transition: "all 0.3s ease",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = "scale(1.05)";
                    e.target.style.boxShadow =
                      "0 4px 12px rgba(239, 126, 32, 0.3)";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = "scale(1)";
                    e.target.style.boxShadow =
                      "0 2px 8px rgba(239, 126, 32, 0.2)";
                  }}
                  aria-label="Explore FAQs"
                >
                  Explore FAQs
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
