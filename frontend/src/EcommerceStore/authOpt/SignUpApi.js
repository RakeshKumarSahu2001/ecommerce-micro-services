// import axios from "axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { app } from "../../firebase.js";
import axiosInstance from "../../AxiosConfig.js";

export const signUpApi = createAsyncThunk(
  "users/createNewUser",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/customer/v1/register", data);
      return response.data.data;
    } catch (err) {
      console.error(err);
      return rejectWithValue(err);
    }
  }
);

export const signUpWithGoogleFirebase = createAsyncThunk(
  "users/signUpWithFirebase",
  async (_, { rejectWithValue }) => {
    try {
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const token = await user.getIdToken();

      const response = await axiosInstance.post(
        "/customer/v1/sign-up-with-google",
        token
      );
      console.log("user firebase registration information :",response);
      return response.data.data;
    } catch (error) {
      console.error(error);
      rejectWithValue(error);
    }
  }
);

const initialState = {
  isUserCreated: false,
  userCreationError: false,
  addUserInfo: null,
};

export const createNewUserSlice = createSlice({
  name: "createUser",
  initialState,
  reducers: {
    resetUserCreationState: (state) => {
      state.isUserCreated = false;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(signUpApi.pending, (state) => {
      state.isUserCreated = false;
      state.userCreationError = false;
    });
    builder.addCase(signUpApi.fulfilled, (state, action) => {
      state.isUserCreated = true;
      state.addUserInfo = action.payload;
    });
    builder.addCase(signUpApi.rejected, (state) => {
      state.userCreationError = true;
    });

    builder.addCase(signUpWithGoogleFirebase.pending, (state) => {
      state.isUserCreated = false;
      state.userCreationError = false;
    });
    builder.addCase(signUpWithGoogleFirebase.fulfilled, (state) => {
      state.isUserCreated = true;
      state.addUserInfo = action.payload;
    });
    builder.addCase(signUpWithGoogleFirebase.rejected, (state) => {
      state.userCreationError = true;
    });
  },
});
