"use client";
import { useState, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";
import axios from "axios";
import { getToken } from "@/utils/auth";

export default function TimeTableForm({
  show,
  onHide,
  fetchTimetables,
  editTimetable,
  academicYear,
  userRole,
}) {
  const [formData, setFormData] = useState({
    timeSlot: "",
    monday: "",
    tuesday: "",
    wednesday: "",
    thursday: "",
    friday: "",
    saturday: "",
    class: "B.A. I AEC",
    targetUserId: "",
  });
  const [errors, setErrors] = useState({});
  const [teachers, setTeachers] = useState([]);

  const canSelectTeacher = ["SuperAdmin", "OrganizationAdmin", "Principal"].includes(userRole);

  useEffect(() => {
    if (canSelectTeacher && show) {
      axios
        .get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/teachers`, {
          headers: { "x-auth-token": getToken() },
        })
        .then((res) => {
          const list = res.data.data?.teachers || [];
          setTeachers(list);
        })
        .catch((err) => {
          console.error("Teachers fetch error:", err.response?.data || err.message);
          setTeachers([]);
        });
    }
  }, [show, canSelectTeacher]);

  useEffect(() => {
    if (editTimetable) {
      setFormData({
        timeSlot: editTimetable.timeSlot || "",
        monday: editTimetable.monday || "",
        tuesday: editTimetable.tuesday || "",
        wednesday: editTimetable.wednesday || "",
        thursday: editTimetable.thursday || "",
        friday: editTimetable.friday || "",
        saturday: editTimetable.saturday || "",
        class: editTimetable.class || "B.A. I AEC",
        targetUserId: editTimetable.userId || "",
      });
    } else {
      setFormData({
        timeSlot: "",
        monday: "",
        tuesday: "",
        wednesday: "",
        thursday: "",
        friday: "",
        saturday: "",
        class: "B.A. I AEC",
        targetUserId: "",
      });
    }
  }, [editTimetable]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.timeSlot) newErrors.timeSlot = "Time slot is required";
    if (!formData.class) newErrors.class = "Class is required";
    if (canSelectTeacher && !editTimetable && !formData.targetUserId)
      newErrors.targetUserId = "Please select a teacher";
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

    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const dayKeys = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];

    const data = {
      class: formData.class,
      academicYear,
      targetUserId: formData.targetUserId || undefined,
      schedule: days.map((day, i) => ({
        day,
        periods: [{
          time: formData.timeSlot,
          subject: formData[dayKeys[i]] || "off lecture",
          class: formData.class,
        }],
      })),
    };

    try {
      if (editTimetable) {
        await axios.put(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/timetables/${editTimetable._id}`,
          data,
          { headers: { "x-auth-token": getToken() } }
        );
      } else {
        await axios.post(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/timetables`,
          data,
          { headers: { "x-auth-token": getToken() } }
        );
      }
      fetchTimetables();
      onHide();
    } catch (err) {
      console.error("Error saving timetable:", err);
      setErrors({ submit: err.response?.data?.message || "Failed to save timetable" });
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header
        style={{ backgroundColor: "#1A3159", color: "#FFFFFF", borderRadius: "8px 8px 0 0" }}
      >
        <Modal.Title>{editTimetable ? "Edit Timetable" : "Add Timetable"}</Modal.Title>
        <Button variant="link" onClick={onHide} style={{ color: "#FFFFFF", textDecoration: "none" }}>
          <i className="bi bi-x-lg"></i>
        </Button>
      </Modal.Header>
      <Modal.Body style={{ backgroundColor: "#FFFFFF" }}>
        <form onSubmit={handleSubmit}>

          {/* Teacher select — only for Admin/Principal on Add, read-only on Edit */}
          {editTimetable ? (
            <div className="mb-3">
              <label className="form-label" style={{ color: "#1A3159" }}>Teacher Name</label>
              <input
                type="text"
                className="form-control"
                value={editTimetable.teacherName || ""}
                readOnly
                style={{ borderColor: "#1A3159", backgroundColor: "#f0f0f0", cursor: "not-allowed" }}
              />
            </div>
          ) : canSelectTeacher ? (
            <div className="mb-3">
              <label className="form-label" style={{ color: "#1A3159" }}>Select Teacher</label>
              <select
                className={`form-select ${errors.targetUserId ? "is-invalid" : ""}`}
                name="targetUserId"
                value={formData.targetUserId}
                onChange={handleChange}
                style={{ borderColor: "#1A3159" }}
              >
                <option value="">-- Select Teacher --</option>
                {teachers.map((t) => (
                  <option key={t._id} value={t._id}>{t.name}</option>
                ))}
              </select>
              {errors.targetUserId && <div className="invalid-feedback">{errors.targetUserId}</div>}
            </div>
          ) : null}

          <div className="mb-3">
            <label className="form-label" style={{ color: "#1A3159" }}>Time Slot</label>
            <select
              className={`form-select ${errors.timeSlot ? "is-invalid" : ""}`}
              name="timeSlot"
              value={formData.timeSlot}
              onChange={handleChange}
              style={{ borderColor: "#1A3159" }}
            >
              <option value="">Select Time Slot</option>
              {["7.40 - 8.40", "8.40 - 9.40", "10.00 - 11.00", "11.00 - 12.00", "12.00 - 1.00"].map((slot) => (
                <option key={slot} value={slot}>{slot}</option>
              ))}
            </select>
            {errors.timeSlot && <div className="invalid-feedback">{errors.timeSlot}</div>}
          </div>

          {["monday", "tuesday", "wednesday", "thursday", "friday", "saturday"].map((day) => (
            <div className="mb-3" key={day}>
              <label className="form-label" style={{ color: "#1A3159" }}>
                {day.charAt(0).toUpperCase() + day.slice(1)}
              </label>
              <input
                type="text"
                className="form-control"
                name={day}
                value={formData[day]}
                onChange={handleChange}
                placeholder="e.g., 9A(Science) or off lecture"
                style={{ borderColor: "#1A3159" }}
              />
            </div>
          ))}

          {errors.submit && <div className="alert alert-danger">{errors.submit}</div>}

          <Button
            type="submit"
            style={{
              backgroundColor: "#EF7E20",
              border: "none",
              borderRadius: "8px",
              padding: "10px 20px",
              fontWeight: "600",
            }}
          >
            {editTimetable ? "Update Timetable" : "Add Timetable"}
          </Button>
        </form>
      </Modal.Body>
    </Modal>
  );
}