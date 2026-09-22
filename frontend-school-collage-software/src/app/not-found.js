 
"use client";
import "bootstrap/dist/css/bootstrap.min.css";
import { useRouter } from "next/navigation";
import { FaExclamationTriangle } from "react-icons/fa";

export default function NotFound() {
  const router = useRouter();

  return (
    <div
      className="container-fluid d-flex justify-content-center align-items-center"
      style={{ backgroundColor: "#F8F9FA", minHeight: "100vh" }}
    >
      <div className="card shadow-sm text-center" style={{ border: "none", maxWidth: "500px" }}>
        <div
          className="card-header"
          style={{ backgroundColor: "#1A3159", color: "#FFFFFF" }}
        >
          <h4 className="mb-0">Page Not Found</h4>
        </div>
        <div className="card-body">
          <FaExclamationTriangle
            size={60}
            color="#EF7E20"
            className="mb-3"
          />
          <h5 className="fw-bold" style={{ color: "#1A3159" }}>
            Oops! The page youre looking for doesnt exist.
          </h5>
          <p className="text-muted mb-4">
            It seems youve wandered off the path. Lets get you back home!
          </p>
          <button
            className="btn py-2 px-4 shadow-sm"
            style={{
              backgroundColor: "#EF7E20",
              color: "#FFFFFF",
              border: "2px solid #FF9B50",
              borderRadius: "8px",
              fontWeight: "600",
              transition: "all 0.3s",
            }}
            onClick={() => router.push("/")}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = "#FF9B50";
              e.target.style.borderColor = "#EF7E20";
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = "#EF7E20";
              e.target.style.borderColor = "#FF9B50";
            }}
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}