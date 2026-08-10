import { NewChat } from "@/type/chat";
import { Chats } from "@/type/prisma";
import { envValues } from "@/util/envValues";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ChatSliceInitialState {
    items : Chats[]
}

const initialState : ChatSliceInitialState = {
    items : []
}

export const sendMessage = createAsyncThunk("chatSlice/sendMessage" , async( data : NewChat , thunkApi ) => {
    const { message , roomId , userId , replyId , onFail , onSuccess } = data;
    try {
        const response = await fetch(`${envValues.apiUrl}/chat` , {
            method : "POST",
            headers : {
                "content-type" : "application/json"
            },
            body : JSON.stringify({ message , roomId , userId , replyId })
        })
        const { newChat } = await response.json();
        thunkApi.dispatch(addNewChat(newChat));
        if(onSuccess) {
            onSuccess();
        }
    } catch(err) {
        console.log(err);
    }
})

const chatSlice = createSlice({
    name : "Chat Slice",
    initialState , 
    reducers : {
        addNewChat : ( state , action : PayloadAction<Chats> ) => {
            state.items = [...state.items , action.payload ]
        },
        setChats : ( state , action : PayloadAction<Chats[]>) => {
            state.items = action.payload;
        }
    }
})

export const { addNewChat , setChats } = chatSlice.actions;

export default chatSlice.reducer;