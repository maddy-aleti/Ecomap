import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";
import voteRoutes from "./routes/votesRoutes.js";
import commentsRoutes from "./routes/commentsRoutes.js";

dotenv.config();
const app=express();

//middleware 
app.use(cors());
app.use(express.json());

//Routes
app.use("/auth",authRoutes);
app.use("/api",reportRoutes);
app.use("/api",voteRoutes);
app.use("/api",commentsRoutes);

app.get("/ping",(req,res)=>{
    res.send("message: \"pong\" ");
})

export default app;