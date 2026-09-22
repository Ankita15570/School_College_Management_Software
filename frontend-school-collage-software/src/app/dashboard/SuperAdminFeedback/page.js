 
"use client";
import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaComment, FaQuestionCircle, FaStar } from "react-icons/fa";
import axios from "axios";
import { useRouter } from "next/navigation";
import Link from "next/link";
import "animate.css";
import { getToken } from "@/utils/auth";

const SuperAdminFeedback = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchFeedbacks = async () => {
    try {
      const token = getToken();
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/feedback`, {
        headers: { "x-auth-token": token },
      });
      setFeedbacks(res.data.data.feedbacks);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching feedbacks:", err);
      setLoading(false);
      router.push("/login");
    }
  };

  useEffect(() => {
    fetchFeedbacks();
  }, [router]);

  return (
    <div className="container-fluid" style={{ backgroundColor: "#F8F9FA", minHeight: "100vh" }} role="main" aria-label="SuperAdmin Feedback page">
      {/* Header */}
      <div className="row align-items-center mb-4">
        <div className="col-12 text-center">
          <h1
            className="fw-bold mb-2 animate__animated animate__fadeIn"
            style={{ color: "#1A3159", fontSize: "2.5rem" }}
          >
            Feedback Overview
          </h1>
          <p style={{ color: "#555", fontSize: "1.2rem", lineHeight: "1.5" }}>
            View all feedback submitted by users across organizations.
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

      {/* Feedback Table */}
      <div className="row justify-content-center">
        <div className="col-12">
          <div className="card shadow-sm animate__animated animate__fadeInUp" style={{ border: "none", borderRadius: "8px", backgroundColor: "#FFFFFF" }}>
            <div
              className="card-header text-center"
              style={{ backgroundColor: "#1A3159", color: "#FFFFFF", borderRadius: "8px 8px 0 0" }}
            >
              <FaComment className="me-2" /> All Feedback
            </div>
            <div className="card-body p-3">
              {loading ? (
                <div className="text-center p-3">
                  <div className="spinner-border" style={{ color: "#EF7E20" }} role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              ) : feedbacks.length === 0 ? (
                <p className="text-muted p-3" style={{ fontSize: "1rem", fontWeight: "400", lineHeight: "1.5" }}>
                  No feedback found.
                </p>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover mb-0">
                    <thead style={{ backgroundColor: "#F8F9FA", color: "#555", fontWeight: "500", fontSize: "0.95rem" }}>
                      <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Type</th>
                        <th>Rating</th>
                        <th>Message</th>
                        <th>Follow-Up</th>
                        <th>Date</th>
                        <th>Organization</th>
                      </tr>
                    </thead>
                    <tbody>
                      {feedbacks.map((feedback) => (
                        <tr
                          key={feedback._id}
                          style={{ transition: "background-color 0.3s" }}
                          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#F8F9FA")}
                          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#FFFFFF")}
                        >
                          <td style={{ fontSize: "0.9rem", fontWeight: "400" }}>{feedback.name || "Anonymous"}</td>
                          <td style={{ fontSize: "0.9rem", fontWeight: "400" }}>{feedback.email || "N/A"}</td>
                          <td style={{ fontSize: "0.9rem", fontWeight: "400" }}>{feedback.feedbackType}</td>
                          <td style={{ fontSize: "0.9rem", fontWeight: "400" }}>
                            <span className="badge bg-warning" style={{ fontSize: "0.85rem", padding: "6px 10px", borderRadius: "4px" }}>
                              {feedback.rating} <FaStar className="ms-1" />
                            </span>
                          </td>
                          <td style={{ fontSize: "0.9rem", fontWeight: "400" }}>{feedback.message.slice(0, 50)}...</td>
                          <td style={{ fontSize: "0.9rem", fontWeight: "400" }}>{feedback.followUp ? "Yes" : "No"}</td>
                          <td style={{ fontSize: "0.9rem", fontWeight: "400" }}>
                            {new Date(feedback.createdAt).toLocaleDateString()}
                          </td>
                          <td style={{ fontSize: "0.9rem", fontWeight: "400" }}>
                            {feedback.organizationId?.name || "N/A"}
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
      </div>
    </div>
  );
};

export default SuperAdminFeedback;