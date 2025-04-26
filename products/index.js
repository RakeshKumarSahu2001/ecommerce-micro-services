import express from "express";
import dotenv from "dotenv";
dotenv.config({ path: "./.env" });
import prisma from "./src/database/Connection.js";
import productApp from "./src/app.js";

async function main() {
  try {
    const app = express();
    await prisma.$connect();
    productApp(app);
    app.listen(process.env.PORT, () =>
      console.log(`listening port ${process.env.PORT}`)
    );
  } catch (error) {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  }
}
main();
