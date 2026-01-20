import { NewCategory } from "@/type/category";
import { RoomCategory } from "@/type/prisma";
import { envValues } from "@/util/envValues";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CategoryInitialStateType {
    items : RoomCategory[]
}

const initialState : CategoryInitialStateType = {
    items : []
}

export const createNewCatgory = createAsyncThunk("categorySlice/createNewCategory" , async( data : NewCategory , thunkApi ) => {
    const { name , iconUrl , adminId , onFail , onSuccess } = data;
    try {
        const response = await fetch(`${envValues.apiUrl}/category` , {
            method : "POST",
            headers : {
                "content-type" : "application/json"
            },
            body : JSON.stringify({ name , iconUrl , adminId })
        });
        const { newCategory } = await response.json();
        thunkApi.dispatch(addCategory(newCategory));
        if(onSuccess) {
            onSuccess();
        }
    } catch(err) {
        console.log(err)
    }
})

const categorySlice = createSlice({
    name : "Category Slice",
    initialState ,
    reducers : {
        addCategory : ( state , action : PayloadAction<RoomCategory> ) => {
            state.items = [...state.items , action.payload ]
        },
        setCategories : ( state , action : PayloadAction<RoomCategory[]> ) => {
            state.items = action.payload;
        }
    }
})

export const { addCategory , setCategories } = categorySlice.actions;

export default categorySlice.reducer;