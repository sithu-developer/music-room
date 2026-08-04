"use client"

import { Box, Button, ButtonBase, FormControlLabel, IconButton, Paper, Slide, Switch, TextField, ToggleButton, ToggleButtonGroup, Typography } from "@mui/material";
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
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import SearchOffRoundedIcon from '@mui/icons-material/SearchOffRounded';

interface Props {
    openedSlideName : string;
    playingMusic : Music
    currentRoom : Room
}

const MusicSlide = ({ openedSlideName , playingMusic , currentRoom } : Props ) => {
    const [ selectedToggle , setSelectedToggle ] = useState<"music" | "youtube">("music");
    const musics = useAppSelector(store => store.music.items)
    const user = useAppSelector(store => store.user.item)
    const [ isMineMusic , setIsMineMusic ] = useState(false);
    const [ open , setOpen ] = useState(false);
    const [ openSearch , setOpenSearch ] = useState(false);
    const [ searchBy , setSearchBy ] = useState<"Song" | "Artist">("Song");
    const [ searchName , setSearchName ] = useState<string>("");
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
                <Box sx={{ position : "relative" , zIndex : 10 , display : 'flex' , flexDirection : "column" , width : "300px" , maxHeight : "75vh" , background : "rgba(75, 110, 113, 0.1)" , backdropFilter : "blur(10px)" , WebkitBackdropFilter : "blur(10px)" , border : "1px solid white" , borderRadius : "10px"   }}>
                    <ToggleButtonGroup
                        value={selectedToggle}
                        exclusive
                        onChange={( _ , value) => {
                            if(value)
                            setSelectedToggle(value)
                        }}
                        sx={{ display : "flex" , justifyContent : "center" , py : "20px" }}
                    >
                        <ToggleButton value="music" sx={{ width : "45%" , borderColor : ( selectedToggle === "music" ?  "white" : "") , borderRightColor : "white" }} aria-label="music" >
                            <MusicNoteRoundedIcon color={selectedToggle === "music" ? "secondary" : "disabled"} />
                        </ToggleButton>
                        <ToggleButton value="youtube" sx={{ width : "45%" , borderColor : ( selectedToggle === "youtube" ?  "white" : "") }} aria-label="youtube">
                            <YouTubeIcon  color={selectedToggle === "youtube" ? "secondary" : "disabled"} />
                        </ToggleButton>
                    </ToggleButtonGroup>
                    <Box sx={{ display : "flex" , justifyContent : "space-between" , px : "20px" }}>
                        <Box sx={{ display : 'flex' , alignItems : "center" , gap : "10px"}}>
                            <Typography variant='h6' >Musics</Typography> 
                            {selectedToggle === "music" && (openSearch ? 
                            <IconButton onClick={() => {
                                setOpenSearch(false);
                                setSearchBy("Song");
                                setSearchName("")
                            }}>
                                <SearchOffRoundedIcon color="secondary" sx={{ fontSize : "20px"}} />
                            </IconButton>
                            :<IconButton onClick={() => setOpenSearch(true)}>
                                <SearchRoundedIcon color="secondary"  sx={{ fontSize : "20px"}}  />
                            </IconButton>)}
                        </Box>
                        {musics.filter(item => item.userId === user.id ).length && selectedToggle === "music" ? <FormControlLabel control={<Switch checked={isMineMusic} onChange={e => setIsMineMusic(e.target.checked)} />} label="Mine" slotProps={{ typography : { sx : { fontSize : "13px" , ml : "-5px" }}}} />
                        :undefined}
                    </Box>
                    {selectedToggle === "music" && openSearch && <Box sx={{  display :"flex" , justifyContent : "center" , alignItems : 'end' , gap : "5px" , px : "11px"}}>
                        <TextField value={searchName} variant="standard" color="secondary" autoComplete="off" placeholder="Search by..." onChange={e => setSearchName(e.target.value)} sx={{ width : (searchBy === "Artist" ? "71.3%" : "75%")}} />
                        <Typography component={ButtonBase} onClick={() => setSearchBy(prev => prev === "Song" ? "Artist" : "Song")} sx={{ border : "1px solid GrayText" , p : "1px 3px" , borderRadius : "5px" , color : "secondary.dark"}}>{searchBy}</Typography>
                    </Box>}
                    {selectedToggle === "music" && <Box  sx={{ display : "flex" , flexDirection : "column" , gap : "10px" , p : "20px 15px" , overflowY : "auto"}} >
                        {musics.filter(item => (isMineMusic ? item.userId === user.id : !item.userId)).filter(item => (searchName ? (searchBy === "Song" ? item.name.toLowerCase().includes(searchName.toLowerCase()) : item.artist.toLowerCase().includes(searchName.toLowerCase()) ) : true)).map(item => (
                            <Box key={item.id} sx={{ border : ( item.id === playingMusic.id ? "1px solid white" : "" ) , display : "flex" , alignItems : "center" , justifyContent : "space-between"  , bgcolor : "primary.main" , pl : "15px" , borderRadius : "35px"}} >
                                {item.musicImgUrl && (
                                    <Box sx={{ width : "39px" , height : "39px" , overflow : "hidden" , display : 'flex' , justifyContent : "center" , alignItems : "center" , borderRadius : "20px" }} >
                                        <Image alt="Music Image" src={item.musicImgUrl} width={100} height={100} style={{ width : "100%" , height : "auto"}} />
                                    </Box>
                                )}
                                <Box sx={{  width :(item.musicImgUrl ? "142px" : "195px") , }}>
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