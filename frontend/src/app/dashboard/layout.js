import ProtectedRoute from "@/components/common/ProtectedRoute";
import AuthNavbar from "../../components/common/AuthNavbar";
import Sidebar from "@/components/common/SideBar";
import "bootstrap/dist/css/bootstrap.min.css";

export default function DashboardLayout({ children }) {
  return (
    <ProtectedRoute>
      <style>{`
        .dashboard-main { margin-left: 280px; padding-top: 80px !important; }
        @media (max-width: 767px) {
          .dashboard-main { margin-left: 0 !important; margin-bottom: 70px !important; padding-top: 50px !important; }
        }
      `}</style>
      <div
        className="d-flex flex-column min-vh-100"
        style={{ backgroundColor: "#FFFFFF" }}
      >
        <AuthNavbar />
        <div className="d-flex flex-grow-1">
          <Sidebar />
          <main
            className="flex-grow-1 p-3 p-md-4 dashboard-main"
            style={{
              backgroundColor: "#F8F9FA",
              minHeight: "calc(100vh - 56px)",
              overflowY: "auto",
            }}
          >
            {children}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
