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
            state.items = [...state.items , ...action.payload]
        }
    }
})

export const { addExtraImages } = extraImagesSlice.actions;

export default extraImagesSlice.reducer;