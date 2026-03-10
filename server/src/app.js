import express from "express";
import cors from "cors";
import passport from "./config/passport.js";
// Routes
import authRoutes from "./routes/authRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import commentsRoutes from "./routes/commentsRoutes.js";
import votesRoutes from "./routes/votesRoutes.js";

const app = express();

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

// Middleware
app.use(express.json());

// Initialize Passport
app.use(passport.initialize());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/users", userRoutes);
app.use("/api", commentsRoutes);
app.use("/api", votesRoutes);

export default app;
