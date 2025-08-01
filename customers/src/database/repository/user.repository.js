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
      const { name, email, firebaseUid } = userInputs;
      const regRes = await prisma.auth.create({
        data: {
          name,

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
          id:true,
          name: true,
          email: true,
          phone: true,
          dateOfBirth: true,
          gender: true,
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

  //fetch all customers
  async getAllCustomers(id) {
    try {
      const allCustomers = await prisma.auth.findMany({
        where: {
          id: {
            not: id,
          },
        },
        select: {
          name: true,
          email: true,
          phone: true,
          gender: true,
          role: true,
          address: true,
          orders: true,
        },
      });
      return allCustomers;
    } catch (error) {
      throw new ApiError(
        404,
        "User information not present...",
        "User information not present..."
      );
    }
  }

  //add userinformation
  async addUserInfo(userInput) {
    try {
      const {
        id,
        name,
        phone,
        gender,
        dateOfBirth,
        street,
        city,
        state,
        country,
        postalCode,
      } = userInput;

      const updatedInformation = await prisma.auth.update({
        where: {
          id,
        },
        data: {
          name,
          phone,
          gender,
          dateOfBirth: new Date(dateOfBirth),
          address: {
            create: {
              street,
              city,
              state,
              country,
              postalCode: String(postalCode),
            },
          },
        },
      });

      return updatedInformation;
    } catch (error) {
      throw new ApiError(
        405,
        "Some error occured while adding user information...",
        "Some error occured while adding user information..."
      );
    }
  }

  //update userinformation
  async updateUserInfo(userInput) {
    try {
      const { id, name, phone, gender, dateOfBirth } = userInput;
      const updatedInfo = await prisma.auth.update({
        where: {
          id,
        },
        data: {
          name,
          phone,
          gender,
          dateOfBirth: new Date(dateOfBirth),
        },
      });

      return updatedInfo;
    } catch (error) {
      throw new ApiError(
        405,
        "Some error occured while updating user information...",
        "Some error occured while updating user information..."
      );
    }
  }

  //add new address
  async addAddress(userInput) {
    const { id, street, city, state, country, postalCode } = userInput;
    try {
      const addresses = await prisma.auth.update({
        where: {
          id,
        },
        data: {
          address: {
            create: { street, city, state, country, postalCode },
          },
        },
      });

      return addresses;
    } catch (error) {
      throw new ApiError(
        405,
        "Some error occured while adding address information...",
        "Some error occured while adding address information..."
      );
    }
  }

  //update address
  async updateAddress(userInput) {
    try {
      const { addressId, street, city, state, country, postalCode } = userInput;

      const updatedAddress = await prisma.address.update({
        where: { id: addressId },
        data: {
          street,
          city,
          state,
          country,
          postalCode,
        },
      });

      return updatedAddress;
    } catch (error) {
      throw new ApiError(
        405,
        "Some error occured while adding user information...",
        "Some error occured while adding user information..."
      );
    }
  }
}

export default userCrudOperation;
