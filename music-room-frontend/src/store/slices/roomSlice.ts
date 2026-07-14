import { Room, User } from "@/type/prisma";
import { CheckRoomMateUsersParaType, CreateNewRoomParaType } from "@/type/room";
import { envValues } from "@/util/envValues";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { addRoomMates } from "./roomMateSlice";


interface RoomSliceInitialState {
    items : Room[]
    roomMateUsers : User[]
}

const initialState : RoomSliceInitialState = {
    items : [],
    roomMateUsers : []
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

export const checkPermissionAndRoomMateUsers = createAsyncThunk("roomSlice/checkRoomMateUsers" , async( para : CheckRoomMateUsersParaType , thunkApi ) => {
    const { roomId , userId , onFail , onSuccess } = para;
    try {
        const response = await fetch(`${envValues.apiUrl}/room?roomId=${roomId}&userId=${userId}`);
        if(!response.ok) {
            if(onFail && response.status === 403) {
                onFail();
            }
        } else {
            const { roomMateUsers } = await response.json();
            thunkApi.dispatch(setRoomMateUsers(roomMateUsers));
            if(onSuccess) {
                onSuccess();
            }
        }

    } catch(err) {
        console.log( err)
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
        setRoomMateUsers : ( state , action : PayloadAction<User[]>) => {
            state.roomMateUsers = action.payload;
        }
    }
});

export const { addNewRoom , setRooms , setRoomMateUsers } = roomSlice.actions;


export default roomSlice.reducer;