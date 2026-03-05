import User from "../models/User.js";
import Report from "../models/Report.js";

/**
 * GET USER PROFILE
 */
export const getUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId).select(
      "name email role createdAt"
    );

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user);

  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * GET REPORTS CREATED BY USER
 */
export const getUserReports = async (req, res) => {
  try {
    const userId = req.user.id;

    const reports = await Report.find({ user: userId })
      .sort({ createdAt: -1 });

    res.json(reports);

  } catch (error) {
    console.error("Error fetching user reports:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * GET DASHBOARD STATS
 */
export const getDashboardStats = async (req, res) => {
  try {
    const userId = req.user.id;

    // User report statistics
    const stats = await Report.aggregate([
      { $match: { user: userId } },
      {
        $group: {
          _id: null,
          total_reports: { $sum: 1 },
          pending_reports: {
            $sum: { $cond: [{ $eq: ["$status", "pending"] }, 1, 0] }
          },
          in_progress_reports: {
            $sum: { $cond: [{ $eq: ["$status", "in_progress"] }, 1, 0] }
          },
          resolved_reports: {
            $sum: { $cond: [{ $eq: ["$status", "resolved"] }, 1, 0] }
          }
        }
      }
    ]);

    // Nearby issues (simplified global count)
    const nearbyIssues = await Report.countDocuments({
      status: { $ne: "resolved" }
    });

    res.json({
      userReports: stats[0] || {
        total_reports: 0,
        pending_reports: 0,
        in_progress_reports: 0,
        resolved_reports: 0
      },
      nearbyIssues
    });

  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
