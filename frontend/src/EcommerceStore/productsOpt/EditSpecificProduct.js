import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios"


export const EditSpecificProductApi = createAsyncThunk("products/EditSpecificProduct",
    async ({ id, updatedData }, { rejectWithValue }) => {
        try {
            const response = await axios.put(`/api/v1/admin/edit-product-by-id/${id}`, updatedData);
            return response.data;
        } catch (error) {
            console.error(error);
            return rejectWithValue(error)
        }
    })


const initialState= {
    isError: false,
    isupdated: false,
}

export const EditSpecificProductSlice = createSlice({
    name: "EditProductById",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(EditSpecificProductApi.pending, (state) => {
            state.isError = false
            state.isupdated = false
        })
        builder.addCase(EditSpecificProductApi.rejected, (state) => {
            state.isError = true
            state.isupdated = false
        })
        builder.addCase(EditSpecificProductApi.fulfilled, (state) => {
            state.isError = false
            state.isupdated = false
        })
    }
})