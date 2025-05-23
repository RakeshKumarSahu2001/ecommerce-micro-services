import ApiError from "../../utils/ApiError.js";
import prisma from "../Connection.js";
import jwt from "jsonwebtoken";

class userCrudOperation {
  // create user
  async registerUser(userInputs) {
    try {
      const { email, password, randomNo, verifyOTPExpiryAt } = userInputs;
      const regRes = await prisma.auth.create({
        data: {
          email,
          password,
          verifyOTP: randomNo,
          verifyOTPExpireAt: verifyOTPExpiryAt,
        },
        select: {
          id: true,
        },
      });
      return regRes;
    } catch (error) {
      throw new ApiError(500, "user record insertion error...", error);
    }
  }

  async registerUserUsingGoogle(userInputs) {
    try {
      const { name, profilePic, email, firebaseUid } = userInputs;
      const regRes = await prisma.auth.create({
        data: {
          name,
          profilePic,
          email,
          firebaseUid,
          registeredWith: "GOOGLE",
        },
        select: {
          id: true,
        },
      });

      return regRes;
    } catch (error) {
      throw new ApiError(500, "user record insertion error...", error);
    }
  }

  //find customer
  async findUser(email) {
    try {
      const existingUser = await prisma.auth.findUnique({
        where: {
          email: email,
        },
        select: {
          id: true,
          role: true,
        },
      });
      return existingUser;
    } catch (error) {
      throw new ApiError(404, "user not found..", error);
    }
  }

  //find customer by id
  async findUserById(id) {
    try {
      const existingUserInfo = await prisma.auth.findFirst({
        where: {
          id,
        },
        select: {
          verifyOTP: true,
          verifyOTPExpireAt: true,
        },
      });

      return existingUserInfo;
    } catch (error) {
      throw new ApiError(404, "User not found...", error);
    }
  }

  //update customer to verified
  async updateIsAccountVerified(id) {
    try {
      await prisma.auth.update({
        where: {
          id,
        },
        data: {
          isAccountVerified: true,
        },
      });
    } catch (error) {
      throw new ApiError(
        501,
        "Database updation error...",
        "Database updation error..."
      );
    }
  }

  //find user for password validation
  async findUserPassword(email) {
    try {
      const existingUser = await prisma.auth.findUnique({
        where: {
          email: email,
        },
        select: {
          id: true,
          role: true,
          password: true,
        },
      });
      return existingUser;
    } catch (error) {
      throw new ApiError(404, "user not found..", error);
    }
  }

  //cookie generator
  async serverCookieGenerator(id, email, role) {
    const refreshToken = jwt.sign(
      { id, email, role },
      process.env.REFRESHTOKEN_SECRETE,
      {
        expiresIn: process.env.REFRESHTOKEN_EXPIRY,
        algorithm: process.env.TOKEN_ALGO_TYPE,
      }
    );

    await prisma.auth.update({
      where: {
        id,
      },
      data: {
        refreshToken: refreshToken,
      },
    });

    const accessToken = jwt.sign(
      { id, email, role },
      process.env.ACCESSTOKEN_SECRETE,
      {
        expiresIn: process.env.ACCESSTOKEN_EXPIRY,
        algorithm: process.env.TOKEN_ALGO_TYPE,
      }
    );

    return { accessToken, refreshToken };
  }
}

export default userCrudOperation;
