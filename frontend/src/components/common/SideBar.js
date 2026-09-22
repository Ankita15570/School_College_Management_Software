"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  FaTachometerAlt, FaCalendarAlt, FaInfoCircle, FaClock,
  FaUserTie, FaLifeRing, FaComment, FaSignOutAlt,
  FaBars, FaTimes, FaUser, FaCommentDots,
  FaUserGraduate, FaClipboardList, FaFileAlt, FaBell,
} from "react-icons/fa";
import { motion } from "framer-motion";
import { getToken, removeToken } from "@/utils/auth";
import { useRouter } from "next/navigation";

const LOGOUT_TAB = { icon: FaSignOutAlt, label: "Logout", href: null };

const ALL_SECTIONS = [
  {
    section: "General",
    tabs: [
      { href: "/dashboard", icon: FaTachometerAlt, label: "Dashboard" },
      { href: "/dashboard/dailyEvent", icon: FaCalendarAlt, label: "Daily Diary" },
      { href: "/dashboard/moredetails", icon: FaInfoCircle, label: "More Diary" },
    ],
  },
  {
    section: "Academic Management",
    tabs: [
      { href: "/dashboard/viewtimetable", icon: FaClock, label: "View Timetable" },
      { href: "/dashboard/timetable", icon: FaClock, label: "Timetable" },
      { href: "/dashboard/attendance", icon: FaClipboardList, label: "Attendance" },
      { href: "/dashboard/examinations", icon: FaFileAlt, label: "Exam Schedule" },
      { href: "/dashboard/notices", icon: FaBell, label: "Notices" },
    ],
  },
  {
    section: "Administration",
    tabs: [
      { href: "/dashboard/employees", icon: FaUserTie, label: "Employees" },
      { href: "/dashboard/students", icon: FaUserGraduate, label: "Students" },
    ],
  },
  {
    section: "Support",
    tabs: [
      { href: "/dashboard/profile", icon: FaUser, label: "Profile" },
      { href: "/dashboard/helpcenter", icon: FaLifeRing, label: "Help Center" },
      { href: "/dashboard/feedback", icon: FaComment, label: "Feedback" },
      LOGOUT_TAB,
    ],
  },
];

const ROLE_ALLOWED = {
  SuperAdmin: [
    "/dashboard",
    "/dashboard/viewtimetable",
    "/dashboard/ViewDailyEventDiary",
    "/dashboard/employees",
    "/dashboard/students",
    "/dashboard/attendance",
    "/dashboard/examinations",
    "/dashboard/notices",
    "/dashboard/profile",
    "/dashboard/SuperAdminFeedback",
    "/dashboard/SuperAdminHelpCenter",
    null,
  ],
  OrganizationAdmin: [
    "/dashboard",
    "/dashboard/viewtimetable",
    "/dashboard/timetable",
    "/dashboard/ViewDailyEventDiary",
    "/dashboard/employees",
    "/dashboard/students",
    "/dashboard/attendance",
    "/dashboard/examinations",
    "/dashboard/notices",
    "/dashboard/profile",
    "/dashboard/helpcenter",
    "/dashboard/feedback",
    null,
  ],
  Principal: [
    "/dashboard",
    "/dashboard/dailyEvent",
    "/dashboard/moredetails",
    "/dashboard/viewtimetable",
    "/dashboard/timetable",
    "/dashboard/ViewDailyEventDiary",
    "/dashboard/employees",
    "/dashboard/students",
    "/dashboard/attendance",
    "/dashboard/examinations",
    "/dashboard/notices",
    "/dashboard/profile",
    "/dashboard/helpcenter",
    "/dashboard/feedback",
    null,
  ],
  Faculty: [
    "/dashboard",
    "/dashboard/dailyEvent",
    "/dashboard/moredetails",
    "/dashboard/timetable",
    "/dashboard/attendance",
    "/dashboard/examinations",
    "/dashboard/notices",
    "/dashboard/profile",
    "/dashboard/helpcenter",
    "/dashboard/feedback",
    null,
  ],
  Teacher: [
    "/dashboard",
    "/dashboard/dailyEvent",
    "/dashboard/moredetails",
    "/dashboard/timetable",
    "/dashboard/attendance",
    "/dashboard/examinations",
    "/dashboard/notices",
    "/dashboard/profile",
    "/dashboard/helpcenter",
    "/dashboard/feedback",
    null,
  ],
};

const EXTRA_TABS = {
  SuperAdmin: [
    { section: "Support", tab: { href: "/dashboard/SuperAdminFeedback", icon: FaCommentDots, label: "View Feedback" } },
    { section: "Support", tab: { href: "/dashboard/SuperAdminHelpCenter", icon: FaLifeRing, label: "View Help Center" } },
  ],
  OrganizationAdmin: [
    { section: "General", tab: { href: "/dashboard/ViewDailyEventDiary", icon: FaInfoCircle, label: "View Daily Diary" } },
  ],
  Principal: [
    { section: "General", tab: { href: "/dashboard/ViewDailyEventDiary", icon: FaInfoCircle, label: "View Daily Diary" } },
  ],
};

