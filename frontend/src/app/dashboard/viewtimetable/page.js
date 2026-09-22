"use client";
import "bootstrap/dist/css/bootstrap.min.css";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { FaSearch, FaDownload } from "react-icons/fa";
import * as XLSX from "xlsx";
import { getToken } from "@/utils/auth";
import { useSelector } from "react-redux";

export default function ViewAllTeachersTimetable() {
  const [timetables, setTimetables] = useState([]);
  const [filteredTimetables, setFilteredTimetables] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();
  const isMonday = new Date().getDay() === 1; // Tuesday (2), so false
  const { academicYear } = useSelector((state) => state.academicYear);

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
      const transformedTimetables = rawTimetables.map((timetable) => {
        const flatData = {
          _id: timetable._id,
          teacherName:
            timetable.schedule[0]?.periods[0]?.userId?.name ||
            timetable.userId?.name ||
            "(User Deleted)",
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
          class: timetable.class || "B.A. I AEC",
          academicYear: timetable.academicYear || academicYear,
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
  }, [router, academicYear]);

  useEffect(() => {
    let result = [...timetables];
    if (searchTerm) {
      result = result.filter(
        (timetable) =>
          timetable.teacherName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          timetable.timeSlot.toLowerCase().includes(searchTerm.toLowerCase()) ||
          Object.values(timetable)
            .filter((val) => typeof val === "string")
            .some((val) => val.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    setFilteredTimetables(result);
  }, [searchTerm, timetables]);

  const handleExport = () => {
    const exportData = filteredTimetables.map((timetable, index) => ({
      "Sr. No.": index + 1,
      "Teacher Name": timetable.teacherName,
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
    XLSX.utils.book_append_sheet(workbook, worksheet, "Teachers_Timetable");
    XLSX.writeFile(workbook, "Teachers_Timetable_Export.xlsx");
  };

  return (
    <div className="container-fluid" style={{ backgroundColor: "#F8F9FA", minHeight: "100vh" }}>
      <div className="row align-items-center py-3">
        <div className="col-12 col-md-6 mb-3 mb-md-0">
          <h1 className="fw-bold" style={{ color: "#1A3159", fontSize: "2rem" }}>
            View All Timetable
          </h1>
          <p style={{ color: "#555", fontSize: "1.1rem" }}>
            Browse and manage timetables for all teachers and faculty
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
              placeholder="Search by teacher, time slot, or subject..."
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
        <div className="col-12 col-md-2 mb-3 mb-md-0 text-md-end">
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
              className="card-header d-flex justify-content-between align-items-center"
              style={{ backgroundColor: "#1A3159", color: "#FFFFFF" }}
            >
              <h5 className="mb-0">Teachers and Faculty Timetable</h5>
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
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTimetables.length === 0 ? (
                      <tr>
                        <td colSpan="9" className="text-center text-muted">
                          {searchTerm
                            ? "No timetable entries match your search."
                            : "No timetable entries found."}
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
    </div>
  );
}