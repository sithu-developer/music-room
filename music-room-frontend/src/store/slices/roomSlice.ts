import { Room, User } from "@/type/prisma";
import { CheckRoomMateUsersParaType, CreateNewRoomParaType, UpdateRoomParaType } from "@/type/room";
import { envValues } from "@/util/envValues";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { addRoomMates, replaceRoomMate } from "./roomMateSlice";


interface RoomSliceInitialState {
    items : Room[]
}

const initialState : RoomSliceInitialState = {
    items : [],
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
            onSuccess(newRoom.id);
        }

    } catch (err) {
        console.log(err)
    }
})

export const updateRoom = createAsyncThunk("roomSlice/updateRoom" , async( para : UpdateRoomParaType , thunkApi ) => {
    const { id , userId , currentRoomImageId , playingMusicId , onFail , onSuccess } = para;
    try {
        const response = await fetch(`${envValues.apiUrl}/room` , {
            method : "PUT",
            headers : {
                "content-type" : "application/json"
            },
            body : JSON.stringify({ id , userId , currentRoomImageId , playingMusicId })
        })
        const { updatedRoom , updatedRoomMate } = await response.json();
        if(updatedRoom) thunkApi.dispatch(replaceRoom(updatedRoom))
        if(updatedRoomMate) thunkApi.dispatch(replaceRoomMate(updatedRoomMate))
        if(onSuccess) {
            onSuccess();
        }
    } catch(err) {
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
        },
        replaceRoom : ( state , action : PayloadAction<Room> ) => {
            state.items = state.items.map(item => item.id === action.payload.id ? action.payload : item )
        }
    }
});

export const { addNewRoom , setRooms , replaceRoom } = roomSlice.actions;


export default roomSlice.reducer;