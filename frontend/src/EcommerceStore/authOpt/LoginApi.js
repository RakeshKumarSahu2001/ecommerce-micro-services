import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../AxiosConfig";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { app } from "../../firebase.js";

export const loginApi = createAsyncThunk(
  "user/loginUser",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        `/customer/v1/login`,
        data
      );

      const userData = {
        id: response.data.data.id,
        email: response.data.data.email,
        Role: response.data.data.role,
      };
      if (response.data) {
        return userData;
      } else {
        return rejectWithValue("User doesn't exist");
      }
    } catch (err) {
      rejectWithValue(err);
    }
  }
);

export const loginWithGoogle = createAsyncThunk(
  "user/loginUserWithGoogle",
  async (_, { rejectWithValue }) => {
    try {
      const auth = getAuth(app);
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const token = await user.getIdToken();

      const response = await axiosInstance.post(
        "/customer/v1/login-with-google",
        token
      );
      return response.data.data;
    } catch (error) {
      rejectWithValue(error);
    }
  }
);

export const logoutApi = createAsyncThunk("user/logoutUser", async () => {
  try {
    await axiosInstance.post("/customer/v1/logout",null);
    return true;
  } catch (error) {
    throw error;
  }
});

const initialState = {
  isUserExist: false,
  loggedInUser: null,
};

export const loginSlice = createSlice({
  name: "loginSlice",
  initialState,
  reducers: {
    clearLoginUserInfoFromLocalStorage: () => {
      sessionStorage.clear();
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loginApi.fulfilled, (state, action) => {
      state.isUserExist = true;
      state.loggedInUser = action.payload;
      sessionStorage.setItem("Id", action.payload.id);
      sessionStorage.setItem("Email", action.payload.email);
      sessionStorage.setItem("Role", action.payload.Role);
    });
    builder.addCase(loginApi.rejected, (state) => {
      state.isUserExist = false;
    });

    builder.addCase(loginWithGoogle.fulfilled, (state, action) => {
      state.isUserExist = true;
      state.loggedInUser = action.payload;
    });

    builder.addCase(logoutApi.fulfilled, (state) => {
      state.isUserExist = false;
      state.loggedInUser = null;
      sessionStorage.removeItem("loginUserInfo");
    });
    builder.addCase(logoutApi.rejected, () => {
      console.log("Logout failed");
    });
  },
});
