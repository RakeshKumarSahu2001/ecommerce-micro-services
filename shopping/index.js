import express from "express";
import dotenv from "dotenv"
dotenv.config({path:"./.env"});

const app=express();

app.get("/",(req,res)=>{
    res.send("hello from shoppings");
})

app.listen(process.env.PORT,()=>console.log(`listening port ${process.env.PORT}`));