"use client"
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { Room, RoomImage } from "@/type/prisma";
import { Box, Button, CircularProgress, FormControlLabel, Paper, Slide, Switch, Typography } from "@mui/material"
import Image from "next/image";
import { useState } from "react";
import NewRoomImage from "./NewRoomImage";
import { updateRoom } from "@/store/slices/roomSlice";
import { changeSnackBarItems } from "@/store/slices/generalSlice";

interface Props {
    currentRoomImage : RoomImage
    setCurrentRoomImage : ( value : RoomImage | undefined ) => void
    openedSlideName : string;
    setOpenedSlideName : (value : string) => void
    currentRoom : Room;
}

const RoomImageSlide = ({ currentRoomImage , setCurrentRoomImage , openedSlideName , setOpenedSlideName , currentRoom } : Props) => {
    const roomImages = useAppSelector(store => store.roomImage.items);
    const user = useAppSelector(store => store.user.item);
    const [ openNewRoomImageDialog , setOpenNewRoomImageDialog ] = useState(false);
    const [ isLoading , setIsLoading ] = useState(false);
    const [ isMineRoomImages , setIsMineRoomImages ] = useState(false);

    const dispatch = useAppDispatch();
    
    if(!user) return null;

    const handleChangeCurrentRoomImage = () => { 
        setIsLoading(true)
        dispatch(updateRoom({ id : currentRoom.id , currentRoomImageId : currentRoomImage.id , userId : user.id , onSuccess : () => {
            setOpenedSlideName("")
            setIsMineRoomImages(false);
            setIsLoading(false);
            if(currentRoom.ownerUserId === user.id) dispatch(changeSnackBarItems({ open : true , message : "Room image is successfully changed !" , severity : "success" }))
        } }))
    }

    return (
        <Slide direction="left" in={openedSlideName === "roomImageSlide"} mountOnEnter unmountOnExit >
            <Paper sx={{ zIndex : 3 , position : "fixed" , right : 20 , top : 80 , bgcolor : "transparent", borderRadius : "10px" }}>
                <Box sx={{ position : "relative" , zIndex : 10 , display : 'flex' , flexDirection : "column" , width : "300px" , maxHeight : "70vh" , background : "rgba(75, 110, 113, 0.1)" , backdropFilter : "blur(10px)" , WebkitBackdropFilter : "blur(10px)" , border : "1px solid white" , borderRadius : "10px" , overflowY : "auto"  }}>
                    <Box sx={{ display : "flex" , justifyContent : "space-between" , p : "10px" }}>
                        <Typography variant='h6' >Room Images</Typography>
                        {roomImages.filter(item => item.userId === user.id ).length ? <FormControlLabel control={<Switch value={isMineRoomImages} onChange={e => setIsMineRoomImages(e.target.checked)} />} label="Mine" slotProps={{ typography : { sx : { fontSize : "13px" , ml : "-5px" }}}} />
                        :undefined}
                    </Box>
                    <Box sx={{ display : "flex" , flexDirection : "column" , alignItems : "center" , gap : "10px" , overflowY : "auto" , p : "10px" }}>
                        {roomImages.filter(item => (isMineRoomImages ? item.userId === user.id : !item.userId)).map(item => (
                            <Box key={item.id} onClick={() => setCurrentRoomImage(item)} sx={{ position : "relative" , cursor : "pointer" , border : (currentRoomImage.id === item.id ? "2px solid white" : "") , borderRadius : "10px" }} >
                                <Typography sx={{ position : "absolute" , top : 0 , left : "50%" , transform : "translateX(-50%)" , background : "linear-gradient(90deg, #5635fa, #fd086a, #00ffd9)" , fontWeight : "bold" , backgroundClip : "text" , color : "transparent" , textShadow : "1px 1px 3px rgba(0,0,0,0.6)" }}>{item.vite}</Typography>
                                <Image alt='Room Image' src={item.bgImageUrl} width={500} height={500} style={{ display : "block" , width : "100%" , height : "auto" , borderRadius : "10px"}} />
                            </Box>
                        ))}
                    </Box>
                    <Button variant='contained' onClick={() => setOpenNewRoomImageDialog(true)} sx={{ width : "90%" , m : "10px" , borderRadius : "10px" , textTransform : "none" }} >Create</Button>
                    {isLoading ? 
                    <Box sx={{ display : "flex" , justifyContent : "center" ,  p : "13px" }} >
                        <CircularProgress color="success" aria-label="Loading…" sx={{ color : "secondary.main" }} />
                    </Box>
                    :<Box sx={{ display : "flex" , justifyContent : "center" , gap : "40px" , p : "15px" }}>
                        <Button variant="outlined" color="secondary" onClick={() => {
                            setOpenedSlideName("")
                            const foundRoomImage = roomImages.find(item => item.id === currentRoom.currentRoomImageId);
                            setCurrentRoomImage(foundRoomImage);
                            setIsMineRoomImages(false);
                        }}>Cancel</Button>
                        <Button variant="contained" onClick={handleChangeCurrentRoomImage} disabled={currentRoom.currentRoomImageId === currentRoomImage.id} >{currentRoom.ownerUserId === user.id ? "Change" : "Request"}</Button>
                    </Box>}
                    {openNewRoomImageDialog && <NewRoomImage openNewRoomImageDialog={openNewRoomImageDialog} setOpenNewRoomImageDialog={setOpenNewRoomImageDialog} />}
                </Box>
            </Paper>
        </Slide>
    )
}

export default RoomImageSlide;