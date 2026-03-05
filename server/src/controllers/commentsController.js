import Comment from "../models/Comment.js";

/**
 * ADD COMMENT
 */
export const addComment = async (req, res) => {
  try {
    const reportId = req.params.id;
    const userId = req.user.id;
    const { comment } = req.body;

    if (!comment) {
      return res.status(400).json({ error: "Comment is required" });
    }

    await Comment.create({
      report: reportId,
      user: userId,
      comment
    });

    res.status(201).json({ message: "Comment added successfully" });

  } catch (error) {
    console.error("Add comment error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * GET COMMENTS FOR A REPORT
 */
export const getComments = async (req, res) => {
  try {
    const reportId = req.params.id;

    const comments = await Comment.find({ report: reportId })
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.json(comments);

  } catch (error) {
    console.error("Get comments error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
