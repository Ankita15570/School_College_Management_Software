"use client";
import "bootstrap/dist/css/bootstrap.min.css";
import { useEffect, useState } from "react";
import axios from "axios";
import {
  FaEdit,
  FaTrash,
  FaPlus,
  FaSearch,
  FaDownload,
  FaEye,
} from "react-icons/fa";
import * as XLSX from "xlsx";
import TimeTableForm from "@/components/TimeTable/TimeTableForm";
import TimeTableView from "@/components/TimeTable/TimeTableView";
import { getToken } from "@/utils/auth";
import { useSelector } from "react-redux";

export default function TimeTable() {
  const [timetables, setTimetables] = useState([]);
  const [filteredTimetables, setFilteredTimetables] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editTimetable, setEditTimetable] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedTimetable, setSelectedTimetable] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const isMonday = new Date().getDay() === 1;

  const { academicYear } = useSelector((state) => state.academicYear);

  useEffect(() => {
    const token = getToken();
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        setUserRole(payload.role);
      } catch {}
    }
  }, []);

  const fetchTimetables = async () => {
    try {
      const token = getToken();
      if (!token) return;
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/timetables`,
        {
          headers: { "x-auth-token": token },
        }
      );
      const rawTimetables = res.data.data || [];
      // Transform nested schedule into flat structure with new time slots
      const transformedTimetables = rawTimetables.map((timetable) => {
        const flatData = {
          _id: timetable._id,
          teacherName: timetable.userId?.name || "Me",
          timeSlot: timetable.schedule[0]?.periods[0]?.time || "",
          monday:
            timetable.schedule.find((d) => d.day === "Monday")?.periods[0]
              ?.subject || "-",
          tuesday:
            timetable.schedule.find((d) => d.day === "Tuesday")?.periods[0]
              ?.subject || "-",
          wednesday:
            timetable.schedule.find((d) => d.day === "Wednesday")?.periods[0]
              ?.subject || "-",
          thursday:
            timetable.schedule.find((d) => d.day === "Thursday")?.periods[0]
              ?.subject || "-",
          friday:
            timetable.schedule.find((d) => d.day === "Friday")?.periods[0]
              ?.subject || "-",
          saturday:
            timetable.schedule.find((d) => d.day === "Saturday")?.periods[0]
              ?.subject || "-",
          class: timetable.class || "B.A. I AEC", // Default based on context
          academicYear: academicYear,
        };
        return flatData;
      });
      setTimetables(transformedTimetables);
      setFilteredTimetables(transformedTimetables);
    } catch (err) {
      console.error("Error fetching timetables:", err);
      setFilteredTimetables([]); // Fallback to empty if API fails
    }
  };

  useEffect(() => {
    fetchTimetables();
  }, [academicYear]);

  useEffect(() => {
    let result = [...timetables];
    if (searchTerm) {
      result = result.filter(
        (timetable) =>
          timetable.timeSlot.toLowerCase().includes(searchTerm.toLowerCase()) ||
          Object.values(timetable)
            .filter((val) => typeof val === "string")
            .some((val) => val.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    setFilteredTimetables(result);
  }, [searchTerm, timetables]);

  const handleDelete = async (id) => {
    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/timetables/${id}`,
        {
          headers: { "x-auth-token": getToken() },
        }
      );
      setTimetables(timetables.filter((timetable) => timetable._id !== id));
    } catch (err) {
      console.error("Error deleting timetable:", err);
    }
  };

  const handleEditClick = (timetable) => {
    setEditTimetable(timetable);
  };

  const handleShowDetails = (timetable) => {
    setSelectedTimetable(timetable);
    setShowDetailsModal(true);
  };

  const handleExport = () => {
    const exportData = filteredTimetables.map((timetable, index) => ({
      "Sr. No.": index + 1,
      "Time Slot": timetable.timeSlot,
      Monday: timetable.monday || "-",
      Tuesday: timetable.tuesday || "-",
      Wednesday: timetable.wednesday || "-",
      Thursday: timetable.thursday || "-",
      Friday: timetable.friday || "-",
      Saturday: timetable.saturday || "-",
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Timetable");
    XLSX.writeFile(workbook, "Timetable_Export.xlsx");
  };

  return (
    <div className="container-fluid" style={{ backgroundColor: "#F8F9FA" }}>
      <div className="row align-items-center flex-column flex-md-row">
        <div className="col-12 col-md-4 mb-3 mb-md-0">
          <h1 className="fw-bold" style={{ color: "#1A3159" }}>
            Manage Timetable
          </h1>
          <p style={{ color: "black" }}>Add or manage your weekly timetable</p>
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
              placeholder="Search by time slot or subject..."
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
            onClick={() => setShowAddModal(true)}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = "#FF9B50";
              e.target.style.borderColor = "#EF7E20";
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = "#EF7E20";
              e.target.style.borderColor = "#FF9B50";
            }}
          >
            <FaPlus className="me-2" /> Add Timetable
          </button>

          <button
            className="btn py-2 px-4 shadow-sm ms-2"
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
              className="card-header d-flex justify-content-between align-items-center"
              style={{ backgroundColor: "#1A3159", color: "#FFFFFF" }}
            >
              <h5 className="mb-0">Individual Timetable</h5>
            </div>
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-hover mb-0">
                  <thead
                    style={{ backgroundColor: "#E9ECEF", color: "#1A3159" }}
                  >
                    <tr>
                      <th scope="col">Sr. No.</th>
                      <th scope="col">Teacher Name</th>
                      <th scope="col">Time</th>
                      <th
                        scope="col"
                        style={isMonday ? { backgroundColor: "#FF9B50" } : {}}
                      >
                        Monday
                      </th>
                      <th scope="col">Tuesday</th>
                      <th scope="col">Wednesday</th>
                      <th scope="col">Thursday</th>
                      <th scope="col">Friday</th>
                      <th scope="col">Saturday</th>
                      <th scope="col">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTimetables.length === 0 ? (
                      <tr>
                        <td colSpan="10" className="text-center text-muted">
                          {searchTerm
                            ? "No timetable entries match your search."
                            : "No timetable entries found. Add an entry above!"}
                        </td>
                      </tr>
                    ) : (
                      filteredTimetables.map((timetable, index) => (
                        <tr key={timetable._id} className="align-middle">
                          <td>{index + 1}</td>
                          <td>{timetable.teacherName}</td>
                          <td>{timetable.timeSlot}</td>
                          <td
                            style={
                              isMonday ? { backgroundColor: "#FF9B50" } : {}
                            }
                          >
                            {timetable.monday}
                          </td>
                          <td>{timetable.tuesday}</td>
                          <td>{timetable.wednesday}</td>
                          <td>{timetable.thursday}</td>
                          <td>{timetable.friday}</td>
                          <td>{timetable.saturday}</td>
                          <td>
                            <div className="d-flex gap-2">
                              <button
                                className="btn btn-sm"
                                style={{
                                  backgroundColor: "#EF7E20",
                                  color: "#FFFFFF",
                                  border: "none",
                                  borderRadius: "50%",
                                  width: "32px",
                                  height: "32px",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                }}
                                onClick={() => handleEditClick(timetable)}
                                title="Edit"
                              >
                                <FaEdit />
                              </button>
                              <button
                                className="btn btn-sm"
                                style={{
                                  backgroundColor: "#1A3159",
                                  color: "#FFFFFF",
                                  border: "none",
                                  borderRadius: "50%",
                                  width: "32px",
                                  height: "32px",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                }}
                                onClick={() => handleDelete(timetable._id)}
                                title="Delete"
                              >
                                <FaTrash />
                              </button>
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
                                onClick={() => handleShowDetails(timetable)}
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

      <TimeTableForm
        show={showAddModal}
        onHide={() => setShowAddModal(false)}
        fetchTimetables={fetchTimetables}
        academicYear={academicYear}
        userRole={userRole}
      />
      <TimeTableForm
        show={!!editTimetable}
        onHide={() => setEditTimetable(null)}
        fetchTimetables={fetchTimetables}
        editTimetable={editTimetable}
        academicYear={academicYear}
        userRole={userRole}
      />
      <TimeTableView
        show={showDetailsModal}
        onHide={() => setShowDetailsModal(false)}
        selectedTimetable={selectedTimetable}
      />
    </div>
  );
}
