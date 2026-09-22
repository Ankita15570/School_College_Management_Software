"use client";
import { Modal, Button } from "react-bootstrap";
import { FaDownload } from "react-icons/fa";

export default function AQARView({ show, onHide, selectedEntry, section }) {
  if (!selectedEntry) return null;

  return (
    <Modal show={show} onHide={onHide} centered size="lg">
      <Modal.Header closeButton style={{ backgroundColor: "#1A3159", color: "#FFFFFF" }}>
        <Modal.Title>
          {section === "part-a" 
            ? "Part A: Extended Profile"
            : `Part B: Criterion ${section.split("-")[1].toUpperCase()}`}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p><strong>Title:</strong> {selectedEntry.title}</p>
        <p><strong>Academic Year:</strong> {selectedEntry.academicYear || 'N/A'}</p>
        
        {selectedEntry.media && selectedEntry.media.url && (
          <div>
            <p><strong>Document:</strong></p>
            <a
              href={selectedEntry.media.url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-sm"
              style={{
                backgroundColor: "#28A745",
                color: "#FFFFFF",
                border: "none",
                borderRadius: "8px",
              }}
            >
              <FaDownload className="me-2" /> Download Document
            </a>
          </div>
        )}
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