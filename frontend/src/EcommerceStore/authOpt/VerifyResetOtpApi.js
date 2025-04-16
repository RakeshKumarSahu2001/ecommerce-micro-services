import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";


export const VerifyResetOtpApi = createAsyncThunk("users/verifyResetOtp", async (data, { rejectWithValue }) => {
    try {
        const response = await axios.post("/api/v1/users/reset-password", data);
        return response.data.data;
    } catch (error) {
        console.error(error);
        rejectWithValue(error);
    }
})

const initialState={
    isReseted:false,
    isError:false
}

export const VerifyResetOtpSlice=createSlice({
    name:"verifyResetOtp",
    initialState,
    reducers:{
        setToInitValue:(state)=>{
            state.isError=false;
            state.isReseted=false;
        }
    },
    extraReducers:(builder)=>{
        builder.addCase(VerifyResetOtpApi.pending,(state)=>{
            state.isReseted=false;
            state.isError=false;
        })
        builder.addCase(VerifyResetOtpApi.fulfilled,(state,action)=>{
            state.isReseted=action.payload.isReseted;
            state.isError=false;
        })
        builder.addCase(VerifyResetOtpApi.rejected,(state)=>{
            state.isReseted=false;
            state.isError=true;
        })
    }
})