 
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
import MoreDetailsForm from "@/components/MoreDetails/MoreDetailsForm";
import MoreDetailsView from "@/components/MoreDetails/MoreDetailsView";
import { useSelector } from "react-redux";

export default function MoreDetails() {
  const [activeTab, setActiveTab] = useState("annual-teaching-plan");
  const [data, setData] = useState({
    "annual-teaching-plan": [],
    mentoring: [],
    patents: [],
    training: [],
    awards: [],
    leave: [],
    "invited-lectures": [],
    "research-project": [],
    "database-publications": [],
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
        const base = { "Sr. No.": `${index + 1}.${subIndex + 1}`, date: entry.date };
        if (section === "annual-teaching-plan") {
          return {
            ...base,
            Title: subEntry.title,
            Description: subEntry.description,
            "PDF Available": subEntry.pdf ? "Yes" : "No",
          };
        } else if (section === "mentoring") {
          return {
            ...base,
            Class: subEntry.class,
            "No. of Mentees": subEntry.mentees,
            "PDF Available": subEntry.pdf ? "Yes" : "No",
          };
        } else if (section === "patents") {
          return {
            ...base,
            "Title of IPR/Patent": subEntry.title,
            "Application No.": subEntry.applicationNo,
            "Publication Date": subEntry.publicationDate,
            "Approval Date": subEntry.approvalDate,
            "Valid Upto": subEntry.validUpto,
            "PDF Available": subEntry.pdf ? "Yes" : "No",
          };
        } else if (section === "training") {
          return {
            ...base,
            Title: subEntry.title,
            Duration: subEntry.duration,
            Organiser: subEntry.organiser,
            "PDF Available": subEntry.pdf ? "Yes" : "No",
          };
        } else if (section === "awards") {
          return {
            ...base,
            Title: subEntry.title,
            "Conferred By": subEntry.conferredBy,
            "PDF Available": subEntry.pdf ? "Yes" : "No",
          };
        } else if (section === "leave") {
          return {
            ...base,
            "Date Range": subEntry.dateRange,
            Type: subEntry.type,
          };
        } else if (section === "invited-lectures") {
          return {
            ...base,
            "Title of the Speech": subEntry.title,
            Event: subEntry.event,
            Organiser: subEntry.organiser,
            Date: subEntry.date,
            "PDF Available": subEntry.pdf ? "Yes" : "No",
          };
        } else if (section === "research-project") {
          return {
            ...base,
            Title: subEntry.title,
            Agency: subEntry.agency,
            Duration: subEntry.duration,
            "Amount Mobilized": subEntry.amountMobilized,
            Status: subEntry.status,
            "PDF Available": subEntry.pdf ? "Yes" : "No",
          };
        } else if (section === "database-publications") {
          return {
            ...base,
            Title: subEntry.title,
            Date: subEntry.date,
            Domain: subEntry.domain,
            "PDF Available": subEntry.pdf ? "Yes" : "No",
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
                  <th scope="col">date</th>
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
                                    {section === "annual-teaching-plan" && (
                                      <>
                                        <th>Title</th>
                                        <th>Description</th>
                                        <th>PDF Available</th>
                                      </>
                                    )}
                                    {section === "mentoring" && (
                                      <>
                                        <th>Class</th>
                                        <th>No. of Mentees</th>
                                        <th>PDF Available</th>
                                      </>
                                    )}
                                    {section === "patents" && (
                                      <>
                                        <th>Title of IPR/Patent</th>
                                        <th>Application No.</th>
                                        <th>Publication Date</th>
                                        <th>Approval Date</th>
                                        <th>Valid Upto</th>
                                        <th>PDF Available</th>
                                      </>
                                    )}
                                    {section === "training" && (
                                      <>
                                        <th>Title</th>
                                        <th>Duration</th>
                                        <th>Organiser</th>
                                        <th>PDF Available</th>
                                      </>
                                    )}
                                    {section === "awards" && (
                                      <>
                                        <th>Title</th>
                                        <th>Conferred By</th>
                                        <th>PDF Available</th>
                                      </>
                                    )}
                                    {section === "leave" && (
                                      <>
                                        <th>Date Range</th>
                                        <th>Type</th>
                                      </>
                                    )}
                                    {section === "invited-lectures" && (
                                      <>
                                        <th>Title of the Speech</th>
                                        <th>Event</th>
                                        <th>Organiser</th>
                                        <th>Date</th>
                                        <th>PDF Available</th>
                                      </>
                                    )}
                                    {section === "research-project" && (
                                      <>
                                        <th>Title</th>
                                        <th>Agency</th>
                                        <th>Duration</th>
                                        <th>Amount Mobilized</th>
                                        <th>Status</th>
                                        <th>PDF Available</th>
                                      </>
                                    )}
                                    {section === "database-publications" && (
                                      <>
                                        <th>Title</th>
                                        <th>Date</th>
                                        <th>Domain</th>
                                        <th>PDF Available</th>
                                      </>
                                    )}
                                    <th>Actions</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {entry.entries.map((subEntry, subIndex) => (
                                    <tr key={`${entry._id}-${subIndex}`}>
                                      {section === "annual-teaching-plan" && (
                                        <>
                                          <td>{subEntry.title}</td>
                                          <td>{subEntry.description}</td>
                                          <td>{subEntry.pdf ? "Yes" : "No"}</td>
                                        </>
                                      )}
                                      {section === "mentoring" && (
                                        <>
                                          <td>{subEntry.class}</td>
                                          <td>{subEntry.mentees}</td>
                                          <td>{subEntry.pdf ? "Yes" : "No"}</td>
                                        </>
                                      )}
                                      {section === "patents" && (
                                        <>
                                          <td>{subEntry.title}</td>
                                          <td>{subEntry.applicationNo}</td>
                                          <td>{subEntry.publicationDate}</td>
                                          <td>{subEntry.approvalDate}</td>
                                          <td>{subEntry.validUpto}</td>
                                          <td>{subEntry.pdf ? "Yes" : "No"}</td>
                                        </>
                                      )}
                                      {section === "training" && (
                                        <>
                                          <td>{subEntry.title}</td>
                                          <td>{subEntry.duration}</td>
                                          <td>{subEntry.organiser}</td>
                                          <td>{subEntry.pdf ? "Yes" : "No"}</td>
                                        </>
                                      )}
                                      {section === "awards" && (
                                        <>
                                          <td>{subEntry.title}</td>
                                          <td>{subEntry.conferredBy}</td>
                                          <td>{subEntry.pdf ? "Yes" : "No"}</td>
                                        </>
                                      )}
                                      {section === "leave" && (
                                        <>
                                          <td>{subEntry.dateRange}</td>
                                          <td>{subEntry.type}</td>
                                        </>
                                      )}
                                      {section === "invited-lectures" && (
                                        <>
                                          <td>{subEntry.title}</td>
                                          <td>{subEntry.event}</td>
                                          <td>{subEntry.organiser}</td>
                                          <td>{subEntry.date}</td>
                                          <td>{subEntry.pdf ? "Yes" : "No"}</td>
                                        </>
                                      )}
                                      {section === "research-project" && (
                                        <>
                                          <td>{subEntry.title}</td>
                                          <td>{subEntry.agency}</td>
                                          <td>{subEntry.duration}</td>
                                          <td>{subEntry.amountMobilized}</td>
                                          <td>{subEntry.status}</td>
                                          <td>{subEntry.pdf ? "Yes" : "No"}</td>
                                        </>
                                      )}
                                      {section === "database-publications" && (
                                        <>
                                          <td>{subEntry.title}</td>
                                          <td>{subEntry.date}</td>
                                          <td>{subEntry.domain}</td>
                                          <td>{subEntry.pdf ? "Yes" : "No"}</td>
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
            More Details
          </h1>
          <p style={{ color: "black" }}>
            Manage additional faculty details
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
              placeholder="Search by title, class, or other fields..."
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
        </div>
      </div>

      <Nav
        variant="tabs"
        activeKey={activeTab}
        onSelect={(key) => setActiveTab(key)}
        className="mt-4"
        style={{ borderBottom: "2px solid #1A3159" ,  alignItems : "center" , justifyContent : "center"  }}
      >
        <Nav.Item>
          <Nav.Link
            eventKey="annual-teaching-plan"
            style={{
              color: activeTab === "annual-teaching-plan" ? "#1A3159" : "#6C757D",
              backgroundColor: activeTab === "annual-teaching-plan" ? "#E9ECEF" : "transparent",
            }}
          >
            Annual Teaching Plan
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link
            eventKey="mentoring"
            style={{
              color: activeTab === "mentoring" ? "#1A3159" : "#6C757D",
              backgroundColor: activeTab === "mentoring" ? "#E9ECEF" : "transparent",
            }}
          >
            Mentoring
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link
            eventKey="patents"
            style={{
              color: activeTab === "patents" ? "#1A3159" : "#6C757D",
              backgroundColor: activeTab === "patents" ? "#E9ECEF" : "transparent",
            }}
          >
            Patents/IPR
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link
            eventKey="training"
            style={{
              color: activeTab === "training" ? "#1A3159" : "#6C757D",
              backgroundColor: activeTab === "training" ? "#E9ECEF" : "transparent",
            }}
          >
            Training/FDP
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link
            eventKey="awards"
            style={{
              color: activeTab === "awards" ? "#1A3159" : "#6C757D",
              backgroundColor: activeTab === "awards" ? "#E9ECEF" : "transparent",
            }}
          >
            Awards
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link
            eventKey="leave"
            style={{
              color: activeTab === "leave" ? "#1A3159" : "#6C757D",
              backgroundColor: activeTab === "leave" ? "#E9ECEF" : "transparent",
            }}
          >
            Leave Record
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link
            eventKey="invited-lectures"
            style={{
              color: activeTab === "invited-lectures" ? "#1A3159" : "#6C757D",
              backgroundColor: activeTab === "invited-lectures" ? "#E9ECEF" : "transparent",
            }}
          >
            Invited Lectures
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link
            eventKey="research-project"
            style={{
              color: activeTab === "research-project" ? "#1A3159" : "#6C757D",
              backgroundColor: activeTab === "research-project" ? "#E9ECEF" : "transparent",
            }}
          >
            Research Project
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link
            eventKey="database-publications"
            style={{
              color: activeTab === "database-publications" ? "#1A3159" : "#6C757D",
              backgroundColor: activeTab === "database-publications" ? "#E9ECEF" : "transparent",
            }}
          >
            Database Publications
          </Nav.Link>
        </Nav.Item>
      </Nav>

      <div className="row mt-4">
        <div className="col-12">{renderTable(activeTab)}</div>
      </div>

      <MoreDetailsForm
        show={showAddModal}
        onHide={() => {
          setShowAddModal(false);
          setEditEntry(null);
        }}
        fetchData={() => fetchData(activeTab)}
        section={activeTab}
        editEntry={editEntry}
        academicYear={academicYear}
      />
      <MoreDetailsView
        show={showDetailsModal}
        onHide={() => setShowDetailsModal(false)}
        selectedEntry={selectedEntry}
        section={activeTab}
      />
    </div>
  );
}