import auth from "../middlewares/auth.middleware.js";
import customerServices from "../services/customer.service.js";
import ApiError from "../utils/ApiError.js";
import { subscribeToQueue } from "../services/rabbit.service.js";

export default (app) => {
  const userService = new customerServices();

  app.post("/v1/register", async (req, res, next) => {
    try {
      const { email, password } = req.body;
      const registeredUser = await userService.register({ email, password });
      res.status(201).json({
        success: true,
        message: "User registered successfully...",
        data: registeredUser,
      });
    } catch (error) {
      next(error);
    }
  });

  app.post("/v1/sign-up-with-google", async (req, res, next) => {
    try {
      const registeredUser = await userService.registerWithGoogle(
        Object.keys(req.body)[0]
      );
      res.status(200).json({
        success: true,
        message: "user registered successfully.",
        data: registeredUser,
      });
    } catch (error) {
      next(error);
    }
  });

  app.post("/v1/verify-otp/:id", async (req, res, next) => {
    try {
      const { id } = req.params;
      const { otp } = req.body;

      await userService.validateOtp({ id, otp });

      res.status(200).json({
        success: true,
        message: "OTP verified successfully...",
        data: [],
      });
    } catch (error) {
      next(error);
    }
  });

  app.post("/v1/login", async (req, res, next) => {
    try {
      const { email, password } = req.body;

      const { accessToken, refreshToken, data } = await userService.login({
        email,
        password,
      });

      res
        .cookie("accessToken", accessToken, {
          httpOnly: true,
          secure: true,
          maxAge: 1000 * 60 * 1,
        })
        .cookie("refreshToken", refreshToken, {
          httpOnly: true,
          secure: true,
          maxAge: 1000 * 60 * 30,
        })
        .status(200)
        .json({
          success: true,
          message: "User login successfully...",
          data: data,
        });
    } catch (error) {
      next(error);
    }
  });

  app.post("/v1/login-with-google", async (req, res, next) => {
    try {
      const { accessToken, refreshToken } = await userService.loginWithGoogle(
        Object.keys(req.body)[0]
      );

      res
        .cookie("accessToken", accessToken, {
          httpOnly: true,
          secure: true,
          maxAge: 1000 * 60 * 1,
        })
        .cookie("refreshToken", refreshToken, {
          httpOnly: true,
          secure: true,
          maxAge: 1000 * 60 * 30,
        })
        .status(200)
        .json({
          success: true,
          message: "User login by google successfully...",
          data: {},
        });
    } catch (error) {
      next(error);
    }
  });

  app.post("/v1/logout", auth, async (req, res, next) => {
    try {
      res
        .clearCookie("accessToken", { httpOnly: true, secure: true })
        .clearCookie("refreshToken", { httpOnly: true, secure: true })
        .status(200)
        .json({
          success: true,
          message: "User logout successfully...",
          data: {},
        });
    } catch (error) {
      next(error);
    }
  });

  //refreshtoken
  app.post("/v1/refresh-token", async (req, res, next) => {
    try {
      console.log("*****************")
      const refreshToken = req.cookies.refreshToken;
      console.log("refreshToken :",refreshToken)
      if (!refreshToken) {
        return res.status(401).json({ message: "Refresh token missing" });
      }

      jwt.verify(refreshToken, process.env.REFRESHTOKEN_SECRETE, (err, user) => {
        if (err)
          return res.status(403).json({ message: "Invalid refresh token" });

        const newAccessToken = jwt.sign(
          { id: user.id },
          process.env.ACCESSTOKEN_SECRETE,
          {
            expiresIn: "1m",
          }
        );

        res.cookie("accessToken", newAccessToken, {
          httpOnly: true,
          secure: false,
          maxAge: 1000 * 60 * 1,
        });

        res
          .status(200)
          .json({ success: true, message: "New access token generated" });
      });
    } catch (error) {
      next(error);
    }
  });

  app.post("/v1/add-user-profile-info", auth, async (req, res, next) => {
    try {
      const { id } = req.user;
      const addedInformation = await userService.addUserInfo({
        ...req.body,
        id,
      });
      res.status(200).json({
        success: true,
        message: "Information added successfully...",
        data: addedInformation,
      });
    } catch (error) {
      next(error);
    }
  });

  app.put("/v1/update-profile-info", auth, async (req, res, next) => {
    try {
      const { id } = req.user;
      const updateUserInfo = await userService.updateUserInfo({
        ...req.body,
        id,
      });

      res.status(200).json({
        success: true,
        message: "User information updated successfully..",
        data: updateUserInfo,
      });
    } catch (error) {
      next(error);
    }
  });

  app.get("/v1/all-users", auth, async (req, res, next) => {
    try {
      const allUsers = await userService.getAllUsers(req.user?.id);
      res.status(200).json({
        success: true,
        message: "Users fetched successfully...",
        data: allUsers,
      });
    } catch (error) {
      next(error);
    }
  });

  app.get("/v1/user", auth, async (req, res, next) => {
    try {
      const user = await userService.getCustomer(req.user.id);
      res.status(200).json({
        success: true,
        message: "User information fetched successfully...",
        data: user,
      });
    } catch (error) {
      next(error);
    }
  });

  app.get("/v1/user-info", auth, async (req, res, next) => {
    try {
      const user = req.user;
      if (!user) {
        throw new ApiError(404, "User not found...", "User not found...");
      }

      res.status(200).json({
        success: true,
        message: "user information fetched successfully...",
        data: user,
      });
    } catch (error) {
      next(error);
    }
  });

  app.post("/v1/add-address", auth, async (req, res, next) => {
    try {
      const { id } = req.user;
      const addresses = await userService.addAddress({ ...req.body, id });
      res.status(200).json({
        success: true,
        message: "New address updated successfully...",
        data: addresses,
      });
    } catch (error) {
      next(error);
    }
  });

  subscribeToQueue("new-product-added-into-user-cart", (data) => {
    console.log("aueue info", data);
  });
};
