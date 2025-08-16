import express from "express";
import {verifyToken} from "../middleware/authMiddleware.js";
import { voteOnReport } from "../controllers/votesController.js";

const router = express.Router();

router.post("/reports/:id/vote", verifyToken ,voteOnReport);

export default router;