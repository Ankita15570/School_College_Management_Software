 
"use client";
import { Modal, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

export default function StudentView({ show, onHide, student }) {
  if (!student) return null;

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header
        closeButton
        style={{ backgroundColor: "#1A3159", color: "#FFFFFF" }}
      >
        <Modal.Title>Student Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p><strong style={{ color: "#1A3159" }}>Student ID:</strong> {student._id}</p>
        <p><strong style={{ color: "#1A3159" }}>Name:</strong> {student.name}</p>
        <p><strong style={{ color: "#1A3159" }}>Email:</strong> {student.email || "-"}</p>
        <p><strong style={{ color: "#1A3159" }}>Class:</strong> {student.class || "-"}</p>
        <p><strong style={{ color: "#1A3159" }}>Roll Number:</strong> {student.rollNumber || "-"}</p>
        <p><strong style={{ color: "#1A3159" }}>Category:</strong> {student.category || "-"}</p>
        <p><strong style={{ color: "#1A3159" }}>Phone Number:</strong> {student.phoneNumber || "-"}</p>
        <p><strong style={{ color: "#1A3159" }}>Date of Birth:</strong> {student.dateOfBirth ? new Date(student.dateOfBirth).toLocaleDateString() : "-"}</p>
        <p><strong style={{ color: "#1A3159" }}>Address:</strong> {student.address || "-"}</p>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="secondary"
          onClick={onHide}
          style={{ backgroundColor: "#E9ECEF", color: "#1A3159" }}
        >
          Close
        </Button>
        <Button
          style={{
            backgroundColor: "#EF7E20",
            color: "#FFFFFF",
            border: "2px solid #FF9B50",
            borderRadius: "8px",
            fontWeight: "600",
            transition: "all 0.3s",
          }}
          onClick={() => {
            onHide();
            // Trigger edit modal from Student.jsx
            document.dispatchEvent(
              new CustomEvent("editStudent", { detail: student })
            );
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = "#FF9B50";
            e.target.style.borderColor = "#EF7E20";
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = "#EF7E20";
            e.target.style.borderColor = "#FF9B50";
          }}
        >
          Edit
        </Button>
      </Modal.Footer>
    </Modal>
  );
}