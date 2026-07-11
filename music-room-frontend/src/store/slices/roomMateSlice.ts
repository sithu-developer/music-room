import { Roommates } from "@/type/prisma";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface RoomMateInitialStateType {
    items : Roommates[]
}

const initialState : RoomMateInitialStateType = {
    items : []
}

export const roomMateSlice = createSlice({
    name : "Room Mate Slice",
    initialState,
    reducers : {
        addRoomMates : ( state , action : PayloadAction<Roommates[]> ) => {
            state.items = [...state.items , ...action.payload]
        },
        setRoomMates : ( state , action : PayloadAction<Roommates[]> ) => {
            state.items = action.payload;
        }
    }
})

export const { addRoomMates , setRoomMates } = roomMateSlice.actions;

export default roomMateSlice.reducer;