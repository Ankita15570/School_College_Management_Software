"use client";
import "bootstrap/dist/css/bootstrap.min.css";
import { useEffect, useState } from "react";
import axios from "axios";
import { FaSearch, FaDownload, FaEye } from "react-icons/fa";
import * as XLSX from "xlsx";
import { getToken } from "@/utils/auth";
import { useSelector } from "react-redux";

// Mapping section to Bootstrap badge colors
const sectionColors = {
  daily: "primary",
  cie: "success",
  "university-exam": "warning",
  "record-field-work": "info",
  "transfer-knowledge-events": "secondary",
  "extension-activities": "dark",
  "skill-development": "primary",
  "workshops-seminars": "success",
  "papers-published": "warning",
  "book-chapter": "info",
  "annual-teaching-plan": "secondary",
  mentoring: "dark",
  patents: "primary",
  training: "success",
  awards: "warning",
  leave: "info",
  "invited-lectures": "secondary",
  "research-project": "dark",
  "database-publications": "primary",
};

export default function DailyEventDiarySuperAdmin() {
  const [diaries, setDiaries] = useState([]);
  const [filteredDiaries, setFilteredDiaries] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedDiary, setSelectedDiary] = useState(null);
  const [userId, setUserId] = useState(null);
  const [organizationId, setOrganizationId] = useState(null);
  const { academicYear } = useSelector((state) => state.academicYear);

  const fetchUserInfo = async () => {
    try {
      const token = getToken();
      if (!token) return;
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/get-user-info`,
        { headers: { "x-auth-token": token } }
      );
      setUserId(res.data.data.user._id);
      setOrganizationId(res.data.data.user.organizationId);
    } catch (err) {
      console.error("Error fetching user info:", err);
    }
  };

  const fetchDiaries = async () => {
    try {
      const token = getToken();
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/daily-event-diary/${academicYear}`,
        {
          headers: {
            "x-auth-token": token,
            "Cache-Control": "no-cache, no-store, must-revalidate",
            Pragma: "no-cache",
            Expires: "0",
          },
        }
      );
      const enrichedDiaries = res.data.data.map((diary) => ({
        ...diary,
        createdAt:
          diary.createdAt || diary.__v
            ? new Date(diary.__v * 1000).toISOString()
            : "N/A",
      }));
      setDiaries(enrichedDiaries);
      setFilteredDiaries(enrichedDiaries);
    } catch (err) {
      console.error("Error fetching diaries:", err);
      setFilteredDiaries([]);
    }
  };

  useEffect(() => {
    fetchUserInfo();
    fetchDiaries();
  }, [academicYear]);

  useEffect(() => {
    let result = [...diaries];
    if (searchTerm) {
      result = result.filter(
        (diary) =>
          diary.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          diary.date.toLowerCase().includes(searchTerm.toLowerCase()) ||
          diary.section.toLowerCase().includes(searchTerm.toLowerCase()) ||
          diary.organizationId?.name
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          diary.entries.some((e) =>
            e.details?.toLowerCase().includes(searchTerm.toLowerCase())
          )
      );
    }
    setFilteredDiaries(result);
  }, [searchTerm, diaries]);

  const handleShowDetails = (diary) => {
    setSelectedDiary(diary);
    setShowDetailsModal(true);
  };

  const handleExport = () => {
    const exportData = filteredDiaries.map((diary, index) => ({
      "Sr. No.": index + 1,
      Date: diary.date,
      Section: diary.section,
      User: diary.user?.name || diary.user,
      "Organization Name": diary.organizationId?.name || "N/A",
      "Created At": new Date(diary.createdAt).toLocaleString(),
      "Entry Details":
        diary.entries.map((e) => e.details || "").join(", ") || "-",
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "DailyEventDiary");
    XLSX.writeFile(workbook, "DailyEventDiary_Export.xlsx");
  };

  return (
    <div className="container-fluid" style={{ backgroundColor: "#F8F9FA" }}>
      <div className="row align-items-center flex-column flex-md-row">
        <div className="col-12 col-md-4 mb-3 mb-md-0">
          <h1 className="fw-bold" style={{ color: "#1A3159" }}>
            View Daily Diary
          </h1>
          <p style={{ color: "black" }}>
            View all diary entries by users in your organization
          </p>
        </div>
        <div className="col-12 col-md-4 mb-3 mb-md-0">
          <div className="input-group">
            <span
              className="input-group-text"
              style={{
                backgroundColor: "#FFFFFF",
                borderColor: "#1A3159",
                borderRadius: "8px 0 0 8px",
                color: "#1A3159",
              }}
            >
              <FaSearch />
            </span>
            <input
              type="text"
              className="form-control"
              placeholder="Search by user name, date, or details..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                borderColor: "#1A3159",
                borderRadius: "0 8px 8px 0",
                boxShadow: "inset 0 1px 3px rgba(0,0,0,0.1)",
              }}
            />
          </div>
        </div>
        <div className="col-12 col-md-4 mb-3 mb-md-0 text-md-end">
          <button
            className="btn py-2 px-4 shadow-sm"
            style={{
              backgroundColor: "#EF7E20",
              color: "#FFFFFF",
              border: "2px solid #FF9B50",
              borderRadius: "8px",
              fontWeight: "600",
              transition: "all 0.3s",
            }}
            onClick={handleExport}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = "#FF9B50";
              e.target.style.borderColor = "#EF7E20";
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = "#EF7E20";
              e.target.style.borderColor = "#FF9B50";
            }}
          >
            <FaDownload className="me-2" /> Export
          </button>
        </div>
      </div>

      <div className="row mt-4">
        <div className="col-12">
          <div className="card shadow-sm" style={{ border: "none" }}>
            <div
              className="card-header"
              style={{ backgroundColor: "#1A3159", color: "#FFFFFF" }}
            >
              <h5 className="mb-0">Daily Event Diary Entries</h5>
            </div>
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-hover mb-0">
                  <thead
                    style={{ backgroundColor: "#E9ECEF", color: "#1A3159" }}
                  >
                    <tr>
                      <th scope="col">Sr. No.</th>
                      <th scope="col">Date</th>
                      <th scope="col">Section</th>
                      <th scope="col">User</th>
                      <th scope="col">Organization Name</th>
                      <th scope="col">Created At</th>
                      <th scope="col">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredDiaries.length === 0 ? (
                      <tr>
                        <td colSpan="7" className="text-center text-muted">
                          {searchTerm
                            ? "No diary entries match your search."
                            : "No diary entries found."}
                        </td>
                      </tr>
                    ) : (
                      filteredDiaries.map((diary, index) => (
                        <tr key={diary._id} className="align-middle">
                          <td>{index + 1}</td>
                          <td>{diary.date}</td>
                          <td>
                            <span
                              className={`badge bg-${
                                sectionColors[diary.section] || "secondary"
                              }`}
                            >
                              {diary.section}
                            </span>
                          </td>
                          <td>{diary.userId?.name || diary.user}</td>
                          <td>{diary.organizationId?.name || "N/A"}</td>
                          <td>
                            {new Date(diary.createdAt).toLocaleString("en-GB", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                              hour12: true,
                            })}
                          </td>
                          <td>
                            <div className="d-flex gap-2">
                              <button
                                className="btn btn-sm"
                                style={{
                                  backgroundColor: "#28A745",
                                  color: "#FFFFFF",
                                  border: "none",
                                  borderRadius: "50%",
                                  width: "32px",
                                  height: "32px",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                }}
                                onClick={() => handleShowDetails(diary)}
                                title="Show Details"
                              >
                                <FaEye />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showDetailsModal && selectedDiary && (
        <div className="modal" style={{ display: "block" }} tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div
                className="modal-header"
                style={{ backgroundColor: "#1A3159", color: "#FFFFFF" }}
              >
                <h5 className="modal-title">Diary Details</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowDetailsModal(false)}
                  style={{ color: "#FFFFFF" }}
                ></button>
              </div>
              <div className="modal-body">
                <p>
                  <strong>Date:</strong> {selectedDiary.date}
                </p>
                <p>
                  <strong>Section:</strong>{" "}
                  <span
                    className={`badge bg-${
                      sectionColors[selectedDiary.section] || "secondary"
                    }`}
                  >
                    {selectedDiary.section}
                  </span>
                </p>
                <p>
                  <strong>User:</strong>{" "}
                  {selectedDiary.user?.name || selectedDiary.user}
                </p>
                <p>
                  <strong>Organization Name:</strong>{" "}
                  {selectedDiary.organizationId?.name || "N/A"}
                </p>
                <p>
                  <strong>Created At:</strong>{" "}
                  {new Date(selectedDiary.createdAt).toLocaleString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                  })}
                </p>
                <h6>Entries:</h6>
                {selectedDiary.entries.length > 0 ? (
                  <ul>
                    {selectedDiary.entries.map((entry, idx) => (
                      <li key={idx}>
                        {Object.entries(entry)
                          .filter(([key, value]) => value && key !== "_id")
                          .map(([key, value]) => (
                            <p key={key}>
                              <strong>{key}:</strong> {value}
                            </p>
                          ))}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No entries available.</p>
                )}
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowDetailsModal(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
