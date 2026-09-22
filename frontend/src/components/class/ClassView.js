 
"use client";
import { Modal, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

export default function ClassView({ show, onHide, classData }) {
  if (!classData) return null;

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header
        closeButton
        style={{ backgroundColor: "#1A3159", color: "#FFFFFF" }}
      >
        <Modal.Title>Class Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p><strong style={{ color: "#1A3159" }}>Class ID:</strong> {classData._id}</p>
        <p><strong style={{ color: "#1A3159" }}>Name:</strong> {classData.name}</p>
        <p><strong style={{ color: "#1A3159" }}>Academic Year:</strong> {classData.academicYear}</p>
        <p><strong style={{ color: "#1A3159" }}>Teacher:</strong> {classData.teacherName || "-"}</p>
        <p><strong style={{ color: "#1A3159" }}>Student Count:</strong> {classData.studentCount || 0}</p>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="secondary"
          onClick={onHide}
          style={{ backgroundColor: "#6C757D", border: "none" }}
        >
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}