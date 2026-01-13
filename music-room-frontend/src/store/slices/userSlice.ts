import { User } from "@/type/prisma";
import { UserSignInType } from "@/type/user";
import { envValues } from "@/util/envValues";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";


interface UserSliceType {
    items : User[]
}

const initialState : UserSliceType = {
    items : []
}

const userSignIn = createAsyncThunk("userSlice/userSignIn" , async( data : UserSignInType , thunkApi ) => {
    const { email , fail , success } = data;
    try {
        const response = await fetch(`${envValues.apiUrl}/user` , {
            method : "POST",
            headers : {
                "content-type" : "application/json"
            },
            body : JSON.stringify({ email })
        });
        const {} = await response.json();

    } catch(err) {
        console.log(err)
    }
})

const userSlice = createSlice({
    name : "user slice",
    initialState  , 
    reducers : {

    }
})

export const {  } = userSlice.actions;

export default userSlice.reducer;