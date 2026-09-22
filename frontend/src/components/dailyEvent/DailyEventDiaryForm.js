 
"use client";
import { useState, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";
import axios from "axios";
import { getToken } from "@/utils/auth";

export default function DailyEventDiaryForm({
  show,
  onHide,
  fetchData,
  editEntry,
  section,
  academicYear
}) {
  const [formData, setFormData] = useState({
    date: "",
    lectureNo: "",
    class: "",
    time: "",
    type: "",
    topic: "",
    attendance: "",
    details: "",
    head: "",
    role: "",
    programName: "",
    programCode: "",
    title: "",
    level: "",
    studentsAdmitted: "",
    duration: "",
    theme: "",
    organisedBy: "",
    paperPresentation: "",
    publicationDetails: "",
    issn: "",
    impactFactor: "",
    authorType: "",
    isbn: "",
    publisher: "",
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (editEntry) {
      setFormData({
        date: editEntry.date || "",
        lectureNo: editEntry.lectureNo || "",
        class: editEntry.class || "",
        time: editEntry.time || "",
        type: editEntry.type || "",
        topic: editEntry.topic || "",
        attendance: editEntry.attendance || "",
        details: editEntry.details || "",
        head: editEntry.head || "",
        role: editEntry.role || "",
        programName: editEntry.programName || "",
        programCode: editEntry.programCode || "",
        title: editEntry.title || "",
        level: editEntry.level || "",
        studentsAdmitted: editEntry.studentsAdmitted || "",
        duration: editEntry.duration || "",
        theme: editEntry.theme || "",
        organisedBy: editEntry.organisedBy || "",
        paperPresentation: editEntry.paperPresentation || "",
        publicationDetails: editEntry.publicationDetails || "",
        issn: editEntry.issn || "",
        impactFactor: editEntry.impactFactor || "",
        authorType: editEntry.authorType || "",
        isbn: editEntry.isbn || "",
        publisher: editEntry.publisher || "",
      });
    } else {
      setFormData({
        date: "",
        lectureNo: "",
        class: "",
        time: "",
        type: "",
        topic: "",
        attendance: "",
        details: "",
        head: "",
        role: "",
        programName: "",
        programCode: "",
        title: "",
        level: "",
        studentsAdmitted: "",
        duration: "",
        theme: "",
        organisedBy: "",
        paperPresentation: "",
        publicationDetails: "",
        issn: "",
        impactFactor: "",
        authorType: "",
        isbn: "",
        publisher: "",
      });
    }
  }, [editEntry]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.date) newErrors.date = "Date is required";
    if (section === "daily") {
      if (!formData.topic) newErrors.topic = "Topic is required";
    }
    if (section === "cie") {
      if (!formData.class) newErrors.class = "Class is required";
    }
    if (section === "university-exam") {
      if (!formData.details) newErrors.details = "Details is required";
    }
    if (
      section === "record-field-work" ||
      section === "transfer-knowledge-events" ||
      section === "extension-activities" ||
      section === "skill-development" ||
      section === "papers-published" ||
      section === "book-chapter"
    ) {
      if (!formData.title) newErrors.title = "Title is required";
    }
    if (section === "workshops-seminars") {
      if (!formData.theme) newErrors.theme = "Theme is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const subEntry = {};
    if (section === "daily") {
      subEntry.lectureNo = formData.lectureNo;
      subEntry.class = formData.class;
      subEntry.time = formData.time;
      subEntry.type = formData.type;
      subEntry.topic = formData.topic;
      subEntry.attendance = formData.attendance;
    } else if (section === "cie") {
      subEntry.class = formData.class;
      subEntry.time = formData.time;
      subEntry.type = formData.type;
    } else if (section === "university-exam") {
      subEntry.details = formData.details;
      subEntry.head = formData.head;
      subEntry.role = formData.role;
    } else if (section === "record-field-work") {
      subEntry.programName = formData.programName;
      subEntry.programCode = formData.programCode;
      subEntry.title = formData.title;
    } else if (section === "transfer-knowledge-events") {
      subEntry.title = formData.title;
      subEntry.level = formData.level;
      subEntry.type = formData.type;
    } else if (section === "extension-activities") {
      subEntry.title = formData.title;
      subEntry.type = formData.type;
    } else if (section === "skill-development") {
      subEntry.title = formData.title;
      subEntry.duration = formData.duration;
      subEntry.studentsAdmitted = formData.studentsAdmitted;
    } else if (section === "workshops-seminars") {
      subEntry.theme = formData.theme;
      subEntry.level = formData.level;
      subEntry.organisedBy = formData.organisedBy;
      subEntry.paperPresentation = formData.paperPresentation;
      subEntry.role = formData.role;
    } else if (section === "papers-published") {
      subEntry.title = formData.title;
      subEntry.publicationDetails = formData.publicationDetails;
      subEntry.type = formData.type;
      subEntry.issn = formData.issn;
      subEntry.impactFactor = formData.impactFactor;
      subEntry.authorType = formData.authorType;
    } else if (section === "book-chapter") {
      subEntry.title = formData.title;
      subEntry.level = formData.level;
      subEntry.isbn = formData.isbn;
      subEntry.publisher = formData.publisher;
    }

    try {
      if (editEntry && editEntry.subEntryIndex !== undefined) {
        await axios.put(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/daily-event-diary/${section}/${editEntry._id}/${editEntry.subEntryIndex}`,
          { date: formData.date, academicYear , subEntry },
          { headers: { "x-auth-token": getToken() } }
        );
      } else {
        await axios.post(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/daily-event-diary/${section}`,
          { date: formData.date, academicYear : academicYear , entries: [subEntry] },
          { headers: { "x-auth-token": getToken() } }
        );
      }
      fetchData();
      onHide();
    } catch (err) {
      console.error(`Error saving ${section} sub-entry:`, err);
      setErrors({
        submit: err.response?.data?.msg || `Failed to save ${section} sub-entry`,
      });
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header
        style={{
          backgroundColor: "#1A3159",
          color: "#FFFFFF",
          borderRadius: "8px 8px 0 0",
        }}
      >
        <Modal.Title>
          {editEntry ? "Edit" : "Add"} {section
            .split("-")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ")} Sub-Entry
        </Modal.Title>
        <Button
          variant="link"
          onClick={onHide}
          style={{ color: "#FFFFFF", textDecoration: "none" }}
        >
          <i className="bi bi-x-lg"></i>
        </Button>
      </Modal.Header>
      <Modal.Body style={{ backgroundColor: "#FFFFFF" }}>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label" style={{ color: "#1A3159" }}>
              Date
            </label>
            <input
              type="date"
              className={`form-control ${errors.date ? "is-invalid" : ""}`}
              name="date"
              value={formData.date}
              onChange={handleChange}
              style={{ borderColor: "#1A3159" }}
            />
            {errors.date && <div className="invalid-feedback">{errors.date}</div>}
          </div>
          {section === "daily" && (
            <>
              <div className="mb-3">
                <label className="form-label" style={{ color: "#1A3159" }}>
                  Lecture No.
                </label>
                <select
                  className="form-control"
                  name="lectureNo"
                  value={formData.lectureNo}
                  onChange={handleChange}
                  style={{ borderColor: "#1A3159" }}
                >
                  <option value="">Select Lecture No.</option>
                  {["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"].map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-3">
                <label className="form-label" style={{ color: "#1A3159" }}>
                  Class
                </label>
                <input
                  type="text"
                  className="form-control"
                  name="class"
                  value={formData.class}
                  onChange={handleChange}
                  style={{ borderColor: "#1A3159" }}
                />
              </div>
              <div className="mb-3">
                <label className="form-label" style={{ color: "#1A3159" }}>
                  Lecture/Time
                </label>
                <input
                  type="text"
                  className="form-control"
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                  placeholder="e.g., 10:00-11:00"
                  style={{ borderColor: "#1A3159" }}
                />
              </div>
              <div className="mb-3">
                <label className="form-label" style={{ color: "#1A3159" }}>
                  Lecture/Practical
                </label>
                <select
                  className="form-control"
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  style={{ borderColor: "#1A3159" }}
                >
                  <option value="">Select Type</option>
                  {["Lecture", "Practical"].map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-3">
                <label className="form-label" style={{ color: "#1A3159" }}>
                  Topic
                </label>
                <input
                  type="text"
                  className={`form-control ${errors.topic ? "is-invalid" : ""}`}
                  name="topic"
                  value={formData.topic}
                  onChange={handleChange}
                  style={{ borderColor: "#1A3159" }}
                />
                {errors.topic && <div className="invalid-feedback">{errors.topic}</div>}
              </div>
              <div className="mb-3">
                <label className="form-label" style={{ color: "#1A3159" }}>
                  Attendance
                </label>
                <input
                  type="text"
                  className="form-control"
                  name="attendance"
                  value={formData.attendance}
                  onChange={handleChange}
                  placeholder="e.g., 28/30"
                  style={{ borderColor: "#1A3159" }}
                />
              </div>
            </>
          )}
          {section === "cie" && (
            <>
              <div className="mb-3">
                <label className="form-label" style={{ color: "#1A3159" }}>
                  Class
                </label>
                <input
                  type="text"
                  className={`form-control ${errors.class ? "is-invalid" : ""}`}
                  name="class"
                  value={formData.class}
                  onChange={handleChange}
                  style={{ borderColor: "#1A3159" }}
                />
                {errors.class && <div className="invalid-feedback">{errors.class}</div>}
              </div>
              <div className="mb-3">
                <label className="form-label" style={{ color: "#1A3159" }}>
                  Time
                </label>
                <input
                  type="text"
                  className="form-control"
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                  placeholder="e.g., 10:00-11:00"
                  style={{ borderColor: "#1A3159" }}
                />
              </div>
              <div className="mb-3">
                <label className="form-label" style={{ color: "#1A3159" }}>
                  Oral/Written
                </label>
                <select
                  className="form-control"
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  style={{ borderColor: "#1A3159" }}
                >
                  <option value="">Select Type</option>
                  {["Oral", "Written"].map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
            </>
          )}
          {section === "university-exam" && (
            <>
              <div className="mb-3">
                <label className="form-label" style={{ color: "#1A3159" }}>
                  Details of Examination
                </label>
                <input
                  type="text"
                  className={`form-control ${errors.details ? "is-invalid" : ""}`}
                  name="details"
                  value={formData.details}
                  onChange={handleChange}
                  style={{ borderColor: "#1A3159" }}
                />
                {errors.details && <div className="invalid-feedback">{errors.details}</div>}
              </div>
              <div className="mb-3">
                <label className="form-label" style={{ color: "#1A3159" }}>
                  Head, Exam Committee/SRPD Coordinator
                </label>
                <input
                  type="text"
                  className="form-control"
                  name="head"
                  value={formData.head}
                  onChange={handleChange}
                  style={{ borderColor: "#1A3159" }}
                />
              </div>
              <div className="mb-3">
                <label className="form-label" style={{ color: "#1A3159" }}>
                  Role
                </label>
                <input
                  type="text"
                  className="form-control"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  style={{ borderColor: "#1A3159" }}
                />
              </div>
            </>
          )}
          {section === "record-field-work" && (
            <>
              <div className="mb-3">
                <label className="form-label" style={{ color: "#1A3159" }}>
                  Program Name
                </label>
                <input
                  type="text"
                  className="form-control"
                  name="programName"
                  value={formData.programName}
                  onChange={handleChange}
                  style={{ borderColor: "#1A3159" }}
                />
              </div>
              <div className="mb-3">
                <label className="form-label" style={{ color: "#1A3159" }}>
                  Program Code
                </label>
                <input
                  type="text"
                  className="form-control"
                  name="programCode"
                  value={formData.programCode}
                  onChange={handleChange}
                  style={{ borderColor: "#1A3159" }}
                />
              </div>
              <div className="mb-3">
                <label className="form-label" style={{ color: "#1A3159" }}>
                  Title
                </label>
                <input
                  type="text"
                  className={`form-control ${errors.title ? "is-invalid" : ""}`}
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  style={{ borderColor: "#1A3159" }}
                />
                {errors.title && <div className="invalid-feedback">{errors.title}</div>}
              </div>
            </>
          )}
          {section === "transfer-knowledge-events" && (
            <>
              <div className="mb-3">
                <label className="form-label" style={{ color: "#1A3159" }}>
                  Title of the Event
                </label>
                <input
                  type="text"
                  className={`form-control ${errors.title ? "is-invalid" : ""}`}
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  style={{ borderColor: "#1A3159" }}
                />
                {errors.title && <div className="invalid-feedback">{errors.title}</div>}
              </div>
              <div className="mb-3">
                <label className="form-label" style={{ color: "#1A3159" }}>
                  Level
                </label>
                <select
                  className="form-control"
                  name="level"
                  value={formData.level}
                  onChange={handleChange}
                  style={{ borderColor: "#1A3159" }}
                >
                  <option value="">Select Level</option>
                  {["Local", "State", "National", "International"].map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-3">
                <label className="form-label" style={{ color: "#1A3159" }}>
                  Co-curricular/Extra-Curricular
                </label>
                <select
                  className="form-control"
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  style={{ borderColor: "#1A3159" }}
                >
                  <option value="">Select Type</option>
                  {["Co-curricular", "Extra-Curricular"].map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
            </>
          )}
          {section === "extension-activities" && (
            <>
              <div className="mb-3">
                <label className="form-label" style={{ color: "#1A3159" }}>
                  Title of Activity
                </label>
                <input
                  type="text"
                  className={`form-control ${errors.title ? "is-invalid" : ""}`}
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  style={{ borderColor: "#1A3159" }}
                />
                {errors.title && <div className="invalid-feedback">{errors.title}</div>}
              </div>
              <div className="mb-3">
                <label className="form-label" style={{ color: "#1A3159" }}>
                  NSS/On Campus/Off Campus/In Collaboration
                </label>
                <select
                  className="form-control"
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  style={{ borderColor: "#1A3159" }}
                >
                  <option value="">Select Type</option>
                  {["NSS", "On Campus", "Off Campus", "In Collaboration"].map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
            </>
          )}
          {section === "skill-development" && (
            <>
              <div className="mb-3">
                <label className="form-label" style={{ color: "#1A3159" }}>
                  Title of the Course
                </label>
                <input
                  type="text"
                  className={`form-control ${errors.title ? "is-invalid" : ""}`}
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  style={{ borderColor: "#1A3159" }}
                />
                {errors.title && <div className="invalid-feedback">{errors.title}</div>}
              </div>
              <div className="mb-3">
                <label className="form-label" style={{ color: "#1A3159" }}>
                  Duration
                </label>
                <input
                  type="text"
                  className="form-control"
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  placeholder="e.g., 6 weeks"
                  style={{ borderColor: "#1A3159" }}
                />
              </div>
              <div className="mb-3">
                <label className="form-label" style={{ color: "#1A3159" }}>
                  No. of Students Admitted
                </label>
                <input
                  type="number"
                  className="form-control"
                  name="studentsAdmitted"
                  value={formData.studentsAdmitted}
                  onChange={handleChange}
                  style={{ borderColor: "#1A3159" }}
                />
              </div>
            </>
          )}
          {section === "workshops-seminars" && (
            <>
              <div className="mb-3">
                <label className="form-label" style={{ color: "#1A3159" }}>
                  Theme
                </label>
                <input
                  type="text"
                  className={`form-control ${errors.theme ? "is-invalid" : ""}`}
                  name="theme"
                  value={formData.theme}
                  onChange={handleChange}
                  style={{ borderColor: "#1A3159" }}
                />
                {errors.theme && <div className="invalid-feedback">{errors.theme}</div>}
              </div>
              <div className="mb-3">
                <label className="form-label" style={{ color: "#1A3159" }}>
                  University/State/National/International
                </label>
                <select
                  className="form-control"
                  name="level"
                  value={formData.level}
                  onChange={handleChange}
                  style={{ borderColor: "#1A3159" }}
                >
                  <option value="">Select Level</option>
                  {["University", "State", "National", "International"].map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-3">
                <label className="form-label" style={{ color: "#1A3159" }}>
                  Organised By
                </label>
                <input
                  type="text"
                  className="form-control"
                  name="organisedBy"
                  value={formData.organisedBy}
                  onChange={handleChange}
                  style={{ borderColor: "#1A3159" }}
                />
              </div>
              <div className="mb-3">
                <label className="form-label" style={{ color: "#1A3159" }}>
                  Paper Presentation
                </label>
                <input
                  type="text"
                  className="form-control"
                  name="paperPresentation"
                  value={formData.paperPresentation}
                  onChange={handleChange}
                  style={{ borderColor: "#1A3159" }}
                />
              </div>
              <div className="mb-3">
                <label className="form-label" style={{ color: "#1A3159" }}>
                  Role
                </label>
                <input
                  type="text"
                  className="form-control"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  style={{ borderColor: "#1A3159" }}
                />
              </div>
            </>
          )}
          {section === "papers-published" && (
            <>
              <div className="mb-3">
                <label className="form-label" style={{ color: "#1A3159" }}>
                  Title of the Paper
                </label>
                <input
                  type="text"
                  className={`form-control ${errors.title ? "is-invalid" : ""}`}
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  style={{ borderColor: "#1A3159" }}
                />
                {errors.title && <div className="invalid-feedback">{errors.title}</div>}
              </div>
              <div className="mb-3">
                <label className="form-label" style={{ color: "#1A3159" }}>
                  Name of Journal/Proceeding/Abstract & Pub. Year & Pg. No.
                </label>
                <input
                  type="text"
                  className="form-control"
                  name="publicationDetails"
                  value={formData.publicationDetails}
                  onChange={handleChange}
                  style={{ borderColor: "#1A3159" }}
                />
              </div>
              <div className="mb-3">
                <label className="form-label" style={{ color: "#1A3159" }}>
                  UGC Care Listed/Peer Reviewed
                </label>
                <select
                  className="form-control"
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  style={{ borderColor: "#1A3159" }}
                >
                  <option value="">Select Type</option>
                  {["UGC Care Listed", "Peer Reviewed"].map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-3">
                <label className="form-label" style={{ color: "#1A3159" }}>
                  ISSN
                </label>
                <input
                  type="text"
                  className="form-control"
                  name="issn"
                  value={formData.issn}
                  onChange={handleChange}
                  style={{ borderColor: "#1A3159" }}
                />
              </div>
              <div className="mb-3">
                <label className="form-label" style={{ color: "#1A3159" }}>
                  Impact Factor
                </label>
                <input
                  type="text"
                  className="form-control"
                  name="impactFactor"
                  value={formData.impactFactor}
                  onChange={handleChange}
                  style={{ borderColor: "#1A3159" }}
                />
              </div>
              <div className="mb-3">
                <label className="form-label" style={{ color: "#1A3159" }}>
                  1st Author/Corresponding
                </label>
                <select
                  className="form-control"
                  name="authorType"
                  value={formData.authorType}
                  onChange={handleChange}
                  style={{ borderColor: "#1A3159" }}
                >
                  <option value="">Select Author Type</option>
                  {["1st Author", "Corresponding"].map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
            </>
          )}
          {section === "book-chapter" && (
            <>
              <div className="mb-3">
                <label className="form-label" style={{ color: "#1A3159" }}>
                  Title of the Book/Chapter with Page nos.
                </label>
                <input
                  type="text"
                  className={`form-control ${errors.title ? "is-invalid" : ""}`}
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  style={{ borderColor: "#1A3159" }}
                />
                {errors.title && <div className="invalid-feedback">{errors.title}</div>}
              </div>
              <div className="mb-3">
                <label className="form-label" style={{ color: "#1A3159" }}>
                  National/International
                </label>
                <select
                  className="form-control"
                  name="level"
                  value={formData.level}
                  onChange={handleChange}
                  style={{ borderColor: "#1A3159" }}
                >
                  <option value="">Select Level</option>
                  {["National", "International"].map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-3">
                <label className="form-label" style={{ color: "#1A3159" }}>
                  ISBN
                </label>
                <input
                  type="text"
                  className="form-control"
                  name="isbn"
                  value={formData.isbn}
                  onChange={handleChange}
                  style={{ borderColor: "#1A3159" }}
                />
              </div>
              <div className="mb-3">
                <label className="form-label" style={{ color: "#1A3159" }}>
                  Publisher
                </label>
                <input
                  type="text"
                  className="form-control"
                  name="publisher"
                  value={formData.publisher}
                  onChange={handleChange}
                  style={{ borderColor: "#1A3159" }}
                />
              </div>
            </>
          )}
          {errors.submit && (
            <div className="alert alert-danger">{errors.submit}</div>
          )}
          <div className="d-flex justify-content-end">
            <Button
              variant="secondary"
              onClick={onHide}
              className="me-2"
              style={{
                backgroundColor: "#6C757D",
                borderColor: "#6C757D",
                borderRadius: "8px",
              }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              style={{
                backgroundColor: "#EF7E20",
                borderColor: "#EF7E20",
                borderRadius: "8px",
              }}
            >
              {editEntry ? "Update" : "Submit"}
            </Button>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  );
}