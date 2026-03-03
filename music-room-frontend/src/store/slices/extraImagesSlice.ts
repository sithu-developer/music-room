import { ExtraImage } from "@/type/prisma";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ExtraImageInitialStateType {
    items : ExtraImage[]
}

const initialState : ExtraImageInitialStateType = {
    items : []
}

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