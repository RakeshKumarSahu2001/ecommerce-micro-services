import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
// import axios from "axios";
import axiosInstance from "../../AxiosConfig.js";

export const EmailValidation = createAsyncThunk("users/emailValidation", async (data) => {

    const {otp,id}=data;
    try {
        const response = await axiosInstance.post(`/customer/v1/verify-otp/${id}`, {otp})
        return response.data.data;
    } catch (error) {
        console.error(error)
    }
})


const initialState= {
    isEmailVerified: false,
    isGotVerificationErr:false
}
export const EmailValidationSlice = createSlice({
    name: "EmailValidation",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(EmailValidation.pending, (state) => {
            state.isEmailVerified=false
            state.isGotVerificationErr=false
        })
        builder.addCase(EmailValidation.fulfilled, (state) => {
            state.isEmailVerified=true
            state.isGotVerificationErr=false
        })
        builder.addCase(EmailValidation.rejected, (state) => {
            state.isEmailVerified=false
            state.isGotVerificationErr=true
        })
    }
})