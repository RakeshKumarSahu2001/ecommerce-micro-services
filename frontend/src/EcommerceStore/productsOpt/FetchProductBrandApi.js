import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import axios from "axios";

export const FetchProductBrandApi=createAsyncThunk("products/productBrands",async(_,{rejectWithValue})=>{
    try {
        const response=await axios.get("/api/v1/users/all-brand");
        return response.data.data;
    } catch (error) {
        console.error(error);
        rejectWithValue(error);
    }
})


const initialState={
    isProdBrandFetched: false,
    isErrOccure: false,
    productBrands: null
}


export const FetchProductBrandSlice=createSlice({
    name:"productBrands",
    initialState,
    reducers:{},
    extraReducers:(builder)=>{
        builder.addCase(FetchProductBrandApi.pending,(state)=>{
            state.isProdBrandFetched= false
            state.isErrOccure= false
            state.productBrands= null
        })

        builder.addCase(FetchProductBrandApi.fulfilled,(state,action)=>{
            state.isProdBrandFetched= true
            state.isErrOccure= false
            state.productBrands= action.payload
        })

        builder.addCase(FetchProductBrandApi.rejected,(state)=>{
            state.isProdBrandFetched= false
            state.isErrOccure= true
            state.productBrands= null
        })
    }
})