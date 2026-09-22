 
"use client";
import { Modal, Button } from "react-bootstrap";

export default function TimeTableView({ show, onHide, selectedTimetable }) {
  return (
    <Modal show={show} onHide={onHide} centered size="lg">
      <Modal.Header
        style={{
          backgroundColor: "#1A3159",
          color: "#FFFFFF",
          borderRadius: "8px 8px 0 0",
        }}
      >
        <Modal.Title className="fw-bold">Timetable Details</Modal.Title>
        <Button
          variant="link"
          onClick={onHide}
          style={{
            color: "#FFFFFF",
            textDecoration: "none",
            fontSize: "1.5rem",
          }}
        >
          <i className="bi bi-x-lg"></i>
        </Button>
      </Modal.Header>
      <Modal.Body style={{ backgroundColor: "#FFFFFF", padding: "2rem" }}>
        {selectedTimetable && (
          <>
            <div className="text-center mb-4">
              <span
                className="badge bg-warning text-dark"
                style={{
                  fontSize: "1.2rem",
                  padding: "10px 20px",
                  backgroundColor: "#EF7E20",
                }}
              >
                Time Slot: {selectedTimetable.timeSlot}
              </span>
            </div>
            <div className="row g-3">
              <div className="col-md-6">
                <strong style={{ color: "#1A3159" }}>Monday:</strong>{" "}
                {selectedTimetable.monday || "-"}
              </div>
              <div className="col-md-6">
                <strong style={{ color: "#1A3159" }}>Tuesday:</strong>{" "}
                {selectedTimetable.tuesday || "-"}
              </div>
              <div className="col-md-6">
                <strong style={{ color: "#1A3159" }}>Wednesday:</strong>{" "}
                {selectedTimetable.wednesday || "-"}
              </div>
              <div className="col-md-6">
                <strong style={{ color: "#1A3159" }}>Thursday:</strong>{" "}
                {selectedTimetable.thursday || "-"}
              </div>
              <div className="col-md-6">
                <strong style={{ color: "#1A3159" }}>Friday:</strong>{" "}
                {selectedTimetable.friday || "-"}
              </div>
              <div className="col-md-6">
                <strong style={{ color: "#1A3159" }}>Saturday:</strong>{" "}
                {selectedTimetable.saturday || "-"}
              </div>
            </div>
          </>
        )}
      </Modal.Body>
    </Modal>
  );
}