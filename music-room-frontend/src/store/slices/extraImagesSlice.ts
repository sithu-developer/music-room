import { ExtraImage } from "@/type/prisma";
import { AcceptOrRejectRequestsParaType } from "@/type/roomMate";
import { envValues } from "@/util/envValues";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { replaceRoom } from "./roomSlice";
import { replaceRoomMate } from "./roomMateSlice";

interface ExtraImageInitialStateType {
    items : ExtraImage[]
}

const initialState : ExtraImageInitialStateType = {
    items : []
}

export const acceptOrRejectRequestsFromOwner = createAsyncThunk("acceptOrRejectRequests" , async( para : AcceptOrRejectRequestsParaType , thunkApi ) => {
    const { isAccept , isRoomImage , roomMateId , onFail , onSuccess } = para;
    try {
        const response = await fetch(`${envValues.apiUrl}/room-mate/acceptOrReject` , {
            method : "PUT",
            headers : {
                "content-type" : "application/json"
            },
            body : JSON.stringify({ isAccept , isRoomImage , roomMateId })
        })
        const { updatedRoom , updatedRoomMate } = await response.json();
        if(updatedRoom) thunkApi.dispatch(replaceRoom(updatedRoom))
        thunkApi.dispatch(replaceRoomMate(updatedRoomMate));
        if(onSuccess) {
            onSuccess();
        }
    } catch(err) {
        console.log(err)
    }
})

const extraImagesSlice = createSlice({
    name : "ExtraImages Slice",
    initialState,
    reducers : {
        addExtraImages : (state , action : PayloadAction<ExtraImage[]>) => {
            state.items = [...state.items , ...action.payload].sort((a,b) => a.id - b.id)
        },
        setExtraImages : ( state , action : PayloadAction<ExtraImage[]> ) => {
            state.items = action.payload;
        },
        removeAllExtraImagesUnderOneRoomImage : ( state , action : PayloadAction<number>) => {
            state.items = state.items.filter(item => item.roomImageId !== action.payload)
        },
    }
})

export const { addExtraImages , setExtraImages , removeAllExtraImagesUnderOneRoomImage } = extraImagesSlice.actions;

export default extraImagesSlice.reducer;