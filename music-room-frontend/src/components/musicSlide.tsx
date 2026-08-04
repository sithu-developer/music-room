"use client"

import { Box, Button, FormControlLabel, IconButton, Paper, Slide, Switch, ToggleButton, ToggleButtonGroup, Typography } from "@mui/material";
import { useState } from "react";
import YouTubeIcon from '@mui/icons-material/YouTube';
import MusicNoteRoundedIcon from '@mui/icons-material/MusicNoteRounded';
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import PlayCircleFilledRoundedIcon from '@mui/icons-material/PlayCircleFilledRounded';
import { Music, Room } from "@/type/prisma";
import GraphicEqRoundedIcon from '@mui/icons-material/GraphicEqRounded';
import NewMusicDialog from "./NewMusic";
import { updateRoom } from "@/store/slices/roomSlice";
import { changeIsLoading, changeSnackBarItems } from "@/store/slices/generalSlice";
import Image from "next/image";


interface Props {
    openedSlideName : string;
    setOpenedSlideName : (value : string) => void
    playingMusic : Music
    currentRoom : Room
}

const MusicSlide = ({ openedSlideName , setOpenedSlideName , playingMusic , currentRoom } : Props ) => {
    const [ selectedToggle , setSelectedToggle ] = useState<string>("music");
    const musics = useAppSelector(store => store.music.items)
    const user = useAppSelector(store => store.user.item)
    const [ isMineMusic , setIsMineMusic ] = useState(false);
    const [ open , setOpen ] = useState(false);
    const dispatch = useAppDispatch();

    if(!user) return null;

    const handleChangeMusicInRoom = ( playingMusicId : number ) => {
        if(playingMusicId !== currentRoom.playingMusicId) {
            dispatch(changeIsLoading(true))
            dispatch(updateRoom({ id : currentRoom.id , userId : user.id , playingMusicId , onSuccess : () => {
                dispatch(changeIsLoading(false));
                if(currentRoom.ownerUserId === user.id) dispatch(changeSnackBarItems({ open : true , message : "Playing Music is successfully changed !" , severity : "success" }))
            } }))
        }
    }

    return (
        <Slide direction="left" in={openedSlideName === "musicSlide"} mountOnEnter unmountOnExit >
            <Paper sx={{ zIndex : 3 , position : "fixed" , right : 20 , top : 80 , bgcolor : "transparent", borderRadius : "10px" }}>
                <Box sx={{ position : "relative" , zIndex : 10 , display : 'flex' , flexDirection : "column" , width : "300px" , maxHeight : "70vh" , background : "rgba(75, 110, 113, 0.1)" , backdropFilter : "blur(10px)" , WebkitBackdropFilter : "blur(10px)" , border : "1px solid white" , borderRadius : "10px"   }}>
                    <Box sx={{ display : "flex" , justifyContent : "space-between" , p : "13px" }}>
                        <Typography variant='h6' >Musics</Typography>
                        {musics.filter(item => item.userId === user.id ).length && selectedToggle === "music" ? <FormControlLabel control={<Switch checked={isMineMusic} onChange={e => setIsMineMusic(e.target.checked)} />} label="Mine" slotProps={{ typography : { sx : { fontSize : "13px" , ml : "-5px" }}}} />
                        :undefined}
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
                        {musics.filter(item => (isMineMusic ? item.userId === user.id : !item.userId)).map(item => (
                            <Box key={item.id} sx={{ border : ( item.id === playingMusic.id ? "1px solid white" : "" ) , display : "flex" , alignItems : "center" , justifyContent : "space-between" , bgcolor : "primary.main" , pl : "15px" , borderRadius : "35px"}} >
                                {item.musicImgUrl && (
                                    <Box sx={{ width : "39px" , height : "39px" , overflow : "hidden" , display : 'flex' , justifyContent : "center" , alignItems : "center" , borderRadius : "20px" , bgcolor : "blue" }} >
                                        <Image alt="Music Image" src={item.musicImgUrl} width={100} height={100} style={{ width : "100%" , height : "auto"}} />
                                    </Box>
                                )}
                                <Box sx={{  width :(item.musicImgUrl ? "150px" : "195px") ,}}>
                                    <Typography sx={{ overflow : "hidden" , textOverflow : "ellipsis" , textWrap :"nowrap"}}>{item.name}</Typography>
                                    <Typography sx={{ overflow : "hidden" , textOverflow : "ellipsis" , textWrap :"nowrap" , fontSize : "10px"}}>{item.artist}</Typography>
                                </Box>
                                <IconButton onClick={() => handleChangeMusicInRoom(item.id)}>
                                    {item.id === playingMusic.id ? 
                                    <GraphicEqRoundedIcon color="secondary" sx={{ fontSize : "40px"}} />
                                    :<PlayCircleFilledRoundedIcon color="secondary" sx={{ fontSize : "40px"}} />}
                                </IconButton>
                            </Box>
                        ))}
                    </Box>}
                    <Box sx={{ display : "flex" , flexDirection : "column" , p : "10px 15px"}}>
                        <Button variant="contained" onClick={() => setOpen(true)} >Create</Button>
                    </Box>
                </Box>
                <NewMusicDialog open={open} setOpen={setOpen} />
            </Paper>
        </Slide>
    )
}

export default MusicSlide;


// testing branch in git