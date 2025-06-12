import express from "express";
import dotenv from "dotenv";
dotenv.config({ path: "./.env" });
import prisma from "./src/database/Connection.js";
import shopping from "./src/app.js"


(async function () {
  try {
    const app = express();
    await prisma.$connect();

    shopping(app);
    app.listen(process.env.PORT, () =>
      console.log(`listening port ${process.env.PORT}`)
    );
  } catch (error) {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  }
})();
