"use client"
import { Box, Button, ButtonBase, Dialog, DialogContent, TextField, Typography } from "@mui/material"
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { useState } from "react";
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { RoomPasswordDialogItems } from "@/type/roomMate";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { changeIsLoading, changeSnackBarItems } from "@/store/slices/generalSlice";
import { joinRoom } from "@/store/slices/roomMateSlice";

interface Props {
    roomPasswordDialogItems : RoomPasswordDialogItems;
    setRoomPasswordDialogItems : ( value : RoomPasswordDialogItems ) => void
}

const RequestRoomPasswordDialog = ( { roomPasswordDialogItems , setRoomPasswordDialogItems } : Props ) => {
    const [ roomPassword , setRoomPassword ] = useState<string>("");
    const [ showPassword , setShowPassword ] = useState<boolean>(false);
    const user = useAppSelector(store => store.user.item)
    const dispatch = useAppDispatch();



    if(!user) return null;
    
    const handleJoinRoom = () => {
        dispatch(changeIsLoading(true))
        dispatch(joinRoom({ roomId : roomPasswordDialogItems.roomId , userId : user.id , roomPassword , onSuccess : () => {
            dispatch(changeIsLoading(false));
            setRoomPasswordDialogItems({ open : false , roomId : 0 });
            setRoomPassword("");
            setShowPassword(false)
            dispatch(changeSnackBarItems({ message : "Successfully Joined !" , open : true , severity : "success" }))
        } , onFail : () => {
            dispatch(changeIsLoading(false));
            dispatch(changeSnackBarItems({ message : "Room Password is incorrect !" , open : true , severity : "error" }))
        } }))
    }

    return (
        <Dialog open={roomPasswordDialogItems.open} onClose={() => {
            setRoomPasswordDialogItems({ open : false , roomId : 0 });
            setRoomPassword("");
            setShowPassword(false)
        }} >
            <DialogContent sx={{ position : "relative" , bgcolor : "primary.main" , display : "flex" , flexDirection : "column" , gap : "20px" , overflow : "hidden" }}>
                <Box component={ButtonBase} onClick={() =>{
                    setRoomPasswordDialogItems({ open : false , roomId : 0 });
                    setRoomPassword("");
                    setShowPassword(false)
                }} sx={{ position : "absolute" , top : "10px" , right : "-35px" , bgcolor : "secondary.main", rotate : "40deg" , p : "3px 0" , width : "140px" , display : "flex" , justifyContent : "center" , alignItems : "center"  , boxShadow : "0px 0px 7px #00000086" , ":hover" : { bgcolor : "secondary.dark"}  }} >
                    <CloseRoundedIcon sx={{ color : "primary.dark" , rotate : "-40deg" }} />
                </Box>
                <Typography variant="h6">Room Password</Typography>
                <TextField variant="outlined" color="secondary" label="Password" type={showPassword ? "text" : "password"} value={roomPassword} onChange={(e) => setRoomPassword(e.target.value)} slotProps={{ input : { sx : { color : "secondary.main" , "& input::-ms-reveal" : { display : "none"} , "& input::-ms-clear": {display : "none"} } , endAdornment : (showPassword ? <VisibilityOff sx={{ cursor : "pointer" , color : "white"}} onClick={() => setShowPassword(false)} /> : <Visibility sx={{ cursor : "pointer" , color : "white"}} onClick={() => setShowPassword(true)} />) } }} />
                <Button variant="contained" color="secondary" disabled={!roomPassword} onClick={handleJoinRoom} >Join</Button>
            </DialogContent>
        </Dialog>
    )
}

export default RequestRoomPasswordDialog;