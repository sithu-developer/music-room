import { DeleteMusic, NewMusic, UpdateMusic } from "@/type/music";
import { Music } from "@/type/prisma";
import { envValues } from "@/util/envValues";
import { PayloadAction } from "@reduxjs/toolkit";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface MusicInitialState {
    items : Music[];
    error : Error | null
}

const initialState : MusicInitialState = {
    items : [],
    error : null
}

export const createMusic = createAsyncThunk("musicSlice/createMusic" , async( data : NewMusic , thunkApi ) => {
    const { name , musicUrl , adminId , userId , onFail , onSuccess } = data;
    try {
        const response = await fetch(`${envValues.apiUrl}/music` , {
            method : "POST",
            headers : {
                "content-type" : "application/json"
            },
            body : JSON.stringify({ name , musicUrl , adminId , userId })
        });
        const { newMusic } = await response.json();
        thunkApi.dispatch(addMusic(newMusic));
        if(onSuccess) {
            onSuccess();
        }
    } catch (err) {
        console.log(err)
    }
})

export const updateMusic = createAsyncThunk("musicSlice/updateMusic" , async( data : UpdateMusic , thunkApi ) => {
    const { id , name , musicUrl , onFail , onSuccess } = data;
    try {
        const response = await fetch(`${envValues.apiUrl}/music` , {
            method : "PUT",
            headers : {
                "content-type" : "application/json"
            },
            body : JSON.stringify({ id , name , musicUrl })
        });
        const { updatedMusic } = await response.json();
        thunkApi.dispatch(replaceMusic(updatedMusic));
        if(onSuccess) {
            onSuccess();
        }
    } catch (err) {
        console.log(err)
    }
})

export const deleteMusic = createAsyncThunk("musicSlice/updateMusic" , async( data : DeleteMusic , thunkApi ) => {
    const { id , onFail , onSuccess } = data;
    try {
        const response = await fetch(`${envValues.apiUrl}/music?id=${id}` , {
            method : "DELETE"
        });
        const { deletedMusicId } = await response.json();
        thunkApi.dispatch(removeMusic(deletedMusicId));
        if(onSuccess) {
            onSuccess();
        }
    } catch (err) {
        console.log(err)
    }
})

const musicSlice = createSlice({
    name : "music slice",
    initialState ,
    reducers : {
        addMusic : ( state , action : PayloadAction<Music> ) => {
            state.items = [...state.items , action.payload ]
        },
        setMusics : (state , action : PayloadAction<Music[]> ) => {
            state.items = action.payload;
        },
        replaceMusic : ( state , action : PayloadAction<Music> ) => {
            state.items = state.items.map(item => (item.id === action.payload.id) ? action.payload : item)
        },
        removeMusic : ( state , action : PayloadAction<number> ) => {
            state.items = state.items.filter(item => item.id !== action.payload )
        }
    }
})

export const { addMusic , setMusics , replaceMusic , removeMusic } = musicSlice.actions; 

export default musicSlice.reducer;