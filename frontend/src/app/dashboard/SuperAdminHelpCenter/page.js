 
"use client";
import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaEnvelope } from "react-icons/fa";
import axios from "axios";
import { getToken } from "@/utils/auth";
import { useRouter } from "next/navigation";
import "animate.css";

export default function SuperAdminHelpCenter() {
  const [helpRequests, setHelpRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const router = useRouter();

  const fetchHelpRequests = async (pageNum = 1) => {
    try {
      const token = getToken();
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/help-center?page=${pageNum}&limit=10`, {
        headers: { "x-auth-token": token },
      });
      setHelpRequests(res.data.data.helpRequests);
      setTotalPages(res.data.data.pages);
      setPage(res.data.data.page);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching help requests:", err);
      setLoading(false);
      router.push("/login");
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      const token = getToken();
      await axios.put(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/help-center/${id}`,
        { status },
        { headers: { "x-auth-token": token } }
      );
      fetchHelpRequests(page);
    } catch (err) {
      console.error("Error updating help request:", err);
      alert("Failed to update help request.");
    }
  };

  useEffect(() => {
    fetchHelpRequests();
  }, [router]);

  return (
    <div className="container-fluid" style={{ backgroundColor: "#F8F9FA", minHeight: "100vh" }}>
      <div className="row align-items-center">
        <div className="col-12 text-center">
          <h1
            className="fw-bold mb-2 animate__animated animate__fadeIn"
            style={{ color: "#1A3159", fontSize: "2.5rem" }}
          >
            Super Admin Help Center 📢
          </h1>
          <p style={{ color: "black", fontSize: "1.2rem" }}>
            View and manage all help requests across organizations.
          </p>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-md-12">
          <div className="card h-100 shadow-sm animate__animated animate__fadeIn" style={{ border: "none" }}>
            <div
              className="card-header text-center"
              style={{ backgroundColor: "#1A3159", color: "#FFFFFF" }}
            >
              <FaEnvelope className="me-2" /> All Help Requests
            </div>
            <div className="card-body p-0">
              {loading ? (
                <div className="text-center p-3">
                  <div className="spinner-border" style={{ color: "#EF7E20" }} role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              ) : helpRequests.length === 0 ? (
                <p className="text-muted p-3">No help requests found.</p>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover mb-0">
                    <thead style={{ backgroundColor: "#E9ECEF", color: "#555" }}>
                      <tr>
                        <th>Organization</th>
                        <th>User</th>
                        <th>Type</th>
                        <th>Issue</th>
                        <th>Status</th>
                        <th>Date</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {helpRequests.map((request) => (
                        <tr key={request._id}>
                          <td>{request.organizationId?.name || "N/A"}</td>
                          <td>{request.userId?.name || "N/A"} ({request.userId?.email || "N/A"})</td>
                          <td>{request.type}</td>
                          <td>{request.issue.slice(0, 50)}...</td>
                          <td>
                            <span
                              className={`badge ${
                                request.status === "Open"
                                  ? "bg-warning"
                                  : request.status === "In Progress"
                                  ? "bg-info"
                                  : "bg-success"
                              }`}
                            >
                              {request.status}
                            </span>
                          </td>
                          <td>{new Date(request.createdAt).toLocaleDateString()}</td>
                          <td>
                            <select
                              value={request.status}
                              onChange={(e) => handleStatusUpdate(request._id, e.target.value)}
                              style={{ borderColor: "#1A3159", borderRadius: "8px" }}
                            >
                              <option value="Open">Open</option>
                              <option value="In Progress">In Progress</option>
                              <option value="Resolved">Resolved</option>
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              <div className="d-flex justify-content-between p-3">
                <button
                  className="btn"
                  disabled={page === 1}
                  onClick={() => fetchHelpRequests(page - 1)}
                  style={{
                    backgroundColor: page === 1 ? "#E9ECEF" : "#EF7E20",
                    color: "#FFFFFF",
                    border: "none",
                    borderRadius: "8px",
                  }}
                >
                  Previous
                </button>
                <span>Page {page} of {totalPages}</span>
                <button
                  className="btn"
                  disabled={page === totalPages}
                  onClick={() => fetchHelpRequests(page + 1)}
                  style={{
                    backgroundColor: page === totalPages ? "#E9ECEF" : "#EF7E20",
                    color: "#FFFFFF",
                    border: "none",
                    borderRadius: "8px",
                  }}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}