import { User } from "@/type/prisma";
import { UserSignInType } from "@/type/user";
import { envValues } from "@/util/envValues";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";


interface UserSliceType {
    item : User | null
}

const initialState : UserSliceType = {
    item : null
}

export const userSignIn = createAsyncThunk("userSlice/userSignIn" , async( data : UserSignInType , thunkApi ) => {
    const { email , onFail , onSuccess } = data;
    try {
        const response = await fetch(`${envValues.apiUrl}/user` , {
            method : "POST",
            headers : {
                "content-type" : "application/json"
            },
            body : JSON.stringify({ email })
        });
        const { createdUser } = await response.json();
        thunkApi.dispatch(setUser(createdUser));
        if(onSuccess) {
            onSuccess();
        }
    } catch(err) {
        console.log(err)
    }
})

const userSlice = createSlice({
    name : "user slice",
    initialState  , 
    reducers : {
        setUser : ( state , action : PayloadAction<User> ) => {
            state.item = action.payload;
        }
    }
})

export const { setUser } = userSlice.actions;

export default userSlice.reducer;