"use client";
import Link from "next/link";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaEnvelope,
  FaPhone,
} from "react-icons/fa";

export default function DefaultFooter() {
  return (
    <footer className="text-white py-5" style={{ backgroundColor: "#1A3159" }}>
      <div className="container">
        <div className="row g-4">
          {/* Brand Section */}
          <div className="col-md-4 text-center text-md-start">
            <h5 className="fw-bold mb-3" style={{ color: "#EF7E20" }}>
              Patil Software
            </h5>
            <p style={{ color: "#FFFFFF", fontSize: "0.95rem" }}>
              Simplifying billing and inventory management for small businesses.
            </p>
          </div>

          {/* Quick Links Section */}
          <div className="col-md-4 text-center">
            <h5 className="fw-bold mb-3" style={{ color: "#EF7E20" }}>
              Quick Links
            </h5>
            <ul className="list-unstyled">
              <li className="mb-2">
                <Link
                  href="/"
                  style={{
                    color: "#FFFFFF",
                    textDecoration: "none",
                    transition: "color 0.3s",
                  }}
                  onMouseEnter={(e) => (e.target.style.color = "#EF7E20")}
                  onMouseLeave={(e) => (e.target.style.color = "#FFFFFF")}
                >
                  Home
                </Link>
              </li>
              <li className="mb-2">
                <Link
                  href="/about"
                  style={{
                    color: "#FFFFFF",
                    textDecoration: "none",
                    transition: "color 0.3s",
                  }}
                  onMouseEnter={(e) => (e.target.style.color = "#EF7E20")}
                  onMouseLeave={(e) => (e.target.style.color = "#FFFFFF")}
                >
                  About Us
                </Link>
              </li>
              <li className="mb-2">
                <Link
                  href="/contact"
                  style={{
                    color: "#FFFFFF",
                    textDecoration: "none",
                    transition: "color 0.3s",
                  }}
                  onMouseEnter={(e) => (e.target.style.color = "#EF7E20")}
                  onMouseLeave={(e) => (e.target.style.color = "#FFFFFF")}
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info Section */}
          <div className="col-md-4 text-center text-md-end">
            <h5 className="fw-bold mb-3" style={{ color: "#EF7E20" }}>
              Get in Touch
            </h5>
            <p style={{ color: "#FFFFFF", fontSize: "0.95rem" }}>
              <FaEnvelope className="me-2" /> support@hariomsoftware.com
            </p>
            <p style={{ color: "#FFFFFF", fontSize: "0.95rem" }}>
              <FaPhone className="me-2" /> +1 (555) 123-4567
            </p>
            <div className="d-flex justify-content-center justify-content-md-end gap-3 mt-3">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "#FFFFFF", transition: "color 0.3s" }}
                onMouseEnter={(e) => (e.target.style.color = "#EF7E20")}
                onMouseLeave={(e) => (e.target.style.color = "#FFFFFF")}
              >
                <FaFacebook size={24} />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "#FFFFFF", transition: "color 0.3s" }}
                onMouseEnter={(e) => (e.target.style.color = "#EF7E20")}
                onMouseLeave={(e) => (e.target.style.color = "#FFFFFF")}
              >
                <FaTwitter size={24} />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "#FFFFFF", transition: "color 0.3s" }}
                onMouseEnter={(e) => (e.target.style.color = "#EF7E20")}
                onMouseLeave={(e) => (e.target.style.color = "#FFFFFF")}
              >
                <FaInstagram size={24} />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright Section */}
        <div className="row mt-4">
          <div className="col-12 text-center">
            <p style={{ color: "#FFFFFF", fontSize: "0.9rem", margin: 0 }}>
              © {new Date().getFullYear()} Patil Software. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
