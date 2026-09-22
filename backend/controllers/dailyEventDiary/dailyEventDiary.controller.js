const DailyEventDiary = require("../../models/DailyEventDiary/DailyEventDiary");

exports.getDiariesBySection = async (req, res) => {
  try {
    const entries = await DailyEventDiary.find({
      section: req.params.section,
      userId: req.user.id,
      organizationId: req.user.organizationId,
      academicYear : req.params.academicYear
    }).sort({ date: -1 });

    res.json(entries);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

exports.createOrUpdateDiaryEntry = async (req, res) => {
  const { date, entries, academicYear } = req.body;

  if (!date || !entries || !Array.isArray(entries)) {
    return res.status(400).json({ msg: "Date and entries array are required" });
  }

  try {
    let diaryEntry = await DailyEventDiary.findOne({
      date,
      academicYear,
      section: req.params.section,
      userId: req.user.id,
      organizationId: req.user.organizationId,
    });

    if (diaryEntry) {
      diaryEntry.entries.push(...entries);
      await diaryEntry.save();
    } else {
      diaryEntry = new DailyEventDiary({
        date,
        academicYear,
        section: req.params.section,
        userId: req.user.id,
        organizationId: req.user.organizationId,
        entries,
      });
      await diaryEntry.save();
    }

    res.json(diaryEntry);
  } catch (err) {
    console.error(err);
    if (err.code === 11000) {
      return res
        .status(400)
        .json({ msg: "Entry for this date and section already exists" });
    }
    res.status(500).send("Server Error");
  }
};

exports.updateSubEntry = async (req, res) => {
  const { date, subEntry, academicYear } = req.body;
  const subEntryIndex = parseInt(req.params.subEntryIndex);

  if (!date || !subEntry || isNaN(subEntryIndex)) {
    return res
      .status(400)
      .json({ msg: "Date, sub-entry, and valid sub-entry index are required" });
  }

  try {
    const diaryEntry = await DailyEventDiary.findOne({
      _id: req.params.id,
      section: req.params.section,
      userId: req.user.id,
      organizationId: req.user.organizationId,
      academicYear,
    });

    if (!diaryEntry) return res.status(404).json({ msg: "Entry not found" });

    if (subEntryIndex < 0 || subEntryIndex >= diaryEntry.entries.length) {
      return res.status(400).json({ msg: "Invalid sub-entry index" });
    }

    diaryEntry.entries[subEntryIndex] = subEntry;
    diaryEntry.date = date;
    await diaryEntry.save();

    res.json(diaryEntry);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

exports.deleteSubEntry = async (req, res) => {
  const subEntryIndex = parseInt(req.params.subEntryIndex);

  if (isNaN(subEntryIndex)) {
    return res.status(400).json({ msg: "Valid sub-entry index is required" });
  }

  try {
    const diaryEntry = await DailyEventDiary.findOne({
      _id: req.params.id,
      section: req.params.section,
      userId: req.user.id,
      organizationId: req.user.organizationId,
    });

    if (!diaryEntry) return res.status(404).json({ msg: "Entry not found" });

    if (subEntryIndex < 0 || subEntryIndex >= diaryEntry.entries.length) {
      return res.status(400).json({ msg: "Invalid sub-entry index" });
    }

    diaryEntry.entries.splice(subEntryIndex, 1);

    if (diaryEntry.entries.length === 0) {
      await DailyEventDiary.deleteOne({ _id: req.params.id });
    } else {
      await diaryEntry.save();
    }

    res.json({ msg: "Sub-entry deleted" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

exports.getAllDiaries = async (req, res) => {
  try {
    const userRole = req.user.role; // Assuming role is set by authentication middleware
    const organizationId = req.user.organizationId; // Assuming role is set by authentication middleware

    let query = {};
    if (userRole !== "SuperAdmin") {
      if (!organizationId) {
        return res.status(400).json({ error: "organizationId is required" });
      }
      query.organizationId = organizationId;
    }
      query.academicYear = req.params.academicYear;

    const diaries = await DailyEventDiary.find(query)
      .populate("userId", "name")
      .populate("organizationId", "name")
      .sort({ createdAt: -1 });

    res.set({
      "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
      Pragma: "no-cache",
      Expires: "0",
      "Surrogate-Control": "no-store",
    });

    res.json({ data: diaries, message: "Diaries fetched successfully" });
  } catch (error) {
    console.error(error.message);
    res.status(500).send(error.message);
  }
};
