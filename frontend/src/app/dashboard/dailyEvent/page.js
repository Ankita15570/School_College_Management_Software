 
"use client";
import "bootstrap/dist/css/bootstrap.min.css";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import {
  FaEdit,
  FaTrash,
  FaPlus,
  FaSearch, 
  FaDownload,
  FaUpload,
  FaEye,
} from "react-icons/fa";
import * as XLSX from "xlsx";
import { Nav, Collapse } from "react-bootstrap";
import { getToken } from "@/utils/auth";
import DailyEventDiaryForm from "@/components/dailyEvent/DailyEventDiaryForm";
import DailyEventDiaryView from "@/components/dailyEvent/DailyEventDiaryView";
import { useSelector } from "react-redux";

export default function DailyEventDiary() {
  const [activeTab, setActiveTab] = useState("daily");
  const [data, setData] = useState({
    daily: [],
    cie: [],
    "university-exam": [],
    "record-field-work": [],
    "transfer-knowledge-events": [],
    "extension-activities": [],
    "skill-development": [],
    "workshops-seminars": [],
    "papers-published": [],
    "book-chapter": [],
  });
  const [filteredData, setFilteredData] = useState(data);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editEntry, setEditEntry] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [expandedRow, setExpandedRow] = useState(null);
  const router = useRouter();
  const { academicYear } = useSelector((state) => state.academicYear);

  const fetchData = async (section) => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/daily-event-diary/${section}/${academicYear}`,
        { headers: { "x-auth-token": getToken() } }
      );
      setData((prev) => ({ ...prev, [section]: res.data }));
      setFilteredData((prev) => ({ ...prev, [section]: res.data }));
    } catch (err) {
      console.error(`Error fetching ${section}:`, err);
      setFilteredData((prev) => ({ ...prev, [section]: [] }));
    }
  };

  useEffect(() => {
    fetchData(activeTab);
  }, [activeTab , academicYear]);

  useEffect(() => {
    let result = { ...data };
    if (searchTerm) {
      result[activeTab] = data[activeTab].filter((entry) =>
        entry.entries.some((subEntry) =>
          Object.values(subEntry)
            .filter((val) => typeof val === "string")
            .some((val) => val.toLowerCase().includes(searchTerm.toLowerCase()))
        )
      );
    }
    setFilteredData(result);
  }, [searchTerm, data, activeTab]);

  const handleDelete = async (section, id, subEntryIndex) => {
    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/daily-event-diary/${section}/${id}/${subEntryIndex}`,
        { headers: { "x-auth-token": getToken() } }
      );
      setData((prev) => ({
        ...prev,
        [section]: prev[section].map((entry) =>
          entry._id === id
            ? {
                ...entry,
                entries: entry.entries.filter((_, index) => index !== subEntryIndex),
              }
            : entry
        ),
      }));
    } catch (err) {
      console.error(`Error deleting ${section} sub-entry:`, err);
    }
  };

  const handleEditClick = (entry, subEntry, subEntryIndex) => {
    setEditEntry({
      ...subEntry,
      _id: entry._id,
      date: entry.date,
      subEntryIndex,
    });
    setShowAddModal(true);
  };

  const handleShowDetails = (entry) => {
    setSelectedEntry(entry);
    setShowDetailsModal(true);
  };

  const handleExport = (section) => {
    const exportData = filteredData[section].flatMap((entry, index) =>
      entry.entries.map((subEntry, subIndex) => {
        const base = { "Sr. No.": `${index + 1}.${subIndex + 1}`, Date: entry.date };
        if (section === "daily") {
          return {
            ...base,
            "Lecture No.": subEntry.lectureNo,
            Class: subEntry.class,
            "Lecture/Time": subEntry.time,
            "Lecture/Practical": subEntry.type,
            Topic: subEntry.topic,
            Attendance: subEntry.attendance,
          };
        } else if (section === "cie") {
          return {
            ...base,
            Class: subEntry.class,
            Time: subEntry.time,
            "Oral/Written": subEntry.type,
          };
        } else if (section === "university-exam") {
          return {
            ...base,
            "Details of Examination": subEntry.details,
            "Head, Exam Committee/SRPD Coordinator": subEntry.head,
            Role: subEntry.role,
          };
        } else if (section === "record-field-work") {
          return {
            ...base,
            "Program Name": subEntry.programName,
            "Program Code": subEntry.programCode,
            Title: subEntry.title,
          };
        } else if (section === "transfer-knowledge-events") {
          return {
            ...base,
            "Title of the Event": subEntry.title,
            Level: subEntry.level,
            "Co-curricular/Extra-Curricular": subEntry.type,
          };
        } else if (section === "extension-activities") {
          return {
            ...base,
            "Title of Activity": subEntry.title,
            "NSS/On Campus/Off Campus/In Collaboration": subEntry.type,
          };
        } else if (section === "skill-development") {
          return {
            ...base,
            "Title of the Course": subEntry.title,
            Duration: subEntry.duration,
            "No. of Students Admitted": subEntry.studentsAdmitted,
          };
        } else if (section === "workshops-seminars") {
          return {
            ...base,
            Theme: subEntry.theme,
            "University/State/National/International": subEntry.level,
            "Organised By": subEntry.organisedBy,
            "Paper Presentation": subEntry.paperPresentation,
            Role: subEntry.role,
          };
        } else if (section === "papers-published") {
          return {
            ...base,
            "Title of the Paper": subEntry.title,
            "Name of Journal/Proceeding/Abstract & Pub. Year & Pg. No.": subEntry.publicationDetails,
            "UGC Care Listed/Peer Reviewed": subEntry.type,
            ISSN: subEntry.issn,
            "Impact Factor": subEntry.impactFactor,
            "1st Author/Corresponding": subEntry.authorType,
          };
        } else if (section === "book-chapter") {
          return {
            ...base,
            "Title of the Book/Chapter with Page nos.": subEntry.title,
            "National/International": subEntry.level,
            ISBN: subEntry.isbn,
            Publisher: subEntry.publisher,
          };
        }
        return base;
      })
    );

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, section);
    XLSX.writeFile(workbook, `${section}_Export.xlsx`);
  };


  const renderTable = (section) => {
    const entries = filteredData[section] || [];
    return (
      <div className="card shadow-sm" style={{ border: "none" }}>
        <div
          className="card-header d-flex justify-content-between align-items-center"
          style={{ backgroundColor: "#1A3159", color: "#FFFFFF" }}
        >
          <h5 className="mb-0">
            {section
              .split("-")
              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
              .join(" ")}
          </h5>
        </div>
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead style={{ backgroundColor: "#E9ECEF", color: "#1A3159" }}>
                <tr>
                  <th scope="col">Sr. No.</th>
                  <th scope="col">Date</th>
                 <th scope="col">Entries Count</th>
                  <th scope="col">Actions</th>
                </tr>
              </thead>
              <tbody>
                {entries.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="text-center text-muted">
                      {searchTerm
                        ? `No ${section} entries match your search.`
                        : `No ${section} entries found. Add an entry above!`}
                    </td>
                  </tr>
                ) : (
                  entries.map((entry, index) => (
                    <>
                      <tr key={entry._id} className="align-middle">
                        <td>{index + 1}</td>
                        <td>{entry.date}</td>
                        <td>{entry.entries.length}</td>
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
                              onClick={() => setShowAddModal(true)}
                              title="Add Sub-Entry"
                            >
                              <FaPlus />
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
                              onClick={() => handleShowDetails(entry)}
                              title="Show Details"
                            >
                              <FaEye />
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
                              onClick={() =>
                                setExpandedRow(expandedRow === entry._id ? null : entry._id)
                              }
                              title="Toggle Sub-Entries"
                            >
                              {expandedRow === entry._id ? <FaEye /> : <FaEye />}
                            </button>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td colSpan={4} style={{ padding: 0 }}>
                          <Collapse in={expandedRow === entry._id}>
                            <div className="p-3">
                              <table className="table table-bordered mb-0">
                                <thead>
                                  <tr>
                                    {section === "daily" && (
                                      <>
                                        <th>Lecture No.</th>
                                        <th>Class</th>
                                        <th>Lecture/Time</th>
                                        <th>Lecture/Practical</th>
                                        <th>Topic</th>
                                        <th>Attendance</th>
                                      </>
                                    )}
                                    {section === "cie" && (
                                      <>
                                        <th>Class</th>
                                        <th>Time</th>
                                        <th>Oral/Written</th>
                                      </>
                                    )}
                                    {section === "university-exam" && (
                                      <>
                                        <th>Details of Examination</th>
                                        <th>Head, Exam Committee/SRPD Coordinator</th>
                                        <th>Role</th>
                                      </>
                                    )}
                                    {section === "record-field-work" && (
                                      <>
                                        <th>Program Name</th>
                                        <th>Program Code</th>
                                        <th>Title</th>
                                      </>
                                    )}
                                    {section === "transfer-knowledge-events" && (
                                      <>
                                        <th>Title of the Event</th>
                                        <th>Level</th>
                                        <th>Co-curricular/Extra-Curricular</th>
                                      </>
                                    )}
                                    {section === "extension-activities" && (
                                      <>
                                        <th>Title of Activity</th>
                                        <th>NSS/On Campus/Off Campus/In Collaboration</th>
                                      </>
                                    )}
                                    {section === "skill-development" && (
                                      <>
                                        <th>Title of the Course</th>
                                        <th>Duration</th>
                                        <th>No. of Students Admitted</th>
                                      </>
                                    )}
                                    {section === "workshops-seminars" && (
                                      <>
                                        <th>Theme</th>
                                        <th>University/State/National/International</th>
                                        <th>Organised By</th>
                                        <th>Paper Presentation</th>
                                        <th>Role</th>
                                      </>
                                    )}
                                    {section === "papers-published" && (
                                      <>
                                        <th>Title of the Paper</th>
                                        <th>Name of Journal/Proceeding/Abstract & Pub. Year & Pg. No.</th>
                                        <th>UGC Care Listed/Peer Reviewed</th>
                                        <th>ISSN</th>
                                        <th>Impact Factor</th>
                                        <th>1st Author/Corresponding</th>
                                      </>
                                    )}
                                    {section === "book-chapter" && (
                                      <>
                                        <th>Title of the Book/Chapter with Page nos.</th>
                                        <th>National/International</th>
                                        <th>ISBN</th>
                                        <th>Publisher</th>
                                      </>
                                    )}
                                    <th>Actions</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {entry.entries.map((subEntry, subIndex) => (
                                    <tr key={`${entry._id}-${subIndex}`}>
                                      {section === "daily" && (
                                        <>
                                          <td>{subEntry.lectureNo}</td>
                                          <td>{subEntry.class}</td>
                                          <td>{subEntry.time}</td>
                                          <td>{subEntry.type}</td>
                                          <td>{subEntry.topic}</td>
                                          <td>{subEntry.attendance}</td>
                                        </>
                                      )}
                                      {section === "cie" && (
                                        <>
                                          <td>{subEntry.class}</td>
                                          <td>{subEntry.time}</td>
                                          <td>{subEntry.type}</td>
                                        </>
                                      )}
                                      {section === "university-exam" && (
                                        <>
                                          <td>{subEntry.details}</td>
                                          <td>{subEntry.head}</td>
                                          <td>{subEntry.role}</td>
                                        </>
                                      )}
                                      {section === "record-field-work" && (
                                        <>
                                          <td>{subEntry.programName}</td>
                                          <td>{subEntry.programCode}</td>
                                          <td>{subEntry.title}</td>
                                        </>
                                      )}
                                      {section === "transfer-knowledge-events" && (
                                        <>
                                          <td>{subEntry.title}</td>
                                          <td>{subEntry.level}</td>
                                          <td>{subEntry.type}</td>
                                        </>
                                      )}
                                      {section === "extension-activities" && (
                                        <>
                                          <td>{subEntry.title}</td>
                                          <td>{subEntry.type}</td>
                                        </>
                                      )}
                                      {section === "skill-development" && (
                                        <>
                                          <td>{subEntry.title}</td>
                                          <td>{subEntry.duration}</td>
                                          <td>{subEntry.studentsAdmitted}</td>
                                        </>
                                      )}
                                      {section === "workshops-seminars" && (
                                        <>
                                          <td>{subEntry.theme}</td>
                                          <td>{subEntry.level}</td>
                                          <td>{subEntry.organisedBy}</td>
                                          <td>{subEntry.paperPresentation}</td>
                                          <td>{subEntry.role}</td>
                                        </>
                                      )}
                                      {section === "papers-published" && (
                                        <>
                                          <td>{subEntry.title}</td>
                                          <td>{subEntry.publicationDetails}</td>
                                          <td>{subEntry.type}</td>
                                          <td>{subEntry.issn}</td>
                                          <td>{subEntry.impactFactor}</td>
                                          <td>{subEntry.authorType}</td>
                                        </>
                                      )}
                                      {section === "book-chapter" && (
                                        <>
                                          <td>{subEntry.title}</td>
                                          <td>{subEntry.level}</td>
                                          <td>{subEntry.isbn}</td>
                                          <td>{subEntry.publisher}</td>
                                        </>
                                      )}
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
                                            onClick={() => handleEditClick(entry, subEntry, subIndex)}
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
                                            onClick={() => handleDelete(section, entry._id, subIndex)}
                                            title="Delete"
                                          >
                                            <FaTrash />
                                          </button>
                                        </div>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </Collapse>
                        </td>
                      </tr>
                    </>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="container-fluid" style={{ backgroundColor: "#F8F9FA" }}>
      <div className="row align-items-center flex-column flex-md-row">
        <div className="col-12 col-md-4 mb-3 mb-md-0">
          <h1 className="fw-bold" style={{ color: "#1A3159" }}>
            Daily Event Diary
          </h1>
          <p style={{ color: "black" }}>
            Manage daily academic and professional activities
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
              placeholder="Search by topic, title, theme, or other fields..."
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
            <FaPlus className="me-2" /> Add Entry
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
            onClick={() => handleExport(activeTab)}
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

      <Nav
        variant="tabs"
        activeKey={activeTab}
        onSelect={(key) => setActiveTab(key)}
        className="mt-4"
        style={{ borderBottom: "2px solid #1A3159" , alignItems : "center" , justifyContent : "center"  }}
      >
        <Nav.Item>
          <Nav.Link
            eventKey="daily"
            style={{
              color: activeTab === "daily" ? "#1A3159" : "#6C757D",
              backgroundColor: activeTab === "daily" ? "#E9ECEF" : "transparent",
            }}
          >
            Daily
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link
            eventKey="cie"
            style={{
              color: activeTab === "cie" ? "#1A3159" : "#6C757D",
              backgroundColor: activeTab === "cie" ? "#E9ECEF" : "transparent",
            }}
          >
            CIE
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link
            eventKey="university-exam"
            style={{
              color: activeTab === "university-exam" ? "#1A3159" : "#6C757D",
              backgroundColor: activeTab === "university-exam" ? "#E9ECEF" : "transparent",
            }}
          >
            University Exam
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link
            eventKey="record-field-work"
            style={{
              color: activeTab === "record-field-work" ? "#1A3159" : "#6C757D",
              backgroundColor: activeTab === "record-field-work" ? "#E9ECEF" : "transparent",
            }}
          >
            Record Field Work / Project Work
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link
            eventKey="transfer-knowledge-events"
            style={{
              color: activeTab === "transfer-knowledge-events" ? "#1A3159" : "#6C757D",
              backgroundColor: activeTab === "transfer-knowledge-events" ? "#E9ECEF" : "transparent",
            }}
          >
            Transfer of Knowledge Events
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link
            eventKey="extension-activities"
            style={{
              color: activeTab === "extension-activities" ? "#1A3159" : "#6C757D",
              backgroundColor: activeTab === "extension-activities" ? "#E9ECEF" : "transparent",
            }}
          >
            Extension Activities
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link
            eventKey="skill-development"
            style={{
              color: activeTab === "skill-development" ? "#1A3159" : "#6C757D",
              backgroundColor: activeTab === "skill-development" ? "#E9ECEF" : "transparent",
            }}
          >
            Skill Development
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link
            eventKey="workshops-seminars"
            style={{
              color: activeTab === "workshops-seminars" ? "#1A3159" : "#6C757D",
              backgroundColor: activeTab === "workshops-seminars" ? "#E9ECEF" : "transparent",
            }}
          >
            Workshops / Seminars
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link
            eventKey="papers-published"
            style={{
              color: activeTab === "papers-published" ? "#1A3159" : "#6C757D",
              backgroundColor: activeTab === "papers-published" ? "#E9ECEF" : "transparent",
            }}
          >
            Papers Published
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link
            eventKey="book-chapter"
            style={{
              color: activeTab === "book-chapter" ? "#1A3159" : "#6C757D",
              backgroundColor: activeTab === "book-chapter" ? "#E9ECEF" : "transparent",
            }}
          >
            Book or Chapter in a Book
          </Nav.Link>
        </Nav.Item>
      </Nav>
 
      <div className="row mt-4">
        <div className="col-12">{renderTable(activeTab)}</div>
      </div>

      <DailyEventDiaryForm
        show={showAddModal}
        onHide={() => {
          setShowAddModal(false);
          setEditEntry(null); // Reset editEntry when closing the modal
        }}
        fetchData={() => fetchData(activeTab)}
        section={activeTab}
        editEntry={editEntry}
        academicYear={academicYear}
      />
      <DailyEventDiaryView
        show={showDetailsModal}
        onHide={() => setShowDetailsModal(false)}
        selectedEntry={selectedEntry}
        section={activeTab}
      />
    </div>
  );
}