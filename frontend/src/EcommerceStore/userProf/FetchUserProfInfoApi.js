import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../AxiosConfig.js";


export const fetchUserProfInfoById = createAsyncThunk("user/fetchUserProfileInfo", async (id) => {
    try {
        const response = await axiosInstance.get(`/customer/v1/user`);
        return response.data.data;
    } catch (error) {
        throw error;
    }
})

const initialState= {
    isProfileDataInserted: false,
    userProfileInfo: null,
    profileDataInsertionError: false
}

export const FetchUserProfInfoSlice = createSlice({
    name: "userInfoSlice",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(fetchUserProfInfoById.pending,(state)=>{
            state.isProfileDataInserted=false,
            state.profileDataInsertionError=false,
            state.userProfileInfo=null
        })
        builder.addCase(fetchUserProfInfoById.rejected,(state)=>{
            state.isProfileDataInserted=false,
            state.userProfileInfo=null,
            state.profileDataInsertionError=false
        })
        builder.addCase(fetchUserProfInfoById.fulfilled,(state,action)=>{
            state.isProfileDataInserted=false,
            state.userProfileInfo=action.payload,
            state.profileDataInsertionError=false 
        })
    }
})
