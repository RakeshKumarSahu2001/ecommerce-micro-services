import express from "express";
import cors from "cors";
import ApiError from "./utils/ApiError.js";
import product from "./controllers/product.controller.js";

export default async (app) => {
    app.use(express.json());
    app.use(express.urlencoded({extended:true}));
    app.use(cors({
        origin:"http://localhost:5173",
        credentials:true
    }));

    product(app);

    app.use((err,req,res,next)=>{
        if(err instanceof ApiError){
            return res.status(err.status).json({
                success:false,
                message:err.message,
                errors:err.error
            })
        }
    })
};
