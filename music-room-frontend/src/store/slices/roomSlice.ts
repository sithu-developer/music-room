import { Room } from "@/type/prisma";
import { CreateNewRoomParaType } from "@/type/room";
import { envValues } from "@/util/envValues";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";


interface RoomSliceInitialState {
    items : Room[]
}

const initialState : RoomSliceInitialState = {
    items : []
}


export const createNewRoom = createAsyncThunk("roomSlice/createNewRoom" , async( para : CreateNewRoomParaType , thunkApi ) => {
    const { name , currentRoomImageId , ownerUserId , playingMusicId , roomCategoryId , roommateQty , roomPassword , onFail , onSuccess } = para;
    try {
        const response = await fetch(`${envValues.apiUrl}/room` , {
            method : "POST",
            headers : {
                "content-type" : "application/json"
            },
            body : JSON.stringify({ name , currentRoomImageId , ownerUserId , playingMusicId , roomCategoryId , roommateQty , roomPassword })
        });
        const { newRoom } = await response.json();
        thunkApi.dispatch(addNewRoom(newRoom));
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