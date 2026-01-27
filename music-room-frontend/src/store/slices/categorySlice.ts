import { DeleteCategory, NewCategory, UpdateCategory } from "@/type/category";
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

export const deleteCategory = createAsyncThunk("categorySlice/deleteCategory" , async( data : DeleteCategory , thunkApi ) => {
    const { id , onFail , onSuccess } = data;
    try {
        const response = await fetch(`${envValues.apiUrl}/category?id=${id}` , {
            method : "DELETE"
        })
        const { deletedCategory } = await response.json();
        thunkApi.dispatch(removeCategory(deletedCategory))
        if(onSuccess) {
            onSuccess();
        }
    } catch(err) {
        console.log(err)
    }
})

export const updateCategory = createAsyncThunk("categorySlice/updateCategory" , async( data : UpdateCategory , thunkApi ) => {
    const { id , name , iconUrl , onFail , onSuccess } = data;
    try {
        const response = await fetch(`${envValues.apiUrl}/category` , {
            method : "PUT",
            headers : {
                "content-type" : "application/json"
            },
            body : JSON.stringify({ id , name , iconUrl })
        });
        const { updatedCategory } = await response.json();
        thunkApi.dispatch(replaceCategory(updatedCategory))
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
        },
        removeCategory : ( state , action : PayloadAction<RoomCategory> ) => {
            state.items = state.items.filter(item => item.id !== action.payload.id)
        },
        replaceCategory : ( state , action : PayloadAction<RoomCategory> ) => {
            state.items = state.items.map(item => item.id === action.payload.id ? action.payload : item);
        }
    }
})

export const { addCategory , setCategories , removeCategory , replaceCategory } = categorySlice.actions;

export default categorySlice.reducer;