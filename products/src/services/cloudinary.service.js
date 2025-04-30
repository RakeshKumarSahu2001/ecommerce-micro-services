import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import ApiError from "../utils/ApiError.js";

async function uploadOnCloudinary(localPath) {
  // Configuration
  cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
  });

  try {
    if (!localPath) {
      return null;
    }

    // Upload an image
    const uploadResult = await cloudinary.uploader.upload(localPath, {
      resource_type: "auto",
    });
    fs.unlinkSync(localPath);
    return uploadResult;
  } catch (error) {
    fs.unlinkSync(localPath);
    throw new ApiError(500, "Image uploaded on cloudinary...", error);
  }
}

export default uploadOnCloudinary;