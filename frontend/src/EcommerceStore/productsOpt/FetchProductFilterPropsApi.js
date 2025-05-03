import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../AxiosConfig.js";

export const FetchProductFilterPropsApi = createAsyncThunk(
  "products/productFilterProps",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/v1/filter-props");
      return response.data.data;
    } catch (error) {
      console.error(error);
      rejectWithValue(error);
    }
  }
);

const initialState = {
  isFiltersFetched: false,
  isErrOccure: false,
  productFilterProps: null,
};

export const FetchProductFilterPropsSlice = createSlice({
  name: "productFilterProps",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(FetchProductFilterPropsApi.pending, (state) => {
      state.isFiltersFetched = false;
      state.isErrOccure = false;
      state.productFilterProps = null;
    });

    builder.addCase(FetchProductFilterPropsApi.fulfilled, (state, action) => {
      state.isFiltersFetched = true;
      state.isErrOccure = false;
      state.productFilterProps = action.payload;
    });

    builder.addCase(FetchProductFilterPropsApi.rejected, (state) => {
      state.isFiltersFetched = false;
      state.isErrOccure = true;
      state.productFilterProps = null;
    });
  },
});
