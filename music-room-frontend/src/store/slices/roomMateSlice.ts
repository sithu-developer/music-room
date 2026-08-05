import { Roommates } from "@/type/prisma";
import { JoinRoomParaType, QuitRoomParaType } from "@/type/roomMate";
import { envValues } from "@/util/envValues";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { removeRoom } from "./roomSlice";

interface RoomMateInitialStateType {
    items : Roommates[]
}

const initialState : RoomMateInitialStateType = {
    items : []
}

export const joinRoom = createAsyncThunk("roomMateSlice/joinRoom" , async( para : JoinRoomParaType , thunkApi) => {
    const { roomId , roomPassword , userId , onFail , onSuccess } = para;
    try {
        const response = await fetch(`${envValues.apiUrl}/room-mate` , {
            method : "PUT",
            headers : {
                "content-type" : "application/json"
            },
            body : JSON.stringify({ roomId , roomPassword , userId })
        });
        if(!response.ok) {
            if(response.status === 403 && onFail) {
                onFail();
            }
        } else {
            const { updatedRoomMate } = await response.json();
            thunkApi.dispatch(replaceRoomMate(updatedRoomMate))
            if(onSuccess) {
                onSuccess();
            }
        }
    } catch(err) {
        console.log(err);
    }

})

export const quitRoom = createAsyncThunk("roomMateSlice/joinRoom" , async( data : QuitRoomParaType , thunkApi) => {
    const { userId , onFail , onSuccess } = data;
    try {
        const response = await fetch(`${envValues.apiUrl}/room-mate/quit-room?userId=${userId}` , {
            method : "DELETE"
        })
        const { updatedRoomMate , deletedRoomId } = await response.json();
        if(updatedRoomMate) thunkApi.dispatch(replaceRoomMate(updatedRoomMate))
        else if(deletedRoomId) {
            thunkApi.dispatch(removeRoomMatesFromQuit(deletedRoomId));
            thunkApi.dispatch(removeRoom(deletedRoomId))
        }
        if(onSuccess) {
            onSuccess();
        }
        
    } catch(err) {
        console.log(err)
    }
})

export const roomMateSlice = createSlice({
    name : "Room Mate Slice",
    initialState,
    reducers : {
        addRoomMates : ( state , action : PayloadAction<Roommates[]> ) => {
            state.items = [...state.items , ...action.payload]
        },
        setRoomMates : ( state , action : PayloadAction<Roommates[]> ) => {
            state.items = action.payload;
        },
        replaceRoomMate : ( state , action : PayloadAction<Roommates> ) => {
            state.items = state.items.map(item => item.id === action.payload.id ? action.payload : item)
        },
        removeRoomMatesFromQuit : ( state , action : PayloadAction<number> ) => {
            state.items = state.items.filter(item => item.roomId !== action.payload )
        }
    }
})

export const { addRoomMates , setRoomMates , replaceRoomMate , removeRoomMatesFromQuit } = roomMateSlice.actions;

export default roomMateSlice.reducer;