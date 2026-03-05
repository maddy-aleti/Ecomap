import express from "express";
// Routes
import authRoutes from "./routes/authRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import commentsRoutes from "./routes/commentsRoutes.js";
import votesRoutes from "./routes/votesRoutes.js";
import cors from "cors";

const app = express();

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));


// Middleware
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/users", userRoutes);
app.use("/api", commentsRoutes);
app.use("/api", votesRoutes);

export default app;
