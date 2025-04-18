import axios from "axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const ProductApi = createAsyncThunk("products/fetchAllProducts", async () => {
    try {
        const response = await axios.get(`/api/v1/users/fetch-all-products`);
        return response.data.data.products;
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

