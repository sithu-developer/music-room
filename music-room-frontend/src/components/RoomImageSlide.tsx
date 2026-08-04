"use client"
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { Room, RoomImage } from "@/type/prisma";
import { Box, Button, CircularProgress, FormControlLabel, IconButton, Paper, Slide, Switch, TextField, Typography } from "@mui/material"
import Image from "next/image";
import { useState } from "react";
import NewRoomImage from "./NewRoomImage";
import { updateRoom } from "@/store/slices/roomSlice";
import { changeSnackBarItems } from "@/store/slices/generalSlice";
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import SearchOffRoundedIcon from '@mui/icons-material/SearchOffRounded';

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
    const [ searchViteName , setSearchViteName ] = useState<string>("");
    const [ openSearch , setOpenSearch ] = useState(false);
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
                <Box sx={{ position : "relative" , zIndex : 10 , display : 'flex' , flexDirection : "column" , width : "300px" , maxHeight : "75vh" , background : "rgba(75, 110, 113, 0.1)" , backdropFilter : "blur(10px)" , WebkitBackdropFilter : "blur(10px)" , border : "1px solid white" , borderRadius : "10px" , overflowY : "auto"  }}>
                    <Box sx={{ display : "flex" , justifyContent : "space-between" , p : "10px" }}>
                        <Box sx={{ display : 'flex' , alignItems : "center" , gap : "3px"}}>
                            <Typography variant='h6' >Room Images</Typography>
                            {(openSearch ? 
                            <IconButton onClick={() => {
                                setOpenSearch(false);
                                setSearchViteName("")
                            }}>
                                <SearchOffRoundedIcon color="secondary" sx={{ fontSize : "20px"}} />
                            </IconButton>
                            :<IconButton onClick={() => setOpenSearch(true)}>
                                <SearchRoundedIcon color="secondary"  sx={{ fontSize : "20px"}}  />
                            </IconButton>)}
                        </Box>
                        {roomImages.filter(item => item.userId === user.id ).length ? <FormControlLabel control={<Switch checked={isMineRoomImages} onChange={e => setIsMineRoomImages(e.target.checked)} />} label="Mine" slotProps={{ typography : { sx : { fontSize : "13px" , ml : "-5px" }}}} />
                        :undefined}
                    </Box>
                    {openSearch && <Box sx={{ px : "15px" , mb : "10px"}}>
                        <TextField value={searchViteName} variant="standard" color="secondary" autoComplete="off" placeholder="Search..." onChange={e => setSearchViteName(e.target.value)} sx={{ width :  "95%" }} />
                    </Box>}
                    <Box sx={{ display : "flex" , flexDirection : "column" , alignItems : "center" , gap : "10px" , overflowY : "auto" , p : "10px" }}>
                        {roomImages.filter(item => (isMineRoomImages ? item.userId === user.id : !item.userId)).filter(item => searchViteName ? (item.vite.toLowerCase().includes(searchViteName.toLowerCase())) : true ).map(item => (
                            <Box key={item.id} onClick={() => setCurrentRoomImage(item)} sx={{ position : "relative" , cursor : "pointer" , border : (currentRoomImage.id === item.id ? "2px solid white" : "") , borderRadius : "10px" }} >
                                <Typography sx={{ position : "absolute" , top : 0 , left : "50%" , transform : "translateX(-50%)" , background : "linear-gradient(90deg, #5635fa, #fd086a, #00ffd9)" , fontWeight : "bold" , backgroundClip : "text" , color : "transparent" , textShadow : "1px 1px 3px rgba(0,0,0,0.6)" , textAlign : "center" }}>{item.vite}</Typography>
                                <Image alt='Room Image' src={item.bgImageUrl} width={500} height={500} style={{ display : "block" , width : "100%" , height : "auto" , borderRadius : "10px"}} />
                            </Box>
                        ))}
                    </Box>
                    <Button variant='contained' onClick={() => setOpenNewRoomImageDialog(true)} sx={{ width : "90%" , m : "10px" , borderRadius : "10px" , textTransform : "none" , alignSelf : "center" }} >Create</Button>
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