import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import ApiError from "./utils/ApiError.js";
import product from "./controllers/product.controller.js";
import {connect} from "./services/rabbit.service.js"

export default async (app) => {
  await connect();
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());
  app.use(
    cors({
      origin: "http://localhost:5173",
      credentials: true,
    })
  );

  product(app);

  app.use((err, req, res, next) => {
    if (err instanceof ApiError) {
      res.status(err.status).json({
        success: false,
        message: err.message,
        errors: err.error,
      });
    }

    res.status(500).json({
      success: false,
      message: "Something went wrong...",
      errors: err,
    });
  });
};
