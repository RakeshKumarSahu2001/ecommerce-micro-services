import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import axiosInstance from "../../AxiosConfig";

export const addToCartApi=createAsyncThunk("cart/addToCart",async(cartInfo)=>{
    try{
        const response=await axiosInstance.post(`/shopping/v1/add-to-cart`,{productId:cartInfo?.id,quantity:cartInfo?.quantity});
        return response.data;
    }catch(err){
        throw(err);
    }
})

const initialState={
    isAdded:false,
    isError:false,
    userSelectedProduct:[]
}

export const addToCartSlice=createSlice({
    name:"addToCart",
    initialState,
    reducers:{
        changeToInitState:(state)=>{
            state.isAdded=false
            state.isError=false
        }
    },
    extraReducers:(builder)=>{
        builder.addCase(addToCartApi.pending,(state)=>{
            state.isAdded=false;
        })
        builder.addCase(addToCartApi.fulfilled,(state)=>{
            state.isAdded=true;
        })
        builder.addCase(addToCartApi.rejected,(state)=>{
            state.isAdded=false;
            state.isError=true;
        })
    }
})




