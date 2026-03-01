import { RoomImage } from "@/type/prisma";
import { NewRoomImageItems } from "@/type/roomImage";
import { envValues } from "@/util/envValues";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { addExtraImages } from "./extraImagesSlice";

interface RoomImageInitialStateType {
    items : RoomImage[]
    error : Error | null
}

const initialState : RoomImageInitialStateType = {
    items : [],
    error : null
}

export const createNewRoomImage = createAsyncThunk("createNewRoomImage/RoomImageSlice" , async( paraItem : NewRoomImageItems , thunkApi ) => {
    const { vite , bgImageUrl , adminId , userId , extraImages , onFail , onSuccess } = paraItem;
    try {
        const response = await fetch(`${envValues.apiUrl}/room-image` , {
            method : "POST" , 
            headers : {
                "content-type" : "application/json"
            },
            body : JSON.stringify({ vite , bgImageUrl , adminId , userId , extraImages })
        });
        const { newRoomImage , newExtraImages } = await response.json();
        thunkApi.dispatch(addRoomImage(newRoomImage))
        thunkApi.dispatch(addExtraImages(newExtraImages))
        if(onSuccess) {
            onSuccess();
        }
    } catch(err) {
        console.log(err)
    }
})

const roomImageSlice = createSlice({
    name : "RoomImage Slice",
    initialState , 
    reducers : {
        addRoomImage : ( state , action : PayloadAction<RoomImage>) => {
            state.items = [...state.items , action.payload ]
        }
    }
})

export const { addRoomImage } = roomImageSlice.actions;

export default roomImageSlice.reducer;