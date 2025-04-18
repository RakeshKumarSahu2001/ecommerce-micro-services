import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const FetchCategoryApi = createAsyncThunk("products/productCategories", async (_,{ rejectWithValue }) => {
    try {
        const response = await axios.get("/api/v1/users/all-categories");
        return response.data.data
    } catch (error) {
        console.log(error);
        rejectWithValue(error);
    }
})


const initialState = {
    isProdCategoriesFetched: false,
    isErrOccure: false,
    productCategories: null
}

export const FetchCategorySlice = createSlice({
    name: "productCategories",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(FetchCategoryApi.pending, (state) => {
            state.isProdCategoriesFetched = false
            state.isErrOccure = false
            state.productCategories = null
        })
        builder.addCase(FetchCategoryApi.fulfilled, (state, action) => {
            state.isProdCategoriesFetched = true
            state.isErrOccure = false
            state.productCategories = action.payload
        })
        builder.addCase(FetchCategoryApi.rejected, (state) => {
            state.isProdCategoriesFetched = false
            state.isErrOccure = true
            state.productCategories = null
        })
    }
})