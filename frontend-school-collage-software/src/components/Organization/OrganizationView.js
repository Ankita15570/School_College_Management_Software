 
"use client";
import { Modal, Button } from "react-bootstrap";

export default function OrganizationView({ show, onHide, selectedEntry }) {
  if (!selectedEntry) return null;

  return (
    <Modal show={show} onHide={onHide} centered size="lg">
      <Modal.Header closeButton style={{ backgroundColor: "#1A3159", color: "#FFFFFF" }}>
        <Modal.Title>Organization Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h5>Name: {selectedEntry.name}</h5>
        <p><strong>Type:</strong> {selectedEntry.type}</p>
        <p><strong>Email:</strong> {selectedEntry.email}</p>
        <p><strong>Address:</strong> {selectedEntry.address || "N/A"}</p>
        <p><strong>Website:</strong> {selectedEntry.website || "N/A"}</p>
        <p><strong>Accreditation Body:</strong> {selectedEntry.accreditationBody || "N/A"}</p>
        <p><strong>NAAC Grade:</strong> {selectedEntry.naacGrade || "N/A"}</p>
        <p><strong>Academic Year:</strong> {selectedEntry.academicYear}</p>
        <p><strong>Contact Person:</strong> {selectedEntry.contactPerson?.fullName || "N/A"}</p>
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