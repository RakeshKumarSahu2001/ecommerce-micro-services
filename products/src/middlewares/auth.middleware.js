import axios from "axios";
import ApiError from "../utils/ApiError.js";

async function auth(req, res, next) {
  try {
    const token = req.cookies?.accessToken || req.header("Authorization").split(" ")[1];

    const response = await axios.get(
      `${process.env.AUTH_BASE_URL + "/customer/v1/user-info"}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    
    const user=response.data;
    if(!user){
        throw new ApiError(401,"Unautherized user...","Unautherized user...");
    }

    req.user=response.data;
    next();
  } catch (error) {
    next(error);
  }
}

export default auth;
