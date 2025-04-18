import express from "express";
import * as dotenv from "dotenv";
import prisma from "./src/database/Connection.js";
dotenv.config({ path: "./.env" })
import expressApp from "./src/app.js";

// (async function(){
  const app = express();
//   try {
    prisma.$connect()
    .then(()=>{
        expressApp(app)
        app.listen(process.env.PORT, () =>
          console.log(`listening port ${process.env.PORT}`)
        );
    })
    .catch((error) => {
        console.error("Database connection failed:", error);
        process.exit(1);
      });
//   } catch (error) {
//     console.error("Error connecting to the database:", error);
//     process.exit(1);
//   }
// })();
