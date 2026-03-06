import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface SnackBarItemsType {
    open : boolean;
    message : string;
    severity : "success" | "error" | "info" | "warning"
}

interface GeneralInitialStateType {
    isLoading : boolean;
    snackBarItems : SnackBarItemsType;
}

const initialState : GeneralInitialStateType = {
    isLoading : false,
    snackBarItems : { open : false , message : "" , severity : "success" }
}

const generalSlice = createSlice({
    name : "General Slice",
    initialState ,
    reducers : {
        changeIsLoading : ( state , action : PayloadAction<boolean> ) => {
            state.isLoading = action.payload
        },
        changeSnackBarItems : (state , action : PayloadAction<SnackBarItemsType> ) => {
            state.snackBarItems = action.payload;
        }
    }
});

export const { changeIsLoading , changeSnackBarItems } = generalSlice.actions;

export default generalSlice.reducer;