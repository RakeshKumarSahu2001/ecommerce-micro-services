import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../AxiosConfig.js";

export const DeleteSpecificProductApi = createAsyncThunk("products/deleteSpecificProduct", async (id) => {
    try {
        const response = await axiosInstance.delete("/v1/delete-product/"+ id);
        return response.data
    } catch (error) {
        throw error
    }
})


const initialState = {
    isDeleted: false,
    isError: false
}

export const deleteProductSlice = createSlice({
    name: "DeleteProductByIdSlice",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(DeleteSpecificProductApi.pending, (state) => {
            state.isDeleted = false
            state.isError = false
        })
        builder.addCase(DeleteSpecificProductApi.rejected, (state) => {
            state.isDeleted = false
            state.isError = true
        })
        builder.addCase(DeleteSpecificProductApi.fulfilled, (state) => {
            state.isDeleted = true
            state.isError = false
        })
    }
})