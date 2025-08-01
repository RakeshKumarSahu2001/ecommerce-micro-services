import userCrudOperation from "../database/repository/user.repository.js";
import ApiError from "../utils/ApiError.js";
import bcrypt from "bcryptjs";
import admin from "../utils/FirebaseConfig.js";

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
          403,
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

  async registerWithGoogle(token) {
    try {
      const decoded = await admin.auth().verifyIdToken(token);
      const isUserExist = await this.repository.findUser(decoded?.email);

      if (isUserExist) {
        throw new ApiError(
          403,
          "User already exist...",
          "User already exist..."
        );
      }

      const regRes = this.repository.registerUserUsingGoogle({
        name: decoded?.name,
        profilePic: decoded?.picture,
        email: decoded?.email,
        firebaseUid: decoded?.user_id,
      });

      return regRes;
    } catch (error) {
      throw new ApiError(500, "Data not found", error);
    }
  }

  async validateOtp(userInput) {
    const { otp, id } = userInput;
    try {
      if (!id || !otp) {
        throw new ApiError(
          403,
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

      if (!isValidPassword) {
        throw new ApiError(
          403,
          "Invalid Credentials...",
          "Invalid Credentials..."
        );
      }

      const { accessToken, refreshToken } =
        await this.repository.serverCookieGenerator(
          isUserExist?.id,
          email,
          isUserExist?.role
        );

      return {
        accessToken,
        refreshToken,
        data: { id: isUserExist?.id, email, role: isUserExist?.role },
      };
    } catch (error) {
      throw new ApiError(500, "Login error..", error);
    }
  }

  async loginWithGoogle(userInput) {
    try {
      const decoded = await admin.auth().verifyIdToken(userInput);

      if (!decoded?.email || !decoded?.uid) {
        throw new ApiError(
          403,
          "Credentials required...",
          "Credentials required..."
        );
      }

      const isUserExist = await this.repository.findUser(decoded?.email);

      if (!isUserExist) {
        throw new ApiError(
          404,
          "User doesn't exist...",
          "User doesn't exist..."
        );
      }

      const { accessToken, refreshToken } =
        await this.repository.serverCookieGenerator(
          isUserExist?.id,
          decoded?.email,
          isUserExist?.role
        );

      return { accessToken, refreshToken };
    } catch (error) {
      throw new ApiError(500, "Login with google error..", error);
    }
  }

  async getCustomer(id) {
    try {
      if (!id) {
        throw new ApiError(
          403,
          "UserId is required...",
          "UserId is required..."
        );
      }
      const customer = await this.repository.findUserById(id);
      return customer;
    } catch (error) {
      throw new ApiError(404, "User doesn't exist...", "User doesn't exist...");
    }
  }

  async getAllUsers(id) {
    try {
      const allUser = await this.repository.getAllCustomers(id);
      return allUser;
    } catch (error) {
      throw new ApiError(
        400,
        "Error occured while fetching all the users record...",
        "Error occured while fetching all the users record..."
      );
    }
  }

  async addUserInfo(userInput) {
    try {
      const { id } = userInput;
      if (!id) {
        throw new ApiError(
          404,
          "User doesn't exist...",
          "User doesn't exist..."
        );
      }
      const updatedInfo = await this.repository.addUserInfo(userInput);
      return updatedInfo;
    } catch (error) {
      throw new ApiError(
        403,
        "Error occured while adding the user information...",
        "Error occured while adding the user information..."
      );
    }
  }

  async updateUserInfo(userInput) {
    try {
      const { id } = userInput;
      if (!id) {
        throw new ApiError(
          404,
          "Id is required to update the information...",
          "Id is required to update the information..."
        );
      }

      const updatedInfo = await this.repository.updateUserInfo(userInput);
      return updatedInfo;
    } catch (error) {
      throw new ApiError(
        403,
        "Error occured while updating the user information...",
        "Error occured while updating the user information..."
      );
    }
  }

  async addAddress(userInput) {
    try {
      const { id } = userInput;
      if (!id) {
        throw new ApiError(
          404,
          "Id is required to update the information...",
          "Id is required to update the information..."
        );
      }

      const addedAddress = await this.repository.addAddress(userInput);

      return addedAddress;
    } catch (error) {
      throw new ApiError(
        403,
        "Error occured while adding new address information...",
        "Error occured while adding new address information..."
      );
    }
  }

  async updatedAddress(userInput) {
    try {
      const { addressId } = userInput;
      if (!addressId) {
        throw new ApiError(
          405,
          "Address id is required to update....",
          "Address id is required to update..."
        );
      }
      const updatedInfo = await this.repository.updateAddress(userInput);

      return updatedInfo;
    } catch (error) {
      throw new ApiError(
        405,
        "Error occured while updating the address...",
        "Error occured while updating the address..."
      );
    }
  }
}

export default customerServices;
