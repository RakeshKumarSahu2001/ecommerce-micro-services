import jwt from "jsonwebtoken";
import ApiError from "../utils/ApiError.js";

async function auth(req, res, next) {
  try {
    const token =
      req.cookies?.accessToken || req.header("Authorization").split(" ")[1];

    if (!token || token === "" || token === null) {
      throw new ApiError(
        401,
        "Unautherized request...",
        "Unautherized request..."
      );
    }
    const decodedData = await jwt.verify(
      token,
      process.env.ACCESSTOKEN_SECRETE
    );

    if (!decodedData) {
      throw new ApiError(401, "Invalid User", "Invalid User");
    }
    req.user=decodedData;
    next();
  } catch (error) {
    next(error);
  }
}

export default auth;
