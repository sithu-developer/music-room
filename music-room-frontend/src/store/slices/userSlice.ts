import { User } from "@/type/prisma";
import { UserSignInData } from "@/type/user";
import { envValues } from "@/util/envValues";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { setAdmin } from "./adminSlice";
import { setRoomImages } from "./roomImageSlice";
import { setCategories } from "./categorySlice";
import { setExtraImages } from "./extraImagesSlice";
import { setMusics } from "./musicSlice";
import { setRooms } from "./roomSlice";
import { setRoomMates } from "./roomMateSlice";

interface UserSliceInitialState {
    item : User | null
}

const initialState : UserSliceInitialState = {
    item : null
}

export const userSignIn = createAsyncThunk("userSlice/userSignIn" , async( data : UserSignInData , thunkApi ) => {
    const { email , name , url , onFail , onSuccess } = data;
    try {
        const response = await fetch(`${envValues.apiUrl}/user` , {
            method : "POST",
            headers : {
                "content-type" : "application/json"
            },
            body : JSON.stringify({ email , name , url })
        });
        const { user, admin , roomCategories , roomImages , extraImages , musics , rooms , roomMates } = await response.json();
        thunkApi.dispatch(setUser(user));
        thunkApi.dispatch(setAdmin(admin));
        thunkApi.dispatch(setCategories(roomCategories));
        thunkApi.dispatch(setRoomImages(roomImages));
        thunkApi.dispatch(setExtraImages(extraImages));
        thunkApi.dispatch(setMusics(musics));
        thunkApi.dispatch(setRooms(rooms))
        thunkApi.dispatch(setRoomMates(roomMates))
        if(onSuccess) {
            onSuccess();
        }
    } catch(err) {
        console.log(err)
    }

})

const userSlice = createSlice({
    name : "user slice", 
    initialState , 
    reducers : {
        setUser : ( state , action : PayloadAction<User>) => {
            state.item = action.payload;
        }
    }
});

const { setUser } = userSlice.actions;

export default userSlice.reducer;