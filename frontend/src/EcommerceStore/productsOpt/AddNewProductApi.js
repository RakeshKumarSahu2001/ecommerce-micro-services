import axios from "axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const AddNewProductApi = createAsyncThunk("products/addNewProduct",
    async (data, { rejectWithValue }) => {

        try {
            const formData = new FormData();
            Object.entries(data).forEach(([key, value]) => {
                if (key === "images" && value instanceof FileList) {
                    for (let i = 0; i < value.length; i++) {
                        formData.append("images", value[i]);
                    }
                } else if (value instanceof FileList) {
                    formData.append(key, value[0]);
                } else {
                    formData.append(key, value.toString());
                }
            });


            const response = await axios.post(`/api/v1/admin/add-new-product`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            return response.data
        } catch (err) {
            return rejectWithValue(err);
        }
    })



const initialState = {
    isProductAdded: false,
    errorInAddProduct: false,
    newProductInformation: null
}

export const createNewAddProductSlice = createSlice({
    name: "AddNewProductIntoTheSlice",
    initialState,
    reducers: {
        setProductParameterToInitialState: (state) => {
            state.isProductAdded = false
            state.errorInAddProduct = false
        }
    },
    extraReducers: (builder) => {
        builder.addCase(AddNewProductApi.pending, (state) => {
            state.isProductAdded = false
        })
        builder.addCase(AddNewProductApi.fulfilled, (state, action) => {
            state.isProductAdded = true
            state.newProductInformation = action.payload
        })
        builder.addCase(AddNewProductApi.rejected, (state) => {
            state.isProductAdded = false
            state.errorInAddProduct = true
        })
    }
})