import pool from "../config/db.js";

export const voteOnReport=async (req,res)=>{
    const reportId =req.params.id;
    const userId =req.user.id;
    const { vote_type } = req.body; // 'upvote' or 'downvote
    if(!['upvote', 'downvote'].includes(vote_type)){
        return res.status(400).json({error: "Invalid vote type"});
    }

    // Prevent duplicate votes by the same user on the same report 
    const existing = await pool.query(
        "select * from votes where report_id=$1 and user_id=$2",
        [reportId, userId]
    )

    if(existing.rows.length > 0){
        return res.status(400).json({error: "User has already voted on this report"});
    }
     

    // record the new vote
    await pool.query(
        "insert into votes (report_id,user_id,vote_type) values($1,$2,$3)",
        [reportId, userId, vote_type]
    );

    res.status(201).json({message: "Vote recorded successfully"});
}