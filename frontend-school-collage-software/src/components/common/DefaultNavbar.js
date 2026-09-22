"use client";
import Link from "next/link";
import "bootstrap/dist/css/bootstrap.min.css";
import Image from "next/image";
import img1 from "./../../assets/images/logo.png";
export default function DefaultNavbar() {
  return (
    <nav
      className="navbar navbar-expand-lg shadow-sm py-5 hide-mobile"
      style={{ backgroundColor: "#1A3159", height: "70px " }}
    >
      <div className="container ">
        {/* Logo */}
        <Link href="/" className="navbar-brand d-flex align-items-center ">
          <Image src={img1} alt="Patil Software Hero Image" className="w-100" />
        </Link>

        {/* Toggler for mobile */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span
            className="navbar-toggler-icon"
            style={{ filter: "invert(1)" }}
          ></span>
        </button>

        {/* Navigation Links */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link
                href="/"
                className="nav-link px-3"
                style={{
                  color: "#FFFFFF",
                  fontWeight: "500",
                  transition: "color 0.3s",
                }}
                onMouseEnter={(e) => (e.target.style.color = "#EF7E20")}
                onMouseLeave={(e) => (e.target.style.color = "#FFFFFF")}
              >
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link
                href="/about"
                className="nav-link px-3"
                style={{
                  color: "#FFFFFF",
                  fontWeight: "500",
                  transition: "color 0.3s",
                }}
                onMouseEnter={(e) => (e.target.style.color = "#EF7E20")}
                onMouseLeave={(e) => (e.target.style.color = "#FFFFFF")}
              >
                About Us
              </Link>
            </li>
            <li className="nav-item">
              <Link
                href="/contact"
                className="nav-link px-3"
                style={{
                  color: "#FFFFFF",
                  fontWeight: "500",
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
      </div>
    </nav>
  );
}
