const mongoose = require("mongoose");
const { TimeTable } = require("../../models/TimeTable/TimeTable");
const Organization = require("../../models/Organization/Organization");
const User = require("../../models/User/User");
const AQAR = require("../../models/AQAR/AQAR");
const HelpCenter = require("../../models/HelpCenter/HelpCenter");
const DailyEventDiary = require("../../models/DailyEventDiary/DailyEventDiary");

exports.getDashboardData = async (req, res) => {
  try {
    const userId = req.user.id;
    const role = req.user.role;
    const organizationId = req.user.organizationId;
    const academicYear =
      req.query.academicYear || new Date().getFullYear().toString(); // Default to current year

    let query = { academicYear };
    if (role !== "SuperAdmin" && organizationId)
      query.organizationId = organizationId;

    // Separate query without academicYear for User model (no academicYear field)
    let userQuery = {};
    if (role !== "SuperAdmin" && organizationId)
      userQuery.organizationId = organizationId;

    let stats = [];
    let charts = [];
    let recents = [];
    let topActivity = {
      name: "None",
      details: "No recent activity",
      date: "-",
      href: "/dashboard",
    };
    let quickActions = [];
    let userData = { name: req.user.name, organizationName: "Organization" , userRole :req.user.role  };
    let todaysEntries = [];

    // Fetch organization name for non-SuperAdmin roles
    if (role !== "SuperAdmin" && organizationId) {
      const org = await Organization.findById(organizationId).lean();
      userData.organizationName = org ? org.name : "Organization";
    }

    const sections = [
      "daily",
      "cie",
      "university-exam",
      "record-field-work",
      "transfer-knowledge-events",
      "extension-activities",
      "skill-development",
      "workshops-seminars",
      "papers-published",
      "book-chapter",
      "annual-teaching-plan",
      "mentoring",
      "patents",
      "training",
      "awards",
      "leave",
      "invited-lectures",
      "research-project",
      "database-publications",
    ];

    const sectionLabels = [
      "Daily",
      "CIE",
      "University Exam",
      "Record Field Work",
      "Transfer Knowledge Events",
      "Extension Activities",
      "Skill Development",
      "Workshops/Seminars",
      "Papers Published",
      "Book Chapter",
      "Annual Teaching Plan",
      "Mentoring",
      "Patents",
      "Training",
      "Awards",
      "Leave",
      "Invited Lectures",
      "Research Project",
      "Database Publications",
    ];

    const sectionColors = [
      "#EF7E20",
      "#2A4A8A",
      "#1A3159",
      "#FF5733",
      "#9B59B6",
      "#1ABC9C",
      "#F1C40F",
      "#E74C3C",
      "#3498DB",
      "#2ECC71",
      "#95A5A6",
      "#34495E",
      "#E67E22",
      "#BDC3C7",
      "#D35400",
      "#7F8C8D",
      "#8E44AD",
      "#27AE60",
      "#2980B9",
    ];

    // Count documents for each section
    const sectionCounts = await Promise.all(
      sections.map((section) =>
        DailyEventDiary.countDocuments({ userId, section, ...query })
      )
    );

    const timeTables = await TimeTable.find({ userId, ...query });

    const totalScheduledDays = timeTables.reduce((acc, tt) => {
      const validDayCount = tt.schedule.filter((day) => {
        const validPeriods = (day.periods || []).filter(
          (period) =>
            typeof period.subject === "string" &&
            period.subject.trim().toLowerCase() !== "off lecture"
        );
        return validPeriods.length > 0;
      }).length;

      return acc + validDayCount;
    }, 0);

    const allTimetables = await TimeTable.find({ userId, ...query });

    const daysOfWeek = [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];

    // Initialize period counts
    const periodCounts = {
      Monday: 0,
      Tuesday: 0,
      Wednesday: 0,
      Thursday: 0,
      Friday: 0,
      Saturday: 0,
    };

    // Aggregate valid periods per day
    allTimetables.forEach((tt) => {
      tt.schedule.forEach((day) => {
        if (periodCounts.hasOwnProperty(day.day)) {
          const validPeriods = (day.periods || []).filter(
            (period) =>
              typeof period.subject === "string" &&
              period.subject.trim().toLowerCase() !== "off lecture"
          );
          periodCounts[day.day] += validPeriods.length;
        }
      });
    });

    // Prepare data for chart
    const periodsData = daysOfWeek.map((day) => periodCounts[day]);
    switch (role) {
      case "SuperAdmin":
        const organizations = await Organization.find().lean();
        console.log(organizations, "organizations++");

        stats = await Promise.all(
          organizations.map(async (org) => {
            const users = await User.countDocuments({
              organizationId: org._id,
            });
            const diaries = await DailyEventDiary.countDocuments({
              organizationId: org._id,
              ...query,
            });
            const timetables = await TimeTable.countDocuments({
              organizationId: org._id,
              ...query,
            });

            const AQARCount = await AQAR.countDocuments({
              organizationId: org._id,
              ...query,
            });

            return {
              label: `Org: ${org.name}`,
              value: { users, diaries, timetables , AQARCount},
              icon: "FaUsers",
            };
          })
        );
        charts = [
          {
            type: "bar",
            title: "Users by Role",
            xLabel: "Role",
            yLabel: "Count",
            data: {
              labels: ["OrganizationAdmin", "Principal", "Faculty", "Teacher"],
              datasets: [
                {
                  label: "User Count",
                  data: await Promise.all([
                    User.countDocuments({ role: "OrganizationAdmin" }),
                    User.countDocuments({ role: "Principal" }),
                    User.countDocuments({ role: "Faculty" }),
                    User.countDocuments({ role: "Teacher" }),
                  ]),
                  backgroundColor: "#EF7E20",
                },
              ],
            },
          },
          {
            type: "pie",
            title: "Help Request Status",
            data: {
              labels: ["Open", "In Progress", "Resolved"],
              datasets: [
                {
                  data: [
                    await HelpCenter.countDocuments({
                      status: "Open",
                      ...query,
                    }),
                    await HelpCenter.countDocuments({
                      status: "In Progress",
                      ...query,
                    }),
                    await HelpCenter.countDocuments({
                      status: "Resolved",
                      ...query,
                    }),
                  ],
                  backgroundColor: ["#EF7E20", "#2A4A8A", "#1A3159"],
                },
              ],
            },
          },
          {
            type: "line",
            title: "Daily Events Across Organizations",
            xLabel: "Week",
            yLabel: "Event Count",
            data: {
              labels: ["Last Week", "This Week"],
              datasets: [
                {
                  label: "Events",
                  data: [
                    await DailyEventDiary.countDocuments({
                      createdAt: {
                        $gte: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
                        $lte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
                      },
                      ...query,
                    }),
                    await DailyEventDiary.countDocuments({
                      createdAt: {
                        $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
                      },
                      ...query,
                    }),
                  ],
                  borderColor: "#EF7E20",
                  backgroundColor: "rgba(239, 126, 32, 0.2)",
                  fill: true,
                },
              ],
            },
          },
        ];
        recents = (
          await AQAR.find(query).sort({ createdAt: -1 }).limit(5).lean()
        ).map((aqar) => ({
          type: "AQAR",
          details: `${aqar.title} (${aqar.academicYear})`,
          date: new Date(aqar.createdAt).toLocaleDateString(),
          href: `/dashboard/aqar/${aqar._id}`,
        }));
        const topAqar = await AQAR.findOne(query)
          .sort({ createdAt: -1 })
          .lean();
        if (topAqar) {
          topActivity = {
            name: `AQAR: ${topAqar.title}`,
            details: topAqar.description || "No description",
            date: new Date(topAqar.createdAt).toLocaleDateString(),
            href: `/dashboard/aqar/${topAqar._id}`,
          };
        }
        todaysEntries = await DailyEventDiary.find({
          ...query,
          createdAt: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) },
        })
          .populate("userId", "name")
          .populate("organizationId", "name")
          .lean();
        quickActions = [
          {
            label: "Manage Organizations",
            href: "/dashboard/organization",
            color: "#EF7E20",
            hoverColor: "#FF9B50",
          },
          {
            label: "Manage Users",
            href: "/dashboard/users",
            color: "#1A3159",
            hoverColor: "#2A4A8A",
          },
          {
            label: "View AQAR",
            href: "/dashboard/aqar",
            color: "#EF7E20",
            hoverColor: "#FF9B50",
          },
          {
            label: "View Timetables",
            href: "/dashboard/timetables",
            color: "#1A3159",
            hoverColor: "#2A4A8A",
          },
        ];
        break;

      case "OrganizationAdmin":
      case "Principal":
        stats = [
          {
            label: "Total Staff",
            value: await User.countDocuments({ organizationId }),
            icon: "FaUsers",
          },
          {
            label: "Total Event Diaries",
            value: await DailyEventDiary.countDocuments(query),
            icon: "FaChalkboardTeacher",
          },

          {
            label: "Timetables Created",
            value: await TimeTable.countDocuments(query),
            icon: "FaClock",
          },
          {
            label: "Total AQAR",
            value: await AQAR.countDocuments(query),
            icon: "FaClock",
          },
        ];
        charts = [
          {
            type: "pie",
            title: "Help Request Status",
            data: {
              labels: ["Open", "In Progress", "Resolved"],
              datasets: [
                {
                  data: [
                    await HelpCenter.countDocuments({
                      organizationId,
                      status: "Open",
                      ...query,
                    }),
                    await HelpCenter.countDocuments({
                      organizationId,
                      status: "In Progress",
                      ...query,
                    }),
                    await HelpCenter.countDocuments({
                      organizationId,
                      status: "Resolved",
                      ...query,
                    }),
                  ],
                  backgroundColor: ["#EF7E20", "#2A4A8A", "#1A3159"],
                },
              ],
            },
          },
          {
            type: "bar",
            title: "Teacher Workload",
            xLabel: "Teacher",
            yLabel: "Periods",
            data: {
              labels: await User.distinct("name", {
                organizationId,
                role: { $in: ["Faculty", "Teacher"] },
                ...query,
              }),
              datasets: [
                {
                  label: "Periods Assigned",
                  data: await Promise.all(
                    (
                      await User.distinct("_id", {
                        organizationId,
                        role: { $in: ["Faculty", "Teacher"] },
                      })
                    ).map(async (id) =>
                      (
                        await TimeTable.find({ userId: id, ...query })
                      ).reduce((sum, tt) => sum + tt.schedule.length, 0)
                    )
                  ),
                  backgroundColor: "#EF7E20",
                },
              ],
            },
          },
          {
            type: "line",
            title: "Daily Events by Organization",
            xLabel: "Week",
            yLabel: "Event Count",
            data: {
              labels: ["Last Week", "This Week"],
              datasets: [
                {
                  label: "Events",
                  data: [
                    await DailyEventDiary.countDocuments({
                      organizationId,
                      createdAt: {
                        $gte: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
                        $lte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
                      },
                      ...query,
                    }),
                    await DailyEventDiary.countDocuments({
                      organizationId,
                      createdAt: {
                        $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
                      },
                      ...query,
                    }),
                  ],
                  borderColor: "#EF7E20",
                  backgroundColor: "rgba(239, 126, 32, 0.2)",
                  fill: true,
                },
              ],
            },
          },
        ];
        recents = (
          await DailyEventDiary.find(query)
            .sort({ createdAt: -1 })
            .limit(5)
            .lean()
        ).map((event) => ({
          type: `Event: ${event.section}`,
          details: event.entries[0]?.topic || "Activity",
          date: event.date,
          href: `/dashboard/daily-events/${event._id}`,
        }));
        const topEvent = await DailyEventDiary.findOne(query)
          .sort({ createdAt: -1 })
          .lean();
        if (topEvent) {
          topActivity = {
            name: `Event: ${topEvent.section}`,
            details: topEvent.entries[0]?.topic || "Activity",
            date: topEvent.date,
            href: `/dashboard/daily-events/${topEvent._id}`,
          };
        }
        todaysEntries = await DailyEventDiary.find({
          organizationId,
          ...query,
          createdAt: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) },
        })
          .populate("userId", "name")
          .populate("organizationId", "name")
          .lean();
        quickActions = [
          {
            label: "Daily Events",
            href: "/dashboard/daily-events",
            color: "#1A3159",
            hoverColor: "#2A4A8A",
          },
          {
            label: "View AQAR",
            href: "/dashboard/aqar",
            color: "#EF7E20",
            hoverColor: "#FF9B50",
          },
          {
            label: "Manage Timetables",
            href: "/dashboard/timetables",
            color: "#1A3159",
            hoverColor: "#2A4A8A",
          },
          {
            label: "Help Center",
            href: "/dashboard/help-center",
            color: "#1A3159",
            hoverColor: "#2A4A8A",
          },
        ];
        break;

      case "Faculty":
      case "Teacher":
        stats = [
          {
            label: "Weekly Workload",
            value: totalScheduledDays,
            icon: "FaChalkboardTeacher",
          },
        ];
        charts = [
          {
            type: "line",
            title: "Daily Events Over Time",
            xLabel: "Week",
            yLabel: "Event Count",
            data: {
              labels: ["Last Week", "This Week"],
              datasets: [
                {
                  label: "Events",
                  data: [
                    await DailyEventDiary.countDocuments({
                      userId,
                      section: "daily",
                      createdAt: {
                        $gte: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
                        $lte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
                      },
                      ...query,
                    }),
                    await DailyEventDiary.countDocuments({
                      userId,
                      section: "daily",
                      createdAt: {
                        $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
                      },
                      ...query,
                    }),
                  ],
                  borderColor: "#EF7E20",
                  backgroundColor: "rgba(239, 126, 32, 0.2)",
                  fill: true,
                },
              ],
            },
          },
          {
            type: "bar",
            title: "Timetable Periods",
            xLabel: "Day",
            yLabel: "Periods",
            data: {
              labels: daysOfWeek,
              datasets: [
                {
                  label: "Periods",
                  data: periodsData,
                  backgroundColor: "#EF7E20",
                },
              ],
            },
          },
          {
            type: "pie",
            title: "Event Types",
            data: {
              labels: sectionLabels,
              datasets: [
                {
                  data: sectionCounts,
                  backgroundColor: sectionColors,
                },
              ],
            },
          },
        ];
        recents = (
          await DailyEventDiary.find({ userId, section: "daily", ...query })
            .sort({ createdAt: -1 })
            .limit(5)
            .lean()
        ).map((event) => ({
          type: "Daily Event",
          details: event.entries[0]?.topic || "Activity",
          date: event.date,
          href: `/dashboard/daily-events/${event._id}`,
        }));
        const topTeacherEvent = await DailyEventDiary.findOne({
          userId,
          section: "daily",
          ...query,
        })
          .sort({ createdAt: -1 })
          .lean();
        if (topTeacherEvent) {
          topActivity = {
            name: "Daily Event",
            details: topTeacherEvent.entries[0]?.topic || "Activity",
            date: topTeacherEvent.date,
            href: `/dashboard/daily-events/${topTeacherEvent._id}`,
          };
        }
        todaysEntries = await DailyEventDiary.find({
          userId,
          ...query,
          createdAt: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) },
        }).lean();
        quickActions = [
          {
            label: "Daily Events",
            href: "/dashboard/daily-events",
            color: "#1A3159",
            hoverColor: "#2A4A8A",
          },
          {
            label: "View Timetable",
            href: "/dashboard/timetables",
            color: "#EF7E20",
            hoverColor: "#FF9B50",
          },
          {
            label: "Submit Feedback",
            href: "/dashboard/feedback",
            color: "#EF7E20",
            hoverColor: "#FF9B50",
          },
        ];
        break;

      default:
        return res.status(403).json({ message: "Invalid role" });
    }

    const data = {
      stats,
      charts,
      recents,
      topActivity,
      quickActions,
      todaysEntries,
    };
    res.status(200).json({ user: userData, data });
  } catch (err) {
    console.log(err, "err");
    res.status(500).json({ message: err.message });
  }
};
