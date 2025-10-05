import pool from "../config/db.js";
import fs from "fs";
import path from "path";

export const createReport = async (req,res)=>{
    try{
        const {title,description,category,severity,location,status,user_id,latitude,longitude}=req.body;
        const image = req.file ? req.file.filename : null;

        // Validate required fields
        if (!title || !description || !category || !severity || !location || !user_id) {
            return res.status(400).json({ error: "Missing required fields" });
        }

         const newReport= await pool.query(
            `INSERT INTO reports 
            (title, description, category, severity, location, status, user_id, image_url, latitude, longitude)
            VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
            [title, description, category, severity, location, status || "pending", user_id, image, latitude || null, longitude || null]
        );
        res.status(201).json(newReport.rows[0]);
    } catch (error) {
        console.error("Error creating report:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

//list all reports
export const getReports= async (req,res)=>{
    try{
        const {status,location} = req.query;
        let query =`select * from reports where 1=1`;
        let values =[];

        if(status){
            values.push(status);
            query += ` and status = $${values.length}`;
        }
        if(location){
            values.push(location);
            query += `and location = $${values.length}`;
        }
        const result= await pool.query(query,values);
        res.json(result.rows);
    }
    catch(err){
        res.status(500).json({error: err.message});
    }
};

// get single report 
export const getReportbyId= async (req,res)=>{
    try{
        const {id }=req.params;
        const result= await pool.query(`select * from reports where id = $1`, [id]);
        if(result.rows.length === 0){
            return res.status(404).json({error: "Report not found"});
        }
        res.json(result.rows[0]);
    }
    catch(err){
        res.status(500).json({error: err.message});
    }
}

//update status of the report
export const updateReportStatus = async (req,res)=>{
    try{
        const {id}=req.params;
        const {status}=req.body;

        const updated= await pool.query(
            `update reports set status=$1 where id =$2 returning *`,
            [status, id]
        );
        if( updated.rows.length ===0){
           return res.status(404).json({error:"Report not found"});
        }
        res.json(updated.rows[0]);
    }
    catch(err){
        res.status(500).json({error:err.message});
    }
};

export const deleteReport =async (req,res)=>{
    try{
        const {id}=req.params;

        //Optional : delete image file from uploads folder 
        const report =await pool.query(`select * from reports where id =$1`,
            [id]
        );
        if(report.rows[0]?.image){
            fs.unlinkSync(path.join("uploads",report.rows[0].image));
        }

        const deleted= await pool.query(`delete from reports 
            where id =$1 returning *`,[id]);
        if(deleted.rows.length === 0){
            return res.status(404).json({message:"Report not found"});
        }
        res.json({message:"Report deleted successfully"});
    }
    catch(err){
        res.status(500).json({error: err.message});
    }
};
