import ApiError from "../utils/ApiError.js";
import axios from "axios";
import jwt from "jsonwebtoken";

// async function auth(req, res, next) {
//   try {
//     const token =
//       req.cookies?.accessToken || req.header("Authorization").split(" ")[1];

//       if (!token) {
//       throw new ApiError(401, "Unautherized User...", "Unautherized User...");
//     }

//     const response = await axios.get(
//       `${process.env.AUTH_BASE_URL + "/customer/v1/user-info"}`,
//       {
//         headers: {
//           Authorization: `${"Bearer " + token}`,
//         },
//       }
//     );
//     const user = response.data;
//     if (!user) {
//       throw new ApiError(401, "Unautherized user...", "Unautherized user...");
//     }

//     req.user = response.data.data;
//     next();
//   } catch (error) {
//     next(error);
//   }
// }

// export default auth;



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

    console.log("decodedData",decodedData)
    next();
  } catch (error) {
    next(error);
  }
}

export default auth;
