"use client"
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { changeIsLoading, changeSnackBarItems } from "@/store/slices/generalSlice";
import { quitRoom } from "@/store/slices/roomMateSlice";
import { Room } from "@/type/prisma";
import { Box, Button, CircularProgress, Dialog, DialogContent, Typography } from "@mui/material"
import { useRouter } from "next/navigation";
import { useState } from "react";

interface Props {
    room : Room
    openQuitRoomDialog : boolean;
    setOpenQuitRoomDialog : ( value : boolean ) => void;
}

const QuitRoomDialog = ({ room , openQuitRoomDialog , setOpenQuitRoomDialog } : Props ) => {
    const user = useAppSelector(store => store.user.item);
    const [ isLoadingQuit , setIsLoadingQuit ] = useState(false);
    const dispatch = useAppDispatch();
    // const router = useRouter();

    if(!user) return null;

    const handleQuitRoom = () => {
        setIsLoadingQuit(true)
        dispatch(quitRoom({ userId : user.id , onSuccess : () => {
            setIsLoadingQuit(false)
        } }))
    }
    
    return (
        <Dialog open={openQuitRoomDialog} onClose={() => {
            if(!isLoadingQuit) {
                setOpenQuitRoomDialog(false)
            }
        }} >
            <DialogContent sx={{ bgcolor : "primary.dark" , display : 'flex' , flexDirection : "column" , gap : "20px"}}>
                <Typography variant="h5" color="error" sx={{ textShadow : "0px 0px 5px white"}} >Quit Room</Typography>
                <Typography>Are you sure that you want to quit the room ?</Typography>
                {user.id === room.ownerUserId && <Typography>This will also delete the room !</Typography>}
                <Box sx={{ display : "flex" , gap : "20px" , justifyContent : "end" }} >
                    <Button variant="outlined" disabled={isLoadingQuit} color="secondary" onClick={() => {
                        if(!isLoadingQuit) {
                            setOpenQuitRoomDialog(false)
                        }
                    }} >Cancel</Button>
                    {isLoadingQuit ? 
                    <Button variant="contained" color="error" >
                        <CircularProgress color="success" aria-label="Loading…" size={25} sx={{ color : "secondary.main" }} />
                    </Button>
                    :<Button variant="contained" color="error" onClick={handleQuitRoom} >Quit</Button>}
                </Box>
            </DialogContent>
        </Dialog>
    )

}

export default QuitRoomDialog;