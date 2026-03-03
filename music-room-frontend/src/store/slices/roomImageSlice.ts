import { RoomImage } from "@/type/prisma";
import { DeleteRoomImageParaType, NewRoomImageItems, UpdateRoomImageParaType } from "@/type/roomImage";
import { envValues } from "@/util/envValues";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { addExtraImages, removeAllExtraImagesUnderOneRoomImage } from "./extraImagesSlice";

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

export const updateRoomImage = createAsyncThunk("updateRoomImage/RoomImageSlice" , async( para : UpdateRoomImageParaType , thunkApi ) => {
    const { id , bgImageUrl , vite , adminId , userId , extraImages , onFail , onSuccess } = para;
    try {
        const response = await fetch(`${envValues.apiUrl}/room-image` , {
            method : "PUT",
            headers : {
                "content-type" : "application/json"
            },
            body : JSON.stringify({ id , bgImageUrl , vite , adminId , userId , extraImages })
        });
        const { updatedRoomImage , finalExtraImages } = await response.json();
        thunkApi.dispatch(replaceRoomImage(updatedRoomImage));
        thunkApi.dispatch(removeAllExtraImagesUnderOneRoomImage(id))
        thunkApi.dispatch(addExtraImages(finalExtraImages));
        if(onSuccess) {
            onSuccess();
        }
    } catch(err) {
        console.log(err)
    }
})

export const deleteRoomImage = createAsyncThunk("deleteRoomImage/RoomImageSlice" , async( para : DeleteRoomImageParaType , thunkApi ) => {
    const { id , onFail , onSuccess } = para;
    try {
        const response = await fetch(`${envValues.apiUrl}/room-image?id=${id}` , {
            method : "DELETE"
        });
        const { deletedId } = await response.json();
        thunkApi.dispatch(removeAllExtraImagesUnderOneRoomImage(deletedId))
        thunkApi.dispatch(removeRoomImage(deletedId))
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
        },
        setRoomImages : ( state , action : PayloadAction<RoomImage[]>) => {
            state.items = action.payload;
        },
        replaceRoomImage : ( state , action : PayloadAction<RoomImage> ) => {
            state.items = state.items.map(item => item.id === action.payload.id ? action.payload : item )
        },
        removeRoomImage : ( state , action : PayloadAction<number> ) => {
            state.items = state.items.filter(item => item.id !== action.payload)
        }
    }
})

export const { addRoomImage , setRoomImages , replaceRoomImage , removeRoomImage } = roomImageSlice.actions;

export default roomImageSlice.reducer;