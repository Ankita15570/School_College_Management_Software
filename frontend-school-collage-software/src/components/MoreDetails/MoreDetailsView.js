 
"use client";
import { Modal, Button } from "react-bootstrap";

export default function MoreDetailsView({ show, onHide, selectedEntry, section }) {
  if (!selectedEntry) return null;

  return (
    <Modal show={show} onHide={onHide} centered size="lg">
      <Modal.Header
        style={{
          backgroundColor: "#1A3159",
          color: "#FFFFFF",
          borderRadius: "8px 8px 0 0",
        }}
      >
        <Modal.Title>
          {section
            .split("-")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ")} Details
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
        <h5>Date: {selectedEntry.date}</h5>
        <div className="table-responsive">
          <table className="table table-bordered">
            <thead>
              <tr>
                {section === "annual-teaching-plan" && (
                  <>
                    <th>Title</th>
                    <th>Description</th>
                    <th>PDF</th>
                  </>
                )}
                {section === "mentoring" && (
                  <>
                    <th>Class</th>
                    <th>No. of Mentees</th>
                    <th>PDF</th>
                  </>
                )}
                {section === "patents" && (
                  <>
                    <th>Title of IPR/Patent</th>
                    <th>Application No.</th>
                    <th>Publication Date</th>
                    <th>Approval Date</th>
                    <th>Valid Upto</th>
                    <th>PDF</th>
                  </>
                )}
                {section === "training" && (
                  <>
                    <th>Title</th>
                    <th>Duration</th>
                    <th>Organiser</th>
                    <th>PDF</th>
                  </>
                )}
                {section === "awards" && (
                  <>
                    <th>Title</th>
                    <th>Conferred By</th>
                    <th>PDF</th>
                  </>
                )}
                {section === "leave" && (
                  <>
                    <th>Date Range</th>
                    <th>Type</th>
                  </>
                )}
                {section === "invited-lectures" && (
                  <>
                    <th>Title of the Speech</th>
                    <th>Event</th>
                    <th>Organiser</th>
                    <th>Date</th>
                    <th>PDF</th>
                  </>
                )}
                {section === "research-project" && (
                  <>
                    <th>Title</th>
                    <th>Agency</th>
                    <th>Duration</th>
                    <th>Amount Mobilized</th>
                    <th>Status</th>
                    <th>PDF</th>
                  </>
                )}
                {section === "database-publications" && (
                  <>
                    <th>Title</th>
                    <th>Date</th>
                    <th>Domain</th>
                    <th>PDF</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody>
              {selectedEntry.entries.map((subEntry, index) => (
                <tr key={`${selectedEntry._id}-${index}`}>
                  {section === "annual-teaching-plan" && (
                    <>
                      <td>{subEntry.title}</td>
                      <td>{subEntry.description}</td>
                      <td>
                        {subEntry.pdf ? (
                          <a href={subEntry.pdf} target="_blank" rel="noopener noreferrer">
                            View PDF
                          </a>
                        ) : (
                          "No PDF"
                        )}
                      </td>
                    </>
                  )}
                  {section === "mentoring" && (
                    <>
                      <td>{subEntry.class}</td>
                      <td>{subEntry.mentees}</td>
                      <td>
                        {subEntry.pdf ? (
                          <a href={subEntry.pdf} target="_blank" rel="noopener noreferrer">
                            View PDF
                          </a>
                        ) : (
                          "No PDF"
                        )}
                      </td>
                    </>
                  )}
                  {section === "patents" && (
                    <>
                      <td>{subEntry.title}</td>
                      <td>{subEntry.applicationNo}</td>
                      <td>{subEntry.publicationDate}</td>
                      <td>{subEntry.approvalDate}</td>
                      <td>{subEntry.validUpto}</td>
                      <td>
                        {subEntry.pdf ? (
                          <a href={subEntry.pdf} target="_blank" rel="noopener noreferrer">
                            View PDF
                          </a>
                        ) : (
                          "No PDF"
                        )}
                      </td>
                    </>
                  )}
                  {section === "training" && (
                    <>
                      <td>{subEntry.title}</td>
                      <td>{subEntry.duration}</td>
                      <td>{subEntry.organiser}</td>
                      <td>
                        {subEntry.pdf ? (
                          <a href={subEntry.pdf} target="_blank" rel="noopener noreferrer">
                            View PDF
                          </a>
                        ) : (
                          "No PDF"
                        )}
                      </td>
                    </>
                  )}
                  {section === "awards" && (
                    <>
                      <td>{subEntry.title}</td>
                      <td>{subEntry.conferredBy}</td>
                      <td>
                        {subEntry.pdf ? (
                          <a href={subEntry.pdf} target="_blank" rel="noopener noreferrer">
                            View PDF
                          </a>
                        ) : (
                          "No PDF"
                        )}
                      </td>
                    </>
                  )}
                  {section === "leave" && (
                    <>
                      <td>{subEntry.dateRange}</td>
                      <td>{subEntry.type}</td>
                    </>
                  )}
                  {section === "invited-lectures" && (
                    <>
                      <td>{subEntry.title}</td>
                      <td>{subEntry.event}</td>
                      <td>{subEntry.organiser}</td>
                      <td>{subEntry.date}</td>
                      <td>
                        {subEntry.pdf ? (
                          <a href={subEntry.pdf} target="_blank" rel="noopener noreferrer">
                            View PDF
                          </a>
                        ) : (
                          "No PDF"
                        )}
                      </td>
                    </>
                  )}
                  {section === "research-project" && (
                    <>
                      <td>{subEntry.title}</td>
                      <td>{subEntry.agency}</td>
                      <td>{subEntry.duration}</td>
                      <td>{subEntry.amountMobilized}</td>
                      <td>{subEntry.status}</td>
                      <td>
                        {subEntry.pdf ? (
                          <a href={subEntry.pdf} target="_blank" rel="noopener noreferrer">
                            View PDF
                          </a>
                        ) : (
                          "No PDF"
                        )}
                      </td>
                    </>
                  )}
                  {section === "database-publications" && (
                    <>
                      <td>{subEntry.title}</td>
                      <td>{subEntry.date}</td>
                      <td>{subEntry.domain}</td>
                      <td>
                        {subEntry.pdf ? (
                          <a href={subEntry.pdf} target="_blank" rel="noopener noreferrer">
                            View PDF
                          </a>
                        ) : (
                          "No PDF"
                        )}
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Modal.Body>
      <Modal.Footer style={{ backgroundColor: "#FFFFFF" }}>
        <Button
          variant="secondary"
          onClick={onHide}
          style={{
            backgroundColor: "#6C757D",
            borderColor: "#6C757D",
            borderRadius: "8px",
          }}
        >
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}