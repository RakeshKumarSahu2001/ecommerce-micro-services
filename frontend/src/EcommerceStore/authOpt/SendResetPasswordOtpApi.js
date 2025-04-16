import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";



export const SendResetPasswordOtpApi = createAsyncThunk("users/sendResetPasswordOTP", async (data, { rejectWithValue }) => {
    try {
        const response = await axios.post("/api/v1/users/send-reset-password-otp", data);
        return response.data.data;
    } catch (error) {
        console.error(error);
        rejectWithValue(error);
    }
})


const initialState = {
    isSended: false,
    isError: false
}

export const SendResetPasswordOtpSlice = createSlice({
    name: "sendResetPasswordOtp",
    initialState,
    reducers: {
        resetToPrevState:(state)=>{
            state.isError=false;
            state.isSended=false;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(SendResetPasswordOtpApi.pending, (state) => {
            state.isError = false;
            state.isSended = false;
        })
        builder.addCase(SendResetPasswordOtpApi.fulfilled, (state, action) => {
            state.isError = false;
            state.isSended = action.payload.isSended;
        })
        builder.addCase(SendResetPasswordOtpApi.rejected, (state) => {
            state.isError = true;
            state.isSended = false;
        })
    }
})