"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  FaUser,
  FaSignOutAlt,
} from "react-icons/fa";
import { Navbar, Nav, Dropdown, Container, Image } from "react-bootstrap";
import axios from "axios";
import { getToken, removeToken } from "@/utils/auth";
import { useDispatch, useSelector } from "react-redux";
import { setUserInfo, clearUserInfo } from "@/redux/slices/userInfoSlice";
import { setAcademicYear } from "@/redux/slices/academicYearSlice";

export default function AuthNavbar() {
  const router = useRouter();
  const dispatch = useDispatch();

  const [role, setRole] = useState(null);
  const [organizationId, setOrganizationId] = useState(null);
  const [organizations, setOrganizations] = useState(null);

  const { academicYear } = useSelector((state) => state.academicYear);

  const handleLogout = () => {
    dispatch(clearUserInfo());
    removeToken();
    router.push("/");
  };

  const getRoleBadgeClass = (role) => {
    switch (role) {
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
  };

  const getOrganization = async (organizationId) => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/organizations/${organizationId}`,
        {
          headers: { "x-auth-token": getToken() },
        }
      );
      setOrganizations(response.data.data);
    } catch (err) {
      console.error("Error getting organization:", err);
    }
  };

  const fetchUser = async () => {
    try {
      const token = getToken();
      if (!token) return;
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/get-user-info`,
        { headers: { "x-auth-token": token } }
      );
      setOrganizationId(res.data.data.user.organizationId);
      setRole(res.data.data.user.role);
      if (res.data.data.user.organizationId) {
        await getOrganization(res.data.data.user.organizationId);
      }
    } catch (err) {
      console.error("Error fetching user:", err);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const handleAcademicYearChange = (e) => {
    dispatch(setAcademicYear(e.target.value));
  };

  const academicYears = [];
  for (let year = 2023; year < 2030; year++) {
    academicYears.push(`${year} - ${year + 1}`);
  }

  return (
    <Navbar
      id="auth-navbar"
      className="shadow-sm nav-bar-auth"
      style={{ backgroundColor: "#1A3159", minHeight: "56px", maxHeight: "56px" }}
      variant="dark"
    >
      <Container fluid>
        {/* Mobile View: Org Logo, Role, Profile Icon */}
        <div className="d-lg-none d-flex align-items-center justify-content-between w-100">
        
          <div className="d-flex align-items-center gap-3">
            <span className={`${getRoleBadgeClass(role)} fs-6 px-3 py-1`}>
              {role || "-"}
            </span>
            <Dropdown>
              <Dropdown.Toggle
                variant="link"
                id="dropdown-user"
                style={{
                  color: "#FFFFFF",
                  textDecoration: "none",
                  display: "flex",
                  alignItems: "center",
                  padding: "0.5rem",
                }}
              >
                <FaUser size={20} />
              </Dropdown.Toggle>
              <Dropdown.Menu
                align="end"
                style={{
                  backgroundColor: "#FFFFFF",
                  borderRadius: "8px",
                  boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                }}
              >
                <Dropdown.Item as="div">
                  <Link
                    href="/dashboard/profile"
                    className="dropdown-item"
                    style={{ color: "#1A3159", fontWeight: "500" }}
                  >
                    <FaUser className="me-2" /> Profile
                  </Link>
                </Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item
                  onClick={handleLogout}
                  style={{ color: "#1A3159", fontWeight: "500" }}
                >
                  <FaSignOutAlt className="me-2" /> Logout
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
          <select
              className="form-select"
              value={academicYear}
              onChange={handleAcademicYearChange}
              style={{
                borderColor: "#1A3159",
                borderRadius: "8px",
                color: "#1A3159",
                backgroundColor: "#FFFFFF",
                maxWidth: "160px",
                display: "inline-block",
              }}
            >
              {academicYears.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
        </div>

        {/* Web View: Full Nav with Links */}
        <div className="d-none d-lg-flex align-items-center w-100">
          <Link
            href="/dashboard"
            className="navbar-brand d-flex align-items-center px-3"
          >
             <span style={{ color: "#FFFFFF", fontWeight: "700", fontSize: "1.1rem" }}>{organizations?.name}</span>
          </Link>

          <div className="ms-auto align-items-center gap-3">
            <select
              className="form-select"
              value={academicYear}
              onChange={handleAcademicYearChange}
              style={{
                borderColor: "#1A3159",
                borderRadius: "8px",
                color: "#1A3159",
                backgroundColor: "#FFFFFF",
                maxWidth: "300px",
                display: "inline-block",
              }}
            >
              {academicYears.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
          <Nav className="ms-auto align-items-center gap-3">
            <span className={`${getRoleBadgeClass(role)} fs-6 px-3 py-1`}>
              {role || "-"}
            </span>
            <Dropdown>
              <Dropdown.Toggle
                variant="link"
                id="dropdown-user"
                style={{
                  color: "#FFFFFF",
                  textDecoration: "none",
                  display: "flex",
                  alignItems: "center",
                  padding: "0.5rem",
                }}
              >
                <FaUser size={20} className="me-2" />
                <span style={{ fontWeight: "500" }}>User</span>
              </Dropdown.Toggle>
              <Dropdown.Menu
                align="end"
                style={{
                  backgroundColor: "#FFFFFF",
                  borderRadius: "8px",
                  boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                }}
              >
                <Dropdown.Item as="div">
                  <Link
                    href="/dashboard/profile"
                    className="dropdown-item"
                    style={{ color: "#1A3159", fontWeight: "500" }}
                  >
                    <FaUser className="me-2" /> Profile
                  </Link>
                </Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item
                  onClick={handleLogout}
                  style={{ color: "#1A3159", fontWeight: "500" }}
                >
                  <FaSignOutAlt className="me-2" /> Logout
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Nav>
        </div>
      </Container>
    </Navbar>
  );
}