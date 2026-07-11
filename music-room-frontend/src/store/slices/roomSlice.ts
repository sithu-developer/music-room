import { Room } from "@/type/prisma";
import { CreateNewRoomParaType } from "@/type/room";
import { envValues } from "@/util/envValues";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { addRoomMates } from "./roomMateSlice";


interface RoomSliceInitialState {
    items : Room[]
}

const initialState : RoomSliceInitialState = {
    items : []
}


export const createNewRoom = createAsyncThunk("roomSlice/createNewRoom" , async( para : CreateNewRoomParaType , thunkApi ) => {
    const { roomCategoryId , name , roomPassword, roommateQty, currentRoomImageId, playingMusicId, ownerUserId , roomMateLayouts , onFail , onSuccess } = para;
    try {
        const response = await fetch(`${envValues.apiUrl}/room` , {
            method : "POST",
            headers : {
                "content-type" : "application/json"
            },
            body : JSON.stringify({ roomCategoryId , name , roomPassword, roommateQty, currentRoomImageId, playingMusicId, ownerUserId , roomMateLayouts })
        });
        const { newRoom , newRoomMates } = await response.json();
        thunkApi.dispatch(addNewRoom(newRoom));
        thunkApi.dispatch(addRoomMates(newRoomMates))
        if(onSuccess) {
            onSuccess();
        }

    } catch (err) {
        console.log(err)
    }
})

const roomSlice = createSlice({
    name : "room slice",
    initialState ,
    reducers : {
        addNewRoom : ( state , action : PayloadAction<Room>) => {
            state.items = [...state.items , action.payload ]
        },
        setRooms : (state , action : PayloadAction<Room[]> ) => {
            state.items = action.payload;
        }
    }
});

export const { addNewRoom , setRooms } = roomSlice.actions;


export default roomSlice.reducer;