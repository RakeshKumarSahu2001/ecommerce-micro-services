import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../AxiosConfig.js";

export const FetchProductDetailsApi = createAsyncThunk("products/fetchProductById", async (id,{rejectWithValue}) => {
    try {
        const response = await axiosInstance.get(`/v1/get-product/${id}`);

        return response.data.data;
    } catch (err) {
        console.error(err);
        rejectWithValue(err)
    }
})


const initialState = {
    loadingStatus: false,
    loadingError: false,
    productInfo: null
};

export const ProductDetailsSlice = createSlice({
    name: "productDetails",
    initialState,
    reducers: {

    },
    extraReducers:(builder)=>{
        builder.addCase(FetchProductDetailsApi.pending,(state)=>{
            state.loadingStatus=true
        }),
        builder.addCase(FetchProductDetailsApi.fulfilled,(state,action)=>{
            state.loadingStatus=false,
            state.productInfo=action.payload
        }),
        builder.addCase(FetchProductDetailsApi.rejected,(state)=>{
            state.loadingError=true
        })
    }
})