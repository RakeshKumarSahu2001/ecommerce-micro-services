import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";


export const loginApi = createAsyncThunk("user/loginUser", async (data, { rejectWithValue }) => {
    try {
        const response = await axios.post(`/api/v1/users/login`, data)

        const userData= {
            id: response.data.data.id,
            email: response.data.data.email,
            Role:response.data.data.Role
        }
        if (response.data) {
            return userData;
        } else {
            return rejectWithValue("User doesn't exist")
        }
    } catch (err) {
        throw (err);
    }
})


export const logoutApi = createAsyncThunk("user/logoutUser", async () => {
    try {
        await axios.post("/api/v1/users/logout")
        return true
    } catch (error) {
        throw error
    }
})


const initialState= {
    isUserExist: false,
    loggedInUser: null
}

export const loginSlice = createSlice({
    name: "loginSlice",
    initialState,
    reducers: {
        clearLoginUserInfoFromLocalStorage:()=>{
             sessionStorage.clear()
        }
    },
    extraReducers: (builder) => {
        builder.addCase(loginApi.fulfilled, (state, action) => {
            state.isUserExist = true;
            state.loggedInUser = action.payload;
            sessionStorage.setItem("Id", action.payload.id);
            sessionStorage.setItem("Email", action.payload.email);
            sessionStorage.setItem("Role", action.payload.Role);
        })
        builder.addCase(loginApi.rejected, (state) => {
            state.isUserExist = false
        })
        builder.addCase(logoutApi.fulfilled, (state) => {
            state.isUserExist = false
            state.loggedInUser = null
            sessionStorage.removeItem("loginUserInfo")
        })
        builder.addCase(logoutApi.rejected, () => {
            console.log("Logout failed");
        });
    }
})