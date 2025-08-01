import ApiError from "../utils/ApiError.js";
import jwt from "jsonwebtoken";

async function auth(req, res, next) {
  try {console.log("############")
    const authToken=req.header("Authorization");
    const token =
      req.cookies?.accessToken || (authToken&& authToken.split(" ")[1]);

      console.log("token ",req.cookies)

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
