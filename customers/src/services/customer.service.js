import userCrudOperation from "../database/repository/user.repository.js";
import ApiError from "../utils/ApiError.js";
import bcrypt from "bcryptjs";

class customerServices {
  constructor() {
    this.repository = new userCrudOperation();
  }

  async register(userInput) {
    const { email, password } = userInput;
    try {
      const isUserExist = await this.repository.findUser(email);
      if (isUserExist) {
        throw new ApiError(
          401,
          "User already exist...",
          "User already exist..."
        );
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const randomNo = Math.floor(Math.random() * 10000);
      const verifyOTPExpiryAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

      const registerUser = await this.repository.registerUser({
        email,
        password: hashedPassword,
        randomNo,
        verifyOTPExpiryAt,
      });
      return registerUser;
    } catch (error) {
      throw new ApiError(500, "Data not found", error);
    }
  }

  async validateOtp(userInput) {
    const { otp, id } = userInput;
    try {
      if (!id || !otp) {
        throw new ApiError(
          401,
          "Id and OTP is required...",
          "Id and OTP is required..."
        );
      }

      const fetchUserRecord = await this.repository.findUserById(id);

      if (!fetchUserRecord || fetchUserRecord?.verifyOTP == null) {
        throw new ApiError(
          404,
          "User information not found...",
          "User information not found..."
        );
      }

      if (
        fetchUserRecord.verifyOTPExpireAt.getTime() &&
        fetchUserRecord.verifyOTPExpireAt.getTime() < Date.now()
      ) {
        throw new ApiError(300, "OTP expired...", "OTP expired...");
      }

      if (fetchUserRecord?.verifyOTP != otp) {
        throw new ApiError(404, "Invalid OTP...", "Invalid OTP...");
      }

      await this.repository.updateIsAccountVerified(id);

    } catch (error) {
      throw new ApiError(500, "Invalid OTP...", error);
    }
  }

  async login(userInput) {
    const { email, password } = userInput;
    try {
      const isUserExist = await this.repository.findUserPassword(email);
      if (!isUserExist) {
        throw new ApiError(
          404,
          "User doesn't exist...",
          "User doesn't exist..."
        );
      }

      const isValidPassword = await bcrypt.compare(
        password,
        isUserExist?.password
      );
      console.log("isValidPassword :", isValidPassword);

      if(!isValidPassword){
        throw new ApiError(403,"Invalid Credentials...","Invalid Credentials...");
      }

      const {accessToken, refreshToken}=await this.repository.serverCookieGenerator(isUserExist?.id,email,isUserExist?.role);

      return {accessToken, refreshToken};
    } catch (error) {
      throw new ApiError(500, "Login error..", error);
    }
  }
}

export default customerServices;
