import mongoose from "mongoose";

const voteSchema = new mongoose.Schema(
  {
    report: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Report",
      required: true
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    voteType: {
      type: String,
      enum: ["upvote", "downvote"],
      required: true
    }
  },
  { timestamps: true }
);

// Prevent multiple votes by same user on same report
voteSchema.index({ report: 1, user: 1 }, { unique: true });

export default mongoose.model("Vote", voteSchema);
