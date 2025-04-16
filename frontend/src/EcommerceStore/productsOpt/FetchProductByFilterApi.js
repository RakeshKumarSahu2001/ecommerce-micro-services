import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const FetchProductByFilterApi = createAsyncThunk(
    "products/fetchProductByFilter",
    async (params, { rejectWithValue }) => {
        try {
            let queryParams = Object.keys(params)
                .flatMap((key) =>
                    (params[key] ).map(
                        (value) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
                    )
                )
                .join("&");

            console.log(queryParams)
            // Make API request
            const response = await axios.get(`/api/v1/users/product-filter?${queryParams}`);
            console.log("response",response.data.data);
            return response.data.data;
        } catch (error) {
            console.error("Error fetching filtered products:", error);
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);


const initialState= {
    fetchingStatus: false,
    fetchingError: false,
    allProducts: null
}

export const FetchProductByFilterSlice = createSlice({
    name: "fetchProductByFilter",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(FetchProductByFilterApi.pending,(state)=>{
            state.fetchingStatus= false
            state.fetchingError= false
            state.allProducts= null
        })

        builder.addCase(FetchProductByFilterApi.fulfilled,(state,action)=>{
            state.fetchingStatus= true
            state.fetchingError= false
            state.allProducts= action.payload
        })

        
        builder.addCase(FetchProductByFilterApi.rejected,(state)=>{
            state.fetchingStatus= false
            state.fetchingError= true
            state.allProducts= null
        })

    }
})