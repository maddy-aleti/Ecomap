import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true
    },

    passwordHash: {
      type: String,
      required: function() {
        return this.authProvider === 'local';
      }
    },

    authProvider: {
      type: String,
      enum: ['local', 'google'],
      default: 'local'
    },

    googleId: {
      type: String,
      sparse: true,
      unique: true
    },

    role: {
      type: String,
      default: "citizen",
      enum: ["citizen", "admin"]
    },

    isEmailVerified: {
      type: Boolean,
      default: false
    },

    emailVerificationToken: {
      type: String
    },

    emailVerificationExpires: {
      type: Date
    }
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
