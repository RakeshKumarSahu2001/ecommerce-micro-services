import express from "express";
import dotenv from "dotenv";
import prisma from "./src/database/Connection.js";
dotenv.config({ path: "./.env" });
import expressApp from "./src/app.js";

(async function () {
  const app = express();
  try {
    await prisma.$connect();
    expressApp(app);
    app.listen(process.env.PORT, () =>
      console.log(`listening port ${process.env.PORT}`)
    );
  } catch (error) {
    console.error("Error connecting to the database:", error);
    process.exit(1);
  }
})();
