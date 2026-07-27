"use client"

import { Box, IconButton, Paper, Slide, ToggleButton, ToggleButtonGroup, Typography } from "@mui/material";
import { useState } from "react";
import YouTubeIcon from '@mui/icons-material/YouTube';
import MusicNoteRoundedIcon from '@mui/icons-material/MusicNoteRounded';
import { useAppSelector } from "@/store/hooks";
import PlayCircleFilledRoundedIcon from '@mui/icons-material/PlayCircleFilledRounded';
import { Music } from "@/type/prisma";
import GraphicEqRoundedIcon from '@mui/icons-material/GraphicEqRounded';


interface Props {
    openedSlideName : string;
    setOpenedSlideName : (value : string) => void
    playingMusic : Music
}

const MusicSlide = ({ openedSlideName , setOpenedSlideName , playingMusic } : Props ) => {
    const [ selectedToggle , setSelectedToggle ] = useState<string>("music");
    const musics = useAppSelector(store => store.music.items)
    const user = useAppSelector(store => store.user.item)
    const [ isMineRoomImages , setIsMineRoomImages ] = useState(false);

    if(!user) return null;

    return (
        <Slide direction="left" in={openedSlideName === "musicSlide"} mountOnEnter unmountOnExit >
            <Paper sx={{ zIndex : 3 , position : "fixed" , right : 20 , top : 80 , bgcolor : "transparent", borderRadius : "10px" }}>
                <Box sx={{ position : "relative" , zIndex : 10 , display : 'flex' , flexDirection : "column" , width : "300px" , maxHeight : "70vh" , background : "rgba(75, 110, 113, 0.1)" , backdropFilter : "blur(10px)" , WebkitBackdropFilter : "blur(10px)" , border : "1px solid white" , borderRadius : "10px"   }}>
                    <Box sx={{ display : "flex" , justifyContent : "center" , p : "13px" }}>
                        <Typography variant='h6' >Musics</Typography>
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
                        <ToggleButton value="music" sx={{ width : "45%" , borderColor : ( selectedToggle === "music" ?  "white" : "") , borderRightColor : "white" }} aria-label="music" >
                            <MusicNoteRoundedIcon color={selectedToggle === "music" ? "secondary" : "disabled"} />
                        </ToggleButton>
                        <ToggleButton value="youtube" sx={{ width : "45%" , borderColor : ( selectedToggle === "youtube" ?  "white" : "") }} aria-label="youtube">
                            <YouTubeIcon  color={selectedToggle === "youtube" ? "secondary" : "disabled"} />
                        </ToggleButton>
                    </ToggleButtonGroup>
                    {selectedToggle === "music" && <Box  sx={{ display : "flex" , flexDirection : "column" , gap : "10px" , p : "20px 15px" , overflowY : "auto"}} >
                        {musics.filter(item => (isMineRoomImages ? item.userId === user.id : !item.userId)).map(item => (
                            <Box key={item.id} sx={{ border : ( item.id === playingMusic.id ? "1px solid white" : "" ) , display : "flex" , alignItems : "center" , justifyContent : "space-between" , bgcolor : "primary.main" , pl : "15px" , borderRadius : "35px"}} >
                                <Typography>{item.name}</Typography>
                                <IconButton>
                                    {item.id === playingMusic.id ? 
                                    <GraphicEqRoundedIcon color="secondary" sx={{ fontSize : "40px"}} />
                                    :<PlayCircleFilledRoundedIcon color="secondary" sx={{ fontSize : "40px"}} />}
                                </IconButton>
                            </Box>
                        ))}
                    </Box>}
                    
                </Box>
            </Paper>
        </Slide>
    )
}

export default MusicSlide;