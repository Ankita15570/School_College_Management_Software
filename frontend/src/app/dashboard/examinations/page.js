"use client";
import "bootstrap/dist/css/bootstrap.min.css";
import { useEffect, useState } from "react";
import axios from "axios";
import { FaPlus, FaEdit, FaTrash, FaSearch } from "react-icons/fa";
import { Modal, Button } from "react-bootstrap";
import { getToken } from "@/utils/auth";
import { useSelector } from "react-redux";

const EXAM_TYPES = ["Unit Test", "Mid Term", "Final", "Practical", "Oral", "Other"];
const EMPTY_FORM = { classId: "", subject: "", examType: "", examDate: "", startTime: "", endTime: "", totalMarks: "" };

export default function ExaminationsPage() {
  const [exams, setExams] = useState([]);
  const [classes, setClasses] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editExam, setEditExam] = useState(null);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [userRole, setUserRole] = useState("");
  const { academicYear } = useSelector((s) => s.academicYear);

  const token = getToken();
  const headers = { "x-auth-token": token };

  useEffect(() => {
    if (token) {
      try { setUserRole(JSON.parse(atob(token.split(".")[1])).role); } catch {}
    }
    axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/classes`, { headers }).then((r) => setClasses(r.data.data || [])).catch(() => {});
  }, []);

  const fetchExams = () => {
    let url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/exams?academicYear=${academicYear}`;
    if (selectedClass) url += `&classId=${selectedClass}`;
    axios.get(url, { headers }).then((r) => setExams(r.data.data || [])).catch(() => {});
  };

  useEffect(() => { fetchExams(); }, [academicYear, selectedClass]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editExam) {
        await axios.put(`${process.env.NEXT_PUBLIC_API_BASE_URL}/exams/${editExam._id}`, { ...formData, academicYear }, { headers });
      } else {
        await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/exams`, { ...formData, academicYear }, { headers });
      }
      fetchExams();
      setShowModal(false);
      setEditExam(null);
      setFormData(EMPTY_FORM);
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (exam) => {
    setEditExam(exam);
    setFormData({ classId: exam.classId?._id || exam.classId, subject: exam.subject, examType: exam.examType, examDate: exam.examDate, startTime: exam.startTime || "", endTime: exam.endTime || "", totalMarks: exam.totalMarks || "" });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this exam?")) return;
    await axios.delete(`${process.env.NEXT_PUBLIC_API_BASE_URL}/exams/${id}`, { headers });
    fetchExams();
  };

  const canEdit = ["Teacher", "Faculty", "Principal", "OrganizationAdmin"].includes(userRole);

  const filtered = exams.filter((e) =>
    e.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.examType?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.classId?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container-fluid" style={{ backgroundColor: "#F8F9FA" }}>
      <div className="row align-items-center mb-4">
        <div className="col-md-5">
          <h1 className="fw-bold" style={{ color: "#1A3159" }}>Exam Schedule</h1>
          <p style={{ color: "#555" }}>View and manage examination dates</p>
        </div>
        <div className="col-md-3">
          <div className="input-group">
            <span className="input-group-text" style={{ backgroundColor: "#fff", borderColor: "#1A3159" }}><FaSearch /></span>
            <input type="text" className="form-control" placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={{ borderColor: "#1A3159" }} />
          </div>
        </div>
        <div className="col-md-2">
          <select className="form-select" value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)} style={{ borderColor: "#1A3159" }}>
            <option value="">All Classes</option>
            {classes.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
          </select>
        </div>
        {canEdit && (
          <div className="col-md-2 text-end">
            <button className="btn px-4 py-2" onClick={() => { setEditExam(null); setFormData(EMPTY_FORM); setShowModal(true); }}
              style={{ backgroundColor: "#EF7E20", color: "#fff", border: "none", borderRadius: "8px", fontWeight: "600" }}>
              <FaPlus className="me-2" /> Add Exam
            </button>
          </div>
        )}
      </div>

      <div className="card shadow-sm" style={{ border: "none" }}>
        <div className="card-header" style={{ backgroundColor: "#1A3159", color: "#fff" }}>
          <h5 className="mb-0">Examination Schedule</h5>
        </div>
        <div className="card-body p-0">
          <table className="table table-hover mb-0">
            <thead style={{ backgroundColor: "#E9ECEF", color: "#1A3159" }}>
              <tr><th>Sr.No</th><th>Class</th><th>Subject</th><th>Type</th><th>Date</th><th>Time</th><th>Marks</th>{canEdit && <th>Actions</th>}</tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={8} className="text-center text-muted py-4">No exams found. Add one above!</td></tr>
              ) : filtered.map((exam, i) => (
                <tr key={exam._id} className="align-middle">
                  <td>{i + 1}</td>
                  <td>{exam.classId?.name || "-"}</td>
                  <td><strong>{exam.subject}</strong></td>
                  <td><span className="badge" style={{ backgroundColor: "#1A3159" }}>{exam.examType}</span></td>
                  <td>{exam.examDate}</td>
                  <td>{exam.startTime && exam.endTime ? `${exam.startTime} - ${exam.endTime}` : exam.startTime || "-"}</td>
                  <td>{exam.totalMarks || "-"}</td>
                  {canEdit && (
                    <td>
                      <div className="d-flex gap-2">
                        <button className="btn btn-sm" onClick={() => handleEdit(exam)}
                          style={{ backgroundColor: "#EF7E20", color: "#fff", border: "none", borderRadius: "50%", width: "32px", height: "32px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <FaEdit />
                        </button>
                        <button className="btn btn-sm" onClick={() => handleDelete(exam._id)}
                          style={{ backgroundColor: "#1A3159", color: "#fff", border: "none", borderRadius: "50%", width: "32px", height: "32px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header style={{ backgroundColor: "#1A3159", color: "#fff" }}>
          <Modal.Title>{editExam ? "Edit Exam" : "Add Exam"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label" style={{ color: "#1A3159" }}>Class</label>
              <select className="form-select" value={formData.classId} onChange={(e) => setFormData({ ...formData, classId: e.target.value })} required style={{ borderColor: "#1A3159" }}>
                <option value="">-- Select Class --</option>
                {classes.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
              </select>
            </div>
            <div className="mb-3">
              <label className="form-label" style={{ color: "#1A3159" }}>Subject</label>
              <input type="text" className="form-control" value={formData.subject} onChange={(e) => setFormData({ ...formData, subject: e.target.value })} required style={{ borderColor: "#1A3159" }} />
            </div>
            <div className="mb-3">
              <label className="form-label" style={{ color: "#1A3159" }}>Exam Type</label>
              <select className="form-select" value={formData.examType} onChange={(e) => setFormData({ ...formData, examType: e.target.value })} required style={{ borderColor: "#1A3159" }}>
                <option value="">-- Select Type --</option>
                {EXAM_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div className="mb-3">
              <label className="form-label" style={{ color: "#1A3159" }}>Exam Date</label>
              <input type="date" className="form-control" value={formData.examDate} onChange={(e) => setFormData({ ...formData, examDate: e.target.value })} required style={{ borderColor: "#1A3159" }} />
            </div>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label" style={{ color: "#1A3159" }}>Start Time</label>
                <input type="time" className="form-control" value={formData.startTime} onChange={(e) => setFormData({ ...formData, startTime: e.target.value })} style={{ borderColor: "#1A3159" }} />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label" style={{ color: "#1A3159" }}>End Time</label>
                <input type="time" className="form-control" value={formData.endTime} onChange={(e) => setFormData({ ...formData, endTime: e.target.value })} style={{ borderColor: "#1A3159" }} />
              </div>
            </div>
            <div className="mb-3">
              <label className="form-label" style={{ color: "#1A3159" }}>Total Marks</label>
              <input type="number" className="form-control" value={formData.totalMarks} onChange={(e) => setFormData({ ...formData, totalMarks: e.target.value })} style={{ borderColor: "#1A3159" }} />
            </div>
            <div className="d-flex justify-content-end gap-2">
              <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
              <Button type="submit" style={{ backgroundColor: "#EF7E20", border: "none" }}>{editExam ? "Update" : "Add"} Exam</Button>
            </div>
          </form>
        </Modal.Body>
      </Modal>
    </div>
  );
}
