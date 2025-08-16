import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import reportRoutes from "./routes/reportRoutes.js";

dotenv.config();

const app=express();

//middleware 
app.use(cors());
app.use(express.json());

//Routes
app.use("/auth",authRoutes);
app.use("/api",reportRoutes);

app.get("/ping",(req,res)=>{
    res.send("message: \"pong\" ");
})

export default app;