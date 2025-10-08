import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from 'url';
import authRoutes from "./routes/authRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";
import voteRoutes from "./routes/votesRoutes.js";
import commentsRoutes from "./routes/commentsRoutes.js";
import userRoutes from "./routes/userRoutes.js";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();
const app=express();

app.use(
    cors({
        origin: process.env.CLIENT_URL,
        credentials:true,
        methods:["GET","POST","PUT","DELETE"],
        allowedHeaders:["Content-Type","Authorization"],
    })
);

//middleware 
app.use(cors());
app.use(express.json());

// Serve uploaded images
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

//Routes
app.use("/auth",authRoutes);
app.use("/api",reportRoutes);
app.use("/api",voteRoutes);
app.use("/api",commentsRoutes);
app.use("/api/user", userRoutes);

app.get("/ping",(req,res)=>{
    res.send("message: \"pong\" ");
})

export default app;