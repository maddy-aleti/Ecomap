import Vote from "../models/Vote.js";

/**
 * VOTE ON A REPORT
 */
export const voteOnReport = async (req, res) => {
  try {
    const reportId = req.params.id;
    const userId = req.user.id;
    const { vote_type } = req.body; // upvote | downvote

    if (!["upvote", "downvote"].includes(vote_type)) {
      return res.status(400).json({ error: "Invalid vote type" });
    }

    // Prevent duplicate vote
    const existingVote = await Vote.findOne({
      report: reportId,
      user: userId,
    });

    if (existingVote) {
      return res
        .status(400)
        .json({ error: "User has already voted on this report" });
    }

    // Record vote
    await Vote.create({
      report: reportId,
      user: userId,
      voteType: vote_type,
    });

    res.status(201).json({ message: "Vote recorded successfully" });
  } catch (error) {
    // Handles duplicate index race condition safely
    if (error.code === 11000) {
      return res
        .status(400)
        .json({ error: "User has already voted on this report" });
    }

    console.error("Vote error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * GET VOTES FOR A REPORT
 */
export const getReportVotes = async (req, res) => {
  try {
    const reportId = req.params.id;

    const votes = await Vote.find({ report: reportId }).select("voteType");

    res.json(votes);
  } catch (error) {
    console.error("Error fetching votes:", error);
    res.status(500).json({ error: "Failed to fetch votes" });
  }
};
