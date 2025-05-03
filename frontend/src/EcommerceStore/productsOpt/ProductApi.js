import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../AxiosConfig.js";

export const ProductApi = createAsyncThunk("products/fetchAllProducts", async () => {
    try {
        const response = await axiosInstance.get(`/v1/get-all-product`);
        return response.data.data;
    } catch (err) {
        throw err;
    }
})


let initialState = {
    loadingStatus: false,
    loadingError: false,
    allProducts: null,
}

export const ProductSlice = createSlice(
    {
        name: "allStoreProducts",
        initialState,
        reducers: {
            setToInitValue: (state) => {
                state.loadingStatus = false;
                state.loadingError = false;
                state.allProducts = null;
            }
        },
        extraReducers: (builder) => {
            builder.addCase(ProductApi.pending, (state) => {
                state.loadingStatus = true
            })
            builder.addCase(ProductApi.fulfilled, (state, action) => {
                state.loadingStatus = false;
                state.allProducts = action.payload
            })
            builder.addCase(ProductApi.rejected, (state) => {
                state.loadingError = true
            })
        }
    }
)

