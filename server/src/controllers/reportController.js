import Report from "../models/Report.js";
import fs from "fs";
import path from "path";
import axios from "axios";
import { shouldEscalate } from "../utils/slaRules.js";
import { generateRTA } from "../services/slaService.js";


export const escalateIfSevere = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);

    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }

    if (!shouldEscalate(report)) {
      return res.status(200).json({
        escalated: false,
        message: "Severity score below escalation threshold",
        severity_score: report.severityScore
      });
    }

    // Call FastAPI SLA service
    const slaResponse = await generateRTA({
      location: report.location,
      upvotes: report.upvotes,
      severity_score: report.severityScore,
      severity_level: report.severityLevel,
      sla_hours: report.slaHours,
      sla_deadline: report.slaDeadline,
      title: report.title,
      description: report.description,
      category: report.category
    });

    report.escalation = {
      status: "escalated",
      severityScore: report.severityScore,
      rtaId: slaResponse.report_id,
      rtaReport: slaResponse.rta_report,
      escalatedAt: new Date()
    };

    await report.save();

    res.status(200).json({
      escalated: true,
      message: "Issue escalated due to high severity",
      rta: slaResponse
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * CREATE REPORT
 */
export const createReport = async (req, res) => {
  try {
    const {
      title,
      description,
      location,
      latitude,
      longitude
    } = req.body;

    const userId = req.user.id;
    const imageUrl = req.file ? req.file.filename : null;

    // 1️⃣ Create report FIRST (basic)
    let report = await Report.create({
      user: userId,
      title,
      description,
      location,
      latitude,
      longitude,
      imageUrl,
      status: "pending",
      aiProcessed: false
    });

    // 2️⃣ Call FastAPI AI service
    try {
      const aiResponse = await axios.post(
        "http://localhost:8000/analyze",
        {
          title,
          description,
          category: "general", // dummy, since FastAPI still expects it
          location
        }
      );

      const ai = aiResponse.data;

      // 3️⃣ Update report with AI data
      report.department = ai.department;
      report.severityLevel = ai.severity_level;
      report.severityScore = ai.severity_score;
      report.slaHours = ai.sla_hours;
      report.slaDeadline = new Date(ai.sla_deadline);
      report.flags = ai.flags || [];
      report.aiProcessed = true;

      await report.save();
    } catch (aiErr) {
      console.error("⚠️ FastAPI call failed:", aiErr.message);
      // We DO NOT fail the report creation
    }

    // 4️⃣ Return final report
    res.status(201).json(report);

  } catch (err) {
    console.error("Error creating report:", err);
    res.status(500).json({ error: "Failed to create report" });
  }
};


/**
 * GET ALL REPORTS (with filters)
 */
export const getReports = async (req, res) => {
  try {
    const { status, location } = req.query;

    const filter = {};
    if (status) filter.status = status;
    if (location) filter.location = location;

    const reports = await Report.find(filter)
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.json(reports);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * GET SINGLE REPORT BY ID
 */
export const getReportById = async (req, res) => {
  try {
    const { id } = req.params;

    const report = await Report.findById(id).populate("user", "name email");

    if (!report) {
      return res.status(404).json({ error: "Report not found" });
    }

    res.json(report);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * UPDATE REPORT STATUS
 */
export const updateReportStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const userId = req.user.id;

    const validStatuses = ["pending", "in_progress", "resolved"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    const report = await Report.findById(id);
    if (!report) {
      return res.status(404).json({ error: "Report not found" });
    }

    // Ownership or admin check
    if (
      report.user.toString() !== userId &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ error: "You can only update your own reports" });
    }

    report.status = status;
    await report.save();

    res.json(report);

  } catch (error) {
    console.error("Error updating report status:", error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * DELETE REPORT
 */
export const deleteReport = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const report = await Report.findById(id);
    if (!report) {
      return res.status(404).json({ error: "Report not found" });
    }

    // Ownership or admin check
    if (
      report.user.toString() !== userId &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ error: "You can only delete your own reports" });
    }

    // Delete image if exists
    if (report.imageUrl) {
      const imagePath = path.join("uploads", report.imageUrl);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await report.deleteOne();

    res.json({ message: "Report deleted successfully" });

  } catch (error) {
    console.error("Error deleting report:", error);
    res.status(500).json({ error: error.message });
  }
};