function getTabsForRole(role) {
  const allowed = ROLE_ALLOWED[role];
  if (!allowed) return ALL_SECTIONS;

  const sections = ALL_SECTIONS.map((section) => ({
    ...section,
    tabs: section.tabs.filter((tab) => allowed.includes(tab.href)),
  }));

  const extras = EXTRA_TABS[role] || [];
  extras.forEach(({ section: sectionName, tab }) => {
    const sec = sections.find((s) => s.section === sectionName);
    if (sec && !sec.tabs.find((t) => t.href === tab.href)) {
      sec.tabs.push(tab);
    }
  });

  return sections.filter((s) => s.tabs.length > 0);
}

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const [isMobile, setIsMobile] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getToken();
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        setRole(payload.role);
      } catch {}
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) setShowMore(false);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    document.body.style.overflow = showMore && isMobile ? "hidden" : "auto";
  }, [showMore, isMobile]);

  const handleLogout = () => { removeToken(); router.push("/"); };

  const getLinkClass = (href) =>
    pathname === href
      ? "d-flex align-items-center text-white p-3 mb-1 rounded active-link"
      : "d-flex align-items-center text-white p-3 mb-1 rounded inactive-link";

  const mainTabs = getTabsForRole(role);

  const renderTab = (tab, tabIndex, sectionIndex) => (
    <motion.div
      key={tab.href || tab.label}
      className="sidebar-tab"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: sectionIndex * 0.1 + tabIndex * 0.05 }}
    >
      {tab.href ? (
        <Link
          href={tab.href}
          className={getLinkClass(tab.href)}
          style={{ textDecoration: "none", fontSize: "0.95rem" }}
          aria-current={pathname === tab.href ? "page" : undefined}
        >
          <tab.icon className="me-3" size={20} />
          {tab.label}
        </Link>
      ) : (
        <div
          onClick={handleLogout}
          className="d-flex align-items-center text-white p-3 mb-1 rounded inactive-link"
          style={{ cursor: "pointer", fontSize: "0.95rem" }}
        >
          <tab.icon className="me-3" size={20} />
          {tab.label}
        </div>
      )}
    </motion.div>
  );

  const sidebarContent = (
    <nav className="h-100 d-flex flex-column">
      {loading ? (
        <div className="text-white text-center p-4">Loading...</div>
      ) : (
        mainTabs.map((section, sIndex) => (
          <div key={section.section}>
            <div className="section-header">{section.section}</div>
            {section.tabs.map((tab, tIndex) => renderTab(tab, tIndex, sIndex))}
          </div>
        ))
      )}
    </nav>
  );

  return (
    <>
      <style>{`
        .active-link { background: #ef7e20 !important; font-weight: 700; box-shadow: 0 3px 10px rgba(239,126,32,0.4); border-radius: 10px; }
        .inactive-link:hover { background: rgba(255,255,255,0.15); transform: translateX(5px); transition: all 0.2s ease; }
        .sidebar-tab { transition: all 0.2s ease; }
        .section-header { color: rgba(255,255,255,0.7); font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 1.2px; padding: 10px 12px 6px; margin-top: 8px; }
      `}</style>

      {!isMobile && (
        <motion.aside
          initial={{ x: -280 }}
          animate={{ x: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          style={{
            position: "fixed", top: "56px", left: 0, zIndex: 999,
            width: "280px",
            background: "linear-gradient(180deg, #1A3159 0%, #2A4A8A 100%)",
            overflowY: "auto", height: "calc(100vh - 56px)", padding: "12px",
          }}
          role="navigation"
          aria-label="Main navigation"
        >
          {sidebarContent}
        </motion.aside>
      )}

      {isMobile && (
        <div
          style={{
            position: "fixed", bottom: 0, left: 0, width: "100%",
            background: "#1A3159", zIndex: 1000, height: "60px",
            display: "flex", alignItems: "center", justifyContent: "space-around",
          }}
          role="navigation"
        >
          {mainTabs[0]?.tabs.slice(0, 4).map((tab) =>
            tab.href ? (
              <Link key={tab.href} href={tab.href}
                style={{ textDecoration: "none", color: pathname === tab.href ? "#EF7E20" : "#fff", textAlign: "center", flex: 1 }}
              >
                <div className="d-flex flex-column align-items-center">
                  <tab.icon size={20} />
                  <small style={{ fontSize: "0.65rem" }}>{tab.label.slice(0, 8)}</small>
                </div>
              </Link>
            ) : null
          )}
          <div onClick={() => setShowMore(true)}
            style={{ cursor: "pointer", color: "#fff", textAlign: "center", flex: 1 }}
          >
            <div className="d-flex flex-column align-items-center">
              <FaBars size={20} />
              <small style={{ fontSize: "0.65rem" }}>More</small>
            </div>
          </div>
        </div>
      )}

      {isMobile && showMore && (
        <>
          <div onClick={() => setShowMore(false)}
            style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 1040 }}
          />
          <motion.div
            initial={{ x: "100%" }} animate={{ x: 0 }} transition={{ duration: 0.3 }}
            style={{
              position: "fixed", top: 0, right: 0, height: "100%", width: "80%", maxWidth: "300px",
              background: "linear-gradient(180deg, #1A3159 0%, #2A4A8A 100%)",
              zIndex: 1050, overflowY: "auto", padding: "12px",
            }}
          >
            <div className="d-flex justify-content-end p-2">
              <FaTimes size={22} className="text-white" style={{ cursor: "pointer" }} onClick={() => setShowMore(false)} />
            </div>
            {sidebarContent}
          </motion.div>
        </>
      )}
    </>
  );
}
