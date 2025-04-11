import customerServices from "../services/customer.service.js";

export default (app) => {
  const userService = new customerServices();

  app.post("/customer/register", async (req, res, next) => {
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

  app.post("/customer/verify-otp/:id", async (req, res, next) => {
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

  app.post("/customer/login", async (req, res, next) => {
    try {
      const { email, password } = req.body;

      const { accessToken, refreshToken } = await userService.login({
        email,
        password,
      });

      res
        .cookie("accessToken", accessToken)
        .cookie("refreshToken", refreshToken)
        .status(200)
        .json({
          success:true,
          message:"User login successfully...",
          data:[]
        });
    } catch (error) {
      next(error);
    }
  });

  
};
