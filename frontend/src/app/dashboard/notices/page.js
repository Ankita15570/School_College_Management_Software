"use client";
import "bootstrap/dist/css/bootstrap.min.css";
import { useEffect, useState } from "react";
import axios from "axios";
import { FaPlus, FaEdit, FaTrash, FaBell } from "react-icons/fa";
import { Modal, Button, Badge } from "react-bootstrap";
import { getToken } from "@/utils/auth";
import { useSelector } from "react-redux";

const EMPTY_FORM = { title: "", description: "", deadline: "", targetRoles: ["All"] };
const ROLES = ["All", "Students", "Teacher", "Faculty", "Principal"];

export default function NoticesPage() {
  const [notices, setNotices] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editNotice, setEditNotice] = useState(null);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [userRole, setUserRole] = useState("");
  const { academicYear } = useSelector((s) => s.academicYear);

  const token = getToken();
  const headers = { "x-auth-token": token };

  useEffect(() => {
    if (token) {
      try { setUserRole(JSON.parse(atob(token.split(".")[1])).role); } catch {}
    }
  }, []);

  const fetchNotices = () => {
    axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/notices?academicYear=${academicYear}`, { headers })
      .then((r) => setNotices(r.data.data || [])).catch(() => {});
  };

  useEffect(() => { fetchNotices(); }, [academicYear]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editNotice) {
        await axios.put(`${process.env.NEXT_PUBLIC_API_BASE_URL}/notices/${editNotice._id}`, { ...formData, academicYear }, { headers });
      } else {
        await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/notices`, { ...formData, academicYear }, { headers });
      }
      fetchNotices();
      setShowModal(false);
      setEditNotice(null);
      setFormData(EMPTY_FORM);
    } catch (err) { console.error(err); }
  };

  const handleEdit = (notice) => {
    setEditNotice(notice);
    setFormData({ title: notice.title, description: notice.description, deadline: notice.deadline || "", targetRoles: notice.targetRoles || ["All"] });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this notice?")) return;
    await axios.delete(`${process.env.NEXT_PUBLIC_API_BASE_URL}/notices/${id}`, { headers });
    fetchNotices();
  };

  const toggleRole = (role) => {
    setFormData((prev) => ({
      ...prev,
      targetRoles: prev.targetRoles.includes(role)
        ? prev.targetRoles.filter((r) => r !== role)
        : [...prev.targetRoles, role],
    }));
  };

  const canEdit = ["Principal", "OrganizationAdmin", "Teacher", "Faculty"].includes(userRole);

  const isExpired = (deadline) => deadline && new Date(deadline) < new Date();

  return (
    <div className="container-fluid" style={{ backgroundColor: "#F8F9FA" }}>
      <div className="row align-items-center mb-4">
        <div className="col-md-8">
          <h1 className="fw-bold" style={{ color: "#1A3159" }}>Notices & Deadlines</h1>
          <p style={{ color: "#555" }}>Important announcements, deadlines and notices</p>
        </div>
        {canEdit && (
          <div className="col-md-4 text-end">
            <button className="btn px-4 py-2" onClick={() => { setEditNotice(null); setFormData(EMPTY_FORM); setShowModal(true); }}
              style={{ backgroundColor: "#EF7E20", color: "#fff", border: "none", borderRadius: "8px", fontWeight: "600" }}>
              <FaPlus className="me-2" /> Add Notice
            </button>
          </div>
        )}
      </div>

      <div className="row g-3">
        {notices.length === 0 ? (
          <div className="col-12 text-center text-muted py-5">No notices found.</div>
        ) : notices.map((notice) => (
          <div className="col-md-6 col-lg-4" key={notice._id}>
            <div className="card shadow-sm h-100" style={{ border: "none", borderLeft: `4px solid ${isExpired(notice.deadline) ? "#DC3545" : "#EF7E20"}` }}>
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <h5 className="fw-bold mb-0" style={{ color: "#1A3159" }}>
                    <FaBell className="me-2" style={{ color: "#EF7E20" }} />{notice.title}
                  </h5>
                  {canEdit && (
                    <div className="d-flex gap-1">
                      <button className="btn btn-sm" onClick={() => handleEdit(notice)}
                        style={{ backgroundColor: "#EF7E20", color: "#fff", border: "none", borderRadius: "50%", width: "28px", height: "28px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <FaEdit size={12} />
                      </button>
                      <button className="btn btn-sm" onClick={() => handleDelete(notice._id)}
                        style={{ backgroundColor: "#1A3159", color: "#fff", border: "none", borderRadius: "50%", width: "28px", height: "28px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <FaTrash size={12} />
                      </button>
                    </div>
                  )}
                </div>
                <p style={{ color: "#555", fontSize: "0.9rem" }}>{notice.description}</p>
                {notice.deadline && (
                  <p className="mb-1" style={{ fontSize: "0.85rem" }}>
                    <strong>Deadline:</strong>{" "}
                    <span style={{ color: isExpired(notice.deadline) ? "#DC3545" : "#28A745", fontWeight: "600" }}>
                      {notice.deadline} {isExpired(notice.deadline) ? "(Expired)" : ""}
                    </span>
                  </p>
                )}
                <div className="mt-2">
                  {(notice.targetRoles || []).map((r) => (
                    <Badge key={r} className="me-1" style={{ backgroundColor: "#1A3159" }}>{r}</Badge>
                  ))}
                </div>
                <p className="mt-2 mb-0" style={{ fontSize: "0.8rem", color: "#999" }}>
                  By: {notice.createdBy?.name || "—"} · {new Date(notice.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header style={{ backgroundColor: "#1A3159", color: "#fff" }}>
          <Modal.Title>{editNotice ? "Edit Notice" : "Add Notice"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label" style={{ color: "#1A3159" }}>Title</label>
              <input type="text" className="form-control" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required style={{ borderColor: "#1A3159" }} />
            </div>
            <div className="mb-3">
              <label className="form-label" style={{ color: "#1A3159" }}>Description</label>
              <textarea className="form-control" rows={3} value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} required style={{ borderColor: "#1A3159" }} />
            </div>
            <div className="mb-3">
              <label className="form-label" style={{ color: "#1A3159" }}>Deadline (optional)</label>
              <input type="date" className="form-control" value={formData.deadline} onChange={(e) => setFormData({ ...formData, deadline: e.target.value })} style={{ borderColor: "#1A3159" }} />
            </div>
            <div className="mb-3">
              <label className="form-label" style={{ color: "#1A3159" }}>Target Roles</label>
              <div className="d-flex flex-wrap gap-2">
                {ROLES.map((r) => (
                  <button type="button" key={r} onClick={() => toggleRole(r)}
                    className="btn btn-sm"
                    style={{ backgroundColor: formData.targetRoles.includes(r) ? "#1A3159" : "#E9ECEF", color: formData.targetRoles.includes(r) ? "#fff" : "#1A3159", border: "none", borderRadius: "20px" }}>
                    {r}
                  </button>
                ))}
              </div>
            </div>
            <div className="d-flex justify-content-end gap-2">
              <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
              <Button type="submit" style={{ backgroundColor: "#EF7E20", border: "none" }}>{editNotice ? "Update" : "Add"} Notice</Button>
            </div>
          </form>
        </Modal.Body>
      </Modal>
    </div>
  );
}
