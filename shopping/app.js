import cors from "cors";
import express from "express";
import ApiError from "./src/utils/ApiError.js";
import shopping from "./src/controllers/shopping.controller.js";

export default async (app) => {
  app.use(
    cors({
      origin: "http://localhost:5173",
      credentials: true,
    })
  );
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
