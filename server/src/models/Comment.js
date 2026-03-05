import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
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

    comment: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
);

export default mongoose.model("Comment", commentSchema);
