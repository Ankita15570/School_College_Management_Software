 
"use client";
import { Modal, Button } from "react-bootstrap";

export default function EmployeeView({ show, onHide, employee }) {
  return (
    <Modal show={show} onHide={onHide} centered size="lg">
      <Modal.Header
        style={{
          backgroundColor: "#1A3159",
          color: "#FFFFFF",
          borderRadius: "8px 8px 0 0",
        }}
      >
        <Modal.Title className="fw-bold">Employee Details</Modal.Title>
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
        {employee && (
          <div className="row g-3">
            <div className="col-md-6">
              <strong style={{ color: "#1A3159" }}>Employee ID:</strong>{" "}
              {employee._id}
            </div>
            <div className="col-md-6">
              <strong style={{ color: "#1A3159" }}>Name:</strong>{" "}
              {employee.name}
            </div>
            <div className="col-md-6">
              <strong style={{ color: "#1A3159" }}>Email:</strong>{" "}
              {employee.email || "-"}
            </div>
            <div className="col-md-6">
              <strong style={{ color: "#1A3159" }}>Department:</strong>{" "}
              {employee.department || "-"}
            </div>
            <div className="col-md-6">
              <strong style={{ color: "#1A3159" }}>Role:</strong>{" "}
              <span
                className={(() => {
                  switch (employee.role) {
                    case "Principal":
                      return "badge bg-primary";
                    case "Management Staff":
                      return "badge bg-success";
                    case "Teacher":
                      return "badge bg-info";
                    case "Accountant":
                      return "badge bg-warning";
                    case "Clerk":
                      return "badge bg-secondary";
                    default:
                      return "badge bg-light text-dark";
                  }
                })()}
              >
                {employee.role || "-"}
              </span>
            </div>
            <div className="col-md-6">
              <strong style={{ color: "#1A3159" }}>Employee ID:</strong>{" "}
              {employee.employeeId || "-"}
            </div>
            <div className="col-md-6">
              <strong style={{ color: "#1A3159" }}>Designation:</strong>{" "}
              {employee.designation || "-"}
            </div>
            <div className="col-md-6">
              <strong style={{ color: "#1A3159" }}>Phone Number:</strong>{" "}
              {employee.phoneNumber || "-"}
            </div>
            <div className="col-md-6">
              <strong style={{ color: "#1A3159" }}>Date of Joining:</strong>{" "}
              {employee.dateOfJoining
                ? new Date(employee.dateOfJoining).toLocaleDateString()
                : "-"}
            </div>
          </div>
        )}
      </Modal.Body>
    </Modal>
  );
}