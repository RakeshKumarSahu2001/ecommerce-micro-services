import express from "express";
import cors from "cors";
import proxy from "express-http-proxy";
import dotenv from "dotenv"
dotenv.config({path:"./.env"});

const app=express();

app.use(cors());
app.use(express.json());

app.use("/customer",proxy("http://localhost:8081"));
app.use("/shopping",proxy("http://localhost:8082"));
app.use("/",proxy("http://localhost:8083")); //products

app.listen(process.env.PORT,()=>console.log(`listening port ${process.env.PORT}`));