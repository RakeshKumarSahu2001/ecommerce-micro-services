import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../AxiosConfig";

export const deleteCartProductApi = createAsyncThunk("cart/deleteCartProduct", async (id) => {
    try {
        const response = await axiosInstance.delete(`/shopping/v1/remove-from-cart/${id}`);
        return response.data.data;
    } catch (error) {
        throw error;
    }
})


const initialState = {
    isDeleted: false,
    isError: false
}

export const deleteCartProductSlice=createSlice({
    name:"DeleteCartProducts",
    initialState,
    reducers:{
        setToInitval:(state)=>{
            state.isDeleted=false
        }
    },
    extraReducers:(builder)=>{
        builder.addCase(deleteCartProductApi.fulfilled,(state)=>{
            state.isDeleted=true
            state.isError=false
        })
        builder.addCase(deleteCartProductApi.rejected,(state)=>{
            state.isDeleted=false
            state.isError=false
        })
    }
})