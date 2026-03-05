import express from "express";
import {
  createReport,
  getReports,
  getReportById,
  updateReportStatus,
  deleteReport,
  escalateIfSevere
} from "../controllers/reportController.js";
import upload from "../middleware/upload.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/:id/escalate", escalateIfSevere);

// CREATE report
router.post("/", verifyToken, upload.single("image"), createReport);

// GET all reports
router.get("/", getReports);

// GET single report
router.get("/:id", getReportById);

// UPDATE report status
router.patch("/:id", verifyToken, updateReportStatus);

// DELETE report
router.delete("/:id", verifyToken, deleteReport);

export default router;
