"use client"
import { useAppSelector } from "@/store/hooks";
import { Room, RoomImage } from "@/type/prisma";
import { Box, Button, FormControlLabel, Paper, Slide, Switch, Typography } from "@mui/material"
import Image from "next/image";
import { useState } from "react";

interface Props {
    currentRoomImage : RoomImage
    setCurrentRoomImage : ( value : RoomImage | undefined ) => void
    updateRoomImageOpen : boolean;
    setUpdateRoomImageOpen : (value : boolean) => void
    currentRoom : Room;
    isMineRoomImages : boolean
    setIsMineRoomImages : (value : boolean) => void;
}

const RoomImageSlide = ({ currentRoomImage , setCurrentRoomImage , setUpdateRoomImageOpen , updateRoomImageOpen , currentRoom , isMineRoomImages , setIsMineRoomImages } : Props) => {
    const roomImages = useAppSelector(store => store.roomImage.items);
    const user = useAppSelector(store => store.user.item);

    
    if(!user) return null;

    return (
        <Slide direction="left" in={updateRoomImageOpen} mountOnEnter unmountOnExit >
            <Paper sx={{ zIndex : 3 , position : "fixed" , right : 20 , top : 80 , bgcolor : "transparent", borderRadius : "10px" }}>
                <Box sx={{ position : "relative" , zIndex : 10 , display : 'flex' , flexDirection : "column" , width : "300px" , maxHeight : "70vh" , background : "rgba(75, 110, 113, 0.1)" , backdropFilter : "blur(10px)" , WebkitBackdropFilter : "blur(10px)" , border : "1px solid white" , borderRadius : "10px" , overflowY : "auto"  }}>
                    <Box sx={{ display : "flex" , justifyContent : "space-between" , p : "10px" }}>
                        <Typography variant='h6' >Room Images</Typography>
                        {roomImages.filter(item => item.userId ).length ? <FormControlLabel control={<Switch value={isMineRoomImages} onChange={e => setIsMineRoomImages(e.target.checked)} />} label="Mine" slotProps={{ typography : { sx : { fontSize : "13px" , ml : "-5px" }}}} />
                        :undefined}
                    </Box>
                    <Box sx={{ display : "flex" , flexDirection : "column" , alignItems : "center" , gap : "10px" , overflowY : "auto" , p : "10px" }}>
                        {roomImages.filter(item => (isMineRoomImages ? item.userId === user.id : !item.userId)).map(item => (
                            <Box key={item.id} sx={{ position : "relative" , cursor : "pointer" , border : (currentRoomImage.id === item.id ? "1px solid white" : "") , borderRadius : "10px" }} onClick={() => setCurrentRoomImage(item)} >
                                <Typography sx={{ position : "absolute" , top : 0 , left : "50%" , transform : "translateX(-50%)" , background : "linear-gradient(90deg, #5635fa, #fd086a, #00ffd9)" , fontWeight : "bold" , backgroundClip : "text" , color : "transparent" , textShadow : "1px 1px 3px rgba(0,0,0,0.6)" }}>{item.vite}</Typography>
                                <Image alt='Room Image' src={item.bgImageUrl} width={500} height={500} style={{ display : "block" , width : "100%" , height : "auto" , borderRadius : "10px"}} />
                            </Box>
                        ))}
                    </Box>
                    <Box sx={{ display : "flex" , justifyContent : "center" , gap : "40px" , p : "15px" }}>
                        <Button variant="outlined" color="secondary" onClick={() => {
                            setUpdateRoomImageOpen(false)
                            const foundRoomImage = roomImages.find(item => item.id === currentRoom.currentRoomImageId);
                            setCurrentRoomImage(foundRoomImage);
                            setIsMineRoomImages(false);
                        }}>Cancel</Button>
                        <Button variant="contained" >Change</Button>
                    </Box>
                </Box>
            </Paper>
        </Slide>
    )
}

export default RoomImageSlide;