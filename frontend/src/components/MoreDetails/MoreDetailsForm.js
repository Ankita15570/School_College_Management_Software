"use client";
import { useState, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";
import axios from "axios";
import { getToken } from "@/utils/auth";

export default function MoreDetailsForm({
  show,
  onHide,
  fetchData,
  editEntry,
  section,
  academicYear,
}) {
  const [formData, setFormData] = useState({
    date: "",
    title: "",
    description: "",
    class: "",
    mentees: "",
    applicationNo: "",
    publicationDate: "",
    approvalDate: "",
    validUpto: "",
    duration: "",
    organiser: "",
    conferredBy: "",
    dateRange: "",
    type: "",
    event: "",
    date: "",
    agency: "",
    amountMobilized: "",
    status: "",
    domain: "",
    pdf: null,
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (editEntry) {
      setFormData({
        date: editEntry.date || "",
        title: editEntry.title || "",
        description: editEntry.description || "",
        class: editEntry.class || "",
        mentees: editEntry.mentees || "",
        applicationNo: editEntry.applicationNo || "",
        publicationDate: editEntry.publicationDate || "",
        approvalDate: editEntry.approvalDate || "",
        validUpto: editEntry.validUpto || "",
        duration: editEntry.duration || "",
        organiser: editEntry.organiser || "",
        conferredBy: editEntry.conferredBy || "",
        dateRange: editEntry.dateRange || "",
        type: editEntry.type || "",
        event: editEntry.event || "",
        date: editEntry.date || "",
        agency: editEntry.agency || "",
        amountMobilized: editEntry.amountMobilized || "",
        status: editEntry.status || "",
        domain: editEntry.domain || "",
        pdf: null,
        academicYear: academicYear,
      });
    } else {
      setFormData({
        date: "",
        title: "",
        description: "",
        class: "",
        mentees: "",
        applicationNo: "",
        publicationDate: "",
        approvalDate: "",
        validUpto: "",
        duration: "",
        organiser: "",
        conferredBy: "",
        dateRange: "",
        type: "",
        event: "",
        date: "",
        agency: "",
        amountMobilized: "",
        status: "",
        domain: "",
        pdf: null,
      });
    }
  }, [editEntry]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.date) newErrors.date = "date is required";
    if (section === "annual-teaching-plan" && !formData.title)
      newErrors.title = "Title is required";
    if (section === "mentoring" && !formData.class)
      newErrors.class = "Class is required";
    if (section === "patents" && !formData.title)
      newErrors.title = "Title is required";
    if (section === "training" && !formData.title)
      newErrors.title = "Title is required";
    if (section === "awards" && !formData.title)
      newErrors.title = "Title is required";
    if (section === "leave" && !formData.dateRange)
      newErrors.dateRange = "Date Range is required";
    if (section === "invited-lectures" && !formData.title)
      newErrors.title = "Title is required";
    if (section === "research-project" && !formData.title)
      newErrors.title = "Title is required";
    if (section === "database-publications" && !formData.title)
      newErrors.title = "Title is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const subEntry = {};
    if (section === "annual-teaching-plan") {
      subEntry.title = formData.title;
      subEntry.description = formData.description;
      subEntry.pdf = formData.pdf;
    } else if (section === "mentoring") {
      subEntry.class = formData.class;
      subEntry.mentees = formData.mentees;
      subEntry.pdf = formData.pdf;
    } else if (section === "patents") {
      subEntry.title = formData.title;
      subEntry.applicationNo = formData.applicationNo;
      subEntry.publicationDate = formData.publicationDate;
      subEntry.approvalDate = formData.approvalDate;
      subEntry.validUpto = formData.validUpto;
      subEntry.pdf = formData.pdf;
    } else if (section === "training") {
      subEntry.title = formData.title;
      subEntry.duration = formData.duration;
      subEntry.organiser = formData.organiser;
      subEntry.pdf = formData.pdf;
    } else if (section === "awards") {
      subEntry.title = formData.title;
      subEntry.conferredBy = formData.conferredBy;
      subEntry.pdf = formData.pdf;
    } else if (section === "leave") {
      subEntry.dateRange = formData.dateRange;
      subEntry.type = formData.type;
    } else if (section === "invited-lectures") {
      subEntry.title = formData.title;
      subEntry.event = formData.event;
      subEntry.organiser = formData.organiser;
      subEntry.date = formData.date;
      subEntry.pdf = formData.pdf;
    } else if (section === "research-project") {
      subEntry.title = formData.title;
      subEntry.agency = formData.agency;
      subEntry.duration = formData.duration;
      subEntry.amountMobilized = formData.amountMobilized;
      subEntry.status = formData.status;
      subEntry.pdf = formData.pdf;
    } else if (section === "database-publications") {
      subEntry.title = formData.title;
      subEntry.date = formData.date;
      subEntry.domain = formData.domain;
      subEntry.pdf = formData.pdf;
    }

    const formDataToSend = new FormData();
    formDataToSend.append("date", formData.date);
    formDataToSend.append("academicYear", academicYear);
    formDataToSend.append("subEntry", JSON.stringify(subEntry));
    if (formData.pdf) formDataToSend.append("pdf", formData.pdf);

    try {
      if (editEntry && editEntry._id && editEntry.subEntryIndex !== undefined) {
        // Update existing sub-entry
        await axios.put(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/daily-event-diary/${section}/${editEntry._id}/${editEntry.subEntryIndex}`,
          formDataToSend,
          { headers: { "x-auth-token": getToken() } }
        );
      } else {
        // Create new sub-entry
        await axios.post(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/daily-event-diary/${section}`,
          {
            date: formData.date,
            academicYear: academicYear,
            entries: [subEntry],
          },
          { headers: { "x-auth-token": getToken() } }
        );
      }
      fetchData();
      setFormData({
        date: "",
        title: "",
        description: "",
        class: "",
        mentees: "",
        applicationNo: "",
        publicationDate: "",
        approvalDate: "",
        validUpto: "",
        duration: "",
        organiser: "",
        conferredBy: "",
        dateRange: "",
        type: "",
        event: "",
        date: "",
        agency: "",
        amountMobilized: "",
        status: "",
        domain: "",
        pdf: null,
      });
      setErrors({});
      onHide();
    } catch (err) {
      console.error(`Error saving ${section} sub-entry:`, err);
      setErrors({
        submit:
          err.response?.data?.msg || `Failed to save ${section} sub-entry`,
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
          {editEntry ? "Edit" : "Add"}{" "}
          {section
            .split("-")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ")}{" "}
          Sub-Entry
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
              date
            </label>
            <input
              type="date"
              className={`form-control ${errors.date ? "is-invalid" : ""}`}
              name="date"
              value={formData.date}
              onChange={handleChange}
              style={{ borderColor: "#1A3159" }}
            />
            {errors.date && (
              <div className="invalid-feedback">{errors.date}</div>
            )}
          </div>
          {section === "annual-teaching-plan" && (
            <>
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
                {errors.title && (
                  <div className="invalid-feedback">{errors.title}</div>
                )}
              </div>
              <div className="mb-3">
                <label className="form-label" style={{ color: "#1A3159" }}>
                  Description
                </label>
                <textarea
                  className="form-control"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  style={{ borderColor: "#1A3159" }}
                />
              </div>
              <div className="mb-3">
                <label className="form-label" style={{ color: "#1A3159" }}>
                  PDF (Optional)
                </label>
                <input
                  type="file"
                  className="form-control"
                  name="pdf"
                  onChange={handleChange}
                  accept=".pdf"
                  style={{ borderColor: "#1A3159" }}
                />
              </div>
            </>
          )}
          {section === "mentoring" && (
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
                {errors.class && (
                  <div className="invalid-feedback">{errors.class}</div>
                )}
              </div>
              <div className="mb-3">
                <label className="form-label" style={{ color: "#1A3159" }}>
                  No. of Mentees
                </label>
                <input
                  type="number"
                  className="form-control"
                  name="mentees"
                  value={formData.mentees}
                  onChange={handleChange}
                  style={{ borderColor: "#1A3159" }}
                />
              </div>
              <div className="mb-3">
                <label className="form-label" style={{ color: "#1A3159" }}>
                  PDF (Optional)
                </label>
                <input
                  type="file"
                  className="form-control"
                  name="pdf"
                  onChange={handleChange}
                  accept=".pdf"
                  style={{ borderColor: "#1A3159" }}
                />
              </div>
            </>
          )}
          {section === "patents" && (
            <>
              <div className="mb-3">
                <label className="form-label" style={{ color: "#1A3159" }}>
                  Title of IPR/Patent
                </label>
                <input
                  type="text"
                  className={`form-control ${errors.title ? "is-invalid" : ""}`}
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  style={{ borderColor: "#1A3159" }}
                />
                {errors.title && (
                  <div className="invalid-feedback">{errors.title}</div>
                )}
              </div>
              <div className="mb-3">
                <label className="form-label" style={{ color: "#1A3159" }}>
                  Application No.
                </label>
                <input
                  type="text"
                  className="form-control"
                  name="applicationNo"
                  value={formData.applicationNo}
                  onChange={handleChange}
                  style={{ borderColor: "#1A3159" }}
                />
              </div>
              <div className="mb-3">
                <label className="form-label" style={{ color: "#1A3159" }}>
                  Publication Date
                </label>
                <input
                  type="date"
                  className="form-control"
                  name="publicationDate"
                  value={formData.publicationDate}
                  onChange={handleChange}
                  style={{ borderColor: "#1A3159" }}
                />
              </div>
              <div className="mb-3">
                <label className="form-label" style={{ color: "#1A3159" }}>
                  Approval Date
                </label>
                <input
                  type="date"
                  className="form-control"
                  name="approvalDate"
                  value={formData.approvalDate}
                  onChange={handleChange}
                  style={{ borderColor: "#1A3159" }}
                />
              </div>
              <div className="mb-3">
                <label className="form-label" style={{ color: "#1A3159" }}>
                  Valid Upto
                </label>
                <input
                  type="date"
                  className="form-control"
                  name="validUpto"
                  value={formData.validUpto}
                  onChange={handleChange}
                  style={{ borderColor: "#1A3159" }}
                />
              </div>
              <div className="mb-3">
                <label className="form-label" style={{ color: "#1A3159" }}>
                  PDF (Optional)
                </label>
                <input
                  type="file"
                  className="form-control"
                  name="pdf"
                  onChange={handleChange}
                  accept=".pdf"
                  style={{ borderColor: "#1A3159" }}
                />
              </div>
            </>
          )}
          {section === "training" && (
            <>
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
                {errors.title && (
                  <div className="invalid-feedback">{errors.title}</div>
                )}
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
                  style={{ borderColor: "#1A3159" }}
                />
              </div>
              <div className="mb-3">
                <label className="form-label" style={{ color: "#1A3159" }}>
                  Organiser
                </label>
                <input
                  type="text"
                  className="form-control"
                  name="organiser"
                  value={formData.organiser}
                  onChange={handleChange}
                  style={{ borderColor: "#1A3159" }}
                />
              </div>
              <div className="mb-3">
                <label className="form-label" style={{ color: "#1A3159" }}>
                  PDF (Optional)
                </label>
                <input
                  type="file"
                  className="form-control"
                  name="pdf"
                  onChange={handleChange}
                  accept=".pdf"
                  style={{ borderColor: "#1A3159" }}
                />
              </div>
            </>
          )}
          {section === "awards" && (
            <>
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
                {errors.title && (
                  <div className="invalid-feedback">{errors.title}</div>
                )}
              </div>
              <div className="mb-3">
                <label className="form-label" style={{ color: "#1A3159" }}>
                  Conferred By
                </label>
                <input
                  type="text"
                  className="form-control"
                  name="conferredBy"
                  value={formData.conferredBy}
                  onChange={handleChange}
                  style={{ borderColor: "#1A3159" }}
                />
              </div>
              <div className="mb-3">
                <label className="form-label" style={{ color: "#1A3159" }}>
                  PDF (Optional)
                </label>
                <input
                  type="file"
                  className="form-control"
                  name="pdf"
                  onChange={handleChange}
                  accept=".pdf"
                  style={{ borderColor: "#1A3159" }}
                />
              </div>
            </>
          )}
          {section === "leave" && (
            <>
              <div className="mb-3">
                <label className="form-label" style={{ color: "#1A3159" }}>
                  Date Range
                </label>
                <input
                  type="text"
                  className={`form-control ${
                    errors.dateRange ? "is-invalid" : ""
                  }`}
                  name="dateRange"
                  value={formData.dateRange}
                  onChange={handleChange}
                  style={{ borderColor: "#1A3159" }}
                />
                {errors.dateRange && (
                  <div className="invalid-feedback">{errors.dateRange}</div>
                )}
              </div>
              <div className="mb-3">
                <label className="form-label" style={{ color: "#1A3159" }}>
                  Type
                </label>
                <select
                  className="form-control"
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  style={{ borderColor: "#1A3159" }}
                >
                  <option value="">Select Type</option>
                  {["Casual", "Medical", "Earned", "Sabbatical"].map(
                    (option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    )
                  )}
                </select>
              </div>
            </>
          )}
          {section === "invited-lectures" && (
            <>
              <div className="mb-3">
                <label className="form-label" style={{ color: "#1A3159" }}>
                  Title of the Speech
                </label>
                <input
                  type="text"
                  className={`form-control ${errors.title ? "is-invalid" : ""}`}
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  style={{ borderColor: "#1A3159" }}
                />
                {errors.title && (
                  <div className="invalid-feedback">{errors.title}</div>
                )}
              </div>
              <div className="mb-3">
                <label className="form-label" style={{ color: "#1A3159" }}>
                  Event
                </label>
                <input
                  type="text"
                  className="form-control"
                  name="event"
                  value={formData.event}
                  onChange={handleChange}
                  style={{ borderColor: "#1A3159" }}
                />
              </div>
              <div className="mb-3">
                <label className="form-label" style={{ color: "#1A3159" }}>
                  Organiser
                </label>
                <input
                  type="text"
                  className="form-control"
                  name="organiser"
                  value={formData.organiser}
                  onChange={handleChange}
                  style={{ borderColor: "#1A3159" }}
                />
              </div>
              <div className="mb-3">
                <label className="form-label" style={{ color: "#1A3159" }}>
                  Date
                </label>
                <input
                  type="date"
                  className="form-control"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  style={{ borderColor: "#1A3159" }}
                />
              </div>
              <div className="mb-3">
                <label className="form-label" style={{ color: "#1A3159" }}>
                  PDF (Optional)
                </label>
                <input
                  type="file"
                  className="form-control"
                  name="pdf"
                  onChange={handleChange}
                  accept=".pdf"
                  style={{ borderColor: "#1A3159" }}
                />
              </div>
            </>
          )}
          {section === "research-project" && (
            <>
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
                {errors.title && (
                  <div className="invalid-feedback">{errors.title}</div>
                )}
              </div>
              <div className="mb-3">
                <label className="form-label" style={{ color: "#1A3159" }}>
                  Agency
                </label>
                <input
                  type="text"
                  className="form-control"
                  name="agency"
                  value={formData.agency}
                  onChange={handleChange}
                  style={{ borderColor: "#1A3159" }}
                />
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
                  style={{ borderColor: "#1A3159" }}
                />
              </div>
              <div className="mb-3">
                <label className="form-label" style={{ color: "#1A3159" }}>
                  Amount Mobilized
                </label>
                <input
                  type="text"
                  className="form-control"
                  name="amountMobilized"
                  value={formData.amountMobilized}
                  onChange={handleChange}
                  style={{ borderColor: "#1A3159" }}
                />
              </div>
              <div className="mb-3">
                <label className="form-label" style={{ color: "#1A3159" }}>
                  Status
                </label>
                <select
                  className="form-control"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  style={{ borderColor: "#1A3159" }}
                >
                  <option value="">Select Status</option>
                  {["Ongoing", "Completed", "Proposed"].map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-3">
                <label className="form-label" style={{ color: "#1A3159" }}>
                  PDF (Optional)
                </label>
                <input
                  type="file"
                  className="form-control"
                  name="pdf"
                  onChange={handleChange}
                  accept=".pdf"
                  style={{ borderColor: "#1A3159" }}
                />
              </div>
            </>
          )}
          {section === "database-publications" && (
            <>
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
                {errors.title && (
                  <div className="invalid-feedback">{errors.title}</div>
                )}
              </div>
              <div className="mb-3">
                <label className="form-label" style={{ color: "#1A3159" }}>
                  Date
                </label>
                <input
                  type="date"
                  className="form-control"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  style={{ borderColor: "#1A3159" }}
                />
              </div>
              <div className="mb-3">
                <label className="form-label" style={{ color: "#1A3159" }}>
                  Domain
                </label>
                <input
                  type="text"
                  className="form-control"
                  name="domain"
                  value={formData.domain}
                  onChange={handleChange}
                  style={{ borderColor: "#1A3159" }}
                />
              </div>
              <div className="mb-3">
                <label className="form-label" style={{ color: "#1A3159" }}>
                  PDF (Optional)
                </label>
                <input
                  type="file"
                  className="form-control"
                  name="pdf"
                  onChange={handleChange}
                  accept=".pdf"
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
