"use client"
import { Box, Button, IconButton, Paper, Slide, Slider, ToggleButton, ToggleButtonGroup, Typography } from "@mui/material";
import ImagesearchRollerRoundedIcon from '@mui/icons-material/ImagesearchRollerRounded';
import MusicNoteRoundedIcon from '@mui/icons-material/MusicNoteRounded';
import { useState } from "react";
import { Roommates } from "@/type/prisma";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import Image from "next/image";
import PauseIcon from '@mui/icons-material/Pause';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { acceptOrRejectRequestsFromOwner } from "@/store/slices/extraImagesSlice";
import { HandleAcceptOrRejectParaType } from "@/type/roomMate";

interface Props {
    requestsInOwnerOpen : boolean;
    currentRoomMates    : Roommates[]
}

const RequestsInOwner = ({ requestsInOwnerOpen , currentRoomMates } : Props) => {
    const [ isPlayingMusic , setIsPlayingMusic ] = useState<boolean>(false);
    const [ selectedToggle , setSelectedToggle ] = useState<string>("image");
    const otherUsers = useAppSelector(store => store.user.otherUsers);
    const roomImages = useAppSelector(store => store.roomImage.items);
    const musics = useAppSelector(store => store.music.items);
    const dispatch = useAppDispatch();

    const handleAcceptOrRejectRequest = ( { isAccept , roomMateId  } : HandleAcceptOrRejectParaType ) => { // Loading after accept and Reject
        dispatch(acceptOrRejectRequestsFromOwner({ roomMateId , isAccept , isRoomImage : (selectedToggle === "image") }))
    }

    return (
        <Slide direction="left" in={requestsInOwnerOpen} mountOnEnter unmountOnExit >
            <Paper sx={{ zIndex : 3 , position : "fixed" , right : 20 , top : 80 , bgcolor : "transparent", borderRadius : "10px" }}>
                <Box sx={{ position : "relative" , zIndex : 10 , display : 'flex' , flexDirection : "column" , width : "300px" , maxHeight : "70vh" , background : "rgba(75, 110, 113, 0.1)" , backdropFilter : "blur(10px)" , WebkitBackdropFilter : "blur(10px)" , border : "1px solid white" , borderRadius : "10px"   }}>
                    <Box sx={{ display : "flex" , justifyContent : "center" , p : "13px" }}>
                        <Typography variant='h6' >Requests</Typography>
                    </Box>
                    <ToggleButtonGroup
                        value={selectedToggle}
                        exclusive
                        onChange={( _ , value) => {
                            if(value)
                            setSelectedToggle(value)
                        }}
                        sx={{ display : "flex" , justifyContent : "center" }}
                    >
                        <ToggleButton value="image" sx={{ width : "45%" , borderColor : ( selectedToggle === "image" ?  "white" : "") , borderRightColor : "white" }} aria-label="image" >
                            <ImagesearchRollerRoundedIcon color={selectedToggle === "image" ? "secondary" : "disabled"} />
                        </ToggleButton>
                        <ToggleButton value="music" sx={{ width : "45%" , borderColor : ( selectedToggle === "music" ?  "white" : "") }} aria-label="music">
                            <MusicNoteRoundedIcon  color={selectedToggle === "music" ? "secondary" : "disabled"} />
                        </ToggleButton>
                    </ToggleButtonGroup>
                    <Box sx={{ display : "flex" , flexDirection : "column" , gap : "35px" , p : "20px 15px" , overflowY : "auto"}}>
                        {currentRoomMates.filter(item => selectedToggle === "image" ? item.requestRoomImageId : item.requestMusicId).length ? currentRoomMates.filter(item => selectedToggle === "image" ? item.requestRoomImageId : item.requestMusicId).map(item => {
                            const requestedOtherUser = otherUsers.find(eachUser => eachUser.id === item.userId);
                            const requestedRoomImage = roomImages.find(eachRoomImage => eachRoomImage.id === item.requestRoomImageId)
                            const requestedMusic = musics.find(eachMusic => eachMusic.id === item.requestMusicId)
                            if(requestedOtherUser)
                            return (
                                <Box key={item.id} >
                                    <Box sx={{ display : "flex" , alignItems : "center" , gap : "20px" , px : "10px"}}>
                                        <Box sx={{ display : "flex" , justifyContent : "center" , alignItems : "center" , height : "52px" , width : "52px" , borderRadius : "30px 30px 0 0" , overflow : "hidden" }}>
                                            <Image alt="Requested Room Mate Profile Photo" src={requestedOtherUser.url} width={200} height={200} style={{ height : "auto" , width : "100%" }} />
                                        </Box>
                                        <Typography>{requestedOtherUser.name}</Typography>
                                    </Box>
                                    {(selectedToggle === "image" && requestedRoomImage) && <Image alt="Requested Room Image" src={requestedRoomImage.bgImageUrl} width={400} height={400} style={{ height : "auto" , width : "100%" , borderRadius : "5px" , display : "block"  }} />}
                                    {(selectedToggle === "music" && requestedMusic) && (
                                        <Box sx={{ bgcolor : "primary.dark" , width : "100%" , p : "15px 20px" , borderRadius : "5px" }}>
                                            <Box sx={{ display : "flex" , justifyContent : "space-between" , alignItems : "center"}}>
                                                <Typography  >{requestedMusic.name}</Typography>
                                                <IconButton onClick={() => setIsPlayingMusic(!isPlayingMusic)}>
                                                    {isPlayingMusic ? <PauseIcon color="secondary" /> 
                                                    : <PlayArrowIcon color="secondary" />}
                                                </IconButton>
                                            </Box>
                                            <Slider size="small" valueLabelDisplay="auto" color="secondary" />
                                        </Box>
                                    )}
                                    <Box sx={{ display : "flex" , justifyContent : "space-between"}}> 
                                        <Button variant="contained" color="error" onClick={() => { handleAcceptOrRejectRequest({ roomMateId : item.id , isAccept : false }) }} >Reject</Button>
                                        <Button variant="contained" color="success" onClick={() => { handleAcceptOrRejectRequest({ roomMateId : item.id , isAccept : true }) }} >Reject</Button>
                                    </Box>
                                </Box>
                            )
                        }):
                        <Typography sx={{ textAlign :"center"}}>{selectedToggle === "image" ? "No Requested Room Image yet !" : "No Requested Music yet !"}</Typography>}
                    </Box>
                    
                </Box>
            </Paper>
        </Slide>
    )
}

export default RequestsInOwner;