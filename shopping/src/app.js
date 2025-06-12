import cors from "cors";
import express from "express";
import ApiError from "./utils/ApiError.js";
import shopping from "./controllers/shopping.controller.js";
import {connect} from "./services/rabbit.service.js";
import cookieParser from "cookie-parser"


export default async (app) => {
  await connect();
  app.use(
    cors({
      origin: "http://localhost:5173",
      credentials: true,
    })
  );
  app.use(cookieParser());
  app.use(express.json());
  app.use(
    express.urlencoded({
      extended: true,
    })
  );
  
  shopping(app);

  app.use((err, req, res, next) => {
    if (err instanceof ApiError) {
      res.status(err.status).json({
        success: false,
        message: err.message,
        error: err.error,
      });
    }

    res.status(500).json({
      success: false,
      message: "Something went wrong...",
      errors: err,
    });
  });
  
};
