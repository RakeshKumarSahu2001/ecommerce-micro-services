import express from "express";
import cors from "cors";
import user from "./controllers/user.controller.js"
import ApiError from "./utils/ApiError.js";

export default async(app)=>{
    app.use(express.json());
    app.use(express.urlencoded());
    app.use(cors());

    user(app);

    app.use((err,req,res,next)=>{
        if(err instanceof ApiError){
            return res.status(err.status)
            .json({
                success:err.success,
                message:err.message,
                errors:err.error
            })
        }

        return res.status(500)
        .json({
            success:false,
            message:"Something went wrong...",
            errors:err
        })
    })
    
}