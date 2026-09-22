 
"use client";
import { Modal, Button } from "react-bootstrap";

export default function DailyEventDiaryView({ show, onHide, selectedEntry, section }) {
  return (
    <Modal show={show} onHide={onHide} centered size="lg">
      <Modal.Header
        style={{
          backgroundColor: "#1A3159",
          color: "#FFFFFF",
          borderRadius: "8px 8px 0 0",
        }}
      >
        <Modal.Title className="fw-bold">
          {section
            .split("-")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ")}{" "}
          Details - {selectedEntry?.date}
        </Modal.Title>
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
        {selectedEntry && (
          <div className="table-responsive">
            <table className="table table-bordered">
              <thead style={{ backgroundColor: "#E9ECEF", color: "#1A3159" }}>
                <tr>
                  {section === "daily" && (
                    <>
                      <th>Lecture No.</th>
                      <th>Class</th>
                      <th>Lecture/Time</th>
                      <th>Lecture/Practical</th>
                      <th>Topic</th>
                      <th>Attendance</th>
                    </>
                  )}
                  {section === "cie" && (
                    <>
                      <th>Class</th>
                      <th>Time</th>
                      <th>Oral/Written</th>
                    </>
                  )}
                  {section === "university-exam" && (
                    <>
                      <th>Details of Examination</th>
                      <th>Head, Exam Committee/SRPD Coordinator</th>
                      <th>Role</th>
                    </>
                  )}
                  {section === "record-field-work" && (
                    <>
                      <th>Program Name</th>
                      <th>Program Code</th>
                      <th>Title</th>
                    </>
                  )}
                  {section === "transfer-knowledge-events" && (
                    <>
                      <th>Title of the Event</th>
                      <th>Level</th>
                      <th>Co-curricular/Extra-Curricular</th>
                    </>
                  )}
                  {section === "extension-activities" && (
                    <>
                      <th>Title of Activity</th>
                      <th>NSS/On Campus/Off Campus/In Collaboration</th>
                    </>
                  )}
                  {section === "skill-development" && (
                    <>
                      <th>Title of the Course</th>
                      <th>Duration</th>
                      <th>No. of Students Admitted</th>
                    </>
                  )}
                  {section === "workshops-seminars" && (
                    <>
                      <th>Theme</th>
                      <th>University/State/National/International</th>
                      <th>Organised By</th>
                      <th>Paper Presentation</th>
                      <th>Role</th>
                    </>
                  )}
                  {section === "papers-published" && (
                    <>
                      <th>Title of the Paper</th>
                      <th>Name of Journal/Proceeding/Abstract & Pub. Year & Pg. No.</th>
                      <th>UGC Care Listed/Peer Reviewed</th>
                      <th>ISSN</th>
                      <th>Impact Factor</th>
                      <th>1st Author/Corresponding</th>
                    </>
                  )}
                  {section === "book-chapter" && (
                    <>
                      <th>Title of the Book/Chapter with Page nos.</th>
                      <th>National/International</th>
                      <th>ISBN</th>
                      <th>Publisher</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody>
                {selectedEntry.entries.map((subEntry, index) => (
                  <tr key={index}>
                    {section === "daily" && (
                      <>
                        <td>{subEntry.lectureNo}</td>
                        <td>{subEntry.class}</td>
                        <td>{subEntry.time}</td>
                        <td>{subEntry.type}</td>
                        <td>{subEntry.topic}</td>
                        <td>{subEntry.attendance}</td>
                      </>
                    )}
                    {section === "cie" && (
                      <>
                        <td>{subEntry.class}</td>
                        <td>{subEntry.time}</td>
                        <td>{subEntry.type}</td>
                      </>
                    )}
                    {section === "university-exam" && (
                      <>
                        <td>{subEntry.details}</td>
                        <td>{subEntry.head}</td>
                        <td>{subEntry.role}</td>
                      </>
                    )}
                    {section === "record-field-work" && (
                      <>
                        <td>{subEntry.programName}</td>
                        <td>{subEntry.programCode}</td>
                        <td>{subEntry.title}</td>
                      </>
                    )}
                    {section === "transfer-knowledge-events" && (
                      <>
                        <td>{subEntry.title}</td>
                        <td>{subEntry.level}</td>
                        <td>{subEntry.type}</td>
                      </>
                    )}
                    {section === "extension-activities" && (
                      <>
                        <td>{subEntry.title}</td>
                        <td>{subEntry.type}</td>
                      </>
                    )}
                    {section === "skill-development" && (
                      <>
                        <td>{subEntry.title}</td>
                        <td>{subEntry.duration}</td>
                        <td>{subEntry.studentsAdmitted}</td>
                      </>
                    )}
                    {section === "workshops-seminars" && (
                      <>
                        <td>{subEntry.theme}</td>
                        <td>{subEntry.level}</td>
                        <td>{subEntry.organisedBy}</td>
                        <td>{subEntry.paperPresentation}</td>
                        <td>{subEntry.role}</td>
                      </>
                    )}
                    {section === "papers-published" && (
                      <>
                        <td>{subEntry.title}</td>
                        <td>{subEntry.publicationDetails}</td>
                        <td>{subEntry.type}</td>
                        <td>{subEntry.issn}</td>
                        <td>{subEntry.impactFactor}</td>
                        <td>{subEntry.authorType}</td>
                      </>
                    )}
                    {section === "book-chapter" && (
                      <>
                        <td>{subEntry.title}</td>
                        <td>{subEntry.level}</td>
                        <td>{subEntry.isbn}</td>
                        <td>{subEntry.publisher}</td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Modal.Body>
    </Modal>
  );
}