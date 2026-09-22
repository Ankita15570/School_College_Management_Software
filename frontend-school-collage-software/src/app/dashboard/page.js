"use client";
import "bootstrap/dist/css/bootstrap.min.css";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { getToken } from "@/utils/auth";
import Link from "next/link";
import {
  FaUsers,
  FaChalkboardTeacher,
  FaFileAlt,
  FaBell,
  FaArrowRight,
  FaClock,
} from "react-icons/fa";
import { Line, Pie, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  ArcElement,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import "animate.css";
import { useSelector } from "react-redux";

ChartJS.register(
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  ArcElement,
  BarElement,
  Tooltip,
  Legend,
);

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  const { academicYear } = useSelector((state) => state.academicYear);

  const router = useRouter();

  const fetchUserInfo = async () => {
    try {
      const token = getToken();
      if (token) {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/get-user-info`,
          { headers: { "x-auth-token": token } },
        );
        setUser(res.data.data.user);
      }
    } catch (err) {
      console.error("Error fetching user role:", err);
    }
  };

  useEffect(() => {
    fetchUserInfo();
  }, []);
  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const token = getToken();
        if (!token) throw new Error("No token found");
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/dashboard?academicYear=${academicYear}`,
          {
            headers: { "x-auth-token": token },
          },
        );
        setDashboardData(res.data.data);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      }
    };
    fetchDashboard();
  }, [academicYear]);

  const stats = dashboardData?.stats || [];
  const recents = dashboardData?.recents || [];
  const topActivity = dashboardData?.topActivity || {
    name: "",
    details: "",
    date: "",
    href: "/dashboard",
  };
  const charts = dashboardData?.charts || [];
  const quickActions = dashboardData?.quickActions || [];
  const todaysEntries = dashboardData?.todaysEntries || [];

  return (
    <div
      className="container-fluid"
      style={{
        backgroundColor: "#F8F9FA",
        minHeight: "100vh",
        padding: "20px",
        paddingTop: "50px",
        marginTop: "10px",
      }}
      role="main"
      aria-label="Dashboard content"
    >
      {/* Header with Year Filter */}
      <div className="row mb-4 align-items-center text-center text-md-start">
        <div className="col-md-7 mb-3 mb-md-0">
          <h2 className="fw-bold" style={{ color: "#1A3159" }}>
            Hello, {user?.name || "User"}!
          </h2>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="row mb-4 g-4">
        {stats &&
          stats.map((stat, index) => (
            <div key={index} className="col-6 col-lg-3">
              <div
                className="card shadow-sm p-3 animate__animated animate__fadeIn"
                style={{
                  border: "none",
                  borderRadius: "12px",
                  backgroundColor: "#FFFFFF",
                }}
              >
                <div className="d-flex align-items-center flex-column flex-sm-row text-center text-sm-start">
                  {stat.icon === "FaUsers" && (
                    <FaUsers
                      size={30}
                      style={{
                        color: "#EF7E20",
                        marginBottom: "10px",
                        marginRight: "15px",
                      }}
                    />
                  )}
                  {stat.icon === "FaChalkboardTeacher" && (
                    <FaChalkboardTeacher
                      size={30}
                      style={{
                        color: "#EF7E20",
                        marginBottom: "10px",
                        marginRight: "15px",
                      }}
                    />
                  )}
                  {stat.icon === "FaFileAlt" && (
                    <FaFileAlt
                      size={30}
                      style={{
                        color: "#EF7E20",
                        marginBottom: "10px",
                        marginRight: "15px",
                      }}
                    />
                  )}
                  {stat.icon === "FaClock" && (
                    <FaClock
                      size={30}
                      style={{
                        color: "#EF7E20",
                        marginBottom: "10px",
                        marginRight: "15px",
                      }}
                    />
                  )}
                  <div>
                    <h6 style={{ color: "#1A3159" }}>{stat.label}</h6>
                    <p
                      className="fw-bold fs-4 mb-0"
                      style={{ color: "#EF7E20" }}
                    >
                      {typeof stat.value === "object"
                        ? `${stat.value.users} Users, Diaries :- ${stat.value.diaries} ,Timetables :- ${stat.value.timetables}  ,AQAR 
                      ;- ${stat.value.AQARCount} `
                        : stat.value}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
      </div>

      {/* Graphs */}
      <div className="row mb-4 g-4">
        {charts.map((chart, index) => (
          <div key={index} className="col-md-4">
            <div
              className="card shadow-sm animate__animated animate__fadeInUp"
              style={{
                border: "none",
                borderRadius: "12px",
                height: "300px",
                backgroundColor: "#FFFFFF",
              }}
            >
              <div
                className="card-header"
                style={{
                  backgroundColor: "#1A3159",
                  color: "#FFFFFF",
                  borderRadius: "12px 12px 0 0",
                }}
              >
                <h5 className="mb-0">{chart.title}</h5>
              </div>
              <div className="card-body p-2">
                {chart.type === "bar" && (
                  <Bar
                    data={chart.data}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: { position: "top" },
                        tooltip: {
                          callbacks: {
                            label: (context) =>
                              `${context.label}: ${context.raw}`,
                          },
                        },
                      },
                      scales: {
                        y: {
                          beginAtZero: true,
                          title: {
                            display: true,
                            text: chart.yLabel || "Count",
                          },
                        },
                        x: {
                          title: {
                            display: true,
                            text: chart.xLabel || "Category",
                          },
                        },
                      },
                      animation: { duration: 1500, easing: "easeInOutQuad" },
                    }}
                    height={250}
                  />
                )}
                {chart.type === "pie" && (
                  <Pie
                    data={chart.data}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: { position: "top" },
                        tooltip: {
                          callbacks: {
                            label: (context) =>
                              `${context.label}: ${context.raw}`,
                          },
                        },
                      },
                      animation: { duration: 1500, easing: "easeInOutQuad" },
                    }}
                    height={250}
                  />
                )}
                {chart.type === "line" && (
                  <Line
                    data={chart.data}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: { position: "top" },
                        tooltip: {
                          callbacks: {
                            label: (context) =>
                              `${context.label}: ${context.raw}`,
                          },
                        },
                      },
                      scales: {
                        y: {
                          beginAtZero: true,
                          title: {
                            display: true,
                            text: chart.yLabel || "Value",
                          },
                        },
                        x: {
                          title: {
                            display: true,
                            text: chart.xLabel || "Time",
                          },
                        },
                      },
                      animation: { duration: 1500, easing: "easeInOutQuad" },
                    }}
                    height={250}
                  />
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Today's Entries */}
      <div className="row mb-4 g-4">
        <div className="col-12">
          <div
            className="card shadow-sm animate__animated animate__fadeIn"
            style={{
              border: "none",
              borderRadius: "12px",
              backgroundColor: "#FFFFFF",
              borderTop: "4px solid #1A3159",
              boxShadow: "0 4px 12px rgba(26, 49, 89, 0.1)",
            }}
          >
            <div
              className="card-header"
              style={{
                background: "linear-gradient(90deg, #1A3159, #2A4A8A)",
                color: "#FFFFFF",
                borderRadius: "12px 12px 0 0",
                padding: "15px 20px",
                fontSize: "1.15rem",
              }}
            >
              <h5 className="mb-0">Todays Entries</h5>
            </div>
            <div className="card-body p-0">
              {todaysEntries.length > 0 ? (
                <div className="table-responsive">
                  <table className="table table-hover mb-0">
                    <thead
                      style={{ backgroundColor: "#F1F3F5", color: "#1A3159" }}
                    >
                      <tr>
                        <th
                          style={{
                            padding: "12px",
                            fontSize: "1rem",
                            fontWeight: "500",
                          }}
                        >
                          Section
                        </th>
                        <th
                          style={{
                            padding: "12px",
                            fontSize: "1rem",
                            fontWeight: "500",
                          }}
                        >
                          Time
                        </th>
                        <th
                          style={{
                            padding: "12px",
                            fontSize: "1rem",
                            fontWeight: "500",
                          }}
                        >
                          Topic
                        </th>
                        {user?.role === "SuperAdmin" && (
                          <th
                            style={{
                              padding: "12px",
                              fontSize: "1rem",
                              fontWeight: "500",
                            }}
                          >
                            Organization
                          </th>
                        )}
                        <th
                          style={{
                            padding: "12px",
                            fontSize: "1rem",
                            fontWeight: "500",
                          }}
                        >
                          User
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {todaysEntries.map((entry, index) => (
                        <tr
                          key={index}
                          style={{
                            backgroundColor:
                              index % 2 === 0 ? "#FFFFFF" : "#F8F9FA",
                          }}
                        >
                          <td
                            style={{
                              padding: "12px",
                              color: "#333",
                              fontSize: "0.95rem",
                            }}
                          >
                            {entry.section}
                          </td>
                          <td
                            style={{
                              padding: "12px",
                              color: "#666",
                              fontSize: "0.9rem",
                            }}
                          >
                            {new Date(entry.createdAt).toLocaleTimeString()}
                          </td>
                          <td
                            style={{
                              padding: "12px",
                              color: "#444",
                              fontSize: "0.95rem",
                            }}
                          >
                            {entry.entries[0]?.topic || "No topic"}
                          </td>
                          {user?.role === "SuperAdmin" && (
                            <td
                              style={{
                                padding: "12px",
                                color: "#444",
                                fontSize: "0.95rem",
                              }}
                            >
                              {entry.organizationId?.name || "N/A"}
                            </td>
                          )}
                          <td
                            style={{
                              padding: "12px",
                              color: "#444",
                              fontSize: "0.95rem",
                            }}
                          >
                            {entry.userId?.name || "N/A"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p
                  className="text-center p-4"
                  style={{
                    color: "#777",
                    fontSize: "1.1rem",
                    fontWeight: "300",
                  }}
                >
                  No entries added today.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="row mb-4 g-4">
        <div className="col-12">
          <div
            className="card shadow-sm animate__animated animate__fadeIn"
            style={{
              border: "none",
              borderRadius: "12px",
              backgroundColor: "#FFFFFF",
            }}
          >
            <div
              className="card-header"
              style={{
                backgroundColor: "#1A3159",
                color: "#FFFFFF",
                borderRadius: "12px 12px 0 0",
              }}
            >
              <h5 className="mb-0">Recent Activities</h5>
            </div>
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-hover mb-0">
                  <thead style={{ backgroundColor: "#E9ECEF", color: "#555" }}>
                    <tr>
                      <th scope="col">Type</th>
                      <th scope="col">Details</th>
                      <th scope="col">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recents.map((recent, index) => (
                      <tr
                        key={index}
                        className="animate__animated animate__fadeInUp"
                        style={{ animationDelay: `${index * 0.1}s` }}
                      >
                        <td>{recent.type}</td>
                        <td>
                          <p className="text-decoration-none text-info">
                            {recent.details}
                          </p>
                        </td>
                        <td>{recent.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Content */}
      <div className="row mb-4 g-4">
        {/* Top Activity */}
        <div className="col-md-4">
          <div
            className="card shadow-sm p-3 animate__animated animate__fadeIn"
            style={{
              border: "none",
              borderRadius: "12px",
              backgroundColor: "#FFFFFF",
              borderBottom: "3px solid #EF7E20",
              boxShadow: "0 2px 6px rgba(239, 126, 32, 0.1)",
            }}
          >
            <h5
              style={{
                color: "#1A3159",
                fontSize: "1.15rem",
                fontWeight: "500",
                paddingBottom: "8px",
                borderBottom: "1px solid #E9ECEF",
              }}
            >
              Recent Activity
            </h5>
            <p
              style={{
                color: "#333",
                fontSize: "1rem",
                margin: "10px 0",
                fontWeight: "400",
              }}
            >
              <strong>{topActivity.name}</strong>
            </p>
            <p style={{ color: "#444", fontSize: "0.9rem", margin: "8px 0" }}>
              Details:{" "}
              <span style={{ color: "#EF7E20" }}>{topActivity.details}</span>
            </p>
            <p style={{ color: "#444", fontSize: "0.9rem", margin: "8px 0" }}>
              Date: <span style={{ color: "#EF7E20" }}>{topActivity.date}</span>
            </p>
            <Link
              href={topActivity.href || "/dashboard"}
              className="text-decoration-none"
            >
              <small
                style={{
                  color: "#1A3159",
                  fontSize: "0.85rem",
                  fontWeight: "600",
                  textTransform: "uppercase",
                }}
              >
                View Details{" "}
                <FaArrowRight
                  className="ms-1"
                  style={{ verticalAlign: "middle" }}
                />
              </small>
            </Link>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="col-md-4 ">
          <div
            className="card shadow-sm p-3 animate__animated animate__fadeIn"
            style={{
              border: "none",
              borderRadius: "12px",
              backgroundColor: "#FFFFFF",
            }}
          >
            <h5 style={{ color: "#1A3159" }}>Quick Actions</h5>
            <div className="d-flex flex-wrap gap-3">
              {quickActions.map((action, index) => (
                <Link key={index} href={action.href}>
                  <button
                    className="btn py-2 px-4"
                    style={{
                      backgroundColor: action.color || "#EF7E20",
                      color: "#FFFFFF",
                      border: "none",
                      borderRadius: "8px",
                      fontWeight: "600",
                      transition: "all 0.3s",
                    }}
                    onMouseEnter={(e) =>
                      (e.target.style.backgroundColor =
                        action.hoverColor || "#FF9B50")
                    }
                    onMouseLeave={(e) =>
                      (e.target.style.backgroundColor =
                        action.color || "#EF7E20")
                    }
                    aria-label={`Navigate to ${action.label}`}
                  >
                    {action.label}
                  </button>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
