import { Admin } from "@/type/prisma";
import { AdminSignInType } from "@/type/admin";
import { envValues } from "@/util/envValues";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { setCategories } from "./categorySlice";


interface AdminSliceType {
    item : Admin | null
}

const initialState : AdminSliceType = {
    item : null
}

export const adminSignIn = createAsyncThunk("adminSlice/adminSignIn" , async( data : AdminSignInType , thunkApi ) => {
    const { email , onFail , onSuccess } = data;
    try {
        const response = await fetch(`${envValues.apiUrl}/admin` , {
            method : "POST",
            headers : {
                "content-type" : "application/json"
            },
            body : JSON.stringify({ email })
        });
        const { createdAdmin , categories } = await response.json();
        thunkApi.dispatch(setAdmin(createdAdmin));
        if(categories) thunkApi.dispatch(setCategories(categories))
            
        if(onSuccess) {
            onSuccess();
        }
    } catch(err) {
        console.log(err)
    }
})

const adminSlice = createSlice({
    name : "Admin slice",
    initialState  , 
    reducers : {
        setAdmin : ( state , action : PayloadAction<Admin> ) => {
            state.item = action.payload;
        }
    }
})

export const { setAdmin } = adminSlice.actions;

export default adminSlice.reducer;